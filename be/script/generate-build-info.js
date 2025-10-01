import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 빌드 정보 생성
function generateBuildInfo() {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
  
  const buildDate = new Date().toISOString();
  const buildNumber = buildDate.replace(/[-:T]/g, '').split('.')[0];
  
  const buildInfo = {
    version: packageJson.version,
    buildDate,
    buildNumber,
    buildTimestamp: Date.now()
  };
  
  // build-info.json 파일 생성
  const buildInfoPath = path.join(__dirname, '../dist/build-info.json');
  fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));
  
  console.log('✅ 빌드 정보 생성 완료:', buildInfoPath);
  console.log('📦 빌드 정보:', buildInfo);
  
  return buildInfo;
}

// 직접 실행 시 (ESM 방식) - 항상 실행
generateBuildInfo();

export { generateBuildInfo };
