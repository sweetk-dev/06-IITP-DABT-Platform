# @iitp-dabt-platform/common

IITP DABT Platform의 공통 타입, 상수, API 정의를 담은 패키지입니다.

## 📁 패키지 구조

```
packages/common/src/
├── index.ts                      # 패키지 진입점
└── types/                        # 타입 정의
    ├── index.ts                  # 타입 모듈 진입점
    ├── constants.ts              # 상수 정의
    ├── errorCodes.ts             # 에러 코드 정의
    ├── selfcheck-logic.ts        # 자가진단 로직 및 상수
    └── api/                      # API 관련 타입
        ├── api.ts                # 기본 API URL 및 공통 타입
        ├── common.ts             # 공통 API 타입
        ├── data.ts               # 데이터 API 타입
        ├── selfcheck.ts          # 자가진단 API 타입
        └── mapping.ts            # API 매핑 테이블
```

## 🚀 설치 및 사용

### 설치

```bash
npm install @iitp-dabt-platform/common
```

### 사용

```typescript
// 모든 타입과 상수 import
import { 
  THEME_CONSTANTS, 
  DATA_TYPE_CONSTANTS,
  SELF_CHECK_CONSTANTS,
  API_URLS,
  API_MAPPING,
  ErrorCode
} from '@iitp-dabt-platform/common';

// 특정 모듈만 import
import { THEME_CONSTANTS } from '@iitp-dabt-platform/common/types/constants';
import { API_URLS } from '@iitp-dabt-platform/common/types/api';
```

## 📋 주요 기능

### 1. 상수 정의

#### 자립 테마 상수

```typescript
import { THEME_CONSTANTS, type ThemeCode } from '@iitp-dabt-platform/common';

// 테마 코드
const theme: ThemeCode = 'phy'; // 'phy' | 'emo' | 'econ' | 'soc'

// 테마 정보 조회
const themeInfo = THEME_CONSTANTS.THEMES.phy;
console.log(themeInfo.name); // '신체적 자립'
console.log(themeInfo.description); // '신체적 자립 수준 및 건강 상태 등...'

// 모든 테마 코드
const allThemes = THEME_CONSTANTS.ALL_CODES; // ['phy', 'emo', 'econ', 'soc']
```

#### 데이터 유형 상수

```typescript
import { DATA_TYPE_CONSTANTS, type DataTypeCode } from '@iitp-dabt-platform/common';

// 데이터 유형 코드
const dataType: DataTypeCode = 'basic'; // 'basic' | 'poi' | 'emp'

// 데이터 유형 정보 조회
const typeInfo = DATA_TYPE_CONSTANTS.DATA_TYPES.basic;
console.log(typeInfo.name); // '기초 데이터'
```

#### 자가진단 상수

```typescript
import { SELF_CHECK_CONSTANTS } from '@iitp-dabt-platform/common';

// 문항당 소요시간
const timePerQuestion = SELF_CHECK_CONSTANTS.TIME_PER_QUESTION; // 20초

// 총 문항 수
const totalQuestions = SELF_CHECK_CONSTANTS.TOTAL_QUESTIONS.TOTAL; // 35문항

// 영역별 문항 수
const physQuestions = SELF_CHECK_CONSTANTS.QUESTIONS_PER_AREA.phys; // 8문항

// 점수 범위
const minScore = SELF_CHECK_CONSTANTS.SCORE.MIN; // 1점
const maxScore = SELF_CHECK_CONSTANTS.SCORE.MAX; // 5점
```

### 2. API 정의

#### API URL 상수

```typescript
import { API_URLS } from '@iitp-dabt-platform/common';

// 공통 API
const healthUrl = API_URLS.COMMON.HEALTH_CHECK; // '/health'
const versionUrl = API_URLS.COMMON.VERSION; // '/version'

// 데이터 API
const latestDataUrl = API_URLS.DATA.SUMMARY.LATEST; // '/summary/latest'
const searchUrl = API_URLS.DATA.SEARCH; // '/search'

// 자가진단 API
const recommendationsUrl = API_URLS.SELF_CHK.RECOMMENDATIONS; // '/recommendations'
const policiesUrl = API_URLS.SELF_CHK.POLICIES; // '/policies'
```

#### API 매핑 테이블

```typescript
import { API_MAPPING, type ExtractReqType, type ExtractResType } from '@iitp-dabt-platform/common';

// API URL을 키로 사용하여 타입 추론
type HealthReq = ExtractReqType<'GET /api/v1/health'>; // CommonHealthReq
type HealthRes = ExtractResType<'GET /api/v1/health'>; // CommonHealthRes

// API 매핑 정보 조회
const healthMapping = API_MAPPING['GET /api/v1/health'];
console.log(healthMapping.description); // '헬스 체크'
console.log(healthMapping.req); // 'CommonHealthReq'
console.log(healthMapping.res); // 'CommonHealthRes'
```

### 3. 에러 코드

