// API 매핑 테이블 - 모든 API의 REQ/RES 타입을 명시적으로 연결
import { API_URLS, FULL_API_URLS } from './api.js';
import type { 
  CommonHealthRes, 
  CommonVersionRes 
} from './common.js';
import type {
  DataLatestRes,
  DataThemeCountsRes,
  DataTypeCountsRes,
  DataSearchRes,
  DataThemesRes,
  DataTypesRes,
  DataThemeItemsRes,
  DataTypeItemsRes,
  DataDetailRes,
  DataPreviewRes
} from './data.js';
import type {
  SelfCheckRecommendationsQuery,
  SelfCheckRecommendationsRes,
  SelfCheckPoliciesQuery,
  SelfCheckPoliciesRes,
  SelfCheckProvidersQuery,
  SelfCheckProvidersRes,
  SelfCheckFacilitiesQuery,
  SelfCheckFacilitiesRes
} from './selfcheck.js';
import type {
  DataLatestQuery,
  DataSearchQuery,
  DataThemeItemsQuery,
  DataThemeItemsParams,
  DataTypeItemsQuery,
  DataTypeItemsParams,
  DataDetailParams,
  DataPreviewQuery,
  DataPreviewParams
} from './data.js';

/**
 * API 요청 타입 정의
 * body: POST/PUT/PATCH 요청의 본문 데이터
 * params: URL 경로 파라미터 (예: /users/{id}에서 {id})
 * query: URL 쿼리 파라미터 (예: ?page=1&size=10)
 */
export interface ApiRequest<B = any, P = any, Q = any> {
  body?: B | 'void';    // 요청 본문 타입
  params?: P | 'void';  // 경로 파라미터 타입
  query?: Q | 'void';   // 쿼리 파라미터 타입
}

/**
 * API 매핑 항목 타입 정의
 */
export interface ApiMappingItem<R = any, B = any, P = any, Q = any> {
  req: ApiRequest<B, P, Q>;
  res: R;  // 실제 응답 타입
  description: string;
  fullUrl?: string;  // 완전한 URL (FULL_API_URLS에서 가져온 값)
}

/**
 * 전체 API 매핑 테이블
 * API URL과 Request/Response 타입을 명시적으로 연결
 * REQ는 body, params, query로 구분하여 정의
 */
