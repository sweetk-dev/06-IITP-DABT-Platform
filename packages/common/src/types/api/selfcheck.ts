// 자가진단 API Request/Response 타입 정의
import { 
  GenderCode, 
  AgeCondCode, 
  DisLevelCode, 
  SelfRltyTypeCode,
  PAGINATION_CONSTANTS
} from '../constants.js';
import { PaginationReq, PaginationRes } from './api.js';

// ============================================================================
// 추천 정책 리스트 API
// ============================================================================

// Query 파라미터 (URL 쿼리)
export interface SelfCheckRecommendationsQuery {
  gender?: GenderCode;
  disLevel?: DisLevelCode;
  ageCond?: AgeCondCode;
  themes?: string; // 콤마분리
  limit?: number; // 기본: 3, 최대: 10
}

// 기본값 상수
export const SELF_CHECK_RECOMMENDATIONS_DEFAULTS = {
  LIMIT: 3,
  MAX_LIMIT: 10
} as const;

export interface SelfCheckPolicyItem {
  policy_id: number;
  category: string;
  policy_name: string;
  self_rlty_type?: SelfRltyTypeCode;
  region?: string;
  gender?: string;
  age_cond?: string;
  dis_level?: string;
  fin_cond?: string;
  link?: string;
}

// ============================================================================
// 자립 지원 정책 리스트 API
// ============================================================================

// Query 파라미터 (URL 쿼리)
export interface SelfCheckPoliciesQuery extends PaginationReq {
  themes?: string; // 콤마분리
  gender?: GenderCode;
  ageCond?: AgeCondCode;
  disLevel?: DisLevelCode;
  page?: number;
  pageSize?: number;
}

// 기본값 상수
export const SELF_CHECK_POLICIES_DEFAULTS = {
  PAGE: PAGINATION_CONSTANTS.DEFAULT_PAGE,
  PAGE_SIZE: PAGINATION_CONSTANTS.DEFAULT_PAGE_SIZE
} as const;

export type SelfCheckPoliciesRes = PaginationRes<SelfCheckPolicyItem>;

// ============================================================================
// 자립 지원 기관 리스트 API
// ============================================================================

// Query 파라미터 (URL 쿼리)
export interface SelfCheckProvidersQuery extends PaginationReq {
  page?: number;
  pageSize?: number;
}

// 기본값 상수
export const SELF_CHECK_PROVIDERS_DEFAULTS = {
  PAGE: PAGINATION_CONSTANTS.DEFAULT_PAGE,
  PAGE_SIZE: PAGINATION_CONSTANTS.DEFAULT_PAGE_SIZE
} as const;

export interface SelfCheckProviderItem {
  provider_id: number;
  provider_name: string;
  service_name: string;
  address: string;
  phone?: string;
  description?: string;
}

export type SelfCheckProvidersRes = PaginationRes<SelfCheckProviderItem>;

// ============================================================================
// 자립 지원 시설 리스트 API
// ============================================================================

// Query 파라미터 (URL 쿼리)
export interface SelfCheckFacilitiesQuery extends PaginationReq {
  page?: number;
  pageSize?: number;
}

// 기본값 상수
export const SELF_CHECK_FACILITIES_DEFAULTS = {
  PAGE: PAGINATION_CONSTANTS.DEFAULT_PAGE,
  PAGE_SIZE: PAGINATION_CONSTANTS.DEFAULT_PAGE_SIZE
} as const;

export interface SelfCheckFacilityItem {
  facility_id: number;
  device: string;
  install_area?: string;
  install_site?: string;
  install_spot?: string;
  hang_dong?: string;
  address?: string;
  opening_hours?: string;
  quantity?: number;
  note?: string;
}

export type SelfCheckFacilitiesRes = PaginationRes<SelfCheckFacilityItem>;
