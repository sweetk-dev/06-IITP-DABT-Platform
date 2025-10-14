# 🚀 IITP DABT Platform 단일 서버(Build+Deploy+Run) 가이드

본 문서는 하나의 서버에서 빌드 서버와 실행(배포) 서버 역할을 동시에 수행하는 환경을 대상으로, 처음부터 끝까지 문제 없이 Backend/Frontend가 기동되도록 상세 스텝을 정리합니다.

**전제 조건(요약)**:
- 동일 서버에서 빌드와 배포 수행 (1대 서버)
- 빌드/배포: `iitp-plf` 계정으로 실행
- **기존 Admin 서비스와 공존**: Admin(`/adm`, `/adm/api`, 포트 30000)과 Platform(`/hub`, `/hub/api`, 포트 33000)
- Nginx: 기존 설정에 Platform location 블록 추가

---

## 0. 서버 기본 세팅

아래는 Ubuntu 20.04+ 기준 예시입니다. 다른 배포판은 패키지 명칭만 차이 있을 수 있습니다.

```bash
sudo apt update && sudo apt upgrade -y

# 필수 패키지
sudo apt install -y git curl unzip jq build-essential nginx

# Node.js 22.x 설치 (NodeSource)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# PM2 글로벌 설치
sudo npm install -g pm2

# PostgreSQL (이미 설치되어 있을 경우 생략)
# sudo apt install -y postgresql postgresql-contrib
```

확인:
```bash
node -v
npm -v
pm2 -v
nginx -t && systemctl status nginx --no-pager | cat
```

### 0.1 운영 계정 및 디렉터리 구조

```bash
# iitp-plf 사용자 생성 (존재하지 않는 경우)
sudo useradd -m -s /bin/bash iitp-plf
sudo passwd iitp-plf

# 홈 아래 기본 구조 생성
sudo mkdir -p /home/iitp-plf/iitp-dabt-platform/{source,deploy}
sudo chown -R iitp-plf:iitp-plf /home/iitp-plf/iitp-dabt-platform

# 서비스 루트 생성 (실행 경로)
sudo mkdir -p /var/www/iitp-dabt-platform/{be,fe,script,packages/common}
sudo chown -R iitp-plf:iitp-plf /var/www/iitp-dabt-platform
```

**설명**:
- `/var/www/iitp-dabt-platform/packages/common`은 BE가 참조하는 공통 패키지의 실제 위치입니다.
  - BE의 `be/package.json`에는 `"@iitp-dabt-platform/common": "file:../packages/common"`로 선언되어 있어
    설치 시 `be/node_modules/@iitp-dabt-platform/common`이 위 경로를 가리키는 심볼릭 링크로 생성됩니다.
  - 배포 시 이 디렉터리에 `dist/**`와 `package.json`이 동기화되어야 런타임에서 모듈을 정상 로드합니다.

### 0.2 환경변수(.env) 설정 가이드 (필수) ⚠️

**중요**: 환경변수는 **빌드 시점 vs 실행 시점**에 따라 요구사항이 다릅니다!

#### 📋 환경변수 요구사항 요약

| 구분 | 빌드 시 | 실행 시 | 위치 | 권장 방법 |
|------|---------|---------|------|----------|
| **Backend** | ❌ 불필요 | ✅ **필수** | 실행 서버: `/var/www/iitp-dabt-platform/be/.env` | 수동 생성 (최초 1회) |
| **Frontend** | ✅ **필수** | ❌ 불필요 | 빌드 서버: `fe/.env` | `.env` 파일 또는 export |

#### FE(빌드 시 주입: Vite)

**빌드 시점에만 필요** - Vite가 환경변수를 코드에 하드코딩합니다.

빌드 서버에서 빌드 전에 환경변수를 설정하세요. 두 가지 방법이 있습니다:

**방법 1: .env 파일 사용 (권장)**
```bash
# 빌드 서버: fe/.env 생성 (최초 1회)
cd /home/iitp-plf/iitp-dabt-platform/source/fe
cp env.sample .env
vi .env

# env.sample에 프로덕션 값이 기본으로 설정되어 있음
# 필요 시 서버 주소만 수정:
# VITE_VISUAL_TOOL=http://실제서버주소:포트/
# VITE_OPEN_API_CENTER_URL=http://실제서버주소/adm/
```

