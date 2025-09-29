# IITP DABT Platform - Frontend

IITP 장애인 데이터 탐색 및 활용 플랫폼의 프론트엔드 애플리케이션입니다.

## 📁 프로젝트 구조

```
fe/src/
├── api/                          # API 관련 모든 기능
│   ├── index.ts                  # API 모듈 진입점
│   ├── client.ts                 # API 클라이언트 (fetch 래퍼)
│   ├── errorHandler.ts           # 공통 에러 처리
│   ├── services/                 # API 서비스 레이어
│   │   ├── index.ts
│   │   ├── dataService.ts        # 데이터 API 서비스
│   │   ├── selfCheckService.ts   # 자가진단 API 서비스
│   │   └── commonService.ts      # 공통 API 서비스
│   └── hooks/                    # API 관련 훅들
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
├── config/                       # 설정 파일
│   └── api.ts                    # API 설정 (레거시)
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

### 1. 훅을 사용한 API 호출 (권장)

```typescript
import { useLatestData, useThemeCounts, useDataSearch } from '../api/hooks';

function MyComponent() {
  // 최신 데이터 조회
  const { data: latestData, loading, error } = useLatestData({ limit: 6 });
  
  // 테마별 건수 조회
  const { data: themeCounts } = useThemeCounts();
  
  // 데이터 검색
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
    // 데이터 서비스 사용
    const latestData = await dataService.getLatestData({ limit: 10 });
    const themeCounts = await dataService.getThemeCounts();
    
    // 자가진단 서비스 사용
    const policies = await selfCheckService.getPolicies({
      themes: 'phy,emo',
      page: 1,
      pageSize: 10
    });
    
    console.log('API 결과:', { latestData, themeCounts, policies });
  } catch (error) {
    // 에러는 자동으로 ErrorAlert로 표시됨
    console.error('API 호출 실패:', error);
  }
}
```

### 3. 자가진단 API 사용

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

### 1. 타입 안전한 API 호출

- `mapping.ts`를 통한 API URL과 타입 자동 연결
- 컴파일 타임에 API 호출 오류 방지
- IDE에서 자동완성 지원

### 2. 자동 에러 처리

- 모든 API 에러가 자동으로 `ErrorAlert`로 표시
- 사용자가 확인 버튼을 눌러야 사라짐
- 에러 타입별로 다른 스타일 적용

### 3. 일관된 API 구조

- 모든 API가 동일한 패턴으로 처리
- 훅과 서비스를 통한 코드 재사용
- 명확한 책임 분리

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

### 환경 변수

```env
# .env.local
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_OPEN_API_CENTER_URL=https://api-center.example.com
VITE_VISUAL_TOOL=https://visual-tool.example.com
VITE_EMPLOYMENT_SITE_URL=https://employment.example.com
```

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
