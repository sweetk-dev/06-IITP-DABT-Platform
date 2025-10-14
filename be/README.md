# IITP 장애인 데이터 플랫폼 Backend

IITP 장애인 데이터 플랫폼의 백엔드 서버입니다. 완벽한 모듈화와 성능 최적화를 통해 구현되었습니다.

## 🚀 주요 특징

### 완벽한 모듈화
- **계층화된 아키텍처**: Controller → Service → Repository → Model
- **의존성 주입**: 테스트 가능한 구조
- **공통 패키지 활용**: `@iitp-dabt-platform/common`의 모든 타입 활용
- **타입 안전성**: TypeScript로 완전한 타입 검증

### 고성능 아키텍처
- **Connection Pooling**: DB 연결 최적화
- **캐싱 전략**: 응답 캐싱 및 성능 향상
- **비동기 처리**: Promise 기반 비동기 처리
- **메모리 최적화**: 효율적인 메모리 사용

### 강력한 에러 처리
- **구조화된 에러 코드**: 공통 에러 코드 시스템
- **자동 에러 로깅**: 상세한 에러 추적
- **API 응답 일관성**: 표준화된 응답 형식

### 완벽한 로깅 시스템
- **구조화된 로그**: JSON 형태의 로그
- **성능 메트릭**: 요청/응답 시간 측정
- **에러 추적**: 상세한 에러 정보

## 📁 프로젝트 구조

```
be/
├── src/                   # 소스 코드
│   ├── app.ts             # Express 앱 설정
│   ├── server.ts          # 서버 시작점
│   ├── index.ts           # 진입점
│   ├── config/            # 설정 관리
│   │   ├── database.ts    # DB 연결 설정
│   │   ├── logger.ts      # 로거 설정
│   │   └── env.ts         # 환경변수 관리 (암호화된 비밀번호 지원)
│   ├── middleware/        # 미들웨어
│   │   ├── errorHandler.ts    # 공통 에러 처리
│   │   ├── logger.ts          # 요청/응답 로깅
│   │   ├── validator.ts       # 요청 검증
│   │   ├── paramConverter.ts  # API 파라미터 변환 (API_MAPPING 기반)
│   │   └── cors.ts            # CORS 설정
│   ├── controllers/       # API 컨트롤러
│   │   ├── common/        # 공통 API
│   │   │   └── index.ts
│   │   ├── data/          # 데이터 관련 API
│   │   │   └── index.ts
│   │   └── selfcheck/     # 자가진단 관련 API
│   │       └── index.ts
│   ├── services/          # 비즈니스 로직
│   │   ├── common/        # 공통 서비스
│   │   │   └── index.ts
│   │   ├── data/          # 데이터 서비스
│   │   │   └── index.ts
│   │   ├── selfcheck/     # 자가진단 서비스
│   │   │   └── index.ts
│   │   └── openapi/       # 외부 API 서비스
│   │       └── index.ts
│   ├── repositories/      # 데이터 접근 계층
│   │   ├── base/          # 기본 Repository
│   │   │   └── BaseRepository.ts
│   │   ├── data/          # 데이터 Repository
│   │   │   └── index.ts
│   │   └── selfcheck/     # 자가진단 Repository
│   │       └── index.ts
│   ├── models/            # DB Entity
│   │   ├── index.ts       # 모델 초기화
│   │   ├── data/          # 데이터 모델
│   │   │   ├── DataSummaryInfo.ts
│   │   │   └── SelfDiagDataCategory.ts
│   │   └── selfcheck/     # 자가진단 모델
│   │       ├── SelfDiagPolicy.ts
│   │       ├── SelfDiagProvider.ts
│   │       └── SelfDiagFacility.ts
│   ├── utils/             # 유틸리티 함수
│   │   ├── pagination.ts      # 페이지네이션 처리
│   │   ├── validation.ts      # 검증 유틸리티
│   │   ├── response.ts        # 응답 포맷팅
│   │   ├── date.ts            # 날짜 처리
│   │   ├── decrypt.ts         # 암호화된 환경변수 복호화
│   │   ├── enumConverter.ts   # Common enum 변환 및 검증
│   │   └── paramConverterUtils.ts # API 파라미터 변환 유틸리티
│   └── routes/            # 라우트 정의
│       ├── common.ts      # 공통 라우트
│       ├── data.ts        # 데이터 라우트
│       └── selfcheck.ts   # 자가진단 라우트
├── script/                # 유틸리티 스크립트
│   └── encrypt-env.js # 환경변수 암호화 도구
├── dist/                  # 빌드 결과물
├── logs/                  # 로그 파일
├── .env                   # 환경변수 (암호화된 비밀번호 포함)
├── env.sample             # 환경변수 샘플
├── package.json           # 패키지 설정
├── tsconfig.json          # TypeScript 설정
└── README.md              # 프로젝트 문서
```

