// 데이터 API 서비스 - common 패키지의 모든 API 타입 활용
import { apiClient } from '../client';
import { 
  FULL_API_URLS,
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
} from '@iitp-dabt-platform/common';

export class DataService {
  /**
   * 최신 데이터 리스트 조회
   */
  async getLatestData(query: DataLatestQuery = {}): Promise<DataLatestRes> {
    return apiClient.get(`GET ${FULL_API_URLS.DATA.LATEST}`, { query });
  }

  /**
   * 자립테마 데이터 건수 조회
   */
  async getThemeCounts(): Promise<DataThemeCountsRes> {
    return apiClient.get(`GET ${FULL_API_URLS.DATA.THEME_COUNTS}`);
  }

  /**
   * 데이터 유형별 데이터 건수 조회
   */
  async getTypeCounts(): Promise<DataTypeCountsRes> {
    return apiClient.get(`GET ${FULL_API_URLS.DATA.TYPE_COUNTS}`);
  }

  /**
   * 데이터 검색
   */
  async searchData(query: DataSearchQuery): Promise<DataSearchRes> {
    return apiClient.get(`GET ${FULL_API_URLS.DATA.SEARCH}`, { query });
  }

  /**
   * 자립 테마 메타데이터 전체 조회
   */
  async getThemes(): Promise<DataThemesRes> {
    return apiClient.get(`GET ${FULL_API_URLS.DATA.THEMES}`);
  }

  /**
   * 전체 테마 아이템 조회 (테마 지정 없음)
   */
  async getAllThemeItems(query: DataThemeItemsQuery = {}): Promise<DataThemeItemsRes> {
    return apiClient.get(`GET ${FULL_API_URLS.DATA.THEMES_ITEMS_ALL}`, { query });
  }

  /**
   * 자립 테마별 리스트 조회
   */
  async getThemeItems(theme: string, query: DataThemeItemsQuery = {}): Promise<DataThemeItemsRes> {
    return apiClient.get(`GET ${FULL_API_URLS.DATA.THEME_ITEMS(theme)}`, { query });
  }

  /**
   * 데이터 유형 메타데이터 전체 조회
   */
  async getTypes(): Promise<DataTypesRes> {
    return apiClient.get(`GET ${FULL_API_URLS.DATA.TYPES}`);
  }

  /**
   * 전체 유형 아이템 조회 (유형 지정 없음)
   */
  async getAllTypeItems(query: DataTypeItemsQuery = {}): Promise<DataTypeItemsRes> {
    return apiClient.get(`GET ${FULL_API_URLS.DATA.TYPES_ITEMS_ALL}`, { query });
  }

  /**
   * 데이터 유형별 리스트 조회
   */
  async getTypeItems(type: string, query: DataTypeItemsQuery = {}): Promise<DataTypeItemsRes> {
    return apiClient.get(`GET ${FULL_API_URLS.DATA.TYPE_ITEMS(type)}`, { query });
  }

  /**
   * 데이터 상세 정보 조회
   */
  async getDataDetail(id: number): Promise<DataDetailRes> {
    return apiClient.get(`GET ${FULL_API_URLS.DATA.DETAIL(id)}`);
  }

  /**
   * 데이터 미리보기 조회
   */
  async getDataPreview(id: number, query: DataPreviewQuery = {}): Promise<DataPreviewRes> {
    return apiClient.get(`GET ${FULL_API_URLS.DATA.PREVIEW(id)}`, { query });
  }
}

// ============================================================================
// 전역 서비스 인스턴스
// ============================================================================

export const dataService = new DataService();