export const API_MAPPING = {
  // ============================================================================
  // Common APIs
  // ============================================================================
  [`GET ${API_URLS.COMMON.HEALTH_CHECK}`]: {
    req: {
      body: 'void',
      params: 'void',
      query: 'void'
    } as ApiRequest,
    res: {} as CommonHealthRes,
    description: '헬스 체크',
    fullUrl: FULL_API_URLS.COMMON.HEALTH_CHECK
  },
  [`GET ${API_URLS.COMMON.VERSION}`]: {
    req: {
      body: 'void',
      params: 'void',
      query: 'void'
    } as ApiRequest,
    res: {} as CommonVersionRes,
    description: '버전 정보 조회',
    fullUrl: FULL_API_URLS.COMMON.VERSION
  },

  // ============================================================================
  // Data APIs
  // ============================================================================
  [`GET ${API_URLS.DATA.SUMMARY.LATEST}`]: {
    req: {
      body: 'void',
      params: 'void',
      query: 'DataLatestQuery'
    } as ApiRequest,
    res: {} as DataLatestRes,
    description: '최신 데이터 리스트 6개 조회',
    fullUrl: FULL_API_URLS.DATA.LATEST
  },
  [`GET ${API_URLS.DATA.COUNTS.THEMES}`]: {
    req: {
      body: 'void',
      params: 'void',
      query: 'void'
    } as ApiRequest,
    res: {} as DataThemeCountsRes,
    description: '자립테마 데이터 건수 조회',
    fullUrl: FULL_API_URLS.DATA.THEME_COUNTS
  },
  [`GET ${API_URLS.DATA.COUNTS.TYPES}`]: {
    req: {
      body: 'void',
      params: 'void',
      query: 'void'
    } as ApiRequest,
    res: {} as DataTypeCountsRes,
    description: '데이터 유형별 데이터 건수 조회',
    fullUrl: FULL_API_URLS.DATA.TYPE_COUNTS
  },
  [`GET ${API_URLS.DATA.SEARCH}`]: {
    req: {
      body: 'void',
      params: 'void',
      query: 'DataSearchQuery'
    } as ApiRequest,
    res: {} as DataSearchRes,
    description: '자립 테마, 데이터 유형별 대상 검색 조회',
    fullUrl: FULL_API_URLS.DATA.SEARCH
  },
  [`GET ${API_URLS.DATA.THEMES}`]: {
    req: {
      body: 'void',
      params: 'void',
      query: 'void'
    } as ApiRequest,
    res: {} as DataThemesRes,
    description: '자립 테마 리스트 전체 조회',
    fullUrl: FULL_API_URLS.DATA.THEMES
  },
  [`GET ${API_URLS.DATA.TYPES}`]: {
    req: {
      body: 'void',
      params: 'void',
      query: 'void'
    } as ApiRequest,
    res: {} as DataTypesRes,
    description: '데이터 유형 리스트 전체 조회',
    fullUrl: FULL_API_URLS.DATA.TYPES
  },
  // 전체 테마 아이템 조회
  [`GET ${API_URLS.DATA.THEMES_ITEMS_ALL}`]: {
    req: {
      body: 'void',
      params: 'void',
      query: 'DataThemeItemsQuery'
    } as ApiRequest,
    res: {} as DataThemeItemsRes,
    description: '전체 테마 데이터 아이템 조회',
    fullUrl: FULL_API_URLS.DATA.THEMES_ITEMS_ALL
  },
  // 특정 테마 아이템 조회
  [`GET ${API_URLS.DATA.THEME_ITEMS('{theme}')}`]: {
    req: {
      body: 'void',
      params: 'DataThemeItemsParams',
      query: 'DataThemeItemsQuery'
    } as ApiRequest,
    res: {} as DataThemeItemsRes,
    description: '자립 테마별 리스트 조회'
  },
  // 전체 유형 아이템 조회
  [`GET ${API_URLS.DATA.TYPES_ITEMS_ALL}`]: {
    req: {
      body: 'void',
      params: 'void',
      query: 'DataTypeItemsQuery'
    } as ApiRequest,
    res: {} as DataTypeItemsRes,
    description: '전체 유형 데이터 아이템 조회',
    fullUrl: FULL_API_URLS.DATA.TYPES_ITEMS_ALL
  },
  // 특정 유형 아이템 조회
  [`GET ${API_URLS.DATA.TYPE_ITEMS('{type}')}`]: {
    req: {
      body: 'void',
      params: 'DataTypeItemsParams',
      query: 'DataTypeItemsQuery'
    } as ApiRequest,
    res: {} as DataTypeItemsRes,
    description: '데이터 유형별 리스트 조회'
  },
  [`GET ${API_URLS.DATA.DETAIL('{id}' as any)}`]: {
    req: {
      body: 'void',
      params: 'DataDetailParams',
      query: 'void'
    } as ApiRequest,
    res: {} as DataDetailRes,
    description: '데이터 테이블 상세 정보 조회'
  },
  [`GET ${API_URLS.DATA.PREVIEW('{id}' as any)}`]: {
    req: {
      body: 'void',
      params: 'DataPreviewParams',
      query: 'DataPreviewQuery'
    } as ApiRequest,
    res: {} as DataPreviewRes,
    description: '데이터 테이블별 미리보기 데이터 조회'
  },

  // ============================================================================
  // Self Check APIs
  // ============================================================================
  [`GET ${API_URLS.SELF_CHK.RECOMMENDATIONS}`]: {
    req: {
      body: 'void',
      params: 'void',
      query: 'SelfCheckRecommendationsQuery'
    } as ApiRequest,
    res: {} as SelfCheckRecommendationsRes,
    description: '추천 정책 리스트 조회',
    fullUrl: FULL_API_URLS.SELF_CHK.RECOMMENDATIONS
  },
  [`GET ${API_URLS.SELF_CHK.POLICIES}`]: {
    req: {
      body: 'void',
      params: 'void',
      query: 'SelfCheckPoliciesQuery'
    } as ApiRequest,
    res: {} as SelfCheckPoliciesRes,
    description: '자립 지원 정책 리스트 조회',
    fullUrl: FULL_API_URLS.SELF_CHK.POLICIES
  },
  [`GET ${API_URLS.SELF_CHK.PROVIDERS}`]: {
    req: {
      body: 'void',
      params: 'void',
      query: 'SelfCheckProvidersQuery'
    } as ApiRequest,
    res: {} as SelfCheckProvidersRes,
    description: '자립 지원 기관 리스트 조회',
    fullUrl: FULL_API_URLS.SELF_CHK.PROVIDERS
  },
  [`GET ${API_URLS.SELF_CHK.FACILITIES}`]: {
    req: {
      body: 'void',
      params: 'void',
      query: 'SelfCheckFacilitiesQuery'
    } as ApiRequest,
    res: {} as SelfCheckFacilitiesRes,
    description: '자립 지원 시설 리스트 조회',
    fullUrl: FULL_API_URLS.SELF_CHK.FACILITIES
  },
} as const;

