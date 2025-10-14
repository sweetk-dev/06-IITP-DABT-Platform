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

// 환경 변수 적용
Object.keys(envVars).forEach(key => {
  if (!process.env[key]) {
    process.env[key] = envVars[key];
  }
});

// OS 감지
const isLinux = process.platform === 'linux';

console.log(`🖥️  OS 감지: ${process.platform} (${isLinux ? 'Linux' : 'Unknown'})`);

// Linux에서만 실행 가능
if (!isLinux) {
  console.error('❌ 서버용 배포 스크립트는 Linux에서만 실행 가능합니다.');
  process.exit(1);
}

// 배포 설정
const deployConfig = {
  // 빌드 서버 설정
  buildServer: {
    host: process.env.BUILD_SERVER_HOST || 'localhost',
    user: process.env.BUILD_SERVER_USER || 'iitp-plf',
    path: process.env.BUILD_SERVER_PATH || '/home/iitp-plf/iitp-dabt-platform/deploy',
    port: process.env.BUILD_SERVER_PORT || '22'
  },
  // 실행 서버 설정
  productionServer: {
    host: process.env.PROD_SERVER_HOST || 'localhost',
    user: process.env.PROD_SERVER_USER || 'iitp-plf',
    bePath: process.env.PROD_BE_PATH || '/var/www/iitp-dabt-platform/be',
    port: process.env.PROD_SERVER_PORT || '22'
  }
};

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', ...opts });
    p.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(' ')} 실패 (종료 코드: ${code})`));
    });
  });
}

function hostsEqual(a, b) {
  const norm = (h) => (h || '').toLowerCase();
  const na = norm(a), nb = norm(b);
  if (na === nb) return true;
  const aliases = new Set(['localhost', '127.0.0.1', '::1']);
  return aliases.has(na) && aliases.has(nb);
}

const sameHost = hostsEqual(deployConfig.buildServer.host, deployConfig.productionServer.host) &&
                 deployConfig.buildServer.user === deployConfig.productionServer.user;

async function rsyncLocal(src, dest) {
  const args = [
    '-avz',
    '--delete',
    '--chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r',
    `${src}`,
    `${dest}`
  ];
  console.log(`📤 rsync (local): rsync ${args.join(' ')}`);
  await run('rsync', args);
}

async function rsyncRemote(srcUserHost, srcPath, destUserHost, destPath, port) {
  const baseArgs = [
    '-avz',
    '--delete',
    '--chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r'
  ];
  if (process.env.RSYNC_CHOWN) baseArgs.push(`--chown=${process.env.RSYNC_CHOWN}`);
  const args = [...baseArgs, '-e', `ssh -p ${port}`, `${srcUserHost}:${srcPath}`, `${destUserHost}:${destPath}`];
  console.log(`📤 rsync (ssh): rsync ${args.join(' ')}`);
  await run('rsync', args);
}

// Common 배포
async function deployCommon() {
  console.log('📦 Common 패키지 배포 중...');
  const src = path.posix.join(deployConfig.buildServer.path, 'common/')
  const destWorkspaceCommon = path.posix.join(deployConfig.productionServer.bePath, '..', 'packages/common/');
  
  console.log(`   ▶︎ 배포 모드: ${sameHost ? 'local' : 'ssh'}`);
  console.log(`   ▶︎ 소스: ${src}`);
  console.log(`   ▶︎ 대상: ${destWorkspaceCommon}`);
  
  if (sameHost) {
    // 로컬 배포
    const bePath = deployConfig.productionServer.bePath;
    const baseDirs = [
      bePath,
      path.posix.join(bePath, 'node_modules'),
      path.posix.join(bePath, 'node_modules/@iitp-dabt-platform'),
      destWorkspaceCommon
    ];
    for (const d of baseDirs) {
      try { 
        if (!fs.existsSync(d)) {
          fs.mkdirSync(d, { recursive: true });
          console.log(`   📁 디렉토리 생성: ${d}`);
        }
      } catch (e) {
        console.error(`   ❌ 디렉토리 생성 실패: ${d} (${e.code || e.message})`);
        throw e;
      }
    }
    await rsyncLocal(src, destWorkspaceCommon);
  } else {
    // 원격 배포
    const sshBase = ['-p', `${deployConfig.productionServer.port}`, `${deployConfig.productionServer.user}@${deployConfig.productionServer.host}`];
    const bePath = deployConfig.productionServer.bePath;
    const mkdirCmd = `mkdir -p ${bePath} ${bePath}/node_modules ${bePath}/node_modules/@iitp-dabt-platform ${destWorkspaceCommon}`;
    console.log(`   📁 원격 디렉토리 생성 중...`);
    await run('ssh', [...sshBase, mkdirCmd]);
    await rsyncRemote(`${deployConfig.buildServer.user}@${deployConfig.buildServer.host}`, src, `${deployConfig.productionServer.user}@${deployConfig.productionServer.host}`, destWorkspaceCommon, deployConfig.buildServer.port);
  }
  
  console.log('✅ Common 패키지 배포 완료');
}

// 버전 정보 확인
async function showVersionInfo() {
  console.log('📋 Common 패키지 버전 정보:');
  try {
    const commonPkgPath = path.posix.join(deployConfig.buildServer.path, 'common/package.json');
    if (sameHost && fs.existsSync(commonPkgPath)) {
      const commonPkg = JSON.parse(fs.readFileSync(commonPkgPath, 'utf8'));
      console.log(`   📦 Common: ${commonPkg.version}`);
    }
  } catch (e) {
    console.log('   ⚠️  버전 정보를 읽을 수 없습니다.');
  }
  console.log('');
}

// 메인 실행 함수
async function main() {
  try {
    console.log('🚀 Common 패키지 단독 배포 시작...');
    console.log('');
    
    await showVersionInfo();
    await deployCommon();
    
    console.log('');
    console.log('🎉 Common 패키지 배포 완료!');
    console.log('');
    console.log('📋 배포 경로:');
    console.log(`   ${deployConfig.productionServer.bePath}/../packages/common/`);
    console.log('');
    console.log('⚠️  중요: 배포 후 영향 및 후속 조치');
    console.log('');
    console.log('✅ Backend:');
    console.log('   - Common 변경사항이 즉시 반영됨 (런타임 참조)');
    console.log('   - 재시작 필요: npm run restart:server:be');
    console.log('   - 재빌드 불필요');
    console.log('');
    console.log('⚠️  Frontend:');
    console.log('   - Common이 빌드 시 번들에 포함됨');
    console.log('   - 타입만 변경: 재빌드 불필요');
    console.log('   - 값/로직 변경: 재빌드 필수');
    console.log('     → npm run build:server:fe');
    console.log('     → npm run deploy:server');
    console.log('     → npm run restart:server:fe');
    console.log('');
    console.log('💡 안전한 방법: npm run build:server (전체 재빌드)');
    
  } catch (error) {
    console.error('❌ Common 패키지 배포 실패:', error.message);
    process.exit(1);
  }
}

// 환경 변수 확인
if (!process.env.BUILD_SERVER_HOST && !process.env.PROD_SERVER_HOST) {
  console.log('⚠️  환경 변수가 설정되지 않았습니다.');
  console.log('📋 필요한 환경 변수:');
  console.log('   BUILD_SERVER_HOST: 빌드 서버 호스트');
  console.log('   BUILD_SERVER_USER: 빌드 서버 사용자명');
  console.log('   BUILD_SERVER_PATH: 빌드 서버 배포 경로');
  console.log('   PROD_SERVER_HOST: 실행 서버 호스트');
  console.log('   PROD_SERVER_USER: 실행 서버 사용자명');
  console.log('   PROD_BE_PATH: 실행 서버 BE 경로');
  console.log('');
  console.log('🔧 또는 .env 파일에 설정하세요.');
  console.log('');
}

main();

