// 요청/응답 로깅 미들웨어 - 완벽한 모듈화
import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { env } from '../config/env';

// 요청 로깅 미들웨어
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();
  
  // 요청 시작 로그
  logger.info('API 요청 시작', {
    method: req.method,
    url: req.originalUrl,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });

  // 응답 완료 시 로그
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    
    // 응답 완료 로그
    logger.info('API 요청 완료', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      timestamp: new Date().toISOString(),
    });

    // 성능 메트릭 로그 (느린 요청)
    if (responseTime > 1000) {
      logger.warn('느린 API 요청 감지', {
        method: req.method,
        url: req.originalUrl,
        responseTime: `${responseTime}ms`,
        statusCode: res.statusCode,
      });
    }
  });

  next();
}

// 에러 로깅 미들웨어
export function errorLogger(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error('API 요청 처리 중 오류 발생', {
    method: req.method,
    url: req.originalUrl,
    error: error.message,
    stack: error.stack,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });

  next(error);
}

// 개발 환경용 상세 로깅
export function detailedLogger(req: Request, res: Response, next: NextFunction): void {
  if (env.NODE_ENV === 'development') {
    logger.debug('상세 요청 정보', {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      query: req.query,
      body: req.body,
      params: req.params,
    });
  }
  
  next();
}
