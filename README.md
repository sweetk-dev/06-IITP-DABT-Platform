# IITP DABT Platform

IITP 장애인 데이터 탐색 및 활용 플랫폼 (Disability Data Access and Utilization Platform)

## 📋 프로젝트 개요

장애인 자립 생활 지원을 위한 빅데이터 플랫폼으로, 데이터 탐색, 자가진단, 정책 추천 등의 기능을 제공합니다.

## 🎯 핵심 특징

- **완전한 모듈화**: `@iitp-dabt-platform/common` 패키지를 통한 FE/BE 공통 타입 및 상수 관리
- **하드코딩 제거**: 모든 상수와 타입을 중앙에서 관리
- **타입 안전성**: TypeScript를 통한 컴파일 타임 타입 체크
- **일관된 API 처리**: 단일 API 클라이언트로 모든 API 호출 통합
- **중복 코드 제거**: 재사용 가능한 서비스와 훅으로 코드 중복 최소화
- **API_MAPPING 기반 파라미터 변환**: 자동 타입 변환 및 검증
- **암호화된 환경변수 지원**: 민감한 정보 보안 강화
- **Common enum 완전 활용**: 하드코딩 없는 일관된 enum 처리

## 🏗️ 프로젝트 구조

```
06-IITP-DABT-Platform/
├── fe/                           # 프론트엔드 (React + TypeScript)
│   ├── src/
│   │   ├── api/                  # API 관련 모든 기능 (common 패키지 완전 활용)
│   │   │   ├── client.ts         # API 클라이언트 (API_MAPPING 활용)
│   │   │   ├── errorHandler.ts   # 에러 처리 (ErrorCode, ErrorMetaMap 활용)
│   │   │   ├── services/         # API 서비스 레이어 (API_URLS, REQ/RES DTO 활용)
│   │   │   └── hooks/            # API 훅들 (common 타입 활용)
│   │   ├── components/           # React 컴포넌트
│   │   ├── pages/                # 페이지 컴포넌트
│   │   ├── hooks/                # 커스텀 훅
│   │   └── styles/               # 스타일 파일
│   └── README.md                 # 프론트엔드 문서
├── be/                           # 백엔드 (Node.js + TypeScript)
│   ├── src/
│   │   ├── app.ts                # Express 앱 설정
│   │   ├── server.ts             # 서버 시작점
│   │   ├── index.ts              # 진입점
│   │   ├── config/               # 설정 관리 (암호화된 환경변수 지원)
│   │   ├── middleware/           # 미들웨어 (API_MAPPING 기반 파라미터 변환)
│   │   ├── controllers/          # API 컨트롤러
│   │   ├── services/             # 비즈니스 로직
│   │   ├── repositories/         # 데이터 접근 계층
│   │   ├── models/               # DB Entity
│   │   ├── utils/                # 유틸리티 (암호화/복호화, enum 변환)
│   │   └── routes/               # 라우트 정의
│   ├── script/
│   │   └── test-password-hash.js # 비밀번호 해싱 테스트
│   ├── .env                      # 환경변수 (암호화된 비밀번호 포함)
│   └── README.md                 # 백엔드 문서
├── packages/                     # 공통 패키지
│   └── common/                   # 공통 타입 및 상수 (FE/BE 완전 공유)
│       ├── src/
│       │   ├── types/            # 타입 정의
│       │   │   ├── constants.ts  # 상수 정의 (THEME_CONSTANTS, DATA_TYPE_CONSTANTS 등)
│       │   │   ├── errorCodes.ts # 에러 코드 (ErrorCode, ErrorMetaMap)
│       │   │   ├── selfcheck-logic.ts # 자가진단 로직
│       │   │   └── api/          # API 타입 정의
│       │   │       ├── api.ts    # 기본 API URL (API_URLS)
│       │   │       ├── common.ts # 공통 API 타입
│       │   │       ├── data.ts   # 데이터 API 타입 (REQ/RES DTO)
│       │   │       ├── selfcheck.ts # 자가진단 API 타입
│       │   │       └── mapping.ts # API 매핑 테이블 (body, params, query 구분)
│       │   └── index.ts          # 패키지 진입점
│       └── README.md             # 공통 패키지 문서
├── 01.references/                # 참고 자료
│   ├── figma_designs/            # Figma 디자인 파일
│   ├── figma-api-data/           # Figma API 데이터
│   ├── figma-react-components/   # Figma React 컴포넌트
│   ├── refer_publishing/         # 참고 퍼블리싱
│   └── openapi-v0.0.3.yaml      # OpenAPI 스펙
└── script/                       # 빌드 및 배포 스크립트
    ├── local/                    # 로컬 개발 스크립트
    └── server/                   # 서버 배포 스크립트
```

