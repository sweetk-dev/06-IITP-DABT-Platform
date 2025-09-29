// CORS 설정 미들웨어 - 완벽한 모듈화
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { env } from '../config/env';
import { logger } from '../config/logger';

// CORS 옵션 설정
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // 개발 환경에서는 모든 origin 허용
    if (env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    // 허용된 origin 목록 확인
    const allowedOrigins = env.CORS_ORIGINS;
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn('CORS 정책 위반 시도', {
        origin,
        allowedOrigins,
        userAgent: 'Unknown',
      });
      callback(new Error('CORS 정책에 의해 차단되었습니다.'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
  ],
  exposedHeaders: [
    'X-Total-Count',
    'X-Page',
    'X-Page-Size',
    'X-Total-Pages',
  ],
  maxAge: 86400, // 24시간
};

// CORS 미들웨어 생성
export const corsMiddleware = cors(corsOptions);

// CORS 에러 처리 미들웨어
export function corsErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err.message.includes('CORS')) {
    res.status(403).json({
      success: false,
      error: {
        code: 'CORS_ERROR',
        message: 'CORS 정책에 의해 요청이 차단되었습니다.',
        details: {
          origin: req.get('Origin'),
          method: req.method,
        },
      },
    });
  } else {
    next(err);
  }
}

// Preflight 요청 처리
export function handlePreflight(req: Request, res: Response, next: NextFunction): void {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
}
