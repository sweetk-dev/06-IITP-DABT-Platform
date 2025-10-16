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
    fePath: process.env.PROD_FE_PATH || '/var/www/iitp-dabt-platform/fe',
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
    `${src}`,
    `${dest}`
  ];
  console.log(`📤 rsync (local): rsync ${args.join(' ')}`);
  await run('rsync', args);
}

async function rsyncRemote(srcUserHost, srcPath, destUserHost, destPath, port) {
  const baseArgs = [
    '-avz',
    '--delete'
  ];
  if (process.env.RSYNC_CHOWN) baseArgs.push(`--chown=${process.env.RSYNC_CHOWN}`);
  const args = [...baseArgs, '-e', `ssh -p ${port}`, `${srcUserHost}:${srcPath}`, `${destUserHost}:${destPath}`];
  console.log(`📤 rsync (ssh): rsync ${args.join(' ')}`);
  await run('rsync', args);
}

// Frontend 배포
async function deployFrontend() {
  console.log('🎨 Frontend 단독 배포 중...');
  const src = path.posix.join(deployConfig.buildServer.path, 'frontend/')
  const dest = deployConfig.productionServer.fePath + '/';
  
  console.log(`   ▶︎ 배포 모드: ${sameHost ? 'local' : 'ssh'}`);
  console.log(`   ▶︎ 소스: ${src}`);
  console.log(`   ▶︎ 대상: ${dest}`);
  
  if (sameHost) {
    await rsyncLocal(src, dest);
  } else {
    await rsyncRemote(
      `${deployConfig.buildServer.user}@${deployConfig.buildServer.host}`,
      src,
      `${deployConfig.productionServer.user}@${deployConfig.productionServer.host}`,
      dest,
      deployConfig.buildServer.port
    );
  }
  
  console.log('✅ Frontend 배포 완료');
}

// 권한 정리
async function fixPermissions() {
  const sshBase = ['-p', `${deployConfig.productionServer.port}`, `${deployConfig.productionServer.user}@${deployConfig.productionServer.host}`];
  const fePath = deployConfig.productionServer.fePath;
  // node_modules, logs 제외하고 권한 설정
  const cmd = `find ${fePath} -path '*/node_modules' -prune -o -path '*/logs' -prune -o -type d -exec chmod 755 {} \\; && find ${fePath} -path '*/node_modules' -prune -o -path '*/logs' -prune -o -type f -exec chmod 644 {} \\;`;
  
  if (sameHost) {
    await run('bash', ['-lc', cmd]);
  } else {
    await run('ssh', [...sshBase, cmd]);
  }
  console.log('🔐 Frontend 퍼미션 정리 완료 (755/644)');
}

// 버전 정보 확인
async function showVersionInfo() {
  console.log('📋 Frontend 버전 정보:');
  try {
    const fePkgPath = path.posix.join(deployConfig.buildServer.path, 'frontend/package.json');
    if (sameHost && fs.existsSync(fePkgPath)) {
      const fePkg = JSON.parse(fs.readFileSync(fePkgPath, 'utf8'));
      console.log(`   🎨 Frontend: ${fePkg.version}`);
      
      const feBuildInfo = path.posix.join(deployConfig.buildServer.path, 'frontend/build-info.json');
      if (fs.existsSync(feBuildInfo)) {
        const buildInfo = JSON.parse(fs.readFileSync(feBuildInfo, 'utf8'));
        if (buildInfo.buildDate) console.log(`   🔨 빌드 시간: ${buildInfo.buildDate}`);
      }
    }
  } catch (e) {
    console.log('   ⚠️  버전 정보를 읽을 수 없습니다.');
  }
  console.log('');
}

// 메인 실행 함수
async function main() {
  try {
    console.log('🚀 Frontend 단독 배포 시작...');
    console.log('');
    
    await showVersionInfo();
    await deployFrontend();
    await fixPermissions();
    
    console.log('');
    console.log('🎉 Frontend 배포 완료!');
    console.log('');
    console.log('📋 배포 경로:');
    console.log(`   ${deployConfig.productionServer.fePath}`);
    console.log('');
    console.log('⚠️  배포 후 필수 작업:');
    console.log('');
    console.log('1. Nginx reload (설정 변경 시):');
    console.log('   npm run restart:server:fe');
    console.log('   # 또는: sudo nginx -t && sudo systemctl reload nginx');
    console.log('');
    console.log('2. 브라우저 캐시 클리어 (필요 시)');
    console.log('');
    console.log('3. 접속 테스트:');
    console.log('   curl -I http://localhost/');
    
  } catch (error) {
    console.error('❌ Frontend 배포 실패:', error.message);
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
  console.log('   PROD_FE_PATH: 실행 서버 FE 경로');
  console.log('');
  console.log('🔧 또는 .env 파일에 설정하세요.');
  console.log('');
}

main();