## 🚀 빠른 시작

### 1. 저장소 클론

```bash
git clone <repository-url>
cd 06-IITP-DABT-Platform
```

### 2. 의존성 설치

```bash
# 전체 프로젝트 의존성 설치
npm run install:all

# 또는 개별 설치
npm install                    # 루트 의존성
cd fe && npm install          # 프론트엔드 의존성
cd ../be && npm install       # 백엔드 의존성
cd ../packages/common && npm install # 공통 패키지 의존성
```

### 3. 개발 서버 실행

```bash
# 모든 서비스 동시 실행
npm run dev:all

# 또는 개별 실행
npm run dev:fe                 # 프론트엔드만 실행
npm run dev:be                 # 백엔드만 실행
```

### 4. 빌드

```bash
# 전체 프로젝트 빌드
npm run build:all

# 또는 개별 빌드
npm run build:fe               # 프론트엔드 빌드
npm run build:be               # 백엔드 빌드
npm run build:common           # 공통 패키지 빌드
```

## 🎯 주요 기능

### 1. 데이터 탐색
- **데이터 목록 조회**: 자립 테마별, 데이터 유형별 데이터 목록
- **데이터 검색**: 키워드, 테마, 유형별 통합 검색
- **데이터 상세**: 데이터 테이블 상세 정보 및 미리보기
- **통계 정보**: 테마별, 유형별 데이터 건수 통계

### 2. 자가진단
- **본인 확인**: 장애인 여부, 성별, 장애등급, 연령대 확인
- **자가진단 문항**: 4개 영역 35문항 자가진단
- **결과 분석**: 영역별 점수 및 미달 영역 분석
- **정책 추천**: 진단 결과 기반 맞춤형 정책 추천

### 3. 정책 정보
- **정책 목록**: 자립 지원 정책 리스트
- **기관 정보**: 자립 지원 기관 정보
- **시설 정보**: 자립 지원 시설 정보

## 🔧 기술 스택

### 프론트엔드
- **React 18**: UI 라이브러리
- **TypeScript**: 타입 안전성
- **Vite**: 빌드 도구
- **React Router**: 라우팅
- **CSS3**: 스타일링

### 백엔드
- **Node.js**: 런타임 환경
- **TypeScript**: 타입 안전성
- **Express**: 웹 프레임워크

### 공통
- **Monorepo**: 단일 저장소 관리
- **TypeScript**: 타입 공유
- **ESLint**: 코드 품질 관리
- **Prettier**: 코드 포맷팅

## 📚 API 문서

### API 구조
- **Base URL**: `/api/v1`
- **데이터 API**: `/api/v1/data/*`
- **자가진단 API**: `/api/v1/selfcheck/*`
- **공통 API**: `/api/v1/health`, `/api/v1/version`

### 주요 엔드포인트

#### 데이터 API
- `GET /api/v1/data/summary/latest` - 최신 데이터 리스트
- `GET /api/v1/data/counts/themes` - 테마별 데이터 건수
- `GET /api/v1/data/search` - 데이터 검색
- `GET /api/v1/data/themes` - 테마 목록
- `GET /api/v1/data/types` - 데이터 유형 목록
- `GET /api/v1/data/themes/{theme}/items` - 테마별 데이터 목록
- `GET /api/v1/data/types/{type}/items` - 유형별 데이터 목록
- `GET /api/v1/data/{id}` - 데이터 상세 정보
- `GET /api/v1/data/{id}/preview` - 데이터 미리보기

