#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// .env 파일 로드 함수
function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) {
    console.log(`⚠️  .env 파일이 없습니다: ${envPath}`);
    return {};
  }
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  console.log(`✅ .env 파일 로드됨: ${envPath}`);
  return envVars;
}

// .env 파일 로드
const envPath = path.join(__dirname, '.env');
const envVars = loadEnvFile(envPath);
Object.keys(envVars).forEach(key => {
  if (!process.env[key]) {
    process.env[key] = envVars[key];
  }
});

// OS 감지
const isLinux = process.platform === 'linux';
console.log(`🖥️  OS 감지: ${process.platform} (${isLinux ? 'Linux' : 'Unknown'})`);
if (!isLinux) {
  console.error('❌ 서버용 빌드 스크립트는 Linux에서만 실행 가능합니다.');
  console.log('💡 로컬에서는 npm run build:be를 사용하세요.');
  process.exit(1);
}

// 설정
const config = {
  sourcePath: process.env.SOURCE_PATH || '/home/iitp-adm/iitp-dabt-admin/source',
  deployPath: process.env.DEPLOY_PATH || '/home/iitp-adm/iitp-dabt-admin/deploy'
};

function run(cmd, args, cwd) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', cwd });
    p.on('close', code => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} 실패 (종료 코드: ${code})`))));
  });
}

function pathExists(p) { try { return fs.existsSync(p); } catch { return false; } }
function isDirEmpty(dir) { try { return fs.readdirSync(dir).length === 0; } catch { return true; } }

async function installToolchainAtRoot() {
  console.log('🧰 루트 도구체인 설치 (dev 포함) 중...');
  // Workspace 환경에서는 npm install 사용 (npm ci는 lockfile 엄격 검증)
  await run('npm', ['install', '--include=dev'], config.sourcePath);
  console.log('✅ 루트 도구체인 설치 완료');
}

// Common 패키지 빌드 (의존성)
async function buildCommon() {
  console.log('📦 packages/common 빌드 중... (의존성)');
  await run('npm', ['run', 'build:clean'], path.join(config.sourcePath, 'packages/common'));
  console.log('✅ packages/common 빌드 완료');
}

// Backend 빌드
async function buildBe() {
  console.log('🔧 Backend 빌드 중...');
  await run('npm', ['run', 'build:clean'], path.join(config.sourcePath, 'be'));
  console.log('✅ Backend 빌드 완료');
}

async function ensureBuilt(name, pkgRelPath, distRelPath) {
  const pkgPath = path.join(config.sourcePath, pkgRelPath);
  const distPath = path.join(config.sourcePath, distRelPath);
  if (!pathExists(distPath) || isDirEmpty(distPath)) {
    console.log(`⚙️  ${name} dist가 없어 빌드 수행: ${pkgPath}`);
    await run('npm', ['run', 'build:clean'], pkgPath);
  }
  if (!pathExists(distPath)) {
    throw new Error(`${name} dist 경로가 존재하지 않습니다: ${distPath}`);
  }
  console.log(`✅ ${name} dist 확인: ${distPath}`);
}

function readBuildDateSafe(baseDir) {
  try {
    const distPath = path.join(baseDir, 'dist', 'build-info.json');
    if (fs.existsSync(distPath)) {
      const info = JSON.parse(fs.readFileSync(distPath, 'utf8'));
      return info.buildDate || undefined;
    }
  } catch (_) {}
  return undefined;
}

function showBuildSummary() {
  try {
    const beVer = require(path.join(config.sourcePath, 'be/package.json')).version;
    const commonVer = require(path.join(config.sourcePath, 'packages/common/package.json')).version;
    const beBuild = readBuildDateSafe(path.join(config.sourcePath, 'be'));
    console.log('📦 빌드 산출물 버전/시간:');
    console.log(`   🏗️  Backend v${beVer}${beBuild ? ` | 🔨 ${beBuild}` : ''}`);
    console.log(`   📦 Common v${commonVer}`);
    console.log('');
  } catch (e) {
    console.log('⚠️  빌드 산출물 버전/시간 정보를 읽을 수 없습니다.');
  }
}

// Backend 배포 폴더로 복사
async function copyBeToDeploy() {
  console.log('📁 Backend 배포 폴더로 복사 중...');
  const deployBePath = path.join(config.deployPath, 'backend');
  if (!fs.existsSync(deployBePath)) fs.mkdirSync(deployBePath, { recursive: true });
  const beDist = path.join(config.sourcePath, 'be/dist');
  const bePkgJson = path.join(config.sourcePath, 'be/package.json');
  const bePkgLock = path.join(config.sourcePath, 'be/package-lock.json');
  const beBuildInfo = path.join(config.sourcePath, 'be/build-info.json');
  await ensureBuilt('Backend', 'be', 'be/dist');
  await run('cp', ['-a', path.join(beDist, '.'), deployBePath], undefined);
  // package.json / lock / build-info 포함
  if (!fs.existsSync(bePkgJson)) {
    throw new Error(`Backend package.json이 없습니다: ${bePkgJson}`);
  }
  fs.copyFileSync(bePkgJson, path.join(deployBePath, 'package.json'));
  if (fs.existsSync(bePkgLock)) {
    fs.copyFileSync(bePkgLock, path.join(deployBePath, 'package-lock.json'));
  }
  if (fs.existsSync(beBuildInfo)) {
    fs.copyFileSync(beBuildInfo, path.join(deployBePath, 'build-info.json'));
  }
  console.log('✅ Backend 복사 완료');
}

// Common 배포 폴더로 복사 (@iitp-dabt/common 배포용)
async function copyCommonToDeploy() {
  console.log('📁 Common 배포 폴더로 복사 중...');
  const deployCommonPath = path.join(config.deployPath, 'common');
  if (!fs.existsSync(deployCommonPath)) fs.mkdirSync(deployCommonPath, { recursive: true });
  const commonDist = path.join(config.sourcePath, 'packages/common/dist');
  const commonPkgJson = path.join(config.sourcePath, 'packages/common/package.json');
  await ensureBuilt('Common', 'packages/common', 'packages/common/dist');
  await run('cp', ['-a', path.join(commonDist, '.'), deployCommonPath], undefined);
  if (!fs.existsSync(commonPkgJson)) {
    throw new Error(`Common package.json이 없습니다: ${commonPkgJson}`);
  }
  fs.copyFileSync(commonPkgJson, path.join(deployCommonPath, 'package.json'));
  console.log('✅ Common 복사 완료');
}

// 메인 실행 함수
async function main() {
  try {
    console.log('🚀 서버용 Backend 빌드 시작...');
    await installToolchainAtRoot();
    await buildCommon();
    await buildBe();
    await copyCommonToDeploy();
    await copyBeToDeploy();
    showBuildSummary();
    console.log('🎉 서버용 Backend 빌드 완료!');
    console.log('');
    console.log('📁 빌드 결과물:');
    console.log(`   - ${config.deployPath}/common/`);
    console.log(`   - ${config.deployPath}/backend/`);
    console.log('');
    console.log('💡 다음 단계: npm run deploy:server:be');
  } catch (error) {
    console.error('❌ 서버용 Backend 빌드 실패:', error.message);
    process.exit(1);
  }
}

main();
