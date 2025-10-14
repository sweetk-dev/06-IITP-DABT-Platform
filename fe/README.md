# IITP DABT Platform - Frontend

IITP 장애인 데이터 탐색 및 활용 플랫폼의 프론트엔드 애플리케이션입니다.

## 🎯 핵심 특징

- **완전한 모듈화**: `@iitp-dabt-platform/common` 패키지의 모든 API 타입, 상수, 에러 코드 완전 활용
- **타입 안전성**: TypeScript를 통한 컴파일 타임 타입 체크
- **일관된 API 처리**: 단일 API 클라이언트로 모든 API 호출 통합
- **하드코딩 제거**: 모든 상수와 타입을 common 패키지에서 가져옴
- **중복 코드 제거**: 재사용 가능한 서비스와 훅으로 코드 중복 최소화

## 📁 프로젝트 구조

```
fe/src/
├── api/                          # API 관련 모든 기능 (common 패키지 완전 활용)
│   ├── index.ts                  # API 모듈 진입점
│   ├── client.ts                 # API 클라이언트 (fetch 래퍼, API_MAPPING 활용)
│   ├── errorHandler.ts           # 공통 에러 처리 (ErrorCode, ErrorMetaMap 활용)
│   ├── services/                 # API 서비스 레이어 (API_URLS, REQ/RES DTO 활용)
│   │   ├── index.ts
│   │   ├── dataService.ts        # 데이터 API 서비스
│   │   ├── selfCheckService.ts   # 자가진단 API 서비스
│   │   └── commonService.ts      # 공통 API 서비스
│   └── hooks/                    # API 관련 훅들 (common 타입 활용)
│       ├── index.ts
│       ├── useDataApi.ts         # 데이터 API 훅들
│       ├── useSelfCheckApi.ts    # 자가진단 API 훅들
│       └── useCommonApi.ts       # 공통 API 훅들
├── components/                   # React 컴포넌트
│   ├── layout/                   # 레이아웃 컴포넌트
│   └── ui/                       # UI 컴포넌트
│       ├── ErrorAlert.tsx        # 에러 알림 컴포넌트
│       └── ...
├── hooks/                        # 커스텀 훅
│   ├── useErrorHandler.ts        # 에러 처리 훅
│   └── useRouteChange.ts         # 라우트 변경 훅
├── pages/                        # 페이지 컴포넌트
│   ├── App.tsx                   # 메인 앱 컴포넌트
│   ├── Home.tsx                  # 홈 페이지
│   ├── DataList.tsx              # 데이터 목록 페이지
│   ├── DataDetail.tsx            # 데이터 상세 페이지
│   ├── DataSearch.tsx            # 데이터 검색 페이지
│   ├── Info.tsx                  # 정보 페이지
│   └── self-check/               # 자가진단 관련 페이지
│       ├── SelfCheckStart.tsx
│       ├── SelfCheckIdentity.tsx
│       ├── SelfCheckQuestions.tsx
│       ├── SelfCheckResult.tsx
│       └── SelfCheckMore.tsx
├── styles/                       # 스타일 파일
│   ├── globals.css               # 전역 스타일
│   ├── components.css            # 컴포넌트 스타일
│   └── data-pages.css            # 데이터 페이지 스타일
├── types/                        # 타입 정의
│   └── common.ts                 # 공통 타입
├── config/                       # 설정 파일 (통합됨)
└── examples/                     # 사용 예시
    └── ApiUsageExample.tsx       # API 사용 예시
```

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.0.0 이상
- npm 9.0.0 이상

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 미리보기
npm run preview
```

## 🔧 API 사용법

### 🎯 완전한 모듈화된 API 구조

모든 API 호출은 `@iitp-dabt-platform/common` 패키지의 타입과 상수를 완전히 활용합니다:

- **API_URLS**: 모든 API 엔드포인트
- **API_MAPPING**: 요청/응답 타입 매핑
- **REQ/RES DTO**: 모든 API 요청/응답 타입
- **ErrorCode, ErrorMetaMap**: 에러 처리
- **Constants**: 모든 상수 (THEME_CONSTANTS, DATA_TYPE_CONSTANTS 등)

### 1. 훅을 사용한 API 호출 (권장)

```typescript
import { useLatestData, useThemeCounts, useDataSearch } from '../api/hooks';