**방법 2: shell 환경변수 export (대안)**
```bash
export VITE_PORT=5173
export VITE_BASE=/hub/
export VITE_API_BASE_URL=/hub
export VITE_API_TIMEOUT=10000
export VITE_VISUAL_TOOL=http://실제서버주소:포트/
export VITE_EMPLOYMENT_SITE_URL=https://www.ablejob.co.kr/
export VITE_OPEN_API_CENTER_URL=http://실제서버주소/adm/
export VITE_OPEN_API_CENTER_ABOUT_URL=http://실제서버주소/adm/about
# 주의: VITE_API_BASE_URL=/hub (not /hub/api)
# FE 코드가 /api/v1/...을 자동으로 추가하므로 baseUrl은 /hub만 설정
```

**중요**:
- ✅ **권장**: 빌드 서버에 `fe/.env` 파일 생성 (`fe/env.sample` 참고)
- ✅ **대안**: shell 환경변수 export
- ❌ 실행 서버의 FE 디렉토리에는 `.env` 파일 불필요 (이미 빌드된 정적 파일)
- ✅ `fe/.env`는 Git에 커밋되지 않으며, 배포 시 exclude됨

#### BE(런타임 주입: dotenv)

**실행 시점에만 필요** - Node.js 런타임에서 dotenv로 로드합니다.

실행 서버의 BE 경로에 `.env`를 **수동으로 생성**하세요: `/var/www/iitp-dabt-platform/be/.env`

최소 예시:
```env
NODE_ENV=production
PORT=33000

# Database (Admin과 동일 DB 사용, 별도 계정)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=iitp_dabt
DB_USER=iitp_platform_user
DB_PASSWORD=your_db_password

# OpenAPI (Admin과 동일 설정)
OPEN_API_SERVER_URL=https://api.example.com
OPEN_API_AUTH_KEY=your_api_key
OPEN_API_AUTH_SECRET=your_api_secret

# CORS (프론트 도메인 추가)
CORS_ORIGINS=http://your-server-ip
```

**중요**:
- ✅ 실행 서버의 `/var/www/iitp-dabt-platform/be/.env` **반드시 필요** (최초 1회 수동 생성)
- ❌ 빌드 서버의 BE 디렉토리에는 `.env` 불필요 (TypeScript 컴파일만 수행)
- ✅ `.env`는 배포(rsync) 시 자동 보존됨 (`--exclude .env*`)
- ✅ 한 번 생성하면 배포 시 덮어쓰지 않으므로 안전

#### ⚙️ 배포 스크립트와 .env 보존

배포 스크립트(`deploy-server.js`)는 다음 파일을 **제외(exclude)**하여 보존합니다:
- `node_modules/` - 실행 서버의 의존성 보존
- `.env`, `.env*` - 환경변수 파일 보존

따라서:
1. **최초 배포 전**: 실행 서버에 `/var/www/iitp-dabt-platform/be/.env` 수동 생성
2. **이후 배포**: `.env` 파일은 자동 보존되어 덮어쓰지 않음

---

## 1. 소스 준비(동일 서버 빌드용)

`iitp-plf` 계정으로 로그인 후 진행합니다.

```bash
sudo -iu iitp-plf

cd /home/iitp-plf/iitp-dabt-platform/source
git clone https://github.com/sweetk-dev/06-IITP-DABT-Platform.git .

# 1. 빌드 스크립트용 .env 작성
cp script/server/env.sample.build-server script/server/.env
vi script/server/.env

# 2. Frontend 빌드용 .env 작성 (권장)
cd fe
cp env.sample .env
vi .env
# 프로덕션 빌드용 설정 (env.sample 참고)
cd ..
```

필수 항목 예시 (script/server/.env):
```bash
SOURCE_PATH=/home/iitp-plf/iitp-dabt-platform/source
DEPLOY_PATH=/home/iitp-plf/iitp-dabt-platform/deploy
GIT_REPO_URL=https://github.com/sweetk-dev/06-IITP-DABT-Platform.git
GIT_BRANCH=main
```

필수 항목 예시 (fe/.env):
```bash
# env.sample에 이미 설정되어 있음 (기본: /hub, 서버 주소만 수정)
VITE_PORT=5173
VITE_BASE=/hub/
VITE_API_BASE_URL=/hub
VITE_API_TIMEOUT=10000
VITE_VISUAL_TOOL=http://실제서버주소:포트/
VITE_EMPLOYMENT_SITE_URL=https://www.ablejob.co.kr/
VITE_OPEN_API_CENTER_URL=http://실제서버주소/adm/
VITE_OPEN_API_CENTER_ABOUT_URL=http://실제서버주소/adm/about
```

**주의**: 
- ❌ `be/.env` 파일은 만들 필요 없음 (빌드 시 불필요, TypeScript 컴파일만)
- ✅ `fe/.env` 파일 **권장** (env.sample 참고, 또는 export로도 가능)

