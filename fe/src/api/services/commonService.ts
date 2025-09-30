// 공통 API 서비스 - common 패키지의 모든 API 타입 활용
import { apiClient } from '../client';
import { 
  FULL_API_URLS,
  CommonHealthRes,
  CommonVersionRes
} from '@iitp-dabt-platform/common';

export class CommonService {
  /**
   * 헬스 체크
   */
  async getHealth(): Promise<CommonHealthRes> {
    return apiClient.get(`GET ${FULL_API_URLS.COMMON.HEALTH_CHECK}`);
  }

  /**
   * 버전 정보 조회
   */
  async getVersion(): Promise<CommonVersionRes> {
    return apiClient.get(`GET ${FULL_API_URLS.COMMON.VERSION}`);
  }
}

// ============================================================================
// 전역 서비스 인스턴스
// ============================================================================

export const commonService = new CommonService();
