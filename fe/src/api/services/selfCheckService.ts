// 자가진단 API 서비스 - common 패키지의 모든 API 타입 활용
import { apiClient } from '../client';
import { 
  API_URLS,
  SelfCheckRecommendationsQuery,
  SelfCheckRecommendationsRes,
  SelfCheckPoliciesQuery,
  SelfCheckPoliciesRes,
  SelfCheckProvidersQuery,
  SelfCheckProvidersRes,
  SelfCheckFacilitiesQuery,
  SelfCheckFacilitiesRes
} from '@iitp-dabt-platform/common';

export class SelfCheckService {
  /**
   * 추천 정책 리스트 조회
   */
  async getRecommendations(query: SelfCheckRecommendationsQuery): Promise<SelfCheckRecommendationsRes> {
    return apiClient.get(`GET ${API_URLS.SELF_CHK.RECOMMENDATIONS}`, { query });
  }

  /**
   * 자립 지원 정책 리스트 조회
   */
  async getPolicies(query: SelfCheckPoliciesQuery = {}): Promise<SelfCheckPoliciesRes> {
    return apiClient.get(`GET ${API_URLS.SELF_CHK.POLICIES}`, { query });
  }

  /**
   * 자립 지원 기관 리스트 조회
   */
  async getProviders(query: SelfCheckProvidersQuery = {}): Promise<SelfCheckProvidersRes> {
    return apiClient.get(`GET ${API_URLS.SELF_CHK.PROVIDERS}`, { query });
  }

  /**
   * 자립 지원 시설 리스트 조회
   */
  async getFacilities(query: SelfCheckFacilitiesQuery = {}): Promise<SelfCheckFacilitiesRes> {
    return apiClient.get(`GET ${API_URLS.SELF_CHK.FACILITIES}`, { query });
  }
}

// ============================================================================
// 전역 서비스 인스턴스
// ============================================================================

export const selfCheckService = new SelfCheckService();