---

## 2. 빌드(서버에서 수행)

```bash
cd /home/iitp-plf/iitp-dabt-platform/source

# Frontend 빌드용 환경변수 설정
# 방법 1 (권장): fe/.env 파일 사용
# → 이미 1단계에서 생성했으므로 추가 작업 불필요

# 방법 2 (대안): export 사용 (fe/.env가 없는 경우)
# export VITE_PORT=5173
# export VITE_BASE=/hub/
# export VITE_API_BASE_URL=/hub
# export VITE_API_TIMEOUT=10000
# export VITE_VISUAL_TOOL=http://실제서버주소:포트/
# export VITE_EMPLOYMENT_SITE_URL=https://www.ablejob.co.kr/
# export VITE_OPEN_API_CENTER_URL=http://실제서버주소/adm/
# export VITE_OPEN_API_CENTER_ABOUT_URL=http://실제서버주소/adm/about

# 전체 빌드 (common → be → fe 순, dist 검증 및 보강 포함)
npm run build:server

# 빌드 산출물 확인
ls -l /home/iitp-plf/iitp-dabt-platform/deploy
ls -l /home/iitp-plf/iitp-dabt-platform/deploy/backend
ls -l /home/iitp-plf/iitp-dabt-platform/deploy/frontend
ls -l /home/iitp-plf/iitp-dabt-platform/deploy/common
```

**빌드 결과(의도)**:
- `deploy/backend/`: `be/dist` + `be/package.json` + (있으면) `package-lock.json`, `build-info.json`
- `deploy/frontend/`: `fe/dist`
- `deploy/common/`: `packages/common/dist` + `packages/common/package.json`

---

## 3. 배포(동일 서버 내 rsync)

### 3.0 배포 전 준비 사항 ⚠️

**매우 중요**: 배포 전 실행 서버에 Backend `.env` 파일을 **반드시 생성**해야 합니다!

```bash
# 실행 서버에 Backend .env 생성 (최초 1회)
sudo mkdir -p /var/www/iitp-dabt-platform/be
sudo vi /var/www/iitp-dabt-platform/be/.env

# env.sample 참고하여 작성
# - PORT=33000
# - DB_NAME=iitp_dabt
# - DB_USER=iitp_platform_user
# - DB_PASSWORD=실제비밀번호
# - CORS_ORIGINS=실제서버주소
```

**왜 필요한가?**
- ✅ Backend는 **실행(런타임) 시**에만 .env 필요 (dotenv로 로드)
- ✅ 배포 스크립트는 `.env*` 파일을 exclude하므로 **배포 시 생성되지 않음**
- ✅ 따라서 **수동으로 최초 1회 생성** 필요

### 3.1 배포 스크립트 설정

동일 서버에서 배포하므로 `BUILD_SERVER_HOST`와 `PROD_SERVER_HOST`가 동일해도 됩니다. 스크립트는 sameHost 모드에서 로컬 rsync 수행하며, 다음을 보존합니다:
- `node_modules/` 보존
- `.env`, `.env*` 보존

```bash
cd /home/iitp-plf/iitp-dabt-platform/source

# 배포 스크립트용 .env 작성
cp script/server/env.sample.deploy-server script/server/.env
vi script/server/.env
```

필수 항목 예시:
```bash
BUILD_SERVER_HOST=localhost
BUILD_SERVER_USER=iitp-plf
BUILD_SERVER_PATH=/home/iitp-plf/iitp-dabt-platform/deploy
BUILD_SERVER_PORT=22

PROD_SERVER_HOST=localhost
PROD_SERVER_USER=iitp-plf
PROD_SERVER_PORT=22

PROD_BE_PATH=/var/www/iitp-dabt-platform/be
PROD_FE_PATH=/var/www/iitp-dabt-platform/fe

PM2_APP_NAME_BE=iitp-dabt-plf-be
```

### 3.2 배포 실행

```bash
# 동일 서버지만 필요 작업에 sudo가 요구될 수 있음
sudo npm run deploy:server
```

### 3.3 배포 후 확인
```bash
ls -l /var/www/iitp-dabt-platform/be
ls -l /var/www/iitp-dabt-platform/fe/dist
ls -l /var/www/iitp-dabt-platform/packages/common
```

> **중요**: Backend 의존성 설치 (최초 또는 be/package.json 변경 시)
```bash
cd /var/www/iitp-dabt-platform/be
npm ci --omit=dev || npm install --omit=dev
```

### 3.1 packages/common 동기화와 BE 연동(중요)

