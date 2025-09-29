// 자가진단 서비스 - 완벽한 모듈화 (common 패키지 완전 활용)
import { 
  SelfCheckRecommendationsRes,
  SelfCheckPoliciesRes,
  SelfCheckProvidersRes,
  SelfCheckFacilitiesRes,
  SelfCheckRecommendationsQuery,
  SelfCheckPoliciesQuery,
  SelfCheckProvidersQuery,
  SelfCheckFacilitiesQuery,
  SELF_CHECK_RECOMMENDATIONS_DEFAULTS,
  SELF_CHECK_POLICIES_DEFAULTS,
  SELF_CHECK_PROVIDERS_DEFAULTS,
  SELF_CHECK_FACILITIES_DEFAULTS
} from '@iitp-dabt-platform/common';
import { selfCheckRepository } from '../../repositories/selfcheck';
import { logger } from '../../config/logger';
import { createPaginationParams, createPaginationMeta } from '../../utils/pagination';
import { processFilterConditions } from '../../utils/response';

// 추천 정책 조회 서비스
export async function getRecommendations(query: SelfCheckRecommendationsQuery = {}): Promise<SelfCheckRecommendationsRes> {
  try {
    logger.debug('추천 정책 조회 서비스 실행', { query });
    
    const startTime = Date.now();
    
    // 제한값 처리 - common 패키지의 기본값 활용
    const limit = Math.min(query.limit ?? SELF_CHECK_RECOMMENDATIONS_DEFAULTS.LIMIT, SELF_CHECK_RECOMMENDATIONS_DEFAULTS.MAX_LIMIT);
    
    // 필터 조건 처리
    const filterConditions = processFilterConditions({
      themes: query.themes,
      gender: query.gender,
      disLevel: query.disLevel,
      ageCond: query.ageCond,
    });
    
    // 추천 정책 조회
    const result = await selfCheckRepository.getRecommendations({
      filterConditions,
      limit,
    });
    
    const duration = Date.now() - startTime;
    logger.info('추천 정책 조회 서비스 완료', { 
      count: result.length, 
      limit, 
      duration: `${duration}ms` 
    });
    
    return result;
  } catch (error) {
    logger.error('추천 정책 조회 서비스 오류', { error });
    throw error;
  }
}

// 자립 지원 정책 조회 서비스
export async function getPolicies(query: SelfCheckPoliciesQuery = {}): Promise<SelfCheckPoliciesRes> {
  try {
    logger.debug('자립 지원 정책 조회 서비스 실행', { query });
    
    const startTime = Date.now();
    
    // 페이지네이션 파라미터 적용
    const { page, pageSize } = createPaginationParams(query.page, query.pageSize);
    
    // 필터 조건 처리
    const filterConditions = processFilterConditions({
      themes: query.themes,
      gender: query.gender,
      disLevel: query.disLevel,
      ageCond: query.ageCond,
    });
    
    // 자립 지원 정책 조회
    const { data, totalItems } = await selfCheckRepository.getPolicies({
      filterConditions,
      page,
      pageSize,
    });
    
    // 페이지네이션 메타데이터 생성
    const meta = createPaginationMeta(page, pageSize, totalItems);
    
    const result: SelfCheckPoliciesRes = {
      data,
      meta,
    };
    
    const duration = Date.now() - startTime;
    logger.info('자립 지원 정책 조회 서비스 완료', { 
      count: data.length, 
      totalItems, 
      duration: `${duration}ms` 
    });
    
    return result;
  } catch (error) {
    logger.error('자립 지원 정책 조회 서비스 오류', { error });
    throw error;
  }
}

// 자립 지원 기관 조회 서비스
export async function getProviders(query: SelfCheckProvidersQuery = {}): Promise<SelfCheckProvidersRes> {
  try {
    logger.debug('자립 지원 기관 조회 서비스 실행', { query });
    
    const startTime = Date.now();
    
    // 페이지네이션 파라미터 적용
    const { page, pageSize } = createPaginationParams(query.page, query.pageSize);
    
    // 자립 지원 기관 조회
    const { data, totalItems } = await selfCheckRepository.getProviders({
      page,
      pageSize,
    });
    
    // 페이지네이션 메타데이터 생성
    const meta = createPaginationMeta(page, pageSize, totalItems);
    
    const result: SelfCheckProvidersRes = {
      data,
      meta,
    };
    
    const duration = Date.now() - startTime;
    logger.info('자립 지원 기관 조회 서비스 완료', { 
      count: data.length, 
      totalItems, 
      duration: `${duration}ms` 
    });
    
    return result;
  } catch (error) {
    logger.error('자립 지원 기관 조회 서비스 오류', { error });
    throw error;
  }
}

// 자립 지원 시설 조회 서비스
export async function getFacilities(query: SelfCheckFacilitiesQuery = {}): Promise<SelfCheckFacilitiesRes> {
  try {
    logger.debug('자립 지원 시설 조회 서비스 실행', { query });
    
    const startTime = Date.now();
    
    // 페이지네이션 파라미터 적용
    const { page, pageSize } = createPaginationParams(query.page, query.pageSize);
    
    // 자립 지원 시설 조회
    const { data, totalItems } = await selfCheckRepository.getFacilities({
      page,
      pageSize,
    });
    
    // 페이지네이션 메타데이터 생성
    const meta = createPaginationMeta(page, pageSize, totalItems);
    
    const result: SelfCheckFacilitiesRes = {
      data,
      meta,
    };
    
    const duration = Date.now() - startTime;
    logger.info('자립 지원 시설 조회 서비스 완료', { 
      count: data.length, 
      totalItems, 
      duration: `${duration}ms` 
    });
    
    return result;
  } catch (error) {
    logger.error('자립 지원 시설 조회 서비스 오류', { error });
    throw error;
  }
}

// 서비스 객체 내보내기
export const selfCheckService = {
  getRecommendations,
  getPolicies,
  getProviders,
  getFacilities,
};
