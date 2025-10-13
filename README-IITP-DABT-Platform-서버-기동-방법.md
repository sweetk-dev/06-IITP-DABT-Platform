# 🚀 IITP DABT Platform 프로젝트 서버 기동 방법

이 프로젝트는 **Backend (Node.js + Express)**와 **Frontend (React + Vite)**로 구성된 풀스택 애플리케이션입니다.

> **중요**: 이 Platform 서비스는 기존 Admin 서비스와 **동일 서버에서 공존**합니다.
> - **Admin 서비스**: `/adm`, `/adm/api` (포트 30000)
> - **Platform 서비스**: `/plf`, `/plf/api` (포트 33000)

## 📋 사전 요구사항

- **Node.js**: 22.x 이상
- **npm**: 9.x 이상  
- **PostgreSQL**: 12.x 이상 (기존 Admin과 공유)
- **Git**: 최신 버전

## 🔧 1. 프로젝트 설정

### 전체 프로젝트 한 번에 설정 (권장)
```bash
# 프로젝트 루트에서 실행
npm run install:all
```

### 개별 설정
```bash
# 1. 공통 패키지 설정
cd packages/common && npm install && npm run build

# 2. Backend 설정  
cd ../../be && npm install

# 3. Frontend 설정
cd ../fe && npm install
```

## 🗄️ 2. 데이터베이스 설정

### PostgreSQL 기존 DB 사용 (Admin과 공유)

```sql
-- PostgreSQL에 접속
sudo -u postgres psql

-- 기존 데이터베이스 사용
\c iitp_dabt

-- Platform용 사용자 생성 (별도 계정)
CREATE USER iitp_platform_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE iitp_dabt TO iitp_platform_user;

-- 종료
\q
```

> **참고**: Admin과 동일한 데이터베이스(`iitp_dabt`)를 사용하되, 별도의 사용자 계정으로 접근합니다.

## ⚙️ 3. 환경 변수 설정

### 📋 환경변수 요구사항 요약 (중요!)

**환경변수는 빌드 시점 vs 실행 시점에 따라 요구사항이 다릅니다!**

| 구분 | 빌드 시 | 실행 시 | 위치 | 권장 방법 |
|------|---------|---------|------|----------|
| **Backend** | ❌ 불필요 | ✅ **필수** | `be/.env` | 수동 생성 (env.sample 참고) |
| **Frontend** | ✅ **필수** | ❌ 불필요 | `fe/.env` | `.env` 파일 또는 export |

### Backend 환경 변수 (실행 시 필수)

**Backend는 실행 시점에만 .env 파일이 필요합니다** (빌드 시에는 불필요)

로컬 개발:
```bash
cd be
# env.sample을 복사하여 .env 생성
cp env.sample .env
```

프로덕션 서버:
```bash
# 실행 서버에 .env 생성 (최초 1회)
sudo vi /var/www/iitp-dabt-platform/be/.env
```

### .env 파일 내용
```env
# 서버 설정
NODE_ENV=production
PORT=33000

# 데이터베이스 설정 (Admin과 동일 DB)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=iitp_dabt
DB_USER=iitp_platform_user
DB_PASSWORD=your_password_here
DB_SSL=false

# OpenAPI 서버 설정 (Admin과 동일 설정 사용 가능)
OPEN_API_SERVER_URL=https://api.example.com
OPEN_API_AUTH_KEY=your_api_key_here
OPEN_API_AUTH_SECRET=your_api_secret_here

# CORS 설정
CORS_ORIGINS=http://your-server-domain-or-ip

# 로깅 설정
LOG_LEVEL=info
LOG_DIR=./logs
```

**중요**:
- ✅ 프로덕션 서버: `/var/www/iitp-dabt-platform/be/.env` 수동 생성 (최초 1회)
- ✅ 배포 시 `.env` 파일은 자동 보존됨 (덮어쓰지 않음)
- ❌ 빌드 시에는 `.env` 불필요 (TypeScript 컴파일만 수행)

### Frontend 빌드 환경변수 (빌드 시 필수)