이 프로젝트의 Backend는 `be/package.json`에 아래와 같이 공통 패키지를 로컬 경로로 참조합니다.

```json
"@iitp-dabt-platform/common": "file:../packages/common"
```

그 결과 BE에서 `npm install`을 수행하면 `be/node_modules/@iitp-dabt-platform/common`이 심볼릭 링크(symlink)로 생성되며, 실제 대상은 실행 서버의 워크스페이스 경로인:

```
/var/www/iitp-dabt-platform/packages/common
```

입니다. 따라서 배포 시 반드시 위 경로를 다음처럼 채워야 합니다.

- 빌드 서버의 `deploy/common/` → 실행 서버 `/var/www/iitp-dabt-platform/packages/common/`
  - 포함 파일: `dist/**`, `package.json`

본 문서의 배포 스크립트는 위 동기화를 자동으로 수행합니다. 배포 후 반드시 다음을 확인하세요.

```bash
ls -l /var/www/iitp-dabt-platform/packages/common
ls -l /var/www/iitp-dabt-platform/packages/common/dist
cat /var/www/iitp-dabt-platform/packages/common/package.json | grep -E '"name"|"main"|"version"'

# 심볼릭 링크가 올바른지(있다면) 확인
ls -l /var/www/iitp-dabt-platform/be/node_modules/@iitp-dabt-platform
readlink -f /var/www/iitp-dabt-platform/be/node_modules/@iitp-dabt-platform/common || true
```

정상이라면 BE 런타임에서 `@iitp-dabt-platform/common` 모듈을 문제 없이 로드할 수 있습니다.

---

## 4. Nginx 설정 (Admin + Platform 공존)

**중요**: Admin 서비스가 이미 운영 중이므로, 기존 Nginx 설정에 Platform location 블록을 **추가**해야 합니다.

파일: `/etc/nginx/conf.d/iitp-services.conf` (또는 기존 설정 파일)

```nginx
# 백엔드 API 서버
upstream iitp_dabt_backend {
    server 127.0.0.1:30000;  # Admin Backend
    keepalive 32;
}

upstream iitp_dabt_platform_backend {
    server 127.0.0.1:33000;  # Platform Backend
    keepalive 32;
}

server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name 192.168.60.142;

    root /var/www/html;
    index index.html;

    # ========================
    # [1] 정적 문서 (기존 Docs)
    # ========================
    location /docs/ {
        index index.html;
        try_files $uri $uri/ =404;
    }

    # ========================
    # [2] Mock 서버 프록시 (선택사항)
    # ========================
    location /mock/ {
        proxy_pass http://192.168.60.142:4010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # ========================
    # [3] Admin API 프록시
    # ========================
    location /adm/api/ {
        proxy_pass http://iitp_dabt_backend/api/;
        proxy_http_version 1.1;
        proxy_read_timeout 120s;
        proxy_send_timeout 120s;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 20m;
    }

    # ========================
    # [4] Admin FE Redirect (/adm → /adm/)
    # ========================
    location = /adm {
        return 301 /adm/;
    }

    # ========================
    # [5] Admin FE 정적 자산 (images, fonts 등)
    # ========================
    location ^~ /adm/assets/ {
        alias /var/www/iitp-dabt-admin/fe/dist/assets/;
        try_files $uri =404;
        expires 7d;
        add_header Cache-Control "public, max-age=604800";
    }

    location ~* ^/adm/([^/]+\.(?:png|jpg|jpeg|gif|svg|ico|woff2?|js|css|map))$ {
        alias /var/www/iitp-dabt-admin/fe/dist/$1;
        try_files $uri =404;
        expires 7d;
        add_header Cache-Control "public, max-age=604800";
    }

    # ========================
    # [6] Admin SPA Fallback (React, Vue, Vite)
    # ========================
    location /adm/ {
        alias /var/www/iitp-dabt-admin/fe/dist/;
        index index.html;
        # 핵심 수정: fallback 시 alias 경로 유지
        try_files $uri $uri/ /adm/index.html;
    }

    # ========================
    # [7] Platform API 프록시 (신규)
    # ========================
    location /hub/api/ {
        proxy_pass http://iitp_dabt_platform_backend/api/;
        proxy_http_version 1.1;
        proxy_read_timeout 120s;
        proxy_send_timeout 120s;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 20m;
    }

    # ========================
    # [8] Platform FE Redirect (/hub → /hub/)
    # ========================
    location = /hub {
        return 301 /hub/;
    }

    # ========================
    # [9] Platform FE 정적 자산 (images, fonts 등)
    # ========================
    location ^~ /hub/assets/ {
        alias /var/www/iitp-dabt-platform/fe/dist/assets/;
        try_files $uri =404;
        expires 7d;
        add_header Cache-Control "public, max-age=604800";
    }

    location ~* ^/hub/([^/]+\.(?:png|jpg|jpeg|gif|svg|ico|woff2?|js|css|map))$ {
        alias /var/www/iitp-dabt-platform/fe/dist/$1;
        try_files $uri =404;
        expires 7d;
        add_header Cache-Control "public, max-age=604800";
    }

    # ========================
    # [10] Platform SPA Fallback (React, Vue, Vite)
    # ========================
    location /hub/ {
        alias /var/www/iitp-dabt-platform/fe/dist/;
        index index.html;
        # 핵심: fallback 시 alias 경로 유지
        try_files $uri $uri/ /hub/index.html;
    }

    # ========================
    # [11] 보안 헤더
    # ========================
    add_header X-Frame-Options SAMEORIGIN always;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;
}
```

