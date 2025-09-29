// API 매핑 테이블 - 모든 API의 REQ/RES 타입을 명시적으로 연결
import { API_URLS } from './api.js';

/**
 * API 요청 타입 정의
 * body: POST/PUT/PATCH 요청의 본문 데이터
 * params: URL 경로 파라미터 (예: /users/{id}에서 {id})
 * query: URL 쿼리 파라미터 (예: ?page=1&size=10)
 */
export interface ApiRequest {
  body?: string;    // 요청 본문 타입
  params?: string;  // 경로 파라미터 타입
  query?: string;   // 쿼리 파라미터 타입
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
    res: 'CommonHealthRes',
    description: '헬스 체크'
  },
  [`GET ${API_URLS.COMMON.VERSION}`]: {
    req: {
      body: 'void',
      params: 'void',
      query: 'void'
    } as ApiRequest,
    res: 'CommonVersionRes',
    description: '버전 정보 조회'
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
    res: 'DataLatestRes',
    description: '최신 데이터 리스트 6개 조회'
  },
  [`GET ${API_URLS.DATA.COUNTS.THEMES}`]: {
    req: {
      body: 'void',
      params: 'void',
      query: 'void'
    } as ApiRequest,
    res: 'DataThemeCountsRes',
    description: '자립테마 데이터 건수 조회'
  },
  [`GET ${API_URLS.DATA.COUNTS.TYPES}`]: {
    req: {
      body: 'void',
      params: 'void',
      query: 'void'
    } as ApiRequest,
    res: 'DataTypeCountsRes',
    description: '데이터 유형별 데이터 건수 조회'
  },
  [`GET ${API_URLS.DATA.SEARCH}`]: {
    req: {
      body: 'void',
      params: 'void',
      query: 'DataSearchQuery'
    } as ApiRequest,
    res: 'DataSearchRes',
    description: '자립 테마, 데이터 유형별 대상 검색 조회'
  },
  [`GET ${API_URLS.DATA.THEMES}`]: {
    req: {
      body: 'void',
      params: 'void',
      query: 'void'
    } as ApiRequest,
    res: 'DataThemesRes',
    description: '자립 테마 리스트 전체 조회'
  },
  [`GET ${API_URLS.DATA.TYPES}`]: {
    req: {
      body: 'void',
      params: 'void',
      query: 'void'
    } as ApiRequest,
    res: 'DataTypesRes',
    description: '데이터 유형 리스트 전체 조회'
  },
  // 동적 경로는 별도 처리 필요
  [`GET /api/v1/data/themes/{theme}/items`]: {
    req: {
      body: 'void',
      params: 'DataThemeItemsParams',
      query: 'DataThemeItemsQuery'
    } as ApiRequest,
    res: 'DataThemeItemsRes',
    description: '자립 테마별 리스트 조회'
  },
  [`GET /api/v1/data/types/{type}/items`]: {
    req: {
      body: 'void',
      params: 'DataTypeItemsParams',
      query: 'DataTypeItemsQuery'
    } as ApiRequest,
    res: 'DataTypeItemsRes',
    description: '데이터 유형별 리스트 조회'
  },
  [`GET /api/v1/data/{id}`]: {
    req: {
      body: 'void',
      params: 'DataDetailParams',
      query: 'void'
    } as ApiRequest,
    res: 'DataDetailRes',
    description: '데이터 테이블 상세 정보 조회'
  },
  [`GET /api/v1/data/{id}/preview`]: {
    req: {
      body: 'void',
      params: 'DataPreviewParams',
      query: 'DataPreviewQuery'
    } as ApiRequest,
    res: 'DataPreviewRes',
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
    res: 'SelfCheckRecommendationsRes',
    description: '추천 정책 리스트 조회'
  },
  [`GET ${API_URLS.SELF_CHK.POLICIES}`]: {
    req: {
      body: 'void',
      params: 'void',
      query: 'SelfCheckPoliciesQuery'
    } as ApiRequest,
    res: 'SelfCheckPoliciesRes',
    description: '자립 지원 정책 리스트 조회'
  },
  [`GET ${API_URLS.SELF_CHK.PROVIDERS}`]: {
    req: {
      body: 'void',
      params: 'void',
      query: 'SelfCheckProvidersQuery'
    } as ApiRequest,
    res: 'SelfCheckProvidersRes',
    description: '자립 지원 기관 리스트 조회'
  },
  [`GET ${API_URLS.SELF_CHK.FACILITIES}`]: {
    req: {
      body: 'void',
      params: 'void',
      query: 'SelfCheckFacilitiesQuery'
    } as ApiRequest,
    res: 'SelfCheckFacilitiesRes',
    description: '자립 지원 시설 리스트 조회'
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
export type ExtractResType<T extends ApiMappingKey> = typeof API_MAPPING[T]['res'];

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
export type ExtractQueryType<T extends ApiMappingKey> = typeof API_MAPPING[T]['req']['query'];
