// 데이터 API Request/Response 타입 정의
import { 
  ThemeCode, 
  DataTypeCode, 
  SelfRelTypeCode 
} from '../constants.js';
import { PaginationReq, PaginationRes, SearchReq, SortReq } from './api.js';

// ============================================================================
// 최신 데이터 리스트 API
// ============================================================================

// Query 파라미터 (URL 쿼리)
export interface DataLatestQuery {
  limit?: number; // 기본: 6, 최대: 12
}

// 레거시 호환성을 위한 별칭
export type DataLatestReq = DataLatestQuery;

export interface DataLatestItem {
  id: number;
  title: string;
  data_type: DataTypeCode;
}

export type DataLatestRes = DataLatestItem[];

// ============================================================================
// 자립테마 데이터 건수 API
// ============================================================================

export interface DataThemeCountsRes {
  phy: number;
  emo: number;
  econ: number;
  soc: number;
}

// ============================================================================
// 데이터 유형별 데이터 건수 API
// ============================================================================

export interface DataTypeCountsRes {
  basic: number;
  poi: number;
  emp: number;
}

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
  sort?: 'recent' | 'alpha';
}

// 레거시 호환성을 위한 별칭
export type DataSearchReq = DataSearchQuery;

export interface DataSearchItem {
  id: number;
  title: string;
  data_type: DataTypeCode;
  self_rel_type?: SelfRelTypeCode;
  category?: string;
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

export type DataThemesRes = DataThemeItem[];

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
  sort?: 'recent' | 'alpha';
}

// 레거시 호환성을 위한 별칭
export type DataThemeItemsReq = DataThemeItemsQuery;

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

export type DataTypesRes = DataTypeItem[];

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
  sort?: 'recent' | 'alpha';
}

// 레거시 호환성을 위한 별칭
export type DataTypeItemsReq = DataTypeItemsQuery;

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
  self_rel_type?: SelfRelTypeCode;
  category?: string;
  sys_tbl_id: string;
  data_desc?: string;
  data_keywords?: string;
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
