// API URL 상수 정의

export const API_URLS = {
  // 공통 API
  COMMON: {
    BASE: '/api/v1',
    HEALTH_CHECK: '/health',
    VERSION: '/version',
  },
  
  // 데이터 목록 API
  DATA: {
    BASE: '/api/v1/data',
    SUMMARY: {
      LATEST: '/summary/latest',
    },
    COUNTS: {
      THEMES: '/counts/themes',
      TYPES: '/counts/types',
    },
    SEARCH: '/search',
    THEMES: '/themes',
    THEMES_ITEMS_ALL: '/themes/items',
    THEME_ITEMS: (theme: string) => `/themes/${theme}/items`,
    TYPES: '/types',
    TYPES_ITEMS_ALL: '/types/items',
    TYPE_ITEMS: (type: string) => `/types/${type}/items`,
    DETAIL: (id: number) => `/${id}`,
    PREVIEW: (id: number) => `/${id}/preview`,
  },

  // 자가진단 API
  SELF_CHK: {
    BASE: '/api/v1/selfcheck',
    RECOMMENDATIONS: '/recommendations',
    POLICIES: '/policies',
    PROVIDERS: '/providers',
    FACILITIES: '/facilities',
  },
} as const;

// URL 조합 유틸리티 함수
export const buildUrl = (base: string, path: string): string => {
  return `${base}${path}`;
};

// API URL 조합 함수들
export const getDataUrl = (path: string): string => buildUrl(API_URLS.DATA.BASE, path);
export const getSelfChkUrl = (path: string): string => buildUrl(API_URLS.SELF_CHK.BASE, path);
export const getCommonUrl = (path: string): string => buildUrl(API_URLS.COMMON.BASE, path);

// 완전한 URL 상수들 (함수 조합으로 생성)
export const FULL_API_URLS = {  
  COMMON: {
    HEALTH_CHECK: getCommonUrl(API_URLS.COMMON.HEALTH_CHECK),
    VERSION: getCommonUrl(API_URLS.COMMON.VERSION),
  },
  DATA: {
    LATEST: getDataUrl(API_URLS.DATA.SUMMARY.LATEST),
    THEME_COUNTS: getDataUrl(API_URLS.DATA.COUNTS.THEMES),
    TYPE_COUNTS: getDataUrl(API_URLS.DATA.COUNTS.TYPES),
    SEARCH: getDataUrl(API_URLS.DATA.SEARCH),
    THEMES: getDataUrl(API_URLS.DATA.THEMES),
    THEMES_ITEMS_ALL: getDataUrl(API_URLS.DATA.THEMES_ITEMS_ALL),
    THEME_ITEMS: (theme: string) => getDataUrl(API_URLS.DATA.THEME_ITEMS(theme)),
    TYPES: getDataUrl(API_URLS.DATA.TYPES),
    TYPES_ITEMS_ALL: getDataUrl(API_URLS.DATA.TYPES_ITEMS_ALL),
    TYPE_ITEMS: (type: string) => getDataUrl(API_URLS.DATA.TYPE_ITEMS(type)),
    DETAIL: (id: number) => getDataUrl(API_URLS.DATA.DETAIL(id)),
    PREVIEW: (id: number) => getDataUrl(API_URLS.DATA.PREVIEW(id)),
  },
  SELF_CHK: {
    RECOMMENDATIONS: getSelfChkUrl(API_URLS.SELF_CHK.RECOMMENDATIONS),
    POLICIES: getSelfChkUrl(API_URLS.SELF_CHK.POLICIES),
    PROVIDERS: getSelfChkUrl(API_URLS.SELF_CHK.PROVIDERS),
    FACILITIES: getSelfChkUrl(API_URLS.SELF_CHK.FACILITIES),
  },
} as const;

// API 응답 기본 구조 (BE/FE 공통)
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  errorCode?: number;
  errorMessage?: string;
}

// 페이징 관련 타입
export interface PaginationReq {
  page?: number;
  limit?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface PaginationRes<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 검색 관련 타입
export interface SearchReq extends PaginationReq {
  search?: string;
}

// 정렬 관련 타입
export interface SortReq {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}