```typescript
import { ErrorCode, ErrorMetaMap } from '@iitp-dabt-platform/common';

// 에러 코드 사용
const errorCode = ErrorCode.VALIDATION_ERROR;

// 에러 메타데이터 조회
const errorMeta = ErrorMetaMap[ErrorCode.VALIDATION_ERROR];
console.log(errorMeta.message); // '입력 데이터가 올바르지 않습니다.'
console.log(errorMeta.statusCode); // 400
```

### 4. 자가진단 로직

```typescript
import { 
  SELF_CHECK_QUESTIONS,
  IDENTITY_QUESTIONS,
  calculateSelfCheckResult,
  type SelfCheckResponse,
  type IdentityResponse
} from '@iitp-dabt-platform/common';

// 본인 확인 문항
const identityQuestions = IDENTITY_QUESTIONS;

// 자가진단 문항
const physQuestions = SELF_CHECK_QUESTIONS.phys;

// 자가진단 결과 계산
const responses: SelfCheckResponse = {
  PI1: 4,
  PI2: 3,
  // ... 기타 응답
};

const userInfo: IdentityResponse = {
  is_person_with_disability: 'yes',
  gender: 'male',
  disability_level: 'mild',
  age_group: 'adult'
};

const result = calculateSelfCheckResult(responses, userInfo);
console.log(result.areaScores); // 영역별 점수
console.log(result.deficientAreas); // 미달 영역
console.log(result.recommendedPolicies); // 추천 정책
```

## 🔧 API 타입 정의

### 데이터 API 타입

```typescript
// 최신 데이터 리스트
interface DataLatestReq {
  limit?: number; // 기본: 6, 최대: 12
}

interface DataLatestItem {
  id: number;
  title: string;
  data_type: DataTypeCode;
  sys_tbl_id: string;
  src_org_name: string;
  sys_data_reg_dt: string;
}

// 데이터 검색
interface DataSearchReq {
  q?: string; // title 검색
  themes?: string; // 콤마분리 예: phy,emo
  types?: string; // 콤마분리 예: basic,poi
  page?: number;
  pageSize?: number;
  sort?: 'recent' | 'alpha';
}
```

### 자가진단 API 타입

```typescript
// 추천 정책 조회
interface SelfCheckRecommendationsReq {
  gender?: GenderCode;
  disLevel?: DisLevelCode;
  ageCond?: AgeCondCode;
  themes?: string; // 콤마분리
  limit?: number; // 기본: 3, 최대: 10
}

// 정책 정보
interface SelfCheckPolicyItem {
  policy_id: number;
  category: string;
  policy_name: string;
  self_rlty_type?: SelfRelTypeCode;
  region?: string;
  gender?: string;
  age_cond?: string;
  dis_level?: string;
  fin_cond?: string;
  link?: string;
}
```

## 🎯 사용 예시

### FE에서 사용

```typescript
// React 컴포넌트에서 사용
import { useLatestData, useThemeCounts } from '../api/hooks';
import { THEME_CONSTANTS } from '@iitp-dabt-platform/common';

function HomePage() {
  const { data: latestData, loading } = useLatestData({ limit: 6 });
  const { data: themeCounts } = useThemeCounts();

  return (
    <div>
      <h1>IITP DABT Platform</h1>
      {loading ? (
        <div>로딩 중...</div>
      ) : (
        <div>
          {latestData?.map((item, index) => (
            <div key={index}>
              <h3>{item.title}</h3>
              <p>{item.src_org_name}</p>
            </div>
          ))}
        </div>
      )}
      
      <div>
        <h2>테마별 데이터 건수</h2>
        {Object.entries(THEME_CONSTANTS.THEMES).map(([code, info]) => (
          <div key={code}>
            {info.name}: {themeCounts?.[code as keyof typeof themeCounts]}건
          </div>
        ))}
      </div>
    </div>
  );
}
```

### BE에서 사용

```typescript
// Express 라우터에서 사용
import { API_MAPPING, ErrorCode } from '@iitp-dabt-platform/common';

app.get('/api/v1/health', (req, res) => {
  const mapping = API_MAPPING['GET /api/v1/health'];
  console.log(`API: ${mapping.description}`);
  
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 에러 처리
app.use((err, req, res, next) => {
  const errorCode = ErrorCode.INTERNAL_SERVER_ERROR;
  const errorMeta = ErrorMetaMap[errorCode];
  
  res.status(errorMeta.statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: errorMeta.message
    }
  });
});
```

## 🔄 버전 관리

이 패키지는 시맨틱 버저닝을 따릅니다:

- **MAJOR**: 호환되지 않는 API 변경
- **MINOR**: 하위 호환되는 기능 추가
- **PATCH**: 하위 호환되는 버그 수정

## 📚 참고 자료

- [TypeScript 공식 문서](https://www.typescriptlang.org/)
- [IITP DABT Platform 메인 README](../../README.md)
- [Frontend README](../fe/README.md)

## 🤝 기여하기

1. 이슈를 생성하거나 기존 이슈에 댓글을 남겨주세요
2. 포크를 생성하고 브랜치를 만드세요
3. 변경사항을 커밋하세요
4. 풀 리퀘스트를 생성하세요

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.
