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
be/src/
├── app.ts                 # Express 앱 설정
├── server.ts              # 서버 시작점
├── config/                # 설정 관리
│   ├── database.ts        # DB 연결 설정
│   ├── logger.ts          # 로거 설정
│   └── env.ts             # 환경변수 관리
├── middleware/            # 미들웨어
│   ├── errorHandler.ts    # 공통 에러 처리
│   ├── logger.ts          # 요청/응답 로깅
│   ├── validator.ts       # 요청 검증
│   └── cors.ts            # CORS 설정
├── controllers/           # API 컨트롤러
│   ├── common/            # 공통 API
│   ├── data/              # 데이터 관련 API
│   └── selfcheck/         # 자가진단 관련 API
├── services/              # 비즈니스 로직
│   ├── common/            # 공통 서비스
│   ├── data/              # 데이터 서비스
│   ├── selfcheck/         # 자가진단 서비스
│   └── openapi/           # OpenAPI 연동 서비스
├── repositories/          # 데이터 접근 계층
│   ├── base/              # 기본 Repository
│   ├── data/              # 데이터 Repository
│   └── selfcheck/         # 자가진단 Repository
├── models/                # DB Entity
│   ├── data/              # 데이터 모델
│   └── selfcheck/         # 자가진단 모델
├── utils/                 # 유틸리티 함수
│   ├── pagination.ts      # 페이지네이션 처리
│   ├── validation.ts      # 검증 유틸
│   ├── response.ts        # 응답 포맷팅
│   └── date.ts            # 날짜 처리
├── types/                 # BE 전용 타입
│   ├── database.ts        # DB 관련 타입
│   └── internal.ts        # 내부 처리 타입
└── routes/                # 라우트 정의
    ├── common.ts          # 공통 라우트
    ├── data.ts            # 데이터 라우트
    └── selfcheck.ts       # 자가진단 라우트
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

### 환경변수

| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `NODE_ENV` | 실행 환경 | `development` |
| `PORT` | 서버 포트 | `3001` |
| `DB_HOST` | 데이터베이스 호스트 | `localhost` |
| `DB_PORT` | 데이터베이스 포트 | `5432` |
| `DB_NAME` | 데이터베이스 이름 | `iitp_dabt_platform` |
| `DB_USER` | 데이터베이스 사용자 | `postgres` |
| `DB_PASSWORD` | 데이터베이스 비밀번호 | - |
| `CORS_ORIGINS` | CORS 허용 오리진 | `http://localhost:3000` |
| `OPEN_API_SERVER_URL` | OpenAPI 서버 URL | - |
| `LOG_LEVEL` | 로그 레벨 | `info` |

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

## 🔒 보안

### 보안 기능
- **Helmet**: 보안 헤더 설정
- **CORS**: 크로스 오리진 제어
- **입력 검증**: Zod를 통한 스키마 검증
- **SQL 인젝션 방지**: Sequelize ORM 사용

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

# 애플리케이션 시작
pm2 start dist/server.js --name "iitp-dabt-platform-be"

# 상태 확인
pm2 status
```

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
