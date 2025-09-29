// 페이지네이션 처리 유틸리티 - 완벽한 모듈화 (common 패키지 완전 활용)
import { 
  PAGINATION_CONSTANTS,
  type PaginationReq,
  type PaginationRes 
} from '@iitp-dabt-platform/common';

// 페이지네이션 파라미터 인터페이스
export interface PaginationParams {
  page: number;
  pageSize: number;
  offset: number;
  limit: number;
}

// 페이지네이션 파라미터 생성 함수
export function createPaginationParams(
  page?: number,
  pageSize?: number
): PaginationParams {
  const validPage = Math.max(0, page ?? PAGINATION_CONSTANTS.DEFAULT_PAGE);
  const validPageSize = Math.min(
    Math.max(1, pageSize ?? PAGINATION_CONSTANTS.DEFAULT_PAGE_SIZE),
    PAGINATION_CONSTANTS.MAX_PAGE_SIZE
  );

  return {
    page: validPage,
    pageSize: validPageSize,
    offset: validPage * validPageSize,
    limit: validPageSize,
  };
}

// 페이지네이션 메타데이터 생성 함수
export function createPaginationMeta(
  page: number,
  pageSize: number,
  totalItems: number
): PaginationRes {
  const totalPages = Math.ceil(totalItems / pageSize);
  
  return {
    page,
    pageSize,
    totalItems,
    totalPages,
    hasNext: page < totalPages - 1,
    hasPrev: page > 0,
  };
}

// 페이지네이션 유효성 검사 함수
export function validatePaginationParams(
  page?: number,
  pageSize?: number
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (page !== undefined) {
    if (!Number.isInteger(page) || page < 0) {
      errors.push('페이지 번호는 0 이상의 정수여야 합니다.');
    }
  }

  if (pageSize !== undefined) {
    if (!Number.isInteger(pageSize) || pageSize < 1) {
      errors.push('페이지 크기는 1 이상의 정수여야 합니다.');
    }
    if (pageSize > PAGINATION_CONSTANTS.MAX_PAGE_SIZE) {
      errors.push(`페이지 크기는 ${PAGINATION_CONSTANTS.MAX_PAGE_SIZE} 이하여야 합니다.`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// 페이지네이션 정보 계산 함수
export function calculatePaginationInfo(
  totalItems: number,
  page: number,
  pageSize: number
): {
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  startItem: number;
  endItem: number;
} {
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = page * pageSize + 1;
  const endItem = Math.min((page + 1) * pageSize, totalItems);

  return {
    totalPages,
    hasNext: page < totalPages - 1,
    hasPrev: page > 0,
    startItem: totalItems > 0 ? startItem : 0,
    endItem: totalItems > 0 ? endItem : 0,
  };
}

// 페이지네이션 범위 검증 함수
export function validatePageRange(
  page: number,
  totalPages: number
): boolean {
  return page >= 0 && page < totalPages;
}

// 페이지네이션 파라미터 정규화 함수
export function normalizePaginationParams(
  page?: number | string,
  pageSize?: number | string
): { page: number; pageSize: number } {
  const normalizedPage = typeof page === 'string' ? parseInt(page, 10) : page;
  const normalizedPageSize = typeof pageSize === 'string' ? parseInt(pageSize, 10) : pageSize;

  return createPaginationParams(normalizedPage, normalizedPageSize);
}

// 페이지네이션 쿼리 빌더 헬퍼
export function buildPaginationQuery(
  page: number,
  pageSize: number
): { offset: number; limit: number } {
  return {
    offset: page * pageSize,
    limit: pageSize,
  };
}

// 페이지네이션 응답 헤더 설정 함수
export function setPaginationHeaders(
  res: any,
  page: number,
  pageSize: number,
  totalItems: number
): void {
  const totalPages = Math.ceil(totalItems / pageSize);
  
  res.setHeader('X-Page', page.toString());
  res.setHeader('X-Page-Size', pageSize.toString());
  res.setHeader('X-Total-Items', totalItems.toString());
  res.setHeader('X-Total-Pages', totalPages.toString());
  res.setHeader('X-Has-Next', (page < totalPages - 1).toString());
  res.setHeader('X-Has-Prev', (page > 0).toString());
}
