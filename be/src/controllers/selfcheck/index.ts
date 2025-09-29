// 자가진단 컨트롤러 - 완벽한 모듈화
import { Request, Response } from 'express';
import { selfCheckService } from '../../services/selfcheck';
import { createSuccessResponse, createPaginatedResponse } from '../../utils/response';
import { logger } from '../../config/logger';
import { GenderCode, DisLevelCode, AgeCondCode } from '@iitp-dabt-platform/common';

// 추천 정책 조회 컨트롤러
export async function getRecommendations(req: Request, res: Response): Promise<void> {
  try {
    const { gender, disLevel, ageCond, themes, limit } = req.query;
    
    logger.debug('추천 정책 조회 요청 처리 시작', { gender, disLevel, ageCond, themes, limit });
    
    const result = await selfCheckService.getRecommendations({
      gender: gender as GenderCode,
      disLevel: disLevel as DisLevelCode,
      ageCond: ageCond as AgeCondCode,
      themes: themes as string,
      limit: limit ? Number(limit) : undefined,
    });
    
    createSuccessResponse(res, result, 200);
    
    logger.debug('추천 정책 조회 요청 처리 완료', { result });
  } catch (error) {
    logger.error('추천 정책 조회 요청 처리 중 오류 발생', { error });
    throw error;
  }
}

// 자립 지원 정책 조회 컨트롤러
export async function getPolicies(req: Request, res: Response): Promise<void> {
  try {
    const { gender, disLevel, ageCond, themes, page, pageSize } = req.query;
    
    logger.debug('자립 지원 정책 조회 요청 처리 시작', { gender, disLevel, ageCond, themes, page, pageSize });
    
    const result = await selfCheckService.getPolicies({
      gender: gender as GenderCode,
      disLevel: disLevel as DisLevelCode,
      ageCond: ageCond as AgeCondCode,
      themes: themes as string,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
    
    createPaginatedResponse(
      res,
      result.items,
      result.page,
      result.limit,
      result.total,
      200
    );
    
    logger.debug('자립 지원 정책 조회 요청 처리 완료', { result });
  } catch (error) {
    logger.error('자립 지원 정책 조회 요청 처리 중 오류 발생', { error });
    throw error;
  }
}

// 자립 지원 기관 조회 컨트롤러
export async function getProviders(req: Request, res: Response): Promise<void> {
  try {
    const { page, pageSize } = req.query;
    
    logger.debug('자립 지원 기관 조회 요청 처리 시작', { page, pageSize });
    
    const result = await selfCheckService.getProviders({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
    
    createPaginatedResponse(
      res,
      result.items,
      result.page,
      result.limit,
      result.total,
      200
    );
    
    logger.debug('자립 지원 기관 조회 요청 처리 완료', { result });
  } catch (error) {
    logger.error('자립 지원 기관 조회 요청 처리 중 오류 발생', { error });
    throw error;
  }
}

// 자립 지원 시설 조회 컨트롤러
export async function getFacilities(req: Request, res: Response): Promise<void> {
  try {
    const { page, pageSize } = req.query;
    
    logger.debug('자립 지원 시설 조회 요청 처리 시작', { page, pageSize });
    
    const result = await selfCheckService.getFacilities({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
    
    createPaginatedResponse(
      res,
      result.items,
      result.page,
      result.limit,
      result.total,
      200
    );
    
    logger.debug('자립 지원 시설 조회 요청 처리 완료', { result });
  } catch (error) {
    logger.error('자립 지원 시설 조회 요청 처리 중 오류 발생', { error });
    throw error;
  }
}

// 컨트롤러 객체 내보내기
export const selfCheckController = {
  getRecommendations,
  getPolicies,
  getProviders,
  getFacilities,
};
