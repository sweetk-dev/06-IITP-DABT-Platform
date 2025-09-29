// 공통 API 서비스
import { apiClient } from '../client';
import { 
  CommonHealthRes,
  CommonVersionRes
} from '../../../packages/common/src/types';

export class CommonService {
  /**
   * 헬스 체크
   */
  async getHealth(): Promise<CommonHealthRes> {
    return apiClient.get('GET /api/v1/health');
  }

  /**
   * 버전 정보 조회
   */
  async getVersion(): Promise<CommonVersionRes> {
    return apiClient.get('GET /api/v1/version');
  }
}

// ============================================================================
// 전역 서비스 인스턴스
// ============================================================================

export const commonService = new CommonService();
