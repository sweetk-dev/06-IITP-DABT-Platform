// 데이터 API Request/Response 타입 정의
import { 
  ThemeCode, 
  DataTypeCode, 
  SelfRltyTypeCode,
  PAGINATION_CONSTANTS,
  SortOption,
  SORT_CONSTANTS
} from '../constants.js';
import { PaginationReq, PaginationRes, SearchReq, SortReq } from './api.js';

// ============================================================================
// 최신 데이터 리스트 API
// ============================================================================

// Query 파라미터 (URL 쿼리)
export interface DataLatestQuery {
  limit?: number; // 기본: 6, 최대: 12
}

// 기본값 상수
export const DATA_LATEST_DEFAULTS = {
  LIMIT: 6,
  MAX_LIMIT: 12
} as const;

export interface DataLatestItem {
  id: number;
  title: string;
  data_type: DataTypeCode;
}

// ============================================================================
// 자립테마 데이터 건수 API
// ============================================================================

// ThemeCode를 Record로 동적 생성
export type DataThemeCountsRes = Record<ThemeCode, number>;

// ============================================================================
// 데이터 유형별 데이터 건수 API
// ============================================================================

// DataTypeCode를 Record로 동적 생성
export type DataTypeCountsRes = Record<DataTypeCode, number>;

// ============================================================================
// 데이터 검색 API
// ============================================================================

// Query 파라미터 (URL 쿼리)
export interface DataSearchQuery extends SearchReq, SortReq {
  q?: string; // title 검색
  themes?: string; // 콤마분리 예: phy,emo
  types?: string; // 콤마분리 예: basic,poi
  page?: number;
  pageSize?: number;
  sort?: SortOption;
}

// 기본값 상수
export const DATA_SEARCH_DEFAULTS = {
  PAGE: PAGINATION_CONSTANTS.DEFAULT_PAGE,
  PAGE_SIZE: PAGINATION_CONSTANTS.DEFAULT_PAGE_SIZE,
  SORT: SORT_CONSTANTS.DEFAULT
} as const;

export interface DataSearchItem {
  id: number;
  title: string;
  data_type: DataTypeCode;
  self_rlty_type?: SelfRltyTypeCode;
  category?: string;
  data_keywords?: string; // 콤마 구분 문자열, 최대 3개 (예: '키워드1,키워드2,키워드3')
  sys_tbl_id: string;
  src_org_name: string;
  src_latest_chn_dt: string;
  sys_data_reg_dt: string;
}

export type DataSearchRes = PaginationRes<DataSearchItem>;

// ============================================================================
// 자립 테마 리스트 API
// ============================================================================

export interface DataThemeItem {
  id: ThemeCode;
  name: string;
  description: string;
  total_count: number;
}

// ============================================================================
// 자립 테마별 리스트 API
// ============================================================================

// Params 파라미터 (URL 경로)
export interface DataThemeItemsParams {
  theme: ThemeCode; // URL 경로에서 추출
}

// Query 파라미터 (URL 쿼리)
export interface DataThemeItemsQuery extends PaginationReq, SortReq {
  page?: number;
  pageSize?: number;
  sort?: SortOption;
}

// 기본값 상수
export const DATA_THEME_ITEMS_DEFAULTS = {
  PAGE: PAGINATION_CONSTANTS.DEFAULT_PAGE,
  PAGE_SIZE: PAGINATION_CONSTANTS.DEFAULT_PAGE_SIZE,
  SORT: SORT_CONSTANTS.DEFAULT
} as const;

export type DataThemeItemsRes = PaginationRes<DataSearchItem>;

// ============================================================================
// 데이터 유형 리스트 API
// ============================================================================

export interface DataTypeItem {
  id: DataTypeCode;
  name: string;
  description: string;
  total_count: number;
}

// ============================================================================
// 데이터 유형별 리스트 API
// ============================================================================

// Params 파라미터 (URL 경로)
export interface DataTypeItemsParams {
  type: DataTypeCode; // URL 경로에서 추출
}

// Query 파라미터 (URL 쿼리)
export interface DataTypeItemsQuery extends PaginationReq, SortReq {
  page?: number;
  pageSize?: number;
  sort?: SortOption;
}

// 기본값 상수
export const DATA_TYPE_ITEMS_DEFAULTS = {
  PAGE: PAGINATION_CONSTANTS.DEFAULT_PAGE,
  PAGE_SIZE: PAGINATION_CONSTANTS.DEFAULT_PAGE_SIZE,
  SORT: SORT_CONSTANTS.DEFAULT
} as const;

export type DataTypeItemsRes = PaginationRes<DataSearchItem>;

// ============================================================================
// 데이터 상세 정보 API
// ============================================================================

// Params 파라미터 (URL 경로)
export interface DataDetailParams {
  id: number; // URL 경로에서 추출
}

export interface DataDetailRes {
  id: number;
  title: string;
  data_type: DataTypeCode;
  self_rlty_type?: SelfRltyTypeCode;
  category?: string;
  sys_tbl_id: string;
  data_desc?: string;
  data_keywords?: string; // 콤마 구분 문자열, 최대 3개 (예: '키워드1,키워드2,키워드3')
  data_format?: string;
  data_usage_scope?: string;
  src_org_name: string;
  src_latest_chn_dt: string;
  sys_data_ref_dt?: string;
  sys_data_reg_dt: string;
  open_api_url: string;
}

// ============================================================================
// 데이터 미리보기 API
// ============================================================================

// Params 파라미터 (URL 경로)
export interface DataPreviewParams {
  id: number; // URL 경로에서 추출
}

// Query 파라미터 (URL 쿼리)
export interface DataPreviewQuery {
  limit?: number; // 미리보기 데이터 개수 제한
  offset?: number; // 미리보기 데이터 오프셋
}

// OpenAPI 원 응답 그대로 전달 (타입은 any)
export type DataPreviewRes = any;
