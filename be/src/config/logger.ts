// 로거 설정 - 완벽한 모듈화
import winston from 'winston';
import path from 'path';
import { env } from './env';

// 로그 포맷 정의
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta,
    });
  })
);

// 파일 로그 포맷 (읽기 쉬운 형태)
const fileLogFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} [${level.toUpperCase()}] ${message}${metaStr}`;
  })
);

// 로거 생성
export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: logFormat,
  defaultMeta: {
    service: 'iitp-dabt-platform-be',
    version: process.env.npm_package_version || '1.0.0',
  },
  transports: [
    // 콘솔 출력
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
          return `${timestamp} [${level}] ${message}${metaStr}`;
        })
      ),
    }),
    
    // 애플리케이션 로그 파일
    new winston.transports.File({
      filename: path.join(env.LOG_DIR, 'app.log'),
      format: fileLogFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    }),
    
    // 에러 로그 파일
    new winston.transports.File({
      filename: path.join(env.LOG_DIR, 'error.log'),
      level: 'error',
      format: fileLogFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    }),
  ],
});

// 개발 환경에서 디버그 로그 활성화
if (env.NODE_ENV === 'development') {
  logger.add(new winston.transports.Console({
    level: 'debug',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
    ),
  }));
}

// 로그 디렉토리 생성
import fs from 'fs';
if (!fs.existsSync(env.LOG_DIR)) {
  fs.mkdirSync(env.LOG_DIR, { recursive: true });
}

// 로거 헬퍼 함수들
export const loggers = {
  // API 요청 로그
  apiRequest: (req: any, res: any, responseTime: number) => {
    logger.info('API 요청 처리 완료', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
    });
  },

  // API 에러 로그
  apiError: (req: any, error: any) => {
    logger.error('API 요청 처리 중 오류 발생', {
      method: req.method,
      url: req.originalUrl,
      error: error.message,
      stack: error.stack,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
    });
  },

  // 데이터베이스 쿼리 로그
  dbQuery: (query: string, params: any[], duration: number) => {
    logger.debug('데이터베이스 쿼리 실행', {
      query,
      params,
      duration: `${duration}ms`,
    });
  },

  // 서비스 로직 로그
  service: (serviceName: string, method: string, data: any) => {
    logger.info('서비스 로직 실행', {
      service: serviceName,
      method,
      data,
    });
  },

  // 성능 메트릭 로그
  performance: (operation: string, duration: number, metadata?: any) => {
    logger.info('성능 메트릭', {
      operation,
      duration: `${duration}ms`,
      ...metadata,
    });
  },
};

// 로거 초기화 완료
logger.info('로거가 성공적으로 초기화되었습니다.', {
  logLevel: env.LOG_LEVEL,
  logDir: env.LOG_DIR,
});