**Frontend는 빌드 시점에만 환경변수가 필요합니다** (실행 시에는 불필요)

Frontend는 Vite를 사용하므로 **빌드 시점**에 환경변수를 주입해야 합니다.

#### 방법 1: .env 파일 사용 (권장)

로컬 개발:
```bash
cd fe
cp env.sample .env
vi .env
# 로컬 값으로 설정 (env.sample의 로컬 개발용 주석 참고)
```

프로덕션 빌드 (빌드 서버):
```bash
cd /home/iitp-plf/iitp-dabt-platform/source/fe
cp env.sample .env
vi .env
# env.sample에 프로덕션 빌드용 설정이 기본값으로 되어 있음
# 필요 시 서버 주소만 수정:
# VITE_VISUAL_TOOL=http://실제서버주소:포트/
# VITE_OPEN_API_CENTER_URL=http://실제서버주소/adm/
```

#### 방법 2: shell 환경변수 export (대안)

```bash
# 빌드 전 환경변수 export (모든 변수 설정)
export VITE_PORT=5173
export VITE_BASE=/plf/
export VITE_API_BASE_URL=/plf
export VITE_API_TIMEOUT=10000
export VITE_VISUAL_TOOL=http://실제서버주소:포트/
export VITE_EMPLOYMENT_SITE_URL=https://www.ablejob.co.kr/
export VITE_OPEN_API_CENTER_URL=http://실제서버주소/adm/
export VITE_OPEN_API_CENTER_ABOUT_URL=http://실제서버주소/adm/about
```

**중요**:
- ✅ **권장**: 빌드 서버에서 `fe/env.sample`을 복사하여 `fe/.env` 생성
- ✅ **대안**: shell 환경변수 export
- ❌ 실행 서버(프로덕션)의 FE 디렉토리에는 `.env` 불필요 (이미 빌드된 정적 파일)
- ✅ Vite가 빌드 시 환경변수를 코드에 하드코딩하므로 런타임 변경 불가
- 🔧 `VITE_API_BASE_URL=/plf` (not `/plf/api`) - FE 코드가 `/api/v1/...`을 자동으로 추가

## 🚀 4. 서버 실행

### 개발 환경에서 실행

#### Backend 서버 실행
```bash
# 방법 1: 프로젝트 루트에서
npm run dev:be

# 방법 2: be 디렉토리에서
cd be
npm run dev
```

#### Frontend 서버 실행
```bash
# 방법 1: 프로젝트 루트에서  
npm run dev:fe

# 방법 2: fe 디렉토리에서
cd fe
npm run dev
```

### 프로덕션 환경에서 실행

#### Backend 프로덕션 실행
```bash
cd be
npm run build
npm start
```

#### Frontend 프로덕션 실행
```bash
cd fe

# 방법 1 (권장): .env 파일 사용
cp env.sample .env
vi .env  # 프로덕션 값으로 수정

# 방법 2 (대안): export 사용
# export VITE_BASE=/plf/
# export VITE_API_BASE_URL=/plf

# 빌드 및 미리보기
npm run build
npm run preview
```

## 🌐 5. 서비스 접속

- **Backend API**: `http://localhost:33000`
- **Frontend**: `http://localhost:5173` (개발) 또는 `http://localhost:4173` (프로덕션 프리뷰)

### 프로덕션 서버 접속
- **Platform Frontend**: `http://서버주소/plf/`
- **Platform API**: `http://서버주소/plf/api`
- **Admin Frontend**: `http://서버주소/adm/` (기존 서비스)
- **Admin API**: `http://서버주소/adm/api` (기존 서비스)

## 🔍 6. 서버 상태 확인

```bash
# Backend 헬스 체크 (직접)
curl http://localhost:33000/api/common/health

# Backend 헬스 체크 (Nginx 경유)
curl http://서버주소/plf/api/common/health

# 버전 정보 확인
curl http://localhost:33000/api/common/version
```

## 📊 7. 로그 확인