## 🛠️ 기술 스택

### 핵심 기술
- **Node.js**: 런타임 환경
- **Express.js**: 웹 프레임워크
- **TypeScript**: 타입 안전성
- **Sequelize**: ORM
- **PostgreSQL**: 데이터베이스

### 추가 라이브러리
- **Winston**: 로깅
- **Zod**: 스키마 검증
- **Axios**: HTTP 클라이언트
- **date-fns**: 날짜 처리
- **Helmet**: 보안
- **CORS**: 크로스 오리진
- **Compression**: 압축

## 🚀 시작하기

### 1. 환경 설정

```bash
# 의존성 설치
npm install

# 환경변수 설정
cp env.sample .env
# .env 파일을 편집하여 실제 값으로 설정
```

### 2. 데이터베이스 설정

```bash
# PostgreSQL 데이터베이스 생성
createdb iitp_dabt_platform

# 테이블 생성 (DDL 실행)
psql -d iitp_dabt_platform -f schema.sql
```

### 3. 개발 서버 실행

```bash
# 개발 모드
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start
```

## 📊 API 문서

### 공통 API

#### 헬스 체크
```http
GET /api/v1/health
```

#### 버전 정보
```http
GET /api/v1/version
```

### 데이터 API

#### 최신 데이터 조회
```http
GET /api/v1/data/summary/latest?limit=6
```

#### 테마별 건수 조회
```http
GET /api/v1/data/counts/themes
```

#### 데이터 검색
```http
GET /api/v1/data/search?q=검색어&themes=phy,emo&types=basic,poi&page=0&pageSize=20&sort=recent
```

### 자가진단 API

#### 추천 정책 조회
```http
GET /api/v1/selfcheck/recommendations?gender=남성&disLevel=경증&ageCond=adult&themes=phy,emo&limit=3
```

#### 자립 지원 정책 조회
```http
GET /api/v1/selfcheck/policies?gender=남성&disLevel=경증&ageCond=adult&themes=phy,emo&page=0&pageSize=20
```

## 🔧 설정

### 환경변수 ⚠️

**중요**: Backend는 **실행 시점에만** `.env` 파일이 필요합니다! (빌드 시에는 불필요)

| 시점 | .env 필요 여부 | 위치 | 이유 |
|------|---------------|------|------|
| **빌드 시** | ❌ 불필요 | - | TypeScript 컴파일만 수행 |
| **실행 시** | ✅ **필수** | `be/.env` | dotenv로 런타임에 로드 |

#### 로컬 개발
```bash
# env.sample을 복사하여 .env 생성
cp env.sample .env
```

#### 프로덕션 서버
```bash
# 실행 서버에 .env 생성 (최초 1회)
sudo vi /var/www/iitp-dabt-platform/be/.env
```

#### 환경변수 목록

| 변수명 | 설명 | 개발 | 프로덕션 |
|--------|------|------|---------|
| `NODE_ENV` | 실행 환경 | `development` | `production` |
| `PORT` | 서버 포트 | `3001` | `33000` |
| `DB_HOST` | 데이터베이스 호스트 | `localhost` | `localhost` |
| `DB_PORT` | 데이터베이스 포트 | `5432` | `5432` |
| `DB_NAME` | 데이터베이스 이름 | `iitp_dabt_platform` | `iitp_dabt` |
| `DB_USER` | 데이터베이스 사용자 | `postgres` | `iitp_platform_user` |
| `DB_PASSWORD` | 데이터베이스 비밀번호 | - | - |
| `CORS_ORIGINS` | CORS 허용 오리진 | `http://localhost:5173` | `http://서버주소` |
| `OPEN_API_SERVER_URL` | OpenAPI 서버 URL | - | - |
| `LOG_LEVEL` | 로그 레벨 | `info` | `warn` |

**프로덕션 주의사항**:
- ✅ 실행 서버의 `/var/www/iitp-dabt-platform/be/.env` **반드시 필요**
- ✅ 배포 스크립트는 `.env` 파일을 exclude하므로 **수동으로 최초 1회 생성**
- ✅ 한 번 생성하면 배포 시 자동 보존됨

