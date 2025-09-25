// API URL 상수 정의

export const API_URLS = {
    // 데이터 목록
  DATA: {
    BASE: '/api/data',
  },

  //자가진단
  SELF_CHK: {
    BASE: '/api/self-chk',
  },
    // 공통
  COMMON: {
    BASE: '/api/common',
    HEALTH_CHECK: '/health',
    VERSION: '/version',
  },
} as const;

// URL 조합 유틸리티 함수
export const buildUrl = (base: string, path: string): string => {
  return `${base}${path}`;
};

// API URL 조합 함수들
export const getDatahUrl = (path: string): string => buildUrl(API_URLS.DATA.BASE, path);
export const getSelfChkUrl = (path: string): string => buildUrl(API_URLS.SELF_CHK.BASE, path);
export const getCommonUrl = (path: string): string => buildUrl(API_URLS.COMMON.BASE, path);

// 완전한 URL 상수들 (함수 조합으로 생성)
export const FULL_API_URLS = {  
  DATA: {
    //??: getDatahUrl(API_URLS.DATA.??),
  },
  SELF_CHK: {
    //??: getSelfChkUrl(API_URLS.SELF_CHK.??),
  },
  COMMON: {
    HEALTH_CHECK: getCommonUrl(API_URLS.COMMON.HEALTH_CHECK),
    VERSION: getCommonUrl(API_URLS.COMMON.VERSION),
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