```bash
# Backend 로그 확인
tail -f be/logs/app-$(date +%Y-%m-%d).log

# 에러 로그 확인
grep -i error be/logs/app-$(date +%Y-%m-%d).log

# 실시간 로그 확인
tail -f be/logs/app-$(date +%Y-%m-%d).log
```

## 🚀 8. 배포 (서버 환경)

### 운영 스크립트 배포 (최초 1회 또는 변경 시)

```bash
# 실행 서버에 기동/재기동 스크립트 배포 (최초 1회 또는 변경 시)
npm run deploy:server:ops
# 직접 실행 대안: node script/server/deploy-server-ops.js
# 기본 경로: /var/www/iitp-dabt-platform/script
```

### 권장 실행 순서
```bash
# 1) 빌드 서버: 전체 빌드
export VITE_BASE=/plf/
export VITE_API_BASE_URL=/plf/api
npm run build:server

# 2) (최초 1회 또는 스크립트 변경 시) 운영 스크립트 배포
npm run deploy:server:ops

# 3) 실행 서버로 전체 배포
npm run deploy:server

# 4) 서버 기동
npm run start:server:be
npm run start:server:fe

# (필요 시) 서버 재시작
npm run restart:server:be
npm run restart:server:fe

# (필요 시) 서버 중지
npm run stop:server:be
npm run stop:server:fe
```

### 서버에서 직접 빌드 및 배포

#### 빌드 서버에서 실행

##### 전체 빌드
```bash
# 환경 변수 설정
export SOURCE_PATH=/home/iitp-plf/iitp-dabt-platform/source
export DEPLOY_PATH=/home/iitp-plf/iitp-dabt-platform/deploy
export GIT_REPO_URL=https://github.com/sweetk-dev/06-IITP-DABT-Platform.git
export GIT_BRANCH=main

# Frontend 빌드용 환경변수 설정 (두 가지 방법 중 선택)

# 방법 1 (권장): fe/.env 파일 생성
# cd $SOURCE_PATH/fe
# cp env.sample .env
# vi .env  # 프로덕션 값으로 수정 (env.sample의 프로덕션 빌드용 참고)
# cd ..

# 방법 2 (대안): shell 환경변수 export
# export VITE_BASE=/plf/
# export VITE_API_BASE_URL=/plf
# export VITE_VISUAL_TOOL=http://실제서버주소:포트/
# export VITE_EMPLOYMENT_SITE_URL=https://www.ablejob.co.kr/

# 전체 빌드 (Git pull + 빌드 + 배포 폴더 복사)
npm run build:server
```

#### 기동 서버에서 실행

##### 전체 배포
```bash
# 환경 변수 설정
export BUILD_SERVER_HOST=localhost
export BUILD_SERVER_USER=iitp-plf
export BUILD_SERVER_PATH=/home/iitp-plf/iitp-dabt-platform/deploy
export PROD_SERVER_HOST=localhost
export PROD_SERVER_USER=iitp-plf
export PROD_BE_PATH=/var/www/iitp-dabt-platform/be
export PROD_FE_PATH=/var/www/iitp-dabt-platform/fe

# 전체 배포 (빌드 서버 → 기동 서버)
npm run deploy:server
```

> **중요**: 실행 서버 의존성 설치 안내
>
> - Backend: 최초 배포이거나 `be/package.json`이 변경되었을 때, 실행 서버에서 다음을 실행하세요.
>   ```bash
>   cd /var/www/iitp-dabt-platform/be
>   npm ci --omit=dev || npm install --omit=dev
>   pm2 restart iitp-dabt-plf-be
>   ```
>
> - Frontend: 정적 산출물만 배포하므로 실행 서버에서 `npm install`이 필요하지 않습니다.

##### 서버 시작
```bash
# Backend 서버 시작 (PM2)
npm run start:server:be

# Frontend 서버 시작 (Nginx)
npm run start:server:fe
```

##### 서버 재시작
```bash
# Backend 서버 재시작
npm run restart:server:be

# Frontend 서버 재시작
npm run restart:server:fe
```

### 재부팅 자동 기동 설정 (PM2)

서버 재부팅 후 BE가 자동 기동되도록 PM2를 systemd에 등록합니다.

