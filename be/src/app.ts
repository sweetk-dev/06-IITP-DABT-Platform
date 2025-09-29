// Express 앱 설정 및 미들웨어 - 완벽한 모듈화
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/logger';
import { validateRequest } from './middleware/validator';
import { commonRoutes } from './routes/common';
import { dataRoutes } from './routes/data';
import { selfCheckRoutes } from './routes/selfcheck';
import { logger } from './config/logger';
import { env } from './config/env';

export function createApp(): express.Application {
  const app = express();

  // ============================================================================
  // 보안 및 기본 미들웨어
  // ============================================================================
  
  // 보안 헤더 설정
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }));

  // CORS 설정
  app.use(cors({
    origin: env.CORS_ORIGINS,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }));

  // 압축 설정
  app.use(compression());

  // JSON 파싱
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ============================================================================
  // 로깅 미들웨어
  // ============================================================================
  
  app.use(requestLogger);

  // ============================================================================
  // API 라우트
  // ============================================================================
  
  // 공통 API
  app.use('/api/v1', commonRoutes);
  
  // 데이터 관련 API
  app.use('/api/v1/data', dataRoutes);
  
  // 자가진단 관련 API
  app.use('/api/v1/selfcheck', selfCheckRoutes);

  // ============================================================================
  // 에러 처리 미들웨어
  // ============================================================================
  
  app.use(errorHandler);

  // ============================================================================
  // 404 처리
  // ============================================================================
  
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: '요청한 API를 찾을 수 없습니다.',
        details: {
          method: req.method,
          url: req.originalUrl,
        },
      },
    });
  });

  logger.info('Express 앱이 성공적으로 설정되었습니다.', {
    port: env.PORT,
    environment: env.NODE_ENV,
  });

  return app;
}
