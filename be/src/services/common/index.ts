// 공통 서비스 - 완벽한 모듈화
import { 
  CommonHealthRes, 
  CommonVersionRes 
} from '../../../../packages/common/src/types';
import { logger } from '../../config/logger';
import { env } from '../../config/env';

// 헬스 체크 서비스
export async function getHealth(): Promise<CommonHealthRes> {
  try {
    logger.debug('헬스 체크 서비스 실행');
    
    const startTime = Date.now();
    
    // 서버 상태 확인
    const status = 'ok';
    const timestamp = new Date().toISOString();
    const uptime = process.uptime();
    
    const result: CommonHealthRes = {
      status,
      timestamp,
      uptime,
    };
    
    const duration = Date.now() - startTime;
    logger.info('헬스 체크 서비스 완료', { 
      status, 
      uptime, 
      duration: `${duration}ms` 
    });
    
    return result;
  } catch (error) {
    logger.error('헬스 체크 서비스 오류', { error });
    throw error;
  }
}

// 버전 정보 서비스
export async function getVersion(): Promise<CommonVersionRes> {
  try {
    logger.debug('버전 정보 서비스 실행');
    
    const startTime = Date.now();
    
    // 버전 정보 생성
    const version = process.env.npm_package_version || '1.0.0';
    const buildDate = process.env.BUILD_DATE || new Date().toISOString();
    const environment = env.NODE_ENV;
    
    const result: CommonVersionRes = {
      version,
      buildDate,
      environment,
    };
    
    const duration = Date.now() - startTime;
    logger.info('버전 정보 서비스 완료', { 
      version, 
      environment, 
      duration: `${duration}ms` 
    });
    
    return result;
  } catch (error) {
    logger.error('버전 정보 서비스 오류', { error });
    throw error;
  }
}

// 서비스 객체 내보내기
export const commonService = {
  getHealth,
  getVersion,
};
