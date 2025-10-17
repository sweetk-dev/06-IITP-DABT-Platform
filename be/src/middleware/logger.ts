// 요청/응답 로깅 미들웨어 - 완벽한 모듈화
import { Request, Response, NextFunction } from 'express';
import { logger, accessLogger } from '../config/logger';
import { env } from '../config/env';

// 요청 로깅 미들웨어
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();
  
  // Access 로그 - 콘솔에 명확하게 출력
  const requestLog = `[ACCESS] ${req.method} ${req.originalUrl} - IP: ${req.ip || 'unknown'}`;
  console.log(`\x1b[36m${requestLog}\x1b[0m`); // cyan color
  
  // 요청 시작 로그
  logger.info('API 요청 시작', {
    method: req.method,
    url: req.originalUrl,
    query: req.query,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
  });

  // 응답 완료 시 로그
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    
    // Access 완료 로그 - 콘솔에 명확하게 출력 (색상으로 상태 구분)
    const statusColor = res.statusCode >= 500 ? '\x1b[31m' : // red for 5xx
                       res.statusCode >= 400 ? '\x1b[33m' : // yellow for 4xx
                       res.statusCode >= 300 ? '\x1b[36m' : // cyan for 3xx
                       '\x1b[32m'; // green for 2xx
    
    const responseLog = `[ACCESS] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${responseTime}ms`;
    console.log(`${statusColor}${responseLog}\x1b[0m`);
    
    // Access 로그 파일에 기록 (access_yyyy-mm-dd.log)
    accessLogger.info('API Access', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
    });
    
    // 응답 완료 로그 (app_yyyy-mm-dd.log)
    logger.info('API 요청 완료', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
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
  const statusCode = (error as any).statusCode || 500;
  
  // Access 로그 파일에도 에러 기록
  accessLogger.error('API Error', {
    method: req.method,
    url: req.originalUrl,
    statusCode,
    error: error.message,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
  });
  
  // App 로그에 상세 에러 기록
  logger.error('API 요청 처리 중 오류 발생', {
    method: req.method,
    url: req.originalUrl,
    error: error.message,
    stack: error.stack,
    statusCode: statusCode,
    openApiError: (error as any).openApiError,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
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
