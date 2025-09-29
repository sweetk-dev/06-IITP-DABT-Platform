// 공통 에러 처리 미들웨어 - 완벽한 모듈화 (common 패키지 완전 활용)
import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { ErrorCode, ErrorMetaMap } from '@iitp-dabt-platform/common';

// API 에러 인터페이스
export interface ApiError extends Error {
  statusCode?: number;
  code?: ErrorCode;
  details?: any;
}

// 에러 응답 인터페이스
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

// 에러 생성 함수
export function createError(
  message: string,
  statusCode: number = 500,
  code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
  details?: any
): ApiError {
  const error = new Error(message) as ApiError;
  error.statusCode = statusCode;
  error.code = code;
  error.details = details;
  return error;
}

// 에러 응답 생성 함수
export function createErrorResponse(error: ApiError): ErrorResponse {
  const errorMeta = ErrorMetaMap[error.code || ErrorCode.UNKNOWN_ERROR];
  
  return {
    success: false,
    error: {
      code: error.code || ErrorCode.UNKNOWN_ERROR,
      message: error.details?.message || error.message || errorMeta?.message || '알 수 없는 오류가 발생했습니다.',
      details: error.details,
    },
  };
}

// 에러 처리 미들웨어
export function errorHandler(
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // 이미 응답이 전송된 경우
  if (res.headersSent) {
    return next(error);
  }

  // 에러 로깅
  logger.error('API 요청 처리 중 오류 발생', {
    method: req.method,
    url: req.originalUrl,
    error: error.message,
    stack: error.stack,
    code: error.code,
    statusCode: error.statusCode,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
  });

  // 기본 상태 코드 설정
  const statusCode = error.statusCode || 500;
  
  // 에러 응답 생성
  const errorResponse = createErrorResponse(error);

  // 응답 전송
  res.status(statusCode).json(errorResponse);
}

// 404 에러 처리
export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
  const error = createError(
    '요청한 리소스를 찾을 수 없습니다.',
    404,
    ErrorCode.NOT_FOUND,
    {
      method: req.method,
      url: req.originalUrl,
    }
  );
  
  next(error);
}

// 비동기 에러 래퍼
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// 에러 타입 가드
export function isApiError(error: any): error is ApiError {
  return error instanceof Error && 'statusCode' in error;
}

// 에러 코드별 상태 코드 매핑
export const ERROR_STATUS_MAP: Record<ErrorCode, number> = {
  [ErrorCode.UNKNOWN_ERROR]: 500,
  [ErrorCode.VALIDATION_ERROR]: 400,
  [ErrorCode.DATABASE_ERROR]: 500,
  [ErrorCode.NETWORK_ERROR]: 503,
  [ErrorCode.INVALID_REQUEST]: 400,
  [ErrorCode.MISSING_REQUIRED_FIELD]: 400,
  [ErrorCode.INVALID_PARAMETER]: 400,
  [ErrorCode.REQUEST_TIMEOUT]: 408,
  [ErrorCode.SYS_INTERNAL_SERVER_ERROR]: 500,
  [ErrorCode.SYS_SERVICE_UNAVAILABLE]: 503,
  [ErrorCode.SYS_MAINTENANCE_MODE]: 503,
};
