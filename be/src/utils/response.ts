// 응답 포맷팅 유틸리티 - 완벽한 모듈화 (common 패키지 완전 활용)
import { Response } from 'express';
import { 
  ApiResponse, 
  PaginationRes, 
  PAGINATION_CONSTANTS 
} from '@iitp-dabt-platform/common';

// 성공 응답 생성 함수
export function createSuccessResponse<T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  meta?: any
): void {
  const response: ApiResponse<T> = {
    success: true,
    data,
    ...(meta && { meta }),
  };

  res.status(statusCode).json(response);
}

// 페이지네이션 메타데이터 생성 함수
export function createPaginationMeta(
  page: number,
  pageSize: number,
  totalItems: number
): PaginationRes<any> {
  const totalPages = Math.ceil(totalItems / pageSize);
  
  return {
    items: [],
    total: totalItems,
    page,
    limit: pageSize,
    totalPages,
  };
}

// 페이지네이션된 응답 생성 함수
export function createPaginatedResponse<T>(
  res: Response,
  data: T[],
  page: number,
  pageSize: number,
  totalItems: number,
  statusCode: number = 200,
  additionalMeta?: any
): void {
  const totalPages = Math.ceil(totalItems / pageSize);
  
  const response: PaginationRes<T> = {
    items: data,
    total: totalItems,
    page,
    limit: pageSize,
    totalPages,
  };

  res.status(statusCode).json(response);
}

// 에러 응답 생성 함수
export function createErrorResponse(
  res: Response,
  message: string,
  statusCode: number = 500,
  code: string = 'INTERNAL_ERROR',
  details?: any
): void {
  const response = {
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
  };

  res.status(statusCode).json(response);
}

// 기본 페이지네이션 파라미터 적용 함수
export function applyDefaultPagination(
  page?: number,
  pageSize?: number
): { page: number; pageSize: number } {
  return {
    page: page ?? PAGINATION_CONSTANTS.DEFAULT_PAGE,
    pageSize: pageSize ?? PAGINATION_CONSTANTS.DEFAULT_PAGE_SIZE,
  };
}

// 페이지네이션 오프셋 계산 함수
export function calculateOffset(page: number, pageSize: number): number {
  return page * pageSize;
}

// 페이지네이션 제한 계산 함수
export function calculateLimit(pageSize: number): number {
  return Math.min(pageSize, PAGINATION_CONSTANTS.MAX_PAGE_SIZE);
}

// 정렬 옵션 처리 함수
export function processSortOption(sort?: string): { orderBy: string; direction: 'ASC' | 'DESC' } {
  switch (sort) {
    case 'alpha':
      return { orderBy: 'title', direction: 'ASC' };
    case 'recent':
    default:
      return { orderBy: 'sys_data_reg_dt', direction: 'DESC' };
  }
}

// 검색 쿼리 처리 함수
export function processSearchQuery(q?: string): string | null {
  if (!q || q.trim().length === 0) {
    return null;
  }
  
  // SQL LIKE 패턴을 위한 이스케이프 처리
  return q.trim().replace(/[%_]/g, '\\$&');
}

// 필터 조건 처리 함수
export function processFilterConditions(filters: {
  themes?: string;
  types?: string;
  gender?: string;
  disLevel?: string;
  ageCond?: string;
}): Record<string, any> {
  const conditions: Record<string, any> = {};

  // 테마 필터 처리
  if (filters.themes) {
    const themeList = filters.themes.split(',').map(t => t.trim());
    conditions.self_rel_type = themeList;
  }

  // 데이터 타입 필터 처리
  if (filters.types) {
    const typeList = filters.types.split(',').map(t => t.trim());
    conditions.data_type = typeList;
  }

  // 성별 필터 처리
  if (filters.gender) {
    conditions.gender = filters.gender;
  }

  // 장애 정도 필터 처리
  if (filters.disLevel) {
    conditions.dis_level = filters.disLevel;
  }

  // 연령 조건 필터 처리
  if (filters.ageCond) {
    conditions.age_cond = filters.ageCond;
  }

  return conditions;
}

// 응답 헤더 설정 함수
export function setResponseHeaders(
  res: Response,
  headers: Record<string, string>
): void {
  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
}

// 캐시 헤더 설정 함수
export function setCacheHeaders(
  res: Response,
  maxAge: number = 300, // 5분
  etag?: string
): void {
  res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
  if (etag) {
    res.setHeader('ETag', etag);
  }
}
