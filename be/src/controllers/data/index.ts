// 데이터 컨트롤러 - 완벽한 모듈화
import { Request, Response } from 'express';
import { dataService } from '../../services/data';
import { createSuccessResponse, createPaginatedResponse } from '../../utils/response';
import { logger } from '../../config/logger';

// 최신 데이터 조회 컨트롤러
export async function getLatestData(req: Request, res: Response): Promise<void> {
  try {
    const { page, pageSize } = req.query;
    
    logger.debug('최신 데이터 조회 요청 처리 시작', { page, pageSize });
    
    const result = await dataService.getLatestData({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
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
      sort: sort as string,
    });
    
    createPaginatedResponse(
      res,
      result.data,
      result.meta.page,
      result.meta.pageSize,
      result.meta.totalItems,
      200,
      { sort: result.meta.sort }
    );
    
    logger.debug('데이터 검색 요청 처리 완료', { result });
  } catch (error) {
    logger.error('데이터 검색 요청 처리 중 오류 발생', { error });
    throw error;
  }
}

// 테마 리스트 조회 컨트롤러
export async function getThemes(req: Request, res: Response): Promise<void> {
  try {
    logger.debug('테마 리스트 조회 요청 처리 시작');
    
    const result = await dataService.getThemes();
    
    createSuccessResponse(res, result, 200);
    
    logger.debug('테마 리스트 조회 요청 처리 완료', { result });
  } catch (error) {
    logger.error('테마 리스트 조회 요청 처리 중 오류 발생', { error });
    throw error;
  }
}

// 테마별 아이템 조회 컨트롤러
export async function getThemeItems(req: Request, res: Response): Promise<void> {
  try {
    const { theme } = req.params;
    const { page, pageSize, sort } = req.query;
    
    logger.debug('테마별 아이템 조회 요청 처리 시작', { theme, page, pageSize, sort });
    
    const result = await dataService.getThemeItems(theme, {
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      sort: sort as string,
    });
    
    createPaginatedResponse(
      res,
      result.data,
      result.meta.page,
      result.meta.pageSize,
      result.meta.totalItems,
      200,
      { theme, sort: result.meta.sort }
    );
    
    logger.debug('테마별 아이템 조회 요청 처리 완료', { result });
  } catch (error) {
    logger.error('테마별 아이템 조회 요청 처리 중 오류 발생', { error });
    throw error;
  }
}

// 데이터 유형 리스트 조회 컨트롤러
export async function getTypes(req: Request, res: Response): Promise<void> {
  try {
    logger.debug('데이터 유형 리스트 조회 요청 처리 시작');
    
    const result = await dataService.getTypes();
    
    createSuccessResponse(res, result, 200);
    
    logger.debug('데이터 유형 리스트 조회 요청 처리 완료', { result });
  } catch (error) {
    logger.error('데이터 유형 리스트 조회 요청 처리 중 오류 발생', { error });
    throw error;
  }
}

// 데이터 유형별 아이템 조회 컨트롤러
export async function getTypeItems(req: Request, res: Response): Promise<void> {
  try {
    const { type } = req.params;
    const { page, pageSize, sort } = req.query;
    
    logger.debug('데이터 유형별 아이템 조회 요청 처리 시작', { type, page, pageSize, sort });
    
    const result = await dataService.getTypeItems(type, {
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      sort: sort as string,
    });
    
    createPaginatedResponse(
      res,
      result.data,
      result.meta.page,
      result.meta.pageSize,
      result.meta.totalItems,
      200,
      { type, sort: result.meta.sort }
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
    const { id } = req.params;
    
    logger.debug('데이터 상세 조회 요청 처리 시작', { id });
    
    const result = await dataService.getDataDetail(Number(id));
    
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
    const { id } = req.params;
    const { page, pageSize } = req.query;
    
    logger.debug('데이터 미리보기 조회 요청 처리 시작', { id, page, pageSize });
    
    const result = await dataService.getDataPreview(Number(id), {
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
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
  getThemeItems,
  getTypes,
  getTypeItems,
  getDataDetail,
  getDataPreview,
};
