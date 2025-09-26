#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const isWindows = process.platform === 'win32';

console.log('🚀 Building all packages...');

try {
  // 1. Common package 빌드
  console.log('\n📦 Step 1: Building common package...');
  execSync(`node ${path.join(__dirname, 'build-common.js')}`, { stdio: 'inherit' });
  
  // 2. FE package 빌드
  console.log('\n📦 Step 2: Building FE package...');
  execSync(`node ${path.join(__dirname, 'build-fe.js')}`, { stdio: 'inherit' });
  
  // 3. BE package 빌드
  console.log('\n📦 Step 3: Building BE package...');
  execSync(`node ${path.join(__dirname, 'build-be.js')}`, { stdio: 'inherit' });
  
  console.log('\n✅ All packages built successfully!');
  
} catch (error) {
  console.error('❌ Build process failed:', error.message);
  process.exit(1);
}
