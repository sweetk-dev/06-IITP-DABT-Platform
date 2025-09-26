#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const isWindows = process.platform === 'win32';
const bePath = path.join(__dirname, '../../be');
const commonPath = path.join(__dirname, '../../packages/common');

console.log('🔨 Building BE package...');

try {
  // BE 디렉토리로 이동
  process.chdir(bePath);
  
  // common package가 빌드되었는지 확인
  const commonDistPath = path.join(commonPath, 'dist');
  if (!fs.existsSync(commonDistPath)) {
    console.log('⚠️  Common package not built. Building common first...');
    execSync(`node ${path.join(__dirname, 'build-common.js')}`, { stdio: 'inherit' });
  }
  
  // BE dist 폴더 정리
  const beDistPath = path.join(bePath, 'dist');
  if (fs.existsSync(beDistPath)) {
    console.log('🧹 Cleaning BE dist directory...');
    if (isWindows) {
      execSync('rmdir /s /q dist', { stdio: 'inherit' });
    } else {
      execSync('rm -rf dist', { stdio: 'inherit' });
    }
  }
  
  // BE 빌드 (package.json의 build 스크립트 실행)
  console.log('📦 Building BE...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ BE build completed successfully!');
  
} catch (error) {
  console.error('❌ BE build failed:', error.message);
  process.exit(1);
}
