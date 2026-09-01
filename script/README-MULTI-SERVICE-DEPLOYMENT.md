# 🚀 IITP DABT Platform 복합 서비스 설치 가이드 (Multi-Service Coexistence)

본 문서는 **Admin + Platform 등 여러 서비스가 공존**하는 환경에서의 Platform 설치 가이드입니다.

> **📌 복합 서비스 환경**
> 
> 이 가이드는 **Admin + Platform 공존 설치** 기준입니다
> - **Admin 서비스**: `/adm`, `/adm/api` (포트 30000)
> - **Platform 서비스**: `/hub`, `/hub/api` (포트 33000)
> 
> **Platform 단독 설치**는 [Platform 단독 설치 가이드](./README-SERVER-DEPLOYMENT.md) 참조
>


## 📋 목차

### 0. [개요 및 사전 요구사항](#0-개요-및-사전-요구사항)
- [0.1 복합 서비스 아키텍처](#01-복합-서비스-아키텍처)
- [0.2 전제조건](#02-전제조건)
- [0.3 기존 Admin 서비스 확인](#03-기존-admin-서비스-확인)

### 1. [초기 설치 - 단일 서버 환경](#1-초기-설치---단일-서버-환경)
- [1.0 서버 기본 세팅](#10-서버-기본-세팅)
- [1.1 Platform 계정 및 디렉토리 구조](#11-platform-계정-및-디렉토리-구조)
- [1.2 데이터베이스 설정](#12-데이터베이스-설정)
- [1.3 프로젝트 클론 및 초기 설정](#13-프로젝트-클론-및-초기-설정)
- [1.4 환경변수 설정](#14-환경변수-설정)
- [1.5 빌드](#15-빌드)
- [1.6 배포 (단일 서버)](#16-배포-단일-서버)
- [1.7 Backend 실행 환경 설정](#17-backend-실행-환경-설정)
- [1.8 Nginx 통합 설정 (Admin + Platform)](#18-nginx-통합-설정-admin--platform)
- [1.9 서비스 시작](#19-서비스-시작)
- [1.10 검증](#110-검증)

### 2. [초기 설치 - 서버 분리 환경](#2-초기-설치---서버-분리-환경)
- [2.1 빌드 서버 설정](#21-빌드-서버-설정)
- [2.2 실행 서버 설정](#22-실행-서버-설정)
- [2.3 빌드 및 배포](#23-빌드-및-배포)
- [2.4 실행 서버 설정 계속](#24-실행-서버-설정-계속)
- [2.5 검증](#25-검증)

### 3. [업데이트 배포 (일상 운영)](#3-업데이트-배포-일상-운영)
- [3.1 사전 확인](#31-사전-확인)
- [3.2 소스 업데이트](#32-소스-업데이트)
- [3.3 의존성 확인](#33-의존성-확인)
- [3.4 빌드](#34-빌드)
- [3.5 배포](#35-배포)
- [3.6 서비스 재시작 (Platform만)](#36-서비스-재시작-platform만)
- [3.7 검증](#37-검증)
- [3.8 롤백 (문제 발생 시)](#38-롤백-문제-발생-시)

### 4. [복합 서비스 운영 관리](#4-복합-서비스-운영-관리)
- [4.1 서비스별 관리](#41-서비스별-관리)
- [4.2 Nginx 로그 분석](#42-nginx-로그-분석)
- [4.3 데이터베이스 관리](#43-데이터베이스-관리)
- [4.4 리소스 모니터링](#44-리소스-모니터링)

### 5. [문제 해결 및 FAQ](#5-문제-해결-및-faq)
- [5.1 복합 서비스 특화 문제](#51-복합-서비스-특화-문제)
- [5.2 FAQ (복합 서비스)](#52-faq-복합-서비스)

### 📋 [체크리스트](#-복합-서비스-체크리스트)
- [초기 설치 체크리스트](#초기-설치-체크리스트)
- [업데이트 체크리스트](#업데이트-체크리스트)

---

## 0. 개요 및 사전 요구사항

### 0.1 복합 서비스 아키텍처

```
서버 IP:<SERVER_HOST>
├── /adm/           → Admin Frontend (포트 80 → Nginx)
├── /adm/api/       → Admin Backend (포트 30000)
├── /hub/           → Platform Frontend (포트 80 → Nginx) ⭐ 신규
└── /hub/api/       → Platform Backend (포트 33000) ⭐ 신규
```

### 0.2 전제조건

**필수 확인사항:**
1. ✅ Admin 서비스가 이미 운영 중
2. ✅ Admin이 `/adm` 경로 사용 중
3. ✅ Admin Backend가 포트 30000 사용 중
4. ✅ PostgreSQL 데이터베이스 `iitp_dabt` 존재
5. ✅ Nginx가 Admin 서비스 제공 중

**시스템 요구사항:**
- 섹션 0.2는 단독 설치 가이드와 동일
- 추가: 충분한 메모리 (Admin + Platform 동시 실행)

### 0.3 기존 Admin 서비스 확인

```bash
# Admin Backend 확인
pm2 list | grep admin
# 또는
sudo netstat -tlnp | grep 30000

# Admin Frontend 확인
curl -I http://localhost/adm/

# Nginx 설정 확인
sudo nginx -t
sudo cat /etc/nginx/conf.d/*.conf | grep adm
```

---

## 1. 초기 설치 - 단일 서버 환경

> **전제조건**: 빌드 서버 = 실행 서버, Admin 서비스 운영 중

### 1.0 서버 기본 세팅

Admin이 이미 설치되어 있으므로 대부분 완료된 상태입니다.

```bash
# 확인만 수행
node -v   # v22.x.x 확인
npm -v    # 9.x.x 이상 확인
pm2 -v    # 최신 버전 확인
nginx -t  # 설정 정상 확인
psql --version  # PostgreSQL 12.x 이상 확인
```

> **참고**: 만약 Node.js가 없거나 구버전이면 단독 설치 가이드의 [섹션 1.0 Node.js 설치](./README-SERVER-DEPLOYMENT.md#node.js-설치-아래-중-하나-선택) 참조

### 1.1 Platform 계정 및 디렉토리 구조

```bash
# iitp-plf 사용자 생성 (Admin과 별도 관리)
sudo useradd -m -s /bin/bash iitp-plf
sudo passwd iitp-plf

# Platform 빌드/소스 디렉토리
sudo mkdir -p /home/iitp-plf/iitp-dabt-platform/source
sudo mkdir -p /home/iitp-plf/iitp-dabt-platform/deploy
sudo chown -R iitp-plf:iitp-plf /home/iitp-plf/iitp-dabt-platform

# Platform 실행 디렉토리 (Admin과 분리)
sudo mkdir -p /var/www/iitp-dabt-platform/be
sudo mkdir -p /var/www/iitp-dabt-platform/fe
sudo mkdir -p /var/www/iitp-dabt-platform/script
sudo mkdir -p /var/www/iitp-dabt-platform/packages/common
sudo chown -R iitp-plf:iitp-plf /var/www/iitp-dabt-platform

# 디렉토리 구조 확인
tree -L 2 /home/iitp-plf/iitp-dabt-platform
tree -L 2 /var/www/
```

**디렉토리 구조:**
```
/var/www/
├── iitp-dabt-admin/        # Admin 서비스 (기존)
│   ├── be/
│   └── fe/
└── iitp-dabt-platform/     # Platform 서비스 (신규)
    ├── be/
    ├── fe/
    ├── script/
    └── packages/common/
```

### 1.2 데이터베이스 설정

Admin과 동일한 DB를 사용하되, 별도 계정으로 접근합니다.

```bash
# PostgreSQL 접속
sudo -u postgres psql

# 기존 DB 사용
\c iitp_dabt

# Platform용 사용자 생성 (Admin과 별도)
CREATE USER iitp_platform_user WITH PASSWORD 'your_secure_password';

# 권한 부여
GRANT ALL PRIVILEGES ON DATABASE iitp_dabt TO iitp_platform_user;

# 권한 확인
\du iitp_platform_user

# 종료
\q
```

**확인:**
```bash
psql -U iitp_platform_user -d iitp_dabt -c "SELECT 1;"
```

### 1.3 프로젝트 클론 및 초기 설정

```bash
# iitp-plf 사용자로 전환
sudo -iu iitp-plf

# Git에서 Platform 소스 다운로드
cd /home/iitp-plf/iitp-dabt-platform/source
git clone https://github.com/sweetk-dev/06-IITP-DABT-Platform.git .

# 브랜치 확인
git branch
git status

# 전체 패키지 설치
npm install

# 설치 확인
ls -la node_modules/
ls -la packages/common/node_modules/
ls -la be/node_modules/
ls -la fe/node_modules/
```

### 1.4 환경변수 설정

#### 1.4.1 Backend 환경변수 (실행 서버용)

```bash
# Platform Backend .env 생성
sudo vi /var/www/iitp-dabt-platform/be/.env
```

내용:
```env
# 서버 설정
NODE_ENV=production
PORT=33000  # Admin(30000)과 다른 포트

# 데이터베이스 설정 (Admin과 동일 DB, 별도 계정)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=iitp_dabt
DB_USER=iitp_platform_user  # Admin과 다른 사용자
DB_PASSWORD=your_secure_password
DB_SSL=false

# CORS 설정
CORS_ORIGINS=http://<SERVER_HOST>

# OpenAPI 서버 설정 (Admin과 동일 설정 사용 가능)
OPEN_API_SERVER_URL=https://api.example.com
OPEN_API_AUTH_KEY=your_api_key_here
OPEN_API_AUTH_SECRET=your_api_secret_here
OPEN_API_PAGE_SIZE=100
OPEN_API_TIMEOUT=30000

# 로깅 설정
LOG_LEVEL=info
LOG_DIR=./logs

# 보안 설정
ENC_SECRET=your_encryption_secret_key_here

# 기타 설정
API_RATE_LIMIT=100
REQUEST_TIMEOUT=30000
```

**권한 설정:**
```bash
sudo chown iitp-plf:iitp-plf /var/www/iitp-dabt-platform/be/.env
sudo chmod 600 /var/www/iitp-dabt-platform/be/.env
```

#### 1.4.2 Frontend 빌드 환경변수 (복합 서비스용)

**방법 1: .env 파일 사용 (권장)**

```bash
cd /home/iitp-plf/iitp-dabt-platform/source/fe
cp env.sample .env
vi .env
```

내용 (**복합 서비스 기준: /hub 경로**):
```env
# 프로덕션 빌드용 설정 (복합 서비스 - /hub 경로)
VITE_PORT=5173
VITE_BASE=/hub/
VITE_API_BASE_URL=/hub
VITE_API_TIMEOUT=10000
VITE_API_DATA_PREVIEW_LIMIT=10
VITE_VISUAL_TOOL=http://<SERVER_HOST>:visual-tool-port/
VITE_EMPLOYMENT_SITE_URL=https://www.ablejob.co.kr/
VITE_OPEN_API_CENTER_URL=http://<SERVER_HOST>/adm/
VITE_OPEN_API_CENTER_ABOUT_URL=http://<SERVER_HOST>/adm/about
```

**중요 설정 설명:**
- `VITE_BASE=/hub/`: 복합 서비스이므로 서브패스 사용
- `VITE_API_BASE_URL=/hub`: Nginx 프록시를 통한 API 호출 (`/hub/api/`로 변환됨)
- FE 코드가 자동으로 `/api/v1/...`을 추가하므로 `/api` 포함 금지
- `VITE_OPEN_API_CENTER_URL`: Admin 서비스 경로 (`/adm/`)

**방법 2: shell 환경변수 export (대안)**

```bash
export VITE_PORT=5173
export VITE_BASE=/hub/
export VITE_API_BASE_URL=/hub
export VITE_API_TIMEOUT=10000
export VITE_API_DATA_PREVIEW_LIMIT=10
export VITE_VISUAL_TOOL=http://<SERVER_HOST>:visual-tool-port/
export VITE_EMPLOYMENT_SITE_URL=https://www.ablejob.co.kr/
export VITE_OPEN_API_CENTER_URL=http://<SERVER_HOST>/adm/
export VITE_OPEN_API_CENTER_ABOUT_URL=http://<SERVER_HOST>/adm/about
```

### 1.5 빌드

#### 1.5.1 전체 빌드 (기본, 권장)

```bash
cd /home/iitp-plf/iitp-dabt-platform/source

# 전체 빌드 (common → be → fe 순서)
npm run build:server

# 빌드 확인
ls -la /home/iitp-plf/iitp-dabt-platform/deploy/backend/dist/
ls -la /home/iitp-plf/iitp-dabt-platform/deploy/frontend/
ls -la /home/iitp-plf/iitp-dabt-platform/deploy/common/dist/
```

#### 1.5.2 개별 빌드 (옵션)

**개별 빌드 방법 및 시나리오는 단독 설치 가이드 참조:**
- [섹션 1.5.2 개별 빌드](./README-SERVER-DEPLOYMENT.md#152-개별-빌드-옵션)

### 1.6 배포 (단일 서버)

#### 1.6.1 전체 배포 (기본, 권장) ⭐

**배포 스크립트를 사용하면 모든 것이 자동으로 처리됩니다!**

```bash
cd /home/iitp-plf/iitp-dabt-platform/source

# 전체 배포 (Common + Backend + Frontend)
npm run deploy:server
```

**스크립트가 자동으로 처리하는 것들:**
- ✅ 단일 서버 환경 자동 감지 (localhost)
- ✅ rsync로 안전한 배포 (.env, node_modules, logs 자동 제외)
- ✅ 파일/디렉토리 권한 자동 설정 (755/644)
- ✅ Common → `/var/www/iitp-dabt-platform/packages/common/`
- ✅ Backend → `/var/www/iitp-dabt-platform/be/`
- ✅ Frontend → `/var/www/iitp-dabt-platform/fe/`
- ✅ 버전 정보 자동 출력

**중요**: 
- Backend `.env` 파일은 스크립트가 자동으로 보존 (덮어쓰지 않음)
- `node_modules/`는 실행 서버에서 별도 설치 필요

**운영 스크립트 배포 (최초 1회 필수):**

자세한 설명은 단독 설치 가이드 참조:
- [운영 스크립트 배포](./README-SERVER-DEPLOYMENT.md#운영-스크립트-배포-최초-1회-필수)

```bash
# 운영 관리 스크립트 배포
npm run deploy:server:ops
```

> 💡 **요약**: PM2 시작/재시작/중지 스크립트를 실행 서버에 배포합니다 (최초 1회 또는 스크립트 수정 시)

#### 1.6.2 개별 배포 (옵션)

**개별 배포 방법 및 주의사항은 단독 설치 가이드 참조:**
- [섹션 1.6.2 개별 배포](./README-SERVER-DEPLOYMENT.md#162-개별-배포-옵션)

### 1.7 Backend 실행 환경 설정

```bash
cd /var/www/iitp-dabt-platform/be

# 의존성 설치
npm install --production

# 심볼릭 링크 확인
ls -la node_modules/@iitp-dabt-platform/common

# .env 파일 확인
cat .env

# 로그 디렉토리 생성
mkdir -p logs
```

### 1.8 Nginx 통합 설정 (Admin + Platform)

**중요**: 기존 Admin 설정에 Platform 설정을 **추가**합니다.

#### Step 1: Nginx 설정 파일 확인 및 편집

```bash
# 기존 Nginx 설정 확인
sudo cat /etc/nginx/conf.d/*.conf

# 기존 설정 파일 편집 (Admin 설정이 있는 경우)
# 또는 새 통합 설정 파일 생성
sudo vi /etc/nginx/conf.d/iitp-services.conf
```

내용 (Admin + Platform 통합):
```nginx
# Backend upstream
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
    server_name <SERVER_HOST>;

    root /var/www/html;
    index index.html;

    # ========================
    # [1] 정적 문서 (기존 Docs, 있는 경우)
    # ========================
    location /docs/ {
        index index.html;
        try_files $uri $uri/ =404;
    }

    # ========================
    # [2] Mock 서버 프록시 (선택사항)
    # ========================
    location /mock/ {
        proxy_pass http://<SERVER_HOST>:4010/;
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
    # [5] Admin FE 정적 자산
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
    # [6] Admin SPA Fallback
    # ========================
    location /adm/ {
        alias /var/www/iitp-dabt-admin/fe/dist/;
        index index.html;
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
    # [9] Platform FE 정적 자산 (신규)
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
    # [10] Platform SPA Fallback (신규)
    # ========================
    location /hub/ {
        alias /var/www/iitp-dabt-platform/fe/dist/;
        index index.html;
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

#### Step 2: 설정 검증 및 적용

```bash
# 기존 default 설정 처리 (Admin 설치 시 이미 처리되었을 수 있음)
ls -la /etc/nginx/sites-enabled/

# Case 1: default 파일이 존재하는 경우 - 제거
sudo rm -f /etc/nginx/sites-enabled/default

# Case 2: default 파일이 없는데 nginx.conf가 직접 참조하는 경우
# 에러: open() "/etc/nginx/sites-enabled/default" failed (2: No such file or directory)
# 확인:
sudo cat /etc/nginx/nginx.conf | grep -n "sites-enabled"
# 해결: nginx.conf에서 해당 라인을 주석 처리 또는 와일드카드로 변경
# include /etc/nginx/sites-enabled/default; → 주석 처리
# 또는
# include /etc/nginx/sites-enabled/*; 로 변경

# 설정 파일 문법 테스트
sudo nginx -t

# Admin 서비스 영향 최소화 - Reload 사용 (재시작 대신)
sudo systemctl reload nginx

# 상태 확인
sudo systemctl status nginx

# 재부팅 후 자동 시작 확인
sudo systemctl is-enabled nginx
# → enabled 출력되어야 함

# Admin 서비스 정상 동작 확인
curl -I http://localhost/adm/
```

> 💡 **conf.d 방식의 장점**:
> - 파일 생성만으로 자동 적용 (심볼릭 링크 불필요)
> - `/etc/nginx/nginx.conf`에서 `include /etc/nginx/conf.d/*.conf;`로 자동 로드
> - 재부팅 후에도 자동으로 유지됨
>
> ⚠️ **sites-enabled/default 관련 주의사항**:
> - Admin 설치 시 이미 제거되었을 수 있습니다
> - 제거되지 않았다면 우리 설정과 충돌하므로 제거 필요합니다
>
> ⚠️ **만약 "No such file or directory" 에러가 발생하면**:
> - 일부 시스템의 `nginx.conf`는 특정 파일을 직접 참조합니다
> - `sudo vi /etc/nginx/nginx.conf` 실행
> - `include /etc/nginx/sites-enabled/default;` 같은 라인을 찾아서:
>   - 주석 처리: `# include /etc/nginx/sites-enabled/default;`
>   - 또는 와일드카드로 변경: `include /etc/nginx/sites-enabled/*;`

### 1.9 서비스 시작 및 자동 시작 설정

#### Platform Backend 시작

**Step 1: PM2로 Platform Backend 시작**

```bash
cd /var/www/iitp-dabt-platform/be

# PM2로 시작 (Admin과 별도)
pm2 start dist/server.js --name iitp-dabt-plf-be

# 상태 확인 (Admin과 Platform 모두 확인)
pm2 list

# Platform 로그 확인
pm2 logs iitp-dabt-plf-be --lines 50

# Platform 헬스체크
curl http://localhost:33000/api/v1/health
```

**Step 2: 재부팅 후 자동 시작 설정 (필수)**

```bash
# 1. PM2 설정 저장 (Admin + Platform 모두 저장)
pm2 save

# 2. systemd 서비스 상태 확인
sudo systemctl status pm2-iitp-plf
# → active (exited) 상태여야 함

# 3. 재부팅 후 자동 시작 확인
sudo systemctl is-enabled pm2-iitp-plf
# → enabled 출력되어야 함
```

> ⚠️ **Admin이 이미 설치되어 있는 경우**:
> - PM2 startup은 이미 설정되어 있으므로 다시 실행할 필요 없음
> - `pm2 save`만 실행하여 Platform Backend를 추가로 저장
> - 재부팅 시 Admin + Platform Backend가 모두 자동 시작됨

#### 서비스 목록 확인

```bash
# PM2 목록
pm2 list
# 예상 출력:
# iitp-dabt-admin-be  (포트 30000) - Admin
# iitp-dabt-plf-be    (포트 33000) - Platform

# 포트 확인
sudo netstat -tlnp | grep :30000  # Admin
sudo netstat -tlnp | grep :33000  # Platform
```

### 1.10 검증

```bash
# Admin 서비스 정상 동작 확인 (영향 없어야 함)
curl http://localhost/adm/api/v1/health
curl http://localhost/adm/

# Platform 서비스 확인
curl http://localhost:33000/api/v1/health  # 직접
curl http://localhost/hub/api/v1/health    # Nginx 경유
curl http://localhost/hub/                     # Frontend

# PM2 상태
pm2 list

# Nginx 로그
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

**성공 확인:**
- ✅ Admin 서비스: `/adm/`, `/adm/api/` 정상
- ✅ Platform 서비스: `/hub/`, `/hub/api/` 정상
- ✅ PM2: 두 서비스 모두 `online`
- ✅ Nginx: 에러 로그 없음

---

## 2. 초기 설치 - 서버 분리 환경

> **전제조건**: 빌드 서버 ≠ 실행 서버, 실행 서버에 Admin 운영 중

### 2.1 빌드 서버 설정

단독 설치 가이드의 [섹션 2.1](./README-SERVER-DEPLOYMENT.md#21-빌드-서버-설정)과 동일하게 진행하되, **Frontend 환경변수만 복합 서비스 기준**으로 설정합니다.

**빌드 서버 세팅 요약:**
- 필수 패키지 설치 (git, curl, build-essential, rsync)
- Node.js 22.x 설치 (NodeSource, snap, nvm 중 선택 - **프로덕션은 NodeSource 권장**)
- iitp-plf 사용자 및 디렉토리 생성
- SSH 키 설정 (rsync용)
- Git 클론 및 패키지 설치

**자세한 내용은 단독 설치 가이드 참조** ([Node.js 설치 방법 비교](./README-SERVER-DEPLOYMENT.md#nodejs-설치-아래-중-하나-선택))

#### Frontend 환경변수 (복합 서비스 기준)

```bash
cd /home/iitp-plf/iitp-dabt-platform/source/fe
cp env.sample .env
vi .env
```

내용:
```env
# 복합 서비스용 - /hub 경로
VITE_PORT=5173
VITE_BASE=/hub/
VITE_API_BASE_URL=/hub
VITE_API_TIMEOUT=10000
VITE_API_DATA_PREVIEW_LIMIT=10
VITE_VISUAL_TOOL=http://실행서버IP:visual-tool-port/
VITE_EMPLOYMENT_SITE_URL=https://www.ablejob.co.kr/
VITE_OPEN_API_CENTER_URL=http://실행서버IP/adm/
VITE_OPEN_API_CENTER_ABOUT_URL=http://실행서버IP/adm/about
```

나머지는 단독 설치 가이드 섹션 2.1 참조

### 2.2 실행 서버 설정

#### 2.2.1 기존 Admin 서비스 확인

```bash
# 실행 서버에서 확인
pm2 list | grep admin
curl http://localhost/adm/
sudo netstat -tlnp | grep 30000
```

#### 2.2.2 Platform 디렉토리 생성

섹션 1.1과 동일

#### 2.2.3 데이터베이스 설정

섹션 1.2와 동일

#### 2.2.4 Backend 환경변수

섹션 1.4.1과 동일

### 2.3 빌드 및 배포

#### 빌드 (빌드 서버)

```bash
cd /home/iitp-plf/iitp-dabt-platform/source
npm run build:server
```

#### 배포 (빌드 서버 → 실행 서버)

단독 설치 가이드 섹션 2.3.2와 동일 (rsync 사용)

### 2.4 실행 서버 설정 계속

#### Backend 실행 준비

섹션 1.7과 동일

#### Nginx 통합 설정

섹션 1.8과 동일

#### 서비스 시작

섹션 1.9와 동일

### 2.5 검증

섹션 1.10과 동일

---

## 3. 업데이트 배포 (일상 운영)

> **전제조건**: 섹션 1 또는 2의 초기 설치 완료

**중요**: Admin 서비스에 영향을 주지 않고 Platform만 업데이트합니다.

### 3.1 사전 확인

```bash
# Admin 서비스 상태 확인 (영향 없어야 함)
pm2 list | grep admin
curl http://localhost/adm/api/v1/health

# Platform 현재 버전 확인
curl http://localhost:33000/api/v1/version
curl http://localhost/hub/api/v1/version

# Platform 서비스 상태
pm2 list | grep plf
pm2 logs iitp-dabt-plf-be --lines 50

# 백업 (선택사항)
pg_dump -U iitp_platform_user iitp_dabt > platform_backup_$(date +%Y%m%d_%H%M%S).sql
```

### 3.2 소스 업데이트

#### 단일 서버:
```bash
cd /home/iitp-plf/iitp-dabt-platform/source
git fetch origin
git pull origin main
git log -5 --oneline
```

#### 빌드 서버 (서버 분리):
```bash
cd /home/iitp-plf/iitp-dabt-platform/source
git fetch origin
git pull origin main
```

### 3.3 의존성 확인

```bash
git diff HEAD@{1} HEAD -- package.json be/package.json fe/package.json

# 변경 있으면
npm install
```

### 3.4 빌드

```bash
cd /home/iitp-plf/iitp-dabt-platform/source

# 전체 빌드 (권장)
npm run build:server
```

**개별 빌드 옵션:** [섹션 1.5.2](#152-개별-빌드-옵션) 또는 [단독 설치 가이드 참조](./README-SERVER-DEPLOYMENT.md#152-개별-빌드-옵션)

### 3.5 배포

> 👤 **실행 계정**: `iitp-plf` (운영 계정)

#### 단일 서버:
```bash
cd /home/iitp-plf/iitp-dabt-platform/source

# 전체 배포 (권장) ⭐
npm run deploy:server

# 또는 개별 배포
npm run deploy:server:be      # Backend만
npm run deploy:server:fe      # Frontend만
npm run deploy:server:common  # Common만
```

**스크립트가 자동으로 처리:**
- ✅ rsync로 안전한 배포 (node_modules, .env, logs 자동 제외)
- ✅ 파일 권한 자동 설정
- ✅ 버전 정보 자동 출력

**수동 배포 (비권장):**
```bash
# Backend
rsync -av --delete \
  --exclude='node_modules' --exclude='.env' --exclude='logs' \
  /home/iitp-plf/iitp-dabt-platform/deploy/backend/ \
  /var/www/iitp-dabt-platform/be/

# Frontend
rsync -av --delete \
  /home/iitp-plf/iitp-dabt-platform/deploy/frontend/ \
  /var/www/iitp-dabt-platform/fe/

# Common
rsync -av --delete \
  /home/iitp-plf/iitp-dabt-platform/deploy/common/ \
  /var/www/iitp-dabt-platform/packages/common/
```

**상세 옵션:** [섹션 1.6.2](./README-SERVER-DEPLOYMENT.md#162-개별-배포-옵션) 참조

#### 서버 분리:
```bash
# 빌드 서버에서 실행
cd /home/iitp-plf/iitp-dabt-platform/source

# 전체 배포 (권장) ⭐
npm run deploy:server

# 또는 개별 배포
npm run deploy:server:be      # Backend만
npm run deploy:server:fe      # Frontend만
npm run deploy:server:common  # Common만

# 후속 조치: 섹션 3.6 참조
```

**주의사항:** Admin 서비스가 실행 중이므로 영향 최소화 필요

**상세 옵션:** [섹션 1.6.2](./README-SERVER-DEPLOYMENT.md#162-개별-배포-옵션) 참조

### 3.6 서비스 재시작 (Platform만)

#### 전체 재시작 (권장)

```bash
# Platform Backend 재시작
npm run restart:server:be

# Platform Frontend 재시작 (Nginx reload)
npm run restart:server:fe

# Admin 서비스 정상 확인 (영향 없어야 함)
pm2 list | grep admin
curl http://localhost/adm/api/v1/health
```

#### 개별 재시작

**재시작 필요 시나리오 및 방법:** [섹션 3.6 개별 재시작](./README-SERVER-DEPLOYMENT.md#36-서비스-재시작) 참조

### 3.7 검증

```bash
# Platform 버전 확인 (변경되었는지)
curl http://localhost/hub/api/v1/version

# Platform 헬스체크
curl http://localhost:33000/api/v1/health
curl http://localhost/hub/api/v1/health

# Admin 서비스 영향 확인 (정상이어야 함)
curl http://localhost/adm/api/v1/health
curl http://localhost/adm/

# PM2 상태 (두 서비스 모두 online)
pm2 list
```

### 3.8 롤백 (문제 발생 시)

```bash
# Git 롤백
cd /home/iitp-plf/iitp-dabt-platform/source
git reset --hard <이전_커밋>

# 재빌드 및 재배포
npm run build:server
# (섹션 3.5 참조)

# 재시작
pm2 restart iitp-dabt-plf-be

# Admin 서비스 영향 확인
pm2 list
curl http://localhost/adm/api/v1/health
```

---

## 4. 복합 서비스 운영 관리

### 4.1 서비스별 관리

#### Admin 서비스
```bash
# 상태 확인
pm2 list | grep admin
curl http://localhost/adm/api/v1/health

# 로그 확인
pm2 logs <admin-app-name>

# 재시작
pm2 restart <admin-app-name>
```

#### Platform 서비스
```bash
# 상태 확인
pm2 list | grep plf
curl http://localhost/hub/api/v1/health

# 로그 확인
pm2 logs iitp-dabt-plf-be

# 재시작
pm2 restart iitp-dabt-plf-be
```

#### 전체 서비스
```bash
# 전체 상태
pm2 list

# 전체 재시작 (주의: Admin도 재시작됨)
pm2 restart all

# 전체 로그
pm2 logs
```

### 4.2 Nginx 로그 분석

```bash
# Access 로그 분리 확인
sudo tail -f /var/log/nginx/access.log | grep /adm/   # Admin
sudo tail -f /var/log/nginx/access.log | grep /hub/   # Platform

# Error 로그
sudo tail -f /var/log/nginx/error.log
```

### 4.3 데이터베이스 관리

```bash
# Admin 사용자 확인
psql -U iitp_admin_user -d iitp_dabt -c "\conninfo"

# Platform 사용자 확인
psql -U iitp_platform_user -d iitp_dabt -c "\conninfo"

# 연결 수 확인
psql -U postgres -d iitp_dabt -c "SELECT * FROM pg_stat_activity WHERE datname='iitp_dabt';"
```

### 4.4 리소스 모니터링

```bash
# 프로세스별 리소스
pm2 monit

# 메모리 사용량
free -h

# CPU 사용량
htop

# 디스크 사용량
df -h
```

---

## 5. 문제 해결 및 FAQ

### 5.1 복합 서비스 특화 문제

#### Admin 서비스가 영향받음

```bash
# Admin 상태 확인
pm2 list | grep admin
curl http://localhost/adm/api/v1/health

# Nginx 설정 확인 (location 블록 충돌 확인)
sudo nginx -t
sudo cat /etc/nginx/conf.d/*.conf

# Nginx 재로드
sudo systemctl reload nginx

# Admin 로그 확인
pm2 logs <admin-app-name> --lines 100
```

#### 포트 충돌

```bash
# 포트 사용 확인
sudo netstat -tlnp | grep :30000  # Admin
sudo netstat -tlnp | grep :33000  # Platform

# 충돌 시 프로세스 종료 또는 포트 변경
```

#### Nginx location 우선순위 문제

```nginx
# 더 구체적인 경로가 먼저 와야 함
# 잘못된 순서:
location / {  # 이게 먼저 오면 모든 요청을 잡음
    ...
}
location /adm/ {  # 이게 실행 안 됨
    ...
}

# 올바른 순서:
location /adm/api/ {  # 가장 구체적
    ...
}
location /adm/ {
    ...
}
location / {  # 가장 일반적 (마지막)
    ...
}
```

### 5.2 FAQ (복합 서비스)

**Q: Admin과 Platform이 같은 DB를 사용해도 되나요?**
- ✅ 네, 같은 DB (`iitp_dabt`)를 사용하되 별도 사용자 계정으로 접근합니다.
- 테이블 이름 충돌 방지를 위해 prefix 사용 권장 (예: `platform_`, `admin_`)

**Q: Nginx에서 /adm/과 /hub/ 경로가 충돌하지 않나요?**
- ✅ 아니요. Nginx는 location 매칭이 정확하므로 충돌하지 않습니다.
- 구체적인 경로 (`/adm/api/`, `/hub/api/`)를 먼저 정의하는 것이 중요합니다.

**Q: 한 서비스만 재시작할 수 있나요?**
- ✅ 네, PM2 앱 이름으로 개별 재시작 가능합니다.
- `pm2 restart iitp-dabt-plf-be` (Platform만)
- `pm2 restart <admin-app-name>` (Admin만)

**Q: Frontend 빌드 시 경로를 잘못 설정했어요**
- 재빌드 및 재배포 필요:
```bash
# Frontend .env 수정
vi fe/.env  # VITE_BASE=/hub/ 확인

# 재빌드
npm run build:server:fe

# 재배포
rsync ... (섹션 3.5 참조)
```

**Q: 두 서비스의 로그를 동시에 보고 싶어요**
```bash
# PM2 전체 로그
pm2 logs

# 또는 tail 동시 실행
tail -f /var/www/iitp-dabt-admin/be/logs/*.log &
tail -f /var/www/iitp-dabt-platform/be/logs/*.log &
```

---

## 📋 복합 서비스 체크리스트

### 초기 설치 체크리스트

- [ ] Admin 서비스 정상 동작 확인
- [ ] Admin 포트 및 경로 확인 (30000, /adm)
- [ ] Platform 사용자 및 디렉토리 생성
- [ ] Platform DB 사용자 생성 (Admin과 별도)
- [ ] Platform Git 클론
- [ ] Platform Backend .env 생성 (포트 33000)
- [ ] Platform Frontend .env 생성 (/hub 경로)
- [ ] Platform 빌드 성공
- [ ] Platform 배포 완료
- [ ] Nginx 통합 설정 (Admin + Platform)
- [ ] Platform Backend PM2 시작
- [ ] Admin 서비스 영향 없음 확인
- [ ] Platform 헬스체크 성공 (/hub/api)
- [ ] Platform Frontend 접속 성공 (/hub)

### 업데이트 체크리스트

- [ ] Admin 서비스 정상 확인
- [ ] Platform 현재 버전 확인
- [ ] 백업 완료
- [ ] Git pull 완료
- [ ] 빌드 성공
- [ ] 배포 완료
- [ ] Platform 재시작
- [ ] Admin 서비스 영향 없음 확인
- [ ] Platform 헬스체크 성공
- [ ] Platform 버전 변경 확인

---
