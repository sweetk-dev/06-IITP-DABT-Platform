// 요청 검증 미들웨어 - 완벽한 모듈화 (common 패키지 완전 활용)
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { createError } from './errorHandler';
import { ErrorCode } from '@iitp-dabt-platform/common';
import { logger } from '../config/logger';
import { 
  THEME_CONSTANTS, 
  DATA_TYPE_CONSTANTS, 
  SELF_REL_TYPE_CONSTANTS,
  PAGINATION_CONSTANTS 
} from '@iitp-dabt-platform/common';

// 검증 스키마 타입
export type ValidationSchema = {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
};

// 요청 검증 미들웨어 생성 함수
export function validateRequest(schema: ValidationSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Body 검증
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }

      // Query 검증
      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }

      // Params 검증
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = createError(
          '요청 데이터 검증에 실패했습니다.',
          400,
          ErrorCode.VALIDATION_ERROR,
          {
            errors: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message,
              code: err.code,
            })),
          }
        );
        
        logger.warn('요청 데이터 검증 실패', {
          method: req.method,
          url: req.originalUrl,
          errors: error.errors,
          userAgent: req.get('User-Agent'),
          ip: req.ip,
        });
        
        next(validationError);
      } else {
        next(error);
      }
    }
  };
}

// 공통 검증 스키마들 - common 패키지의 상수 활용
export const commonSchemas = {
  // 페이지네이션 쿼리 - common 패키지의 PAGINATION_CONSTANTS 활용
  paginationQuery: z.object({
    page: z.string().transform(Number).pipe(z.number().min(PAGINATION_CONSTANTS.DEFAULT_PAGE)).optional(),
    pageSize: z.string().transform(Number).pipe(z.number().min(PAGINATION_CONSTANTS.MIN_PAGE_SIZE).max(PAGINATION_CONSTANTS.MAX_PAGE_SIZE)).optional(),
    sort: z.enum(['recent', 'alpha']).optional(),
  }),

  // ID 파라미터
  idParam: z.object({
    id: z.string().transform(Number).pipe(z.number().positive()),
  }),

  // 테마 파라미터 - common 패키지의 THEME_CONSTANTS 활용
  themeParam: z.object({
    theme: z.enum(THEME_CONSTANTS.ALL_CODES as unknown as [string, ...string[]]),
  }),

  // 데이터 타입 파라미터 - common 패키지의 DATA_TYPE_CONSTANTS 활용
  typeParam: z.object({
    type: z.enum(DATA_TYPE_CONSTANTS.ALL_CODES as unknown as [string, ...string[]]),
  }),

  // 검색 쿼리 - common 패키지의 상수 활용
  searchQuery: z.object({
    q: z.string().min(1).max(100).optional(),
    themes: z.string().optional(),
    types: z.string().optional(),
    page: z.string().transform(Number).pipe(z.number().min(PAGINATION_CONSTANTS.DEFAULT_PAGE)).optional(),
    pageSize: z.string().transform(Number).pipe(z.number().min(PAGINATION_CONSTANTS.MIN_PAGE_SIZE).max(PAGINATION_CONSTANTS.MAX_PAGE_SIZE)).optional(),
    sort: z.enum(['recent', 'alpha']).optional(),
  }),

  // 자가진단 쿼리 - common 패키지의 상수 활용
  selfCheckQuery: z.object({
    gender: z.enum(['남성', '여성']).optional(),
    disLevel: z.enum(['경증', '중증']).optional(),
    ageCond: z.enum(['minor', 'adult', 'all']).optional(),
    themes: z.string().optional(),
    limit: z.string().transform(Number).pipe(z.number().min(1).max(10)).optional(),
    page: z.string().transform(Number).pipe(z.number().min(PAGINATION_CONSTANTS.DEFAULT_PAGE)).optional(),
    pageSize: z.string().transform(Number).pipe(z.number().min(PAGINATION_CONSTANTS.MIN_PAGE_SIZE).max(PAGINATION_CONSTANTS.MAX_PAGE_SIZE)).optional(),
  }),
};

// 검증 헬퍼 함수들
export const validators = {
  // 숫자 ID 검증
  validateId: (id: string): number => {
    const numId = parseInt(id, 10);
    if (isNaN(numId) || numId <= 0) {
      throw createError('유효하지 않은 ID입니다.', 400, ErrorCode.INVALID_PARAMETER);
    }
    return numId;
  },

  // 페이지 번호 검증
  validatePage: (page: string | undefined, defaultPage: number = 0): number => {
    if (!page) return defaultPage;
    const numPage = parseInt(page, 10);
    if (isNaN(numPage) || numPage < 0) {
      throw createError('유효하지 않은 페이지 번호입니다.', 400, ErrorCode.INVALID_PARAMETER);
    }
    return numPage;
  },

  // 페이지 크기 검증
  validatePageSize: (pageSize: string | undefined, defaultPageSize: number = 20): number => {
    if (!pageSize) return defaultPageSize;
    const numPageSize = parseInt(pageSize, 10);
    if (isNaN(numPageSize) || numPageSize < 1 || numPageSize > 100) {
      throw createError('유효하지 않은 페이지 크기입니다.', 400, ErrorCode.INVALID_PARAMETER);
    }
    return numPageSize;
  },

  // 정렬 옵션 검증
  validateSort: (sort: string | undefined, defaultSort: string = 'recent'): string => {
    if (!sort) return defaultSort;
    const validSorts = ['recent', 'alpha'];
    if (!validSorts.includes(sort)) {
      throw createError('유효하지 않은 정렬 옵션입니다.', 400, ErrorCode.INVALID_PARAMETER);
    }
    return sort;
  },
};