적용:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 5. Backend 시작/재시작/중지 및 검증

### 시작(최초):
```bash
cd /var/www/iitp-dabt-platform
# 스크립트는 .env 로드, npm install --omit=dev, PM2 start 수행
npm run start:server:be
```

### 재시작/중지:
```bash
npm run restart:server:be
npm run stop:server:be
```

### 상태/로그:
```bash
pm2 status
pm2 logs iitp-dabt-plf-be --lines 100
```

### 헬스체크:
```bash
# BE 직접
curl -i http://127.0.0.1:33000/api/common/health

# Nginx 경유
curl -i http://127.0.0.1/hub/api/common/health
```

---

## 6. Frontend 제공 및 검증

브라우저 접속:
```
http://<서버_IP_또는_도메인>/hub/
```

정적 파일 확인:
```bash
ls -l /var/www/iitp-dabt-platform/fe/dist
```

---

## 7. 운영 팁 및 주의사항

- 실행 서버에서 `be/package.json`이 변경된 배포를 받은 경우:
  ```bash
  cd /var/www/iitp-dabt-platform/be
  npm ci --omit=dev || npm install --omit=dev
  pm2 restart iitp-dabt-plf-be
  ```
- 배포 스크립트는 `node_modules/`, `.env`, `.env*`를 보존합니다.
- `@iitp-dabt-platform/common`은 `/var/www/iitp-dabt-platform/packages/common`으로 동기화되며, BE의 `node_modules/@iitp-dabt-platform/common`은 해당 경로를 가리키는 symlink일 수 있습니다.
- 포트 충돌 시 33000 사용 중인 프로세스 확인: `ss -tlpn | grep :33000 || true`
- Nginx 프록시 경로 주의: `location /hub/api/` 블록에서 `proxy_pass .../api/;`처럼 끝 슬래시가 꼭 있어야 `/hub/api/* → /api/*`로 정확히 매핑됩니다.

---

## 8. 문제 해결(요약)

### PM2 online이지만 즉시 `errored`로 바뀌는 경우
- `.env` 누락, 포트 충돌, DB 연결 실패, 의존성 미설치 여부 확인
- `pm2 logs iitp-dabt-plf-be --lines 200`

### `MODULE_NOT_FOUND: '@iitp-dabt-platform/common'`
- `/var/www/iitp-dabt-platform/packages/common` 경로에 `dist/`와 `package.json`이 있는지 확인
- BE 디렉터리에서 `npm ci --omit=dev || npm install --omit=dev`

### 배포 후 `node_modules`가 사라짐
- 현재 스크립트는 `node_modules/`를 제외하도록 수정되어 보존됩니다.

### Nginx 404
- `proxy_pass http://iitp_dabt_platform_backend/api/;` 끝 슬래시 포함 여부 확인

### Admin과 Platform 포트 충돌
```bash
# Admin: 30000, Platform: 33000 확인
sudo netstat -tulpn | grep -E ':(30000|33000)'

# PM2 프로세스 확인
pm2 list
```

---

## 9. 서비스 확인

### 포트 확인
```bash
# Admin BE: 30000
curl http://localhost:30000/api/common/health

# Platform BE: 33000
curl http://localhost:33000/api/common/health
```

### Nginx 경유 확인
```bash
# Admin
curl http://서버주소/adm/api/common/health

# Platform
curl http://서버주소/hub/api/common/health
```

---

이 문서 순서대로 수행하면 단일 서버 환경에서 빌드 → 배포 → 기동까지 원활히 진행되며, Admin(`/adm`)과 Platform(`/hub`)이 정상 동작합니다.

**IITP DABT Platform Team** © 2025

