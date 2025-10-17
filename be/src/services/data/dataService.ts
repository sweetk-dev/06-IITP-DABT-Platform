// 데이터 서비스 - 완벽한 모듈화 (common 패키지 완전 활용)
import { 
  DataLatestItem,
  DataThemeCountsRes,
  DataTypeCountsRes,
  DataSearchRes,
  DataThemeItem,
  DataThemeItemsRes,
  DataTypeItem,
  DataTypeItemsRes,
  DataDetailRes,
  DataPreviewRes,
  DataLatestQuery,
  DataSearchQuery,
  DataThemeItemsQuery,
  DataTypeItemsQuery,
  DataPreviewQuery,
  DATA_LATEST_DEFAULTS,
  DATA_SEARCH_DEFAULTS,
  DATA_THEME_ITEMS_DEFAULTS,
  DATA_TYPE_ITEMS_DEFAULTS
} from '@iitp-dabt-platform/common';
import { dataRepository } from '../../repositories/data/dataRepository';
import { logger } from '../../config/logger';
import { createPaginationParams, createPaginationMeta } from '../../utils/pagination';
import { processSortOption, processSearchQuery, processFilterConditions } from '../../utils/response';

// 최신 데이터 조회 서비스
export async function getLatestData(query: DataLatestQuery = {}): Promise<DataLatestItem[]> {
  try {
    logger.debug('최신 데이터 조회 서비스 실행', { query });
    
    const startTime = Date.now();
    
    // 제한값 처리 - common 패키지의 기본값 활용
    const limit = Math.min(query.limit ?? DATA_LATEST_DEFAULTS.LIMIT, DATA_LATEST_DEFAULTS.MAX_LIMIT);
    
    // 정렬 옵션 처리 (최신순)
    const { orderBy, direction } = processSortOption('recent');
    
    // 데이터 조회
    const result = await dataRepository.getLatestData({
      limit,
      orderBy,
      direction,
    });
    
    const duration = Date.now() - startTime;
    logger.info('최신 데이터 조회 서비스 완료', { 
      count: result.length, 
      duration: `${duration}ms` 
    });
    
    return result;
  } catch (error) {
    logger.error('최신 데이터 조회 서비스 오류', { error });
    throw error;
  }
}

// 테마별 건수 조회 서비스
export async function getThemeCounts(): Promise<DataThemeCountsRes> {
  try {
    logger.debug('테마별 건수 조회 서비스 실행');
    
    const startTime = Date.now();
    
    // 테마별 건수 조회
    const result = await dataRepository.getThemeCounts();
    
    const duration = Date.now() - startTime;
    logger.info('테마별 건수 조회 서비스 완료', { 
      result, 
      duration: `${duration}ms` 
    });
    
    return result;
  } catch (error) {
    logger.error('테마별 건수 조회 서비스 오류', { error });
    throw error;
  }
}

// 데이터 유형별 건수 조회 서비스
export async function getTypeCounts(): Promise<DataTypeCountsRes> {
  try {
    logger.debug('데이터 유형별 건수 조회 서비스 실행');
    
    const startTime = Date.now();
    
    // 데이터 유형별 건수 조회
    const result = await dataRepository.getTypeCounts();
    
    const duration = Date.now() - startTime;
    logger.info('데이터 유형별 건수 조회 서비스 완료', { 
      result, 
      duration: `${duration}ms` 
    });
    
    return result;
  } catch (error) {
    logger.error('데이터 유형별 건수 조회 서비스 오류', { error });
    throw error;
  }
}

