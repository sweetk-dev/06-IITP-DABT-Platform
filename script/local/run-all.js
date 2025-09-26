#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

const isWindows = process.platform === 'win32';

console.log('🚀 Starting all development servers...');

let feProcess, beProcess;

try {
  // FE 서버 시작
  console.log('\n🌐 Starting FE development server...');
  feProcess = spawn('node', [path.join(__dirname, 'run-fe.js')], {
    stdio: 'inherit',
    shell: true
  });
  
  // BE 서버 시작
  console.log('\n🌐 Starting BE development server...');
  beProcess = spawn('node', [path.join(__dirname, 'run-be.js')], {
    stdio: 'inherit',
    shell: true
  });
  
  // 프로세스 종료 처리
  const cleanup = () => {
    console.log('\n🛑 Stopping all development servers...');
    if (feProcess) feProcess.kill('SIGINT');
    if (beProcess) beProcess.kill('SIGINT');
    process.exit(0);
  };
  
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  
  // 프로세스 종료 감지
  feProcess.on('close', (code) => {
    console.log(`FE process exited with code ${code}`);
  });
  
  beProcess.on('close', (code) => {
    console.log(`BE process exited with code ${code}`);
  });
  
} catch (error) {
  console.error('❌ Failed to start development servers:', error.message);
  process.exit(1);
}