function MyComponent() {
  // 최신 데이터 조회 (common 패키지의 DataLatestQuery 타입 사용)
  const { data: latestData, loading, error } = useLatestData({ limit: 6 });
  
  // 테마별 건수 조회 (common 패키지의 DataThemeCountsRes 타입 사용)
  const { data: themeCounts } = useThemeCounts();
  
  // 데이터 검색 (common 패키지의 DataSearchQuery 타입 사용)
  const { data: searchResults, execute: search } = useDataSearch({
    q: '장애인',
    themes: 'phy,emo',
    page: 1,
    pageSize: 20
  });

  return (
    <div>
      {loading && <div>로딩 중...</div>}
      {error && <div>에러: {error}</div>}
      {latestData && (
        <ul>
          {latestData.map((item, index) => (
            <li key={index}>{item.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### 2. 서비스를 사용한 직접 API 호출

```typescript
import { dataService, selfCheckService } from '../api/services';

async function handleApiCall() {
  try {
    // 데이터 서비스 사용 (common 패키지의 API_URLS와 타입 활용)
    const latestData = await dataService.getLatestData({ limit: 10 });
    const themeCounts = await dataService.getThemeCounts();
    
    // 자가진단 서비스 사용 (common 패키지의 타입 활용)
    const policies = await selfCheckService.getPolicies({
      themes: 'phy,emo',
      page: 1,
      pageSize: 10
    });
    
    console.log('API 결과:', { latestData, themeCounts, policies });
  } catch (error) {
    // 에러는 자동으로 ErrorAlert로 표시됨 (common 패키지의 ErrorCode 활용)
    console.error('API 호출 실패:', error);
  }
}
```

### 3. API 클라이언트 직접 사용 (고급)

```typescript
import { apiClient } from '../api/client';
import { API_URLS } from '@iitp-dabt-platform/common';

async function directApiCall() {
  try {
    // API 클라이언트 직접 사용 (API_MAPPING을 통한 완전한 타입 안전성)
    const data = await apiClient.get(`GET ${API_URLS.DATA.SUMMARY.LATEST}`, {
      query: { limit: 6 }
    });
    
    console.log('API 결과:', data);
  } catch (error) {
    console.error('API 호출 실패:', error);
  }
}
```

### 4. 자가진단 API 사용

```typescript
import { useRecommendations, usePolicies } from '../api/hooks';

function SelfCheckComponent() {
  // 추천 정책 조회
  const { data: recommendations } = useRecommendations({
    gender: 'male',
    disLevel: 'mild',
    ageCond: 'adult',
    themes: 'phy,emo',
    limit: 3
  });
  
  // 정책 목록 조회
  const { data: policies } = usePolicies({
    themes: 'phy,emo',
    page: 1,
    pageSize: 10
  });

  return (
    <div>
      <h3>추천 정책</h3>
      {recommendations?.map((policy, index) => (
        <div key={index}>{policy.policy_name}</div>
      ))}
    </div>
  );
}
```

## 🎯 주요 기능

### 1. 완전한 모듈화

- `@iitp-dabt-platform/common` 패키지의 모든 타입과 상수 활용
- 하드코딩 완전 제거
- 중복 코드 제거로 유지보수성 향상

### 2. 타입 안전한 API 호출

- `API_MAPPING`을 통한 API URL과 타입 자동 연결
- 컴파일 타임에 API 호출 오류 방지
- IDE에서 자동완성 지원
- `body`, `params`, `query` 구분으로 명확한 요청 구조

### 3. 통합된 에러 처리

- `ErrorCode`와 `ErrorMetaMap`을 활용한 일관된 에러 처리
- 모든 API 에러가 자동으로 `ErrorAlert`로 표시
- 사용자가 확인 버튼을 눌러야 사라짐
- 에러 타입별로 다른 스타일 적용

### 4. 일관된 API 구조

- 모든 API가 동일한 패턴으로 처리
- 훅과 서비스를 통한 코드 재사용
- 명확한 책임 분리
- 단일 API 클라이언트로 통합

## 📋 사용 가능한 API

### 데이터 API

- `useLatestData()` - 최신 데이터 리스트 조회
- `useThemeCounts()` - 자립테마 데이터 건수 조회
- `useTypeCounts()` - 데이터 유형별 데이터 건수 조회
- `useDataSearch()` - 데이터 검색
- `useThemes()` - 자립 테마 리스트 조회
- `useTypes()` - 데이터 유형 리스트 조회
- `useThemeItems()` - 자립 테마별 리스트 조회
- `useTypeItems()` - 데이터 유형별 리스트 조회
- `useDataDetail()` - 데이터 상세 정보 조회
- `useDataPreview()` - 데이터 미리보기 조회

### 자가진단 API

- `useRecommendations()` - 추천 정책 리스트 조회
- `usePolicies()` - 자립 지원 정책 리스트 조회
- `useProviders()` - 자립 지원 기관 리스트 조회
- `useFacilities()` - 자립 지원 시설 리스트 조회

### 공통 API

- `useHealth()` - 헬스 체크
- `useVersion()` - 버전 정보 조회

## 🎨 UI 컴포넌트

### ErrorAlert

전역 에러 알림 컴포넌트로, API 에러 발생 시 자동으로 표시됩니다.

```typescript
import { ErrorAlert } from '../components/ui/ErrorAlert';
import { useErrorHandler } from '../hooks/useErrorHandler';

function App() {
  const { error, clearError } = useErrorHandler();
  
  return (
    <div>
      {/* 앱 내용 */}
      <ErrorAlert error={error} onClose={clearError} />
    </div>
  );
}
```

## 🔧 설정

### 환경 변수 ⚠️

**중요**: Frontend는 **빌드 시점에만** 환경변수가 필요합니다! (실행 시에는 불필요)

| 시점 | 환경변수 필요 | 방법 | 이유 |
|------|--------------|------|------|
| **빌드 시** | ✅ **필수** | shell export 또는 .env | Vite가 코드에 하드코딩 |
| **실행 시** | ❌ 불필요 | - | 이미 빌드된 정적 파일 |

#### 로컬 개발

로컬에서는 `.env` 파일 또는 `.env.local` 파일로 설정:

```bash
# env.sample을 복사하여 .env 생성
cp env.sample .env
vi .env

# 로컬 개발용 값으로 수정 (env.sample의 로컬 개발용 주석 해제)
# VITE_PORT=5173
# VITE_BASE=/
# VITE_API_BASE_URL=http://localhost:33000
# VITE_API_TIMEOUT=10000
# VITE_VISUAL_TOOL=http://localhost:3000/
# VITE_EMPLOYMENT_SITE_URL=https://www.ablejob.co.kr/
# VITE_OPEN_API_CENTER_URL=http://192.168.60.142/adm/
# VITE_OPEN_API_CENTER_ABOUT_URL=http://192.168.60.142/adm/about
```

#### 프로덕션 빌드

프로덕션 빌드 시에는 **빌드 서버에서 fe/.env 파일 생성** (권장):

```bash
# 빌드 서버에서: fe/.env 생성 (최초 1회)
cd /home/iitp-plf/iitp-dabt-platform/source/fe
cp env.sample .env
vi .env

# env.sample에 프로덕션 빌드용 설정이 기본값으로 되어 있음 (기본: /hub)
# 필요 시 서버 주소만 수정:
# VITE_VISUAL_TOOL=http://실제서버주소:포트/
# VITE_OPEN_API_CENTER_URL=http://실제서버주소/adm/
# VITE_OPEN_API_CENTER_ABOUT_URL=http://실제서버주소/adm/about
```

또는 **shell 환경변수로 export**도 가능:

```bash
# 빌드 전 환경변수 export (모든 변수 설정)
export VITE_PORT=5173
export VITE_BASE=/hub/
export VITE_API_BASE_URL=/hub
export VITE_API_TIMEOUT=10000
export VITE_VISUAL_TOOL=http://실제서버주소:포트/
export VITE_EMPLOYMENT_SITE_URL=https://www.ablejob.co.kr/
export VITE_OPEN_API_CENTER_URL=http://실제서버주소/adm/
export VITE_OPEN_API_CENTER_ABOUT_URL=http://실제서버주소/adm/about

# 빌드 실행
npm run build
```

**프로덕션 주의사항**:
- ✅ **권장**: 빌드 서버의 `fe/.env` 파일 생성 (env.sample 참고)
- ✅ **대안**: shell 환경변수 export
- ❌ 실행 서버(프로덕션)의 FE 디렉토리에는 `.env` 불필요 (이미 빌드된 정적 파일)
- ✅ Vite가 빌드 시 환경변수를 코드에 하드코딩하므로 런타임 변경 불가
- 🔧 `VITE_API_BASE_URL=/hub` (not `/hub/api`) - FE 코드가 `/api/v1/...`을 자동으로 추가

#### 환경변수 목록

| 변수명 | 설명 | 로컬 개발 | 프로덕션 (단독) | 프로덕션 (복합) | 사용 위치 |
|--------|------|-----------|----------------|----------------|----------|
| `VITE_PORT` | 개발 서버 포트 | `5173` | `5173` | `5173` | vite.config.ts |
| `VITE_BASE` | 베이스 경로 | `/` | `/` | `/hub/` | vite.config.ts |
| `VITE_API_BASE_URL` | API 베이스 URL | `http://localhost:33000` | `http://서버` | `/hub` | api/client.ts |
| `VITE_API_TIMEOUT` | API 타임아웃 (ms) | `10000` | `10000` | `10000` | api/client.ts |
| `VITE_API_DATA_PREVIEW_LIMIT` | 데이터 미리보기 제한 | `10` | `10` | `10` | (향후 사용) |
| `VITE_VISUAL_TOOL` | 시각화 도구 URL | `http://localhost:3000/` | `http://서버:포트/` | `http://서버:포트/` | DataDetail.tsx |
| `VITE_EMPLOYMENT_SITE_URL` | 구인구직 사이트 URL | `https://www.ablejob.co.kr/` | `https://www.ablejob.co.kr/` | `https://www.ablejob.co.kr/` | Home.tsx |
| `VITE_OPEN_API_CENTER_URL` | Open API 센터 URL | `http://192.168.60.142/adm/` | `http://서버/admin/` | `http://서버/adm/` | DataDetail.tsx |
| `VITE_OPEN_API_CENTER_ABOUT_URL` | Open API 센터 소개 | `http://192.168.60.142/adm/about` | `http://서버/admin/about` | `http://서버/adm/about` | DataDetail.tsx (Modal helpText) |

### API 설정

API 관련 설정은 `packages/common` 패키지에서 관리됩니다:

- `API_URLS` - API 엔드포인트 정의
- `API_MAPPING` - API URL과 타입 매핑
- `ErrorCode` - 에러 코드 정의

## 🚀 개발 가이드

### 새로운 API 추가

1. `packages/common/src/types/api/` 에 REQ/RES 타입 정의
2. `packages/common/src/types/api/mapping.ts` 에 API 매핑 추가
3. `fe/src/api/services/` 에 서비스 메서드 추가
4. `fe/src/api/hooks/` 에 훅 추가

### 에러 처리

모든 API 에러는 자동으로 `ErrorAlert`로 표시됩니다. 추가적인 에러 처리가 필요한 경우:

```typescript
import { apiErrorHandler } from '../api/errorHandler';

// 커스텀 에러 표시
apiErrorHandler.showError({
  code: ErrorCode.VALIDATION_ERROR,
  message: '사용자 정의 에러 메시지',
  details: { field: 'email' }
});
```

## 📚 참고 자료

- [React 공식 문서](https://react.dev/)
- [TypeScript 공식 문서](https://www.typescriptlang.org/)
- [Vite 공식 문서](https://vitejs.dev/)
- [Common 패키지 README](../../packages/common/README.md)

## 🤝 기여하기

1. 이슈를 생성하거나 기존 이슈에 댓글을 남겨주세요
2. 포크를 생성하고 브랜치를 만드세요
3. 변경사항을 커밋하세요
4. 풀 리퀘스트를 생성하세요

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.