/**
 * API 매핑 타입 정의
 */
export type ApiMappingKey = keyof typeof API_MAPPING;
export type ApiMappingValue = typeof API_MAPPING[ApiMappingKey];

/**
 * API 매핑에서 요청 타입 추출 (body, params, query 구분)
 */
export type ExtractReqType<T extends ApiMappingKey> = typeof API_MAPPING[T]['req'];

/**
 * API 매핑에서 응답 타입 추출
 */
export type ExtractResType<T extends ApiMappingKey> = typeof API_MAPPING[T]['res'] extends infer R ? R : never;

/**
 * API 매핑에서 body 타입 추출
 */
export type ExtractBodyType<T extends ApiMappingKey> = typeof API_MAPPING[T]['req']['body'];

/**
 * API 매핑에서 params 타입 추출
 */
export type ExtractParamsType<T extends ApiMappingKey> = typeof API_MAPPING[T]['req']['params'];

/**
 * API 매핑에서 query 타입 추출
 */
export type ExtractQueryType<T extends ApiMappingKey> = typeof API_MAPPING[T]['req']['query'] extends infer Q 
  ? Q extends 'void' ? void 
  : Q extends 'SelfCheckRecommendationsQuery' ? SelfCheckRecommendationsQuery
  : Q extends 'SelfCheckPoliciesQuery' ? SelfCheckPoliciesQuery
  : Q extends 'SelfCheckProvidersQuery' ? SelfCheckProvidersQuery
  : Q extends 'SelfCheckFacilitiesQuery' ? SelfCheckFacilitiesQuery
  : Q extends 'DataLatestQuery' ? DataLatestQuery
  : Q extends 'DataSearchQuery' ? DataSearchQuery
  : Q extends 'DataThemeItemsQuery' ? DataThemeItemsQuery
  : Q extends 'DataTypeItemsQuery' ? DataTypeItemsQuery
  : Q extends 'DataPreviewQuery' ? DataPreviewQuery
  : Q
  : never;

// ============================================================================
// API 매핑 키 생성 유틸리티
// ============================================================================

/**
 * API 매핑 키를 동적으로 생성하는 유틸리티 함수들
 */
export const createApiKey = {
  common: {
    healthCheck: () => `GET ${API_URLS.COMMON.HEALTH_CHECK}` as ApiMappingKey,
    version: () => `GET ${API_URLS.COMMON.VERSION}` as ApiMappingKey,
  },
  data: {
    latest: () => `GET ${API_URLS.DATA.SUMMARY.LATEST}` as ApiMappingKey,
    themeCounts: () => `GET ${API_URLS.DATA.COUNTS.THEMES}` as ApiMappingKey,
    typeCounts: () => `GET ${API_URLS.DATA.COUNTS.TYPES}` as ApiMappingKey,
    search: () => `GET ${API_URLS.DATA.SEARCH}` as ApiMappingKey,
    themes: () => `GET ${API_URLS.DATA.THEMES}` as ApiMappingKey,
    types: () => `GET ${API_URLS.DATA.TYPES}` as ApiMappingKey,
    themeItems: (theme: string) => `GET /api/v1/data/themes/${theme}/items` as ApiMappingKey,
    typeItems: (type: string) => `GET /api/v1/data/types/${type}/items` as ApiMappingKey,
    detail: (id: number) => `GET /api/v1/data/${id}` as ApiMappingKey,
    preview: (id: number) => `GET /api/v1/data/${id}/preview` as ApiMappingKey,
  },
  selfCheck: {
    recommendations: () => `GET ${API_URLS.SELF_CHK.RECOMMENDATIONS}` as ApiMappingKey,
    policies: () => `GET ${API_URLS.SELF_CHK.POLICIES}` as ApiMappingKey,
    providers: () => `GET ${API_URLS.SELF_CHK.PROVIDERS}` as ApiMappingKey,
    facilities: () => `GET ${API_URLS.SELF_CHK.FACILITIES}` as ApiMappingKey,
  },
};