```bash
# root로 실행: iitp-plf 사용자용 PM2 systemd 유닛 생성
sudo env PATH=$PATH pm2 startup systemd -u iitp-plf --hp /home/iitp-plf

# iitp-plf 사용자로 프로세스 등록 및 저장
sudo -iu iitp-plf
pm2 start /var/www/iitp-dabt-platform/be/dist/index.js --name iitp-dabt-plf-be || true
pm2 save

# 재부팅 후 검증
pm2 status
pm2 logs iitp-dabt-plf-be --lines 50
```

**주의사항**:
- `npm run start:be`는 .env 로드와 `npm install --omit=dev`까지 수행합니다.
- 최초 한 번은 `npm run start:be`로 기동 후 `pm2 save`를 권장합니다.
- 이후 `be/package.json` 변경 배포 시에는 실행 서버에서:
  ```bash
  cd /var/www/iitp-dabt-platform/be
  npm ci --omit=dev || npm install --omit=dev
  pm2 restart iitp-dabt-plf-be
  pm2 save
  ```

**검증 체크리스트**:
```bash
# 유닛 상태/활성화
sudo systemctl status pm2-iitp-plf | cat
sudo systemctl is-enabled pm2-iitp-plf

# 부팅 직후 복구 로그 확인(이번 부팅 범위)
journalctl -u pm2-iitp-plf -b --no-pager | tail -n 100

# 반드시 iitp-plf 컨텍스트에서 상태 확인
sudo -iu iitp-plf pm2 status
```

**권장 실행 위치/사용자**:
- BE 기동/저장은 반드시 `iitp-plf` 사용자로, 프로젝트 루트(`/var/www/iitp-dabt-platform`)에서 수행하세요.

## 🛠️ 9. 개발 가이드

### 스크립트 명령어

#### 로컬용 명령어
```bash
# 설정 및 빌드
npm run install:all      # 전체 설정
npm run build:all        # 전체 빌드
npm run build:be         # BE만 빌드
npm run build:fe         # FE만 빌드
npm run build:common     # Common만 빌드

# 개발 서버
npm run dev:be           # BE 개발 서버
npm run dev:fe           # FE 개발 서버
```

#### 서버용 명령어 (Linux 전용)
```bash
# 빌드 서버에서 실행
npm run build:server        # Git pull + 전체 빌드 + 배포 폴더 복사

# 기동 서버에서 실행
npm run deploy:server       # 전체 배포 (빌드 서버 → 기동 서버)
npm run deploy:server:ops   # 운영 스크립트 배포

# 서버 시작/재시작
npm run start:server:be
npm run start:server:fe
npm run restart:server:be
npm run restart:server:fe
npm run stop:server:be
npm run stop:server:fe
```

## 🔒 10. 보안 설정

### 환경 변수 보호
- `.env` 파일은 절대 Git에 커밋하지 마세요
- 프로덕션 환경에서는 강력한 비밀번호 사용
- DB 사용자는 최소 권한 원칙 적용

## 🐛 11. 문제 해결

### 일반적인 문제들

#### 1. 데이터베이스 연결 실패
```bash
# PostgreSQL 서비스 상태 확인
sudo systemctl status postgresql

# 데이터베이스 연결 테스트
psql -h localhost -U iitp_platform_user -d iitp_dabt
```

#### 2. 포트 충돌
```bash
# 포트 사용 확인
netstat -tulpn | grep :33000

# 프로세스 종료
kill -9 <process-id>
```

#### 3. PM2 프로세스 확인
```bash
# PM2 상태 확인
pm2 status

# PM2 로그 확인
pm2 logs iitp-dabt-plf-be

# PM2 프로세스 삭제 후 재시작
pm2 delete iitp-dabt-plf-be
npm run start:server:be
```

#### 4. Nginx 설정 문제
```bash
# Nginx 설정 테스트
sudo nginx -t

# Nginx 에러 로그 확인
sudo tail -f /var/log/nginx/error.log

# Nginx 재시작
sudo systemctl restart nginx
```

