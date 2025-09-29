// API 엔드포인트 및 관련 상수 정의
// common 패키지의 API 정의를 재export하고 FE 전용 설정 추가

import { 
  API_URLS,
  FULL_API_URLS,
  getDataUrl,
  getSelfChkUrl,
  getCommonUrl,
  API_MAPPING,
  type ExtractReqType,
  type ExtractResType
} from '../../../packages/common/src/types/index.js';
import { type SelfCheckMoreMenuType } from '../../../packages/common/src/types/constants.js';

// ============================================================================
// Base API Configuration
// ============================================================================

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

// ============================================================================
// Self Check More API Endpoints (FE 전용)
// ============================================================================

export const SELF_CHECK_MORE_API_ENDPOINTS = {
  policies: `${API_BASE_URL}/selfcheck/policies`,
  providers: `${API_BASE_URL}/selfcheck/providers`, 
  facilities: `${API_BASE_URL}/selfcheck/facilities`
} as const;

// ============================================================================
// Full API URLs for Frontend
// ============================================================================

export const FULL_API_URLS_FE = {
  // Common APIs
  health: getCommonUrl(API_URLS.COMMON.HEALTH_CHECK),
  version: getCommonUrl(API_URLS.COMMON.VERSION),
  
  // Data APIs
  latestData: getDataUrl(API_URLS.DATA.SUMMARY.LATEST),
  themeCounts: getDataUrl(API_URLS.DATA.COUNTS.THEMES),
  typeCounts: getDataUrl(API_URLS.DATA.COUNTS.TYPES),
  dataSearch: getDataUrl(API_URLS.DATA.SEARCH),
  themes: getDataUrl(API_URLS.DATA.THEMES),
  types: getDataUrl(API_URLS.DATA.TYPES),
  
  // Self Check APIs
  recommendations: getSelfChkUrl(API_URLS.SELF_CHK.RECOMMENDATIONS),
  policies: getSelfChkUrl(API_URLS.SELF_CHK.POLICIES),
  providers: getSelfChkUrl(API_URLS.SELF_CHK.PROVIDERS),
  facilities: getSelfChkUrl(API_URLS.SELF_CHK.FACILITIES)
} as const;

// ============================================================================
// API 관련 유틸리티 함수
// ============================================================================

/**
 * SelfCheckMore 메뉴 타입에 따른 API 엔드포인트 가져오기
 */
export function getSelfCheckMoreApiEndpoint(menuType: SelfCheckMoreMenuType): string {
  return SELF_CHECK_MORE_API_ENDPOINTS[menuType];
}

/**
 * 자립테마별 데이터 목록 API URL 생성
 */
export function buildThemeItemsUrl(theme: string, params?: { page?: number; pageSize?: number; sort?: string }): string {
  const url = new URL(getDataUrl(API_URLS.DATA.THEME_ITEMS(theme)), 'http://localhost');
  if (params?.page) url.searchParams.set('page', params.page.toString());
  if (params?.pageSize) url.searchParams.set('pageSize', params.pageSize.toString());
  if (params?.sort) url.searchParams.set('sort', params.sort);
  return url.pathname + url.search;
}

/**
 * 데이터 유형별 데이터 목록 API URL 생성
 */
export function buildTypeItemsUrl(type: string, params?: { page?: number; pageSize?: number; sort?: string }): string {
  const url = new URL(getDataUrl(API_URLS.DATA.TYPE_ITEMS(type)), 'http://localhost');
  if (params?.page) url.searchParams.set('page', params.page.toString());
  if (params?.pageSize) url.searchParams.set('pageSize', params.pageSize.toString());
  if (params?.sort) url.searchParams.set('sort', params.sort);
  return url.pathname + url.search;
}

/**
 * 데이터 상세 정보 API URL 생성
 */
export function buildDataDetailUrl(id: number): string {
  return getDataUrl(API_URLS.DATA.DETAIL(id));
}

/**
 * 데이터 미리보기 API URL 생성
 */
export function buildDataPreviewUrl(id: number): string {
  return getDataUrl(API_URLS.DATA.PREVIEW(id));
}

// ============================================================================
// 타입 안전한 API 클라이언트
// ============================================================================

/**
 * 타입 안전한 API 호출 함수
 */
export async function callApi<T extends keyof typeof API_MAPPING>(
  url: T,
  request?: ExtractReqType<T>
): Promise<ExtractResType<T>> {
  const [method, path] = String(url).split(' ');
  const fullUrl = `${API_BASE_URL}${path}`;
  
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  if (request && method !== 'GET') {
    options.body = JSON.stringify(request);
  }
  
  const response = await fetch(fullUrl, options);
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * GET 요청용 타입 안전한 API 호출 함수
 */
export async function getApi<T extends keyof typeof API_MAPPING>(
  url: T,
  params?: ExtractReqType<T>
): Promise<ExtractResType<T>> {
  const [method, path] = String(url).split(' ');
  let fullUrl = `${API_BASE_URL}${path}`;
  
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value));
      }
    });
    fullUrl += `?${searchParams.toString()}`;
  }
  
  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// ============================================================================
// Re-export from common package
// ============================================================================

export {
  API_URLS,
  FULL_API_URLS,
  getDataUrl,
  getSelfChkUrl,
  getCommonUrl,
  API_MAPPING,
  type ExtractReqType,
  type ExtractResType
} from '../../../packages/common/src/types/index.js';
