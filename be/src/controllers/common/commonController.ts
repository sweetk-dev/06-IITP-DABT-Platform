// 공통 컨트롤러 - 완벽한 모듈화
import { Request, Response } from 'express';
import { commonService } from '../../services/common/commonService';
import { createSuccessResponse } from '../../utils/response';
import { logger } from '../../config/logger';

// 헬스 체크 컨트롤러
export async function getHealth(req: Request, res: Response): Promise<void> {
  try {
    logger.debug('헬스 체크 요청 처리 시작');
    
    const result = await commonService.getHealth();
    
    createSuccessResponse(res, result, 200);
    
    logger.debug('헬스 체크 요청 처리 완료', { result });
  } catch (error) {
    logger.error('헬스 체크 요청 처리 중 오류 발생', { error });
    throw error;
  }
}

// 버전 정보 컨트롤러
export async function getVersion(req: Request, res: Response): Promise<void> {
  try {
    logger.debug('버전 정보 요청 처리 시작');
    
    const result = await commonService.getVersion();
    
    createSuccessResponse(res, result, 200);
    
    logger.debug('버전 정보 요청 처리 완료', { result });
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
