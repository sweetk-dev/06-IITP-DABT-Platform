// 데이터 컨트롤러 - 완벽한 모듈화
import { Request, Response } from 'express';
import { dataService } from '../../services/data/dataService';
import { createSuccessResponse, createPaginatedResponse } from '../../utils/response';
import { logger } from '../../config/logger';
import { SortOption } from '@iitp-dabt-platform/common';

// 최신 데이터 조회 컨트롤러
export async function getLatestData(req: Request, res: Response): Promise<void> {
  try {
    const { page, pageSize } = req.query;
    
    logger.debug('최신 데이터 조회 요청 처리 시작', { page, pageSize });
    
    const result = await dataService.getLatestData({
      limit: pageSize ? Number(pageSize) : undefined,
    });
    
    createSuccessResponse(res, result, 200);
    
    logger.debug('최신 데이터 조회 요청 처리 완료', { result });
  } catch (error) {
    logger.error('최신 데이터 조회 요청 처리 중 오류 발생', { error });
    throw error;
  }
}

// 테마별 건수 조회 컨트롤러
export async function getThemeCounts(req: Request, res: Response): Promise<void> {
  try {
    logger.debug('테마별 건수 조회 요청 처리 시작');
    
    const result = await dataService.getThemeCounts();
    
    createSuccessResponse(res, result, 200);
    
    logger.debug('테마별 건수 조회 요청 처리 완료', { result });
  } catch (error) {
    logger.error('테마별 건수 조회 요청 처리 중 오류 발생', { error });
    throw error;
  }
}

// 데이터 유형별 건수 조회 컨트롤러
export async function getTypeCounts(req: Request, res: Response): Promise<void> {
  try {
    logger.debug('데이터 유형별 건수 조회 요청 처리 시작');
    
    const result = await dataService.getTypeCounts();
    
    createSuccessResponse(res, result, 200);
    
    logger.debug('데이터 유형별 건수 조회 요청 처리 완료', { result });
  } catch (error) {
    logger.error('데이터 유형별 건수 조회 요청 처리 중 오류 발생', { error });
    throw error;
  }
}

// 데이터 검색 컨트롤러
export async function searchData(req: Request, res: Response): Promise<void> {
  try {
    const { q, themes, types, page, pageSize, sort } = req.query;
    
    logger.debug('데이터 검색 요청 처리 시작', { q, themes, types, page, pageSize, sort });
    
    const result = await dataService.searchData({
      q: q as string,
      themes: themes as string,
      types: types as string,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      sort: sort as SortOption,
    });
    
    createPaginatedResponse(
      res,
      result.items,
      result.page,
      result.limit,
      result.total,
      200
    );
    
    logger.debug('데이터 검색 요청 처리 완료', { result });
  } catch (error) {
    logger.error('데이터 검색 요청 처리 중 오류 발생', { error });
    throw error;
  }
}

// 테마 메타데이터 조회 컨트롤러
export async function getThemes(req: Request, res: Response): Promise<void> {
  try {
    logger.debug('테마 메타데이터 조회 요청 처리 시작');
    
    const result = await dataService.getThemes();
    
    createSuccessResponse(res, result, 200);
    
    logger.debug('테마 메타데이터 조회 요청 처리 완료', { result });
  } catch (error) {
    logger.error('테마 메타데이터 조회 요청 처리 중 오류 발생', { error });
    throw error;
  }
}

// 전체 테마 아이템 조회 컨트롤러 (테마 지정 없음)
export async function getAllThemeItems(req: Request, res: Response): Promise<void> {
  try {
    const { page, pageSize, sort } = req.query;
    
    logger.debug('전체 테마 아이템 조회 요청 처리 시작', { page, pageSize, sort });
    
    const result = await dataService.getAllThemeItems({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      sort: sort as SortOption,
    });
    
    createPaginatedResponse(
      res,
      result.items,
      result.page,
      result.limit,
      result.total,
      200
    );
    
    logger.debug('전체 테마 아이템 조회 요청 처리 완료', { result });
  } catch (error) {
    logger.error('전체 테마 아이템 조회 요청 처리 중 오류 발생', { error });
    throw error;
  }
}

