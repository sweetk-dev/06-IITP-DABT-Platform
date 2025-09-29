// API 엔드포인트 및 관련 상수 정의

// ============================================================================
// Base API Configuration
// ============================================================================

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

// ============================================================================
// Self Check More API Endpoints
// ============================================================================

export const SELF_CHECK_MORE_API_ENDPOINTS = {
  policies: `${API_BASE_URL}/selfcheck/policies`,
  providers: `${API_BASE_URL}/selfcheck/providers`, 
  facilities: `${API_BASE_URL}/selfcheck/facilities`
} as const;

// ============================================================================
// API 관련 유틸리티 함수
// ============================================================================

/**
 * SelfCheckMore 메뉴 타입에 따른 API 엔드포인트 가져오기
 */
export function getSelfCheckMoreApiEndpoint(menuType: 'policies' | 'providers' | 'facilities'): string {
  return SELF_CHECK_MORE_API_ENDPOINTS[menuType];
}

/**
 * API 응답 타입 정의 (향후 사용)
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