#### 자가진단 API
- `GET /api/v1/selfcheck/recommendations` - 추천 정책
- `GET /api/v1/selfcheck/policies` - 정책 목록
- `GET /api/v1/selfcheck/providers` - 기관 목록
- `GET /api/v1/selfcheck/facilities` - 시설 목록

## 🎨 UI/UX

### 디자인 시스템
- **Figma**: 디자인 도구
- **컴포넌트 기반**: 재사용 가능한 UI 컴포넌트
- **반응형 디자인**: 모바일/데스크톱 대응
- **접근성**: 장애인 접근성 고려

### 주요 페이지
- **홈**: 메인 대시보드
- **데이터 목록**: 데이터 탐색
- **데이터 검색**: 통합 검색
- **데이터 상세**: 데이터 정보
- **자가진단**: 자가진단 프로세스
- **정보**: 플랫폼 정보

## 🔧 BE 고급 기능

### API_MAPPING 기반 파라미터 변환
- **자동 타입 변환**: `req.params`의 string → number 자동 변환
- **Enum 검증**: Common 패키지의 enum 타입 자동 검증
- **API_MAPPING 활용**: 중앙 집중식 API 타입 관리

### 암호화된 환경변수 지원
- **AES-256-CBC 암호화**: `DB_PASSWORD=ENC(암호화된문자열)` 형태 지원
- **자동 복호화**: 환경변수 로딩 시 자동 복호화
- **보안 강화**: 민감한 정보 암호화 저장

### Common enum 완전 활용
- **하드코딩 제거**: 모든 enum 값을 common 패키지에서 관리
- **타입 안전성**: TypeScript로 enum 타입 보장
- **일관성**: FE/BE 간 동일한 enum 값 사용

### 비밀번호 해싱 도구
- **bcrypt 해싱**: `script/test-password-hash.js`로 관리자 계정 초기 설정
- **SQL 자동 생성**: 해싱된 비밀번호로 INSERT 문 생성
- **검증 테스트**: 비밀번호 검증 로직 테스트

## 🔧 개발 가이드

### 코드 스타일
- **ESLint**: 코드 품질 관리
- **Prettier**: 코드 포맷팅
- **TypeScript**: 엄격한 타입 체크

### 커밋 컨벤션
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 추가
chore: 빌드 설정 등
```

### 브랜치 전략
- **main**: 프로덕션 브랜치
- **develop**: 개발 브랜치
- **feature/***: 기능 개발 브랜치
- **hotfix/***: 긴급 수정 브랜치

## 📋 요구사항

### 시스템 요구사항
- **Node.js**: 18.0.0 이상
- **npm**: 9.0.0 이상
- **브라우저**: Chrome, Firefox, Safari, Edge 최신 버전

### 개발 환경
- **IDE**: VS Code (권장)
- **확장 프로그램**: TypeScript, ESLint, Prettier
- **Git**: 버전 관리

## 🚀 배포

### 로컬 배포
```bash
# 빌드
npm run build:all

# 정적 파일 서빙
npm run preview
```

### 서버 배포
```bash
# 서버 빌드
npm run build:server

# 서버 배포
npm run deploy:server
```

## 📚 문서

- [프론트엔드 문서](./fe/README.md)
- [공통 패키지 문서](./packages/common/README.md)
- [API 스펙](./01.references/openapi-v0.0.3.yaml)
- [Figma 디자인](./01.references/figma_designs/)

## 🤝 기여하기

1. 이슈를 생성하거나 기존 이슈에 댓글을 남겨주세요
2. 포크를 생성하고 브랜치를 만드세요
3. 변경사항을 커밋하세요
4. 풀 리퀘스트를 생성하세요

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 생성해주세요.
