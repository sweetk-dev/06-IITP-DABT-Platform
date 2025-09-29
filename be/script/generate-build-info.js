const fs = require('fs');
const path = require('path');

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

// 직접 실행 시
if (require.main === module) {
  generateBuildInfo();
}

module.exports = { generateBuildInfo };