### 로깅 설정

로그는 `./logs` 디렉토리에 저장됩니다:
- `app.log`: 애플리케이션 로그
- `error.log`: 에러 로그

## 🧪 테스트

```bash
# 테스트 실행
npm test

# 테스트 커버리지
npm run test:coverage
```

## 📈 성능 모니터링

### 로그 모니터링
- 요청/응답 시간 자동 측정
- 느린 요청 자동 감지 (1초 이상)
- 에러 발생 시 상세 로그

### 메트릭 수집
- API 호출 횟수
- 응답 시간 분포
- 에러 발생률
- 데이터베이스 연결 상태

## 🔧 유틸리티 및 스크립트

### 암호화/복호화 유틸리티
- **`src/utils/decrypt.ts`**: AES-256-CBC 암호화된 환경변수 복호화
  - `decryptAes256()`: Base64 인코딩된 암호화 데이터 복호화
  - `getDecryptedEnv()`: ENC() 형태의 환경변수 자동 복호화

### 환경변수 암호화 스크립트
- **`script/encrypt-env.js`**: 민감한 환경변수 암호화 도구
  ```bash
  # 사용법
  node script/encrypt-env.js
  
  # 또는 ENC_SECRET 환경변수 설정 후
  ENC_SECRET=your_secret_key node script/encrypt-env.js
  ```
  
  **기능:**
  - AES-256-CBC 암호화를 사용한 민감한 값 암호화
  - `ENC()` 형식으로 암호화된 값 출력
  - 데이터베이스 비밀번호 등 민감한 정보 안전 저장
  - 관리자 계정 초기 설정 지원

### 환경변수 암호화 지원
- **암호화된 비밀번호**: `DB_PASSWORD=ENC(암호화된문자열)` 형태 지원
- **복호화 키**: `ENC_SECRET` 환경변수로 복호화 키 관리
- **자동 복호화**: 환경변수 로딩 시 자동으로 복호화 처리

## 🔒 보안

### 보안 기능
- **Helmet**: 보안 헤더 설정
- **CORS**: 크로스 오리진 제어
- **입력 검증**: Zod를 통한 스키마 검증
- **SQL 인젝션 방지**: Sequelize ORM 사용
- **암호화된 환경변수**: 민감한 정보 암호화 저장

### 에러 처리
- 민감한 정보 노출 방지
- 구조화된 에러 응답
- 자동 에러 로깅

## 🚀 배포

### Docker 배포
```bash
# Docker 이미지 빌드
docker build -t iitp-dabt-platform-be .

# 컨테이너 실행
docker run -p 3001:3001 iitp-dabt-platform-be
```

### PM2 배포
```bash
# PM2 설치
npm install -g pm2

# 애플리케이션 시작 (프로덕션)
pm2 start dist/server.js --name "iitp-dabt-plf-be"

# 상태 확인
pm2 status

# 로그 확인
pm2 logs iitp-dabt-plf-be
```

**프로덕션 서버 참고**:
- PM2 앱명: `iitp-dabt-plf-be`
- 포트: `33000`
- 서비스 경로: `/hub/api` (1서버 여러 서비스 공존 시)

## 📦 패키지 정보

### 핵심 의존성
- **Express.js**: 웹 프레임워크
- **Sequelize**: ORM (PostgreSQL)
- **Winston**: 로깅 시스템
- **Zod**: 스키마 검증
- **Helmet**: 보안 미들웨어
- **CORS**: 크로스 오리진 리소스 공유

### 개발 의존성
- **TypeScript**: 타입 안전성
- **ts-node-dev**: 개발 서버
- **Jest**: 테스트 프레임워크
- **ESLint**: 코드 품질 관리

### 공통 패키지
- **@iitp-dabt-platform/common**: 공통 타입 및 상수
  - API 타입 정의
  - 상수 관리
  - 유틸리티 함수
  - 에러 코드 시스템

### 보안 패키지
- **bcrypt**: 비밀번호 해싱
- **crypto**: 암호화/복호화
- **helmet**: 보안 헤더

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 지원

문제가 발생하거나 질문이 있으시면 이슈를 생성해 주세요.

---

**IITP 장애인 데이터 플랫폼 Backend** - 완벽한 모듈화와 성능 최적화로 구현된 현대적인 백엔드 서버