// 데이터 검색 서비스
export async function searchData(query: DataSearchQuery): Promise<DataSearchRes> {
  try {
    logger.debug('데이터 검색 서비스 실행', { query });
    
    const startTime = Date.now();
    
    // 페이지네이션 파라미터 적용
    const { page, pageSize } = createPaginationParams(query.page, query.pageSize);
    
    // 정렬 옵션 처리
    const { orderBy, direction } = processSortOption(query.sort);
    
    // 검색어 처리
    const searchQuery = processSearchQuery(query.q);
    
    // 필터 조건 처리
    const filterConditions = processFilterConditions({
      themes: query.themes,
      types: query.types,
    });
    
    // 데이터 검색
    const { data, totalItems } = await dataRepository.searchData({
      searchQuery: searchQuery || undefined,
      filterConditions,
      page,
      pageSize,
      orderBy,
      direction,
    });
    
    // 페이지네이션 메타데이터 생성
    const meta = createPaginationMeta(page, pageSize, totalItems);
    
    const result: DataSearchRes = {
      items: data,
      total: totalItems,
      page,
      limit: pageSize,
      totalPages: meta.totalPages,
    };
    
    const duration = Date.now() - startTime;
    logger.info('데이터 검색 서비스 완료', { 
      count: data.length, 
      totalItems, 
      duration: `${duration}ms` 
    });
    
    return result;
  } catch (error) {
    logger.error('데이터 검색 서비스 오류', { error });
    throw error;
  }
}

// 테마 메타데이터 조회 서비스
export async function getThemes(): Promise<DataThemeItem[]> {
  try {
    logger.debug('테마 메타데이터 조회 서비스 실행');
    
    const startTime = Date.now();
    
    // 테마 메타데이터 조회
    const result = await dataRepository.getThemes();
    
    const duration = Date.now() - startTime;
    logger.info('테마 메타데이터 조회 서비스 완료', { 
      count: result.length, 
      duration: `${duration}ms` 
    });
    
    return result;
  } catch (error) {
    logger.error('테마 메타데이터 조회 서비스 오류', { error });
    throw error;
  }
}

// 전체 테마 아이템 조회 서비스 (테마 지정 없음)
export async function getAllThemeItems(query: DataThemeItemsQuery = {}): Promise<DataThemeItemsRes> {
  try {
    logger.debug('전체 테마 아이템 조회 서비스 실행', { query });
    
    // 모든 테마를 검색 조건으로 사용
    const { THEME_CONSTANTS } = await import('@iitp-dabt-platform/common');
    return searchData({
      themes: THEME_CONSTANTS.ALL_CODES.join(','),
      ...query
    });
  } catch (error) {
    logger.error('전체 테마 아이템 조회 서비스 오류', { error });
    throw error;
  }
}

// 테마별 아이템 조회 서비스
export async function getThemeItems(theme: string, query: DataThemeItemsQuery = {}): Promise<DataThemeItemsRes> {
  try {
    logger.debug('테마별 아이템 조회 서비스 실행', { theme, query });
    
    const startTime = Date.now();
    
    // 페이지네이션 파라미터 적용
    const { page, pageSize } = createPaginationParams(query.page, query.pageSize);
    
    // 정렬 옵션 처리
    const { orderBy, direction } = processSortOption(query.sort);
    
    // 테마별 아이템 조회
    const { data, totalItems } = await dataRepository.getThemeItems(theme, {
      page,
      pageSize,
      orderBy,
      direction,
    });
    
    // 페이지네이션 메타데이터 생성
    const meta = createPaginationMeta(page, pageSize, totalItems);
    
    const result: DataThemeItemsRes = {
      items: data,
      total: totalItems,
      page,
      limit: pageSize,
      totalPages: meta.totalPages,
    };
    
    const duration = Date.now() - startTime;
    logger.info('테마별 아이템 조회 서비스 완료', { 
      theme, 
      count: data.length, 
      totalItems, 
      duration: `${duration}ms` 
    });
    
    return result;
  } catch (error) {
    logger.error('테마별 아이템 조회 서비스 오류', { error });
    throw error;
  }
}