#### 5. Admin과 Platform 서비스 충돌
```bash
# 포트 확인 (30000: Admin, 33000: Platform)
sudo netstat -tulpn | grep -E ':(30000|33000)'

# PM2 앱 목록 확인
pm2 list

# 각 서비스 상태 확인
curl http://localhost:30000/api/common/health  # Admin
curl http://localhost:33000/api/common/health  # Platform
```

### 로그 확인
```bash
# 최신 로그 확인
tail -n 50 be/logs/app-$(date +%Y-%m-%d).log

# 에러 로그 확인
grep -i error be/logs/app-$(date +%Y-%m-%d).log
```

## 📚 12. API 문서

### API 구조

* **Base URL**: `/api/v1`
* **데이터 API**: `/api/v1/data/*`
* **자가진단 API**: `/api/v1/selfcheck/*`
* **공통 API**: `/api/v1/health`, `/api/v1/version`

### 주요 엔드포인트

#### 데이터 API
- `GET /api/v1/data/summary/latest` - 최신 데이터 리스트
- `GET /api/v1/data/counts/themes` - 테마별 데이터 건수
- `GET /api/v1/data/search` - 데이터 검색
- `GET /api/v1/data/{id}` - 데이터 상세 정보

#### 자가진단 API
- `GET /api/v1/selfcheck/recommendations` - 추천 정책
- `GET /api/v1/selfcheck/policies` - 정책 목록

#### 공통 API
- `GET /api/v1/common/version` - 서버 버전 정보
- `GET /api/v1/common/health` - 서버 상태 확인

## 🔧 13. Nginx 설정 (Admin과 공존)

### 통합 Nginx 설정 예시

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
    location /plf/api/ {
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
    # [8] Platform FE Redirect (/plf → /plf/)
    # ========================
    location = /plf {
        return 301 /plf/;
    }

    # ========================
    # [9] Platform FE 정적 자산 (images, fonts 등)
    # ========================
    location ^~ /plf/assets/ {
        alias /var/www/iitp-dabt-platform/fe/dist/assets/;
        try_files $uri =404;
        expires 7d;
        add_header Cache-Control "public, max-age=604800";
    }

    location ~* ^/plf/([^/]+\.(?:png|jpg|jpeg|gif|svg|ico|woff2?|js|css|map))$ {
        alias /var/www/iitp-dabt-platform/fe/dist/$1;
        try_files $uri =404;
        expires 7d;
        add_header Cache-Control "public, max-age=604800";
    }

    # ========================
    # [10] Platform SPA Fallback (React, Vue, Vite)
    # ========================
    location /plf/ {
        alias /var/www/iitp-dabt-platform/fe/dist/;
        index index.html;
        # 핵심: fallback 시 alias 경로 유지
        try_files $uri $uri/ /plf/index.html;
    }

    # ========================
    # [11] 보안 헤더
    # ========================
    add_header X-Frame-Options SAMEORIGIN always;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;
}
```

### Nginx 설정 적용
```bash
# 설정 파일 위치 확인 (보통 /etc/nginx/conf.d/ 또는 /etc/nginx/sites-available/)
sudo vi /etc/nginx/conf.d/iitp-services.conf

# 설정 테스트
sudo nginx -t

# Nginx 재시작
sudo systemctl reload nginx
```

## 📞 14. 지원

문제가 발생하거나 질문이 있으시면:

1. **로그 확인**: `be/logs/` 디렉토리의 로그 파일 확인
2. **문서 참조**: 각 디렉토리의 README.md 파일 참조
3. **이슈 등록**: GitHub Issues에 등록

---

## 🔗 15. 관련 문서

- **서버 배포 가이드 (단일 서버)**: `script/README-ONE-SERVER-BUILD-DEPLOY.md`
- **서버 배포 가이드 (분리 서버)**: `script/README-SERVER-DEPLOYMENT.md`
- **프론트엔드 문서**: `fe/README.md`
- **백엔드 문서**: `be/README.md`
- **공통 패키지 문서**: `packages/common/README.md`

---

**IITP DABT Platform Team** © 2025

