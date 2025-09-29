// Common API Request/Response 타입 정의
import { API_URLS } from './api.js';

/**
 * COMMON API 매핑 테이블 (레거시 호환성)
 * API URL과 Request/Response 타입을 명시적으로 연결
 */
export const COMMON_API_MAPPING = {
  [`GET ${API_URLS.COMMON.HEALTH_CHECK}`]: {
    req: 'CommonHealthReq',
    res: 'CommonHealthRes',
    description: '헬스 체크'
  },
  [`GET ${API_URLS.COMMON.VERSION}`]: {
    req: 'CommonVersionReq',
    res: 'CommonVersionRes',
    description: '버전 정보 조회'
  },
} as const;

// ============================================================================
// 헬스 체크 API
// ============================================================================

// Query 파라미터 (URL 쿼리) - 현재는 파라미터 없음
export interface CommonHealthQuery {
  // 현재는 파라미터 없음
}

// 레거시 호환성을 위한 별칭
export type CommonHealthReq = CommonHealthQuery;

export interface CommonHealthRes {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
}

// ============================================================================
// 버전 정보 조회 API
// ============================================================================

// Query 파라미터 (URL 쿼리) - 현재는 파라미터 없음
export interface CommonVersionQuery {
  // 현재는 파라미터 없음
}

// 레거시 호환성을 위한 별칭
export type CommonVersionReq = CommonVersionQuery;

export interface CommonVersionRes {
  version: string;
  buildDate: string;
  environment: string;
}

// VersionRes 타입 (FE 호환성)
export type VersionRes = CommonVersionRes; 