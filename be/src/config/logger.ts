// 로거 설정 - 완벽한 모듈화
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { env } from './env';

// 공통 로그 포맷 (함수 정보 포함)
const fileLogFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const functionName = meta.function || '';
    const fnStr = functionName ? `[${functionName}]` : '';
    const metaFiltered = { ...meta };
    delete metaFiltered.function;
    const metaStr = Object.keys(metaFiltered).length > 0 ? ` ${JSON.stringify(metaFiltered)}` : '';
    return `${timestamp} [${level.toUpperCase()}]${fnStr} ${message}${metaStr}`;
  })
);

// 애플리케이션 로거 생성 (app_yyyy-mm-dd.log)
export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: fileLogFormat,
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
          const functionName = meta.function || '';
          const fnStr = functionName ? `[${functionName}]` : '';
          const metaFiltered = { ...meta };
          delete metaFiltered.function;
          delete metaFiltered.service;
          delete metaFiltered.version;
          const metaStr = Object.keys(metaFiltered).length > 0 ? ` ${JSON.stringify(metaFiltered)}` : '';
          return `${timestamp} [${level}]${fnStr} ${message}${metaStr}`;
        })
      ),
    }),
    
    // 애플리케이션 로그 파일 (날짜별 로테이션: app_yyyy-mm-dd.log)
    new DailyRotateFile({
      dirname: env.LOG_DIR,
      filename: 'app_%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      format: fileLogFormat,
      maxSize: '10m',
      maxFiles: '30d', // 30일 보관
    }),
  ],
});

// API Access 로거 생성 (access_yyyy-mm-dd.log)
export const accessLogger = winston.createLogger({
  level: 'info',
  format: fileLogFormat,
  defaultMeta: {
    service: 'iitp-dabt-platform-be-access',
  },
  transports: [
    // API 호출 로그 파일 (날짜별 로테이션: access_yyyy-mm-dd.log)
    new DailyRotateFile({
      dirname: env.LOG_DIR,
      filename: 'access_%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      format: fileLogFormat,
      maxSize: '10m',
      maxFiles: '30d', // 30일 보관
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
  // API 요청 로그 (access log에 기록)
  apiRequest: (req: any, res: any, responseTime: number) => {
    accessLogger.info('API Request', {
      function: 'apiRequest',
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
    logger.error('API Error', {
      function: 'apiError',
      method: req.method,
      url: req.originalUrl,
      error: error.message,
      stack: error.stack,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
    });
    
    // access log에도 기록
    accessLogger.error('API Error', {
      function: 'apiError',
      method: req.method,
      url: req.originalUrl,
      statusCode: error.statusCode || 500,
      error: error.message,
    });
  },

  // 데이터베이스 쿼리 로그
  dbQuery: (query: string, params: any[], duration: number) => {
    logger.debug('Database Query', {
      function: 'dbQuery',
      query,
      params,
      duration: `${duration}ms`,
    });
  },

  // 서비스 로직 로그 (dev 환경에서만)
  service: (serviceName: string, method: string, result: any) => {
    if (env.NODE_ENV === 'development') {
      logger.info(`Service: ${serviceName}`, {
        function: method,
        result: typeof result === 'object' ? JSON.stringify(result).substring(0, 200) : result,
      });
    }
  },

  // 성능 메트릭 로그
  performance: (operation: string, duration: number, metadata?: any) => {
    logger.info('Performance', {
      function: 'performance',
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
