#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// .env 파일 로드 함수
function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) {
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

// Linux에서만 실행 가능
if (!isLinux) {
  console.error('❌ 서버용 재시작 스크립트는 Linux에서만 실행 가능합니다.');
  process.exit(1);
}

// 설정
const config = {
  fePath: process.env.PROD_FE_PATH || '/var/www/iitp-dabt-platform/fe',
  serviceRoot: process.env.SERVICE_ROOT || '/'
};

// 버전 정보 출력
function showVersionInfo() {
  console.log('📋 Frontend 버전 정보:');
  
  try {
    // Frontend 버전 확인
    const fePackageJsonPath = path.join(config.fePath, 'package.json');
    if (fs.existsSync(fePackageJsonPath)) {
      const fePackageJson = JSON.parse(fs.readFileSync(fePackageJsonPath, 'utf8'));
      console.log(`   🎨 Frontend: ${fePackageJson.version}`);
    }
    
    // 빌드 정보 확인
    const buildInfoPath = path.join(config.fePath, 'build-info.json');
    if (fs.existsSync(buildInfoPath)) {
      const buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, 'utf8'));
      if (buildInfo.buildDate) console.log(`   🔨 빌드 시간: ${buildInfo.buildDate}`);
    }
    
    console.log(`   📂 서비스 경로: ${config.serviceRoot}`);
  } catch (error) {
    console.log('   ⚠️  버전 정보를 가져올 수 없습니다.');
  }
  
  console.log('');
}

// 프로세스 실행 헬퍼
function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit' });
    p.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(' ')} 실패 (종료 코드: ${code})`));
    });
  });
}

// Frontend 재시작 (Nginx reload)
async function restartFrontend() {
  console.log('🔄 Frontend 재시작 (Nginx reload) 중...');
  
  // 버전 정보 출력
  showVersionInfo();
  
  // Nginx 설정 테스트
  console.log('🧪 Nginx 설정 테스트 중...');
  await run('nginx', ['-t']);
  console.log('✅ Nginx 설정 테스트 통과');
  
  // Nginx reload (무중단 재시작)
  console.log('🔄 Nginx reload 중...');
  await run('systemctl', ['reload', 'nginx']);
  console.log('✅ Nginx reload 완료');
}

// 메인 실행 함수
async function main() {
  try {
    console.log('🚀 Frontend 재시작...');
    console.log('');
    
    // Frontend 재시작
    await restartFrontend();
    
    console.log('');
    console.log('🎉 Frontend 재시작 완료!');
    console.log('');
    console.log('📋 Frontend 정보:');
    console.log(`   경로: ${config.fePath}`);
    console.log(`   서비스 경로: ${config.serviceRoot}`);
    console.log('');
    console.log('💡 유용한 명령어:');
    console.log('   systemctl status nginx        # Nginx 상태 확인');
    console.log('   nginx -t                      # Nginx 설정 테스트');
    console.log('   tail -f /var/log/nginx/access.log # 접속 로그');
    console.log('   tail -f /var/log/nginx/error.log  # 에러 로그');
    
  } catch (error) {
    console.error('❌ Frontend 재시작 실패:', error.message);
    console.log('');
    console.log('💡 문제 해결:');
    console.log('   1. sudo 권한 확인: sudo nginx -t');
    console.log('   2. Nginx 로그 확인: sudo tail /var/log/nginx/error.log');
    console.log('   3. Nginx 상태 확인: sudo systemctl status nginx');
    process.exit(1);
  }
}

main();

