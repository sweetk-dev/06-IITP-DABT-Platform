#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const isWindows = process.platform === 'win32';
const fePath = path.join(__dirname, '../../fe');
const commonPath = path.join(__dirname, '../../packages/common');

console.log('🔨 Building FE package...');

try {
  // FE 디렉토리로 이동
  process.chdir(fePath);
  
  // common package가 빌드되었는지 확인
  const commonDistPath = path.join(commonPath, 'dist');
  if (!fs.existsSync(commonDistPath)) {
    console.log('⚠️  Common package not built. Building common first...');
    execSync(`node ${path.join(__dirname, 'build-common.js')}`, { stdio: 'inherit' });
  }
  
  // FE dist 폴더 정리
  const feDistPath = path.join(fePath, 'dist');
  if (fs.existsSync(feDistPath)) {
    console.log('🧹 Cleaning FE dist directory...');
    if (isWindows) {
      execSync('rmdir /s /q dist', { stdio: 'inherit' });
    } else {
      execSync('rm -rf dist', { stdio: 'inherit' });
    }
  }
  
  // FE 빌드
  console.log('📦 Building FE with Vite...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ FE build completed successfully!');
  
} catch (error) {
  console.error('❌ FE build failed:', error.message);
  process.exit(1);
}
