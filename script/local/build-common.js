#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const isWindows = process.platform === 'win32';
const commonPath = path.join(__dirname, '../../packages/common');

console.log('🔨 Building common package...');

try {
  // common 디렉토리로 이동
  process.chdir(commonPath);
  
  // dist 디렉토리 정리
  if (fs.existsSync('dist')) {
    console.log('🧹 Cleaning dist directory...');
    if (isWindows) {
      execSync('rmdir /s /q dist', { stdio: 'inherit' });
    } else {
      execSync('rm -rf dist', { stdio: 'inherit' });
    }
  }
  
  // TypeScript 컴파일
  console.log('📦 Compiling TypeScript...');
  execSync('npx tsc', { stdio: 'inherit' });
  
  console.log('✅ Common package build completed successfully!');
  
} catch (error) {
  console.error('❌ Common package build failed:', error.message);
  process.exit(1);
}