// 데이터 유형 메타데이터 조회 서비스
export async function getTypes(): Promise<DataTypeItem[]> {
  try {
    logger.debug('데이터 유형 메타데이터 조회 서비스 실행');
    
    const startTime = Date.now();
    
    // 데이터 유형 메타데이터 조회
    const result = await dataRepository.getTypes();
    
    const duration = Date.now() - startTime;
    logger.info('데이터 유형 메타데이터 조회 서비스 완료', { 
      count: result.length, 
      duration: `${duration}ms` 
    });
    
    return result;
  } catch (error) {
    logger.error('데이터 유형 메타데이터 조회 서비스 오류', { error });
    throw error;
  }
}

// 전체 유형 아이템 조회 서비스 (유형 지정 없음)
export async function getAllTypeItems(query: DataTypeItemsQuery = {}): Promise<DataTypeItemsRes> {
  try {
    logger.debug('전체 유형 아이템 조회 서비스 실행', { query });
    
    // 모든 유형을 검색 조건으로 사용
    const { DATA_TYPE_CONSTANTS } = await import('@iitp-dabt-platform/common');
    return searchData({
      types: DATA_TYPE_CONSTANTS.ALL_CODES.join(','),
      ...query
    });
  } catch (error) {
    logger.error('전체 유형 아이템 조회 서비스 오류', { error });
    throw error;
  }
}

// 데이터 유형별 아이템 조회 서비스
export async function getTypeItems(type: string, query: DataTypeItemsQuery = {}): Promise<DataTypeItemsRes> {
  try {
    logger.debug('데이터 유형별 아이템 조회 서비스 실행', { type, query });
    
    const startTime = Date.now();
    
    // 페이지네이션 파라미터 적용
    const { page, pageSize } = createPaginationParams(query.page, query.pageSize);
    
    // 정렬 옵션 처리
    const { orderBy, direction } = processSortOption(query.sort);
    
    // 데이터 유형별 아이템 조회
    const { data, totalItems } = await dataRepository.getTypeItems(type, {
      page,
      pageSize,
      orderBy,
      direction,
    });
    
    // 페이지네이션 메타데이터 생성
    const meta = createPaginationMeta(page, pageSize, totalItems);
    
    const result: DataTypeItemsRes = {
      items: data,
      total: totalItems,
      page,
      limit: pageSize,
      totalPages: meta.totalPages,
    };
    
    const duration = Date.now() - startTime;
    logger.info('데이터 유형별 아이템 조회 서비스 완료', { 
      type, 
      count: data.length, 
      totalItems, 
      duration: `${duration}ms` 
    });
    
    return result;
  } catch (error) {
    logger.error('데이터 유형별 아이템 조회 서비스 오류', { error });
    throw error;
  }
}

// 데이터 상세 조회 서비스
export async function getDataDetail(id: number): Promise<DataDetailRes> {
  try {
    logger.debug('데이터 상세 조회 서비스 실행', { id });
    
    const startTime = Date.now();
    
    // 데이터 상세 조회
    const result = await dataRepository.getDataDetail(id);
    
    const duration = Date.now() - startTime;
    logger.info('데이터 상세 조회 서비스 완료', { 
      id, 
      duration: `${duration}ms` 
    });
    
    return result;
  } catch (error) {
    logger.error('데이터 상세 조회 서비스 오류', { error });
    throw error;
  }
}

// 데이터 미리보기 조회 서비스
export async function getDataPreview(id: number, query: DataPreviewQuery = {}): Promise<DataPreviewRes> {
  const startTime = Date.now();
  
  try {
    logger.debug('데이터 미리보기 조회 서비스 실행', { id, query });
    
    // 데이터 미리보기 조회
    const result = await dataRepository.getDataPreview(id, query);
    
    const duration = Date.now() - startTime;
    logger.info('데이터 미리보기 조회 완료', { id, duration: `${duration}ms` });
    
    return result;
  } catch (error) {
    // 에러는 Repository/OpenAPI에서 이미 로깅됨, 그대로 전달
    const duration = Date.now() - startTime;
    logger.debug('데이터 미리보기 조회 실패', { id, duration: `${duration}ms` });
    throw error;
  }
}

// 서비스 객체 내보내기
export const dataService = {
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
