// 공통 컨트롤러 - Service Layer 없이 직접 처리
import { Request, Response } from 'express';
import { createSuccessResponse } from '../../utils/response';
import { logger } from '../../config/logger';
import { env } from '../../config/env';
import { CommonHealthRes, CommonVersionRes } from '@iitp-dabt-platform/common';
import { readFileSync } from 'fs';
import { join } from 'path';

// 헬스 체크 컨트롤러
export async function getHealth(req: Request, res: Response): Promise<void> {
  try {
    logger.debug('헬스 체크 요청 처리 시작');
    
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
    logger.info('헬스 체크 완료', { 
      status, 
      uptime, 
      duration: `${duration}ms` 
    });
    
    createSuccessResponse(res, result, 200);
  } catch (error) {
    logger.error('헬스 체크 요청 처리 중 오류 발생', { error });
    throw error;
  }
}

// 버전 정보 컨트롤러
export async function getVersion(req: Request, res: Response): Promise<void> {
  try {
    logger.debug('버전 정보 요청 처리 시작');
    
    const startTime = Date.now();
    
    // build-info.json에서 빌드 정보 가져오기
    let version: string | undefined;
    let buildDate: string | undefined;
    let buildNumber: string | undefined;
    
    try {
      // controllers/common/ → dist/ (2단계 위)
      const buildInfoPath = join(__dirname, '../../build-info.json');
      const buildInfo = JSON.parse(readFileSync(buildInfoPath, 'utf8'));
      
      version = buildInfo.version;
      buildDate = buildInfo.buildDate;
      buildNumber = buildInfo.buildNumber;
      
      logger.debug('빌드 정보 파일에서 데이터 로드', { buildInfo });
    } catch (error) {
      logger.warn('빌드 정보 파일을 읽을 수 없습니다.', { 
        error: error instanceof Error ? error.message : String(error) 
      });
      
      // 빌드 정보가 없으면 package.json에서 읽기
      try {
        const packageJsonPath = join(__dirname, '../../package.json');
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
        version = packageJson.version;
      } catch (pkgError) {
        logger.error('package.json도 읽을 수 없습니다.', { pkgError });
      }
    }
    
    // 환경 정보는 런타임에 결정 (빌드 시점이 아님)
    const environment = env.NODE_ENV;
    
    const result: CommonVersionRes = {
      version,
      buildDate,
      buildNumber,
      environment,
    };
    
    const duration = Date.now() - startTime;
    logger.info('버전 정보 조회 완료', { 
      version, 
      buildDate,
      buildNumber,
      environment, 
      duration: `${duration}ms` 
    });
    
    createSuccessResponse(res, result, 200);
  } catch (error) {
    logger.error('버전 정보 요청 처리 중 오류 발생', { error });
    throw error;
  }
}

// 컨트롤러 객체 내보내기
export const commonController = {
  getHealth,
  getVersion,
};
