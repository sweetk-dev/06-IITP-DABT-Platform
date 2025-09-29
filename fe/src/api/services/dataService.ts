// 데이터 API 서비스
import { apiClient } from '../client';
import { 
  DataLatestQuery,
  DataLatestRes,
  DataThemeCountsRes,
  DataTypeCountsRes,
  DataSearchQuery,
  DataSearchRes,
  DataThemesRes,
  DataTypesRes,
  DataThemeItemsQuery,
  DataThemeItemsRes,
  DataTypeItemsQuery,
  DataTypeItemsRes,
  DataDetailRes,
  DataPreviewQuery,
  DataPreviewRes
} from '../../../packages/common/src/types';

export class DataService {
  /**
   * 최신 데이터 리스트 조회
   */
  async getLatestData(query: DataLatestQuery = {}): Promise<DataLatestRes> {
    return apiClient.get('GET /api/v1/data/summary/latest', { query });
  }

  /**
   * 자립테마 데이터 건수 조회
   */
  async getThemeCounts(): Promise<DataThemeCountsRes> {
    return apiClient.get('GET /api/v1/data/counts/themes');
  }

  /**
   * 데이터 유형별 데이터 건수 조회
   */
  async getTypeCounts(): Promise<DataTypeCountsRes> {
    return apiClient.get('GET /api/v1/data/counts/types');
  }

  /**
   * 데이터 검색
   */
  async searchData(query: DataSearchQuery): Promise<DataSearchRes> {
    return apiClient.get('GET /api/v1/data/search', { query });
  }

  /**
   * 자립 테마 리스트 전체 조회
   */
  async getThemes(): Promise<DataThemesRes> {
    return apiClient.get('GET /api/v1/data/themes');
  }

  /**
   * 데이터 유형 리스트 전체 조회
   */
  async getTypes(): Promise<DataTypesRes> {
    return apiClient.get('GET /api/v1/data/types');
  }

  /**
   * 자립 테마별 리스트 조회
   */
  async getThemeItems(theme: string, query: DataThemeItemsQuery = {}): Promise<DataThemeItemsRes> {
    return apiClient.get('GET /api/v1/data/themes/{theme}/items' as any, {
      params: { theme },
      query
    });
  }

  /**
   * 데이터 유형별 리스트 조회
   */
  async getTypeItems(type: string, query: DataTypeItemsQuery = {}): Promise<DataTypeItemsRes> {
    return apiClient.get('GET /api/v1/data/types/{type}/items' as any, {
      params: { type },
      query
    });
  }

  /**
   * 데이터 상세 정보 조회
   */
  async getDataDetail(id: number): Promise<DataDetailRes> {
    return apiClient.get('GET /api/v1/data/{id}' as any, {
      params: { id }
    });
  }

  /**
   * 데이터 미리보기 조회
   */
  async getDataPreview(id: number, query: DataPreviewQuery = {}): Promise<DataPreviewRes> {
    return apiClient.get('GET /api/v1/data/{id}/preview' as any, {
      params: { id },
      query
    });
  }
}

// ============================================================================
// 전역 서비스 인스턴스
// ============================================================================

export const dataService = new DataService();
