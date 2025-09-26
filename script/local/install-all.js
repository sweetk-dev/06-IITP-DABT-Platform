#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const isWindows = process.platform === 'win32';

console.log('📦 Installing all dependencies...');

try {
  // 루트에서 모든 의존성 설치 (workspaces 활용)
  console.log('🔧 Installing root dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Common package 빌드
  console.log('🔨 Building common package...');
  execSync(`node ${path.join(__dirname, 'build-common.js')}`, { stdio: 'inherit' });
  
  console.log('✅ All dependencies installed and common package built successfully!');
  console.log('\n📋 Available commands:');
  console.log('  npm run build:common  - Build common package only');
  console.log('  npm run build:fe      - Build FE package');
  console.log('  npm run build:be      - Build BE package');
  console.log('  npm run build:all     - Build all packages');
  console.log('  npm run dev:fe        - Start FE development server');
  console.log('  npm run dev:be        - Start BE development server');
  console.log('  npm run dev:all       - Start all development servers');
  
} catch (error) {
  console.error('❌ Installation failed:', error.message);
  process.exit(1);
}
