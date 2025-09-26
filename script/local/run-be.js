#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const isWindows = process.platform === 'win32';
const bePath = path.join(__dirname, '../../be');
const commonPath = path.join(__dirname, '../../packages/common');

console.log('🚀 Starting BE development server...');

try {
  // BE 디렉토리로 이동
  process.chdir(bePath);
  
  // common package가 빌드되었는지 확인
  const commonDistPath = path.join(commonPath, 'dist');
  if (!fs.existsSync(commonDistPath)) {
    console.log('⚠️  Common package not built. Building common first...');
    execSync(`node ${path.join(__dirname, 'build-common.js')}`, { stdio: 'inherit' });
  }
  
  // BE 개발 서버 시작
  console.log('🌐 Starting BE development server...');
  const child = spawn(isWindows ? 'npm.cmd' : 'npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true
  });
  
  // 프로세스 종료 처리
  process.on('SIGINT', () => {
    console.log('\n🛑 Stopping BE development server...');
    child.kill('SIGINT');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Stopping BE development server...');
    child.kill('SIGTERM');
    process.exit(0);
  });
  
} catch (error) {
  console.error('❌ BE development server failed:', error.message);
  process.exit(1);
}
