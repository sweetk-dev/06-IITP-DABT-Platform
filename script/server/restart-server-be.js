#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

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
  bePath: process.env.PROD_BE_PATH || '/var/www/iitp-dabt-platform/be',
  pm2AppName: process.env.PM2_APP_NAME_BE || 'iitp-dabt-plf-be'
};

// 버전 정보 출력
function showVersionInfo() {
  console.log('📋 버전 정보:');
  
  try {
    // Backend 버전 확인
    const bePackageJson = require(path.join(config.bePath, 'package.json'));
    console.log(`   🏗️  Backend: ${bePackageJson.version}`);
    
    // Common 패키지 버전 확인
    try {
      const commonPackageJson = require(path.join(config.bePath, 'node_modules/@iitp-dabt-platform/common/package.json'));
      console.log(`   📦 Common: ${commonPackageJson.version}`);
    } catch (_) {}
    
    // 빌드 정보 확인
    const buildInfoPath = path.join(config.bePath, 'dist/build-info.json');
    if (fs.existsSync(buildInfoPath)) {
      const buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, 'utf8'));
      if (buildInfo.buildDate) console.log(`   🔨 빌드 시간: ${buildInfo.buildDate}`);
    }
  } catch (error) {
    console.log('   ⚠️  버전 정보를 가져올 수 없습니다.');
  }
  
  console.log('');
}

// 의존성 설치
async function installDependencies() {
  console.log('📦 의존성 확인 및 설치 중...');
  const installProcess = spawn('npm', ['install', '--omit=dev'], {
    stdio: 'inherit',
    cwd: config.bePath
  });
  
  return new Promise((resolve, reject) => {
    installProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ 의존성 설치 완료');
        resolve();
      } else {
        reject(new Error(`의존성 설치 실패 (종료 코드: ${code})`));
      }
    });
  });
}

// Backend 서버 재시작
async function restartBackend() {
  console.log('🔄 Backend 서버 재시작 중...');
  
  const restartProcess = spawn('pm2', ['restart', config.pm2AppName], {
    stdio: 'inherit'
  });
  
  return new Promise((resolve, reject) => {
    restartProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Backend 서버 재시작 완료');
        resolve();
      } else {
        reject(new Error(`Backend 서버 재시작 실패 (종료 코드: ${code})`));
      }
    });
  });
}

// 메인 실행 함수
async function main() {
  try {
    console.log('🚀 Backend 서버 재시작...');
    console.log('');
    
    // 1. 버전 정보 출력
    showVersionInfo();
    
    // 2. 의존성 설치
    await installDependencies();
    
    // 3. 서버 재시작
    await restartBackend();
    
    console.log('');
    console.log('🎉 Backend 서버 재시작 완료!');
    console.log('');
    console.log('📋 서버 정보:');
    console.log(`   경로: ${config.bePath}`);
    console.log(`   PM2 앱명: ${config.pm2AppName}`);
    console.log('');
    console.log('💡 유용한 명령어:');
    console.log('   pm2 status                    # 서버 상태 확인');
    console.log(`   pm2 logs ${config.pm2AppName}    # 로그 확인`);
    console.log(`   pm2 stop ${config.pm2AppName}    # 서버 중지`);
    
  } catch (error) {
    console.error('❌ Backend 서버 재시작 실패:', error.message);
    process.exit(1);
  }
}

main();
