#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// OS 감지
const isLinux = process.platform === 'linux';

console.log(`🖥️  OS 감지: ${process.platform} (${isLinux ? 'Linux' : 'Unknown'})`);

// Linux에서만 실행 가능
if (!isLinux) {
  console.error('❌ 서버용 시작 스크립트는 Linux에서만 실행 가능합니다.');
  process.exit(1);
}

// 설정
const config = {
  fePath: process.env.PROD_FE_PATH || '/var/www/iitp-dabt-platform/fe',
  nginxConfigPath: process.env.NGINX_CONFIG_PATH || '/etc/nginx/sites-available/iitp-dabt-plf-fe'
};

// 버전 정보 출력
function showVersionInfo() {
  console.log('📋 버전 정보:');
  
  try {
    // Frontend 버전 확인
    const fePackageJson = require(path.join(config.fePath, 'package.json'));
    console.log(`   🎨 Frontend: ${fePackageJson.version}`);
    
    // Common 패키지 버전 확인
    const commonPackageJson = require(path.join(config.fePath, 'node_modules/@iitp-dabt/common/package.json'));
    console.log(`   📦 Common: ${commonPackageJson.version}`);
    
    // 빌드 정보 확인
    const buildInfoPath = path.join(config.fePath, 'dist/build-info.json');
    if (fs.existsSync(buildInfoPath)) {
      const buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, 'utf8'));
      if (buildInfo.buildDate) console.log(`   🔨 빌드 시간: ${buildInfo.buildDate}`);
    }
  } catch (error) {
    console.log('   ⚠️  버전 정보를 가져올 수 없습니다.');
  }
  
  console.log('');
}

// Frontend 서버 시작 (Nginx 설정)
async function startFrontend() {
  console.log('🎨 Frontend 서버 시작 중...');
  
  // 버전 정보 출력
  showVersionInfo();
  
  // Nginx 설정 파일 생성
  console.log('📝 Nginx 설정 파일 생성 중...');
  const nginxConfig = `
# IITP 장애인 데이터 플랫폼 Frontend (기존 서비스와 공존)
# 주의: 이 설정은 기존 Nginx 설정 파일에 location 블록만 추가하거나,
# 별도의 conf.d 파일로 include되어야 합니다.

# FE: /plf → /plf/
location = /plf {
    return 301 /plf/;
}

# 정적 자산 캐시
location ^~ /plf/assets/ {
    alias ${config.fePath}/dist/assets/;
    try_files $uri =404;
    expires 7d;
    add_header Cache-Control "public, max-age=604800";
}

location ~* ^/plf/(.+\\.(png|jpg|jpeg|gif|svg|ico|woff2?|js|css))$ {
    alias ${config.fePath}/dist/$1;
    try_files $uri =404;
    expires 7d;
    add_header Cache-Control "public, max-age=604800";
}

# SPA 진입점
location ^~ /plf/ {
    alias ${config.fePath}/dist/;
    index index.html;
    try_files $uri $uri/ /index.html;
}

# API 프록시 (/plf/api/* → /api/*)
location /plf/api/ {
    proxy_pass http://127.0.0.1:33000/api/;  # 끝 슬래시 필수
    proxy_http_version 1.1;
    proxy_read_timeout 120s;
    proxy_send_timeout 120s;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    client_max_body_size 20m;
}
`;
  
  // Nginx 설정 파일 작성
  fs.writeFileSync(config.nginxConfigPath, nginxConfig);
  console.log('✅ Nginx 설정 파일 생성 완료');
  
  // Nginx 설정 활성화
  console.log('🔗 Nginx 설정 활성화 중...');
  const enableProcess = spawn('ln', ['-sf', config.nginxConfigPath, '/etc/nginx/sites-enabled/'], {
    stdio: 'inherit'
  });
  
  await new Promise((resolve, reject) => {
    enableProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Nginx 설정 활성화 완료');
        resolve();
      } else {
        reject(new Error(`Nginx 설정 활성화 실패 (종료 코드: ${code})`));
      }
    });
  });
  
  // Nginx 설정 테스트
  console.log('🧪 Nginx 설정 테스트 중...');
  const testProcess = spawn('nginx', ['-t'], {
    stdio: 'inherit'
  });
  
  await new Promise((resolve, reject) => {
    testProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Nginx 설정 테스트 통과');
        resolve();
      } else {
        reject(new Error(`Nginx 설정 테스트 실패 (종료 코드: ${code})`));
      }
    });
  });
  
  // Nginx 재시작
  console.log('🔄 Nginx 재시작 중...');
  const restartProcess = spawn('systemctl', ['restart', 'nginx'], {
    stdio: 'inherit'
  });
  
  return new Promise((resolve, reject) => {
    restartProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Nginx 재시작 완료');
        resolve();
      } else {
        reject(new Error(`Nginx 재시작 실패 (종료 코드: ${code})`));
      }
    });
  });
}

// 메인 실행 함수
async function main() {
  try {
    console.log('🚀 Frontend 서버 시작...');
    
    // 1. 서버 시작
    await startFrontend();
    
    console.log('🎉 Frontend 서버 시작 완료!');
    console.log('');
    console.log('📋 서버 정보:');
    console.log(`   경로: ${config.fePath}`);
    console.log(`   Nginx 설정: ${config.nginxConfigPath}`);
    console.log(`   도메인: ${process.env.FRONTEND_DOMAIN || 'localhost'}`);
    console.log('');
    console.log('💡 유용한 명령어:');
    console.log('   systemctl status nginx        # Nginx 상태 확인');
    console.log('   systemctl restart nginx       # Nginx 재시작');
    console.log('   nginx -t                      # Nginx 설정 테스트');
    console.log('   tail -f /var/log/nginx/error.log # 에러 로그 확인');
    
  } catch (error) {
    console.error('❌ Frontend 서버 시작 실패:', error.message);
    process.exit(1);
  }
}

// 환경 변수 확인
if (!process.env.PROD_FE_PATH) {
  console.log('⚠️  환경 변수가 설정되지 않았습니다.');
  console.log('📋 필요한 환경 변수:');
  console.log('   PROD_FE_PATH: Frontend 서버 경로 (기본값: /var/www/iitp-dabt-platform/fe)');
  console.log('   NGINX_CONFIG_PATH: Nginx 설정 파일 경로 (기본값: /etc/nginx/sites-available/iitp-dabt-plf-fe)');
  console.log('   FRONTEND_DOMAIN: Frontend 도메인 (기본값: localhost)');
  console.log('');
  console.log('💡 예시:');
  console.log('   export PROD_FE_PATH=/var/www/iitp-dabt-platform/fe');
  console.log('   export NGINX_CONFIG_PATH=/etc/nginx/sites-available/iitp-dabt-plf-fe');
  console.log('   export FRONTEND_DOMAIN=your-domain.com');
  console.log('');
  console.log('🔧 또는 .env 파일에 설정하세요.');
  console.log('');
  console.log('⚠️  중요: Platform은 기존 Admin 서비스와 공존합니다!');
  console.log('   - Platform: /plf, /plf/api (포트 33000)');
  console.log('   - Admin: /adm, /adm/api (포트 30000)');
  console.log('   - Nginx 설정은 기존 설정에 추가하거나 conf.d에 include하세요.');
}

main();
