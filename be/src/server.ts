// 서버 시작점 - 완벽한 모듈화 (common 패키지 완전 활용)
import { createApp } from './app';
import { connectDatabase } from './config/database';
import { logger } from './config/logger';
import { env } from './config/env';
import { initializeModels } from './models';

async function startServer(): Promise<void> {
  try {
    // ============================================================================
    // 데이터베이스 연결 및 모델 초기화
    // ============================================================================
    
    logger.info('데이터베이스 연결을 시작합니다...');
    await connectDatabase();
    logger.info('데이터베이스 연결이 성공적으로 완료되었습니다.');
    
    logger.info('모델 초기화를 시작합니다...');
    await initializeModels();
    logger.info('모델 초기화가 성공적으로 완료되었습니다.');

    // ============================================================================
    // Express 앱 생성
    // ============================================================================
    
    const app = createApp();

    // ============================================================================
    // 서버 시작
    // ============================================================================
    
    const server = app.listen(env.PORT, () => {
      logger.info('서버가 성공적으로 시작되었습니다.', {
        port: env.PORT,
        environment: env.NODE_ENV,
        timestamp: new Date().toISOString(),
      });
    });

    // ============================================================================
    // Graceful Shutdown 처리
    // ============================================================================
    
    const gracefulShutdown = (signal: string) => {
      logger.info(`${signal} 신호를 받았습니다. 서버를 종료합니다...`);
      
      server.close(() => {
        logger.info('HTTP 서버가 종료되었습니다.');
        process.exit(0);
      });

      // 강제 종료 타임아웃 (10초)
      setTimeout(() => {
        logger.error('강제 종료 타임아웃이 발생했습니다.');
        process.exit(1);
      }, 10000);
    };

    // 종료 신호 처리
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // ============================================================================
    // 예상치 못한 에러 처리
    // ============================================================================
    
    process.on('uncaughtException', (error) => {
      logger.error('예상치 못한 예외가 발생했습니다.', { error });
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('처리되지 않은 Promise 거부가 발생했습니다.', { reason, promise });
      process.exit(1);
    });

  } catch (error) {
    logger.error('서버 시작 중 오류가 발생했습니다.', { error });
    process.exit(1);
  }
}

// 서버 시작
startServer();
