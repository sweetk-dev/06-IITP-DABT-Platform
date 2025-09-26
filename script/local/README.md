# Local Development Scripts

이 디렉토리는 IITP-DABT-Platform 프로젝트의 로컬 개발을 위한 빌드 및 실행 스크립트를 포함합니다.

## 📁 구조

```
script/local/
├── build-common.js/.bat/.sh    # Common package 빌드
├── build-fe.js/.bat/.sh        # FE package 빌드
├── build-be.js/.bat/.sh        # BE package 빌드
├── build-all.js/.bat/.sh       # 모든 패키지 빌드
├── run-fe.js/.bat/.sh          # FE 개발 서버 실행
├── run-be.js/.bat/.sh          # BE 개발 서버 실행
├── run-all.js/.bat/.sh         # 모든 개발 서버 실행
└── README.md                   # 이 파일
```

## 🚀 사용법

### 초기 설정 (최초 1회)
```bash
# 모든 의존성 설치 및 common package 빌드
script\local\install-all.bat    # Windows
./script/local/install-all.sh   # MacOS/Linux
# 또는
npm run install:all
```

### Windows 사용자
```bash
# Common package 빌드
script\local\build-common.bat

# FE 빌드
script\local\build-fe.bat

# BE 빌드
script\local\build-be.bat

# 모든 패키지 빌드
script\local\build-all.bat

# FE 개발 서버 실행
script\local\run-fe.bat

# BE 개발 서버 실행
script\local\run-be.bat

# 모든 개발 서버 실행
script\local\run-all.bat
```

### MacOS/Linux 사용자
```bash
# 실행 권한 부여 (최초 1회)
chmod +x script/local/*.sh

# Common package 빌드
./script/local/build-common.sh

# FE 빌드
./script/local/build-fe.sh

# BE 빌드
./script/local/build-be.sh

# 모든 패키지 빌드
./script/local/build-all.sh

# FE 개발 서버 실행
./script/local/run-fe.sh

# BE 개발 서버 실행
./script/local/run-be.sh

# 모든 개발 서버 실행
./script/local/run-all.sh
```

### Node.js 직접 실행 또는 npm scripts
```bash
# 모든 의존성 설치
npm run install:all

# Common package 빌드
npm run build:common
# 또는
node script/local/build-common.js

# FE 빌드
npm run build:fe
# 또는
node script/local/build-fe.js

# BE 빌드
npm run build:be
# 또는
node script/local/build-be.js

# 모든 패키지 빌드
npm run build:all
# 또는
node script/local/build-all.js

# FE 개발 서버 실행
npm run dev:fe
# 또는
node script/local/run-fe.js

# BE 개발 서버 실행
npm run dev:be
# 또는
node script/local/run-be.js

# 모든 개발 서버 실행
npm run dev:all
# 또는
node script/local/run-all.js

# Common package watch 모드 (개발 중 타입 변경 감지)
npm run build:common:watch
```

## 📦 빌드 프로세스

1. **Common Package 빌드**: `packages/common`의 TypeScript 파일들을 컴파일하여 `dist` 디렉토리에 출력
2. **FE 빌드**: Common package를 참조하여 FE 애플리케이션을 빌드
3. **BE 빌드**: Common package를 참조하여 BE 애플리케이션을 빌드

## 🔧 의존성 관리

### 최적화된 의존성 구조
- **Common Package**: FE와 BE에서 공통으로 사용되는 타입, 상수, 유틸리티
- **FE Package**: React 관련 의존성만 포함, common package 참조
- **BE Package**: Express 관련 의존성만 포함, common package 참조
- **Root Package**: TypeScript, rimraf 등 공통 devDependencies 관리

### 중복 설치 방지
- `workspaces`를 활용하여 공통 의존성을 루트에서 관리
- `peerDependencies`로 TypeScript 버전 통일
- `.npmrc` 설정으로 중복 설치 방지

### 패키지 참조 방식
- FE는 `@iitp-dabt-platform/common` 패키지를 로컬 파일 참조로 사용
- Vite 설정에서 alias를 통해 소스 파일을 직접 참조
- 빌드 시에는 common package가 먼저 빌드되어야 함

## ⚠️ 주의사항

- Common package가 빌드되지 않은 상태에서 FE/BE를 빌드하면 자동으로 common package를 먼저 빌드합니다
- 개발 서버 실행 시에도 common package가 빌드되지 않았다면 자동으로 빌드합니다
- 모든 스크립트는 프로젝트 루트 디렉토리에서 실행해야 합니다

## 🐛 문제 해결

### Common package 빌드 실패
```bash
# packages/common 디렉토리로 이동하여 직접 빌드
cd packages/common
npm install
npm run build
```

### FE/BE 빌드 실패
```bash
# 의존성 재설치
cd fe  # 또는 be
npm install
```

### 권한 오류 (MacOS/Linux)
```bash
# 실행 권한 부여
chmod +x script/local/*.sh
```