// 테마별 아이템 조회 컨트롤러
export async function getThemeItems(req: Request, res: Response): Promise<void> {
  try {
    // paramConverter에서 변환된 파라미터 사용 (타입 안전성 보장)
    const { theme } = req.convertedParams || req.params;
    const { page, pageSize, sort } = req.query;
    
    logger.debug('테마별 아이템 조회 요청 처리 시작', { theme, page, pageSize, sort });
    
    const result = await dataService.getThemeItems(theme as string, {
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      sort: sort as SortOption,
    });
    
    createPaginatedResponse(
      res,
      result.items,
      result.page,
      result.limit,
      result.total,
      200
    );
    
    logger.debug('테마별 아이템 조회 요청 처리 완료', { result });
  } catch (error) {
    logger.error('테마별 아이템 조회 요청 처리 중 오류 발생', { error });
    throw error;
  }
}

// 데이터 유형 메타데이터 조회 컨트롤러
export async function getTypes(req: Request, res: Response): Promise<void> {
  try {
    logger.debug('데이터 유형 메타데이터 조회 요청 처리 시작');
    
    const result = await dataService.getTypes();
    
    createSuccessResponse(res, result, 200);
    
    logger.debug('데이터 유형 메타데이터 조회 요청 처리 완료', { result });
  } catch (error) {
    logger.error('데이터 유형 메타데이터 조회 요청 처리 중 오류 발생', { error });
    throw error;
  }
}

// 전체 유형 아이템 조회 컨트롤러 (유형 지정 없음)
export async function getAllTypeItems(req: Request, res: Response): Promise<void> {
  try {
    const { page, pageSize, sort } = req.query;
    
    logger.debug('전체 유형 아이템 조회 요청 처리 시작', { page, pageSize, sort });
    
    const result = await dataService.getAllTypeItems({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      sort: sort as SortOption,
    });
    
    createPaginatedResponse(
      res,
      result.items,
      result.page,
      result.limit,
      result.total,
      200
    );
    
    logger.debug('전체 유형 아이템 조회 요청 처리 완료', { result });
  } catch (error) {
    logger.error('전체 유형 아이템 조회 요청 처리 중 오류 발생', { error });
    throw error;
  }
}

// 데이터 유형별 아이템 조회 컨트롤러
export async function getTypeItems(req: Request, res: Response): Promise<void> {
  try {
    // paramConverter에서 변환된 파라미터 사용 (타입 안전성 보장)
    const { type } = req.convertedParams || req.params;
    const { page, pageSize, sort } = req.query;
    
    logger.debug('데이터 유형별 아이템 조회 요청 처리 시작', { type, page, pageSize, sort });
    
    const result = await dataService.getTypeItems(type as string, {
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      sort: sort as SortOption,
    });
    
    createPaginatedResponse(
      res,
      result.items,
      result.page,
      result.limit,
      result.total,
      200
    );
    
    logger.debug('데이터 유형별 아이템 조회 요청 처리 완료', { result });
  } catch (error) {
    logger.error('데이터 유형별 아이템 조회 요청 처리 중 오류 발생', { error });
    throw error;
  }
}

// 데이터 상세 조회 컨트롤러
export async function getDataDetail(req: Request, res: Response): Promise<void> {
  try {
    // paramConverter에서 변환된 파라미터 사용 (타입 안전성 보장)
    const { id } = req.convertedParams || req.params;
    
    logger.debug('데이터 상세 조회 요청 처리 시작', { id });
    
    const result = await dataService.getDataDetail(id);
    
    createSuccessResponse(res, result, 200);
    
    logger.debug('데이터 상세 조회 요청 처리 완료', { result });
  } catch (error) {
    logger.error('데이터 상세 조회 요청 처리 중 오류 발생', { error });
    throw error;
  }
}

// 데이터 미리보기 조회 컨트롤러
export async function getDataPreview(req: Request, res: Response): Promise<void> {
  try {
    // paramConverter에서 변환된 파라미터 사용 (타입 안전성 보장)
    const { id } = req.convertedParams || req.params;
    const { page, pageSize } = req.query;
    
    logger.debug('데이터 미리보기 조회 요청 처리 시작', { id, page, pageSize });
    
    const result = await dataService.getDataPreview(id, {
      limit: pageSize ? Number(pageSize) : undefined,
      offset: page ? Number(page) * (pageSize ? Number(pageSize) : 10) : undefined,
    });
    
    createSuccessResponse(res, result, 200);
    
    logger.debug('데이터 미리보기 조회 요청 처리 완료', { result });
  } catch (error) {
    logger.error('데이터 미리보기 조회 요청 처리 중 오류 발생', { error });
    throw error;
  }
}

// 컨트롤러 객체 내보내기
export const dataController = {
  getLatestData,
  getThemeCounts,
  getTypeCounts,
  searchData,
  getThemes,
  getAllThemeItems,
  getThemeItems,
  getTypes,
  getAllTypeItems,
  getTypeItems,
  getDataDetail,
  getDataPreview,
};
