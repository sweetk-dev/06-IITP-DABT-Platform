// 데이터 Repository - 완벽한 모듈화 (common 패키지 완전 활용)
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
  THEME_CONSTANTS,
  DATA_TYPE_CONSTANTS,
  DataTypeCode,
  SelfRltyTypeCode,
  ThemeCode
} from '@iitp-dabt-platform/common';
import { BaseRepository } from '../base/BaseRepository';
import { DataSummaryInfo } from '../../models/data/DataSummaryInfo';
import { SelfDiagDataCategory } from '../../models/data/SelfDiagDataCategory';
import { logger } from '../../config/logger';
import { openApiService } from '../../services/openapi/openApiService';
import { getSequelize } from '../../config/database';
import { Op } from 'sequelize';
import { buildDataOrder } from '../../utils/response';
import { buildVisualUrl } from '../../config/visualDashboards';

// 데이터 Repository 클래스
class DataRepository extends BaseRepository<DataSummaryInfo> {
  constructor() {
    super(DataSummaryInfo, 'DataSummaryInfo');
  }

  // 최신 데이터 조회
  async getLatestData(options: {
    limit: number;
    orderBy: string;
    direction: 'ASC' | 'DESC';
  }): Promise<DataLatestItem[]> {
    try {
      logger.debug('데이터 Repository - 최신 데이터 조회', { options });
      
      const data = await this.model.findAll({
        where: {
          status: 'A',
          del_yn: 'N',
        },
        limit: options.limit,
        // [2026-10] NULL 뒤로 + data_id 보조 정렬 (utils/response.ts buildDataOrder 참고)
        order: buildDataOrder(options.orderBy, options.direction),
        attributes: ['data_id', 'title', 'data_type'],
      });

      return data.map(item => ({
        id: item.data_id,
        title: item.title,
        data_type: item.data_type as DataTypeCode,
      }));
    } catch (error) {
      logger.error('데이터 Repository - 최신 데이터 조회 오류', { error });
      throw error;
    }
  }

  // 테마별 건수 조회
  async getThemeCounts(): Promise<DataThemeCountsRes> {
    try {
      logger.debug('데이터 Repository - 테마별 건수 조회');
      
      const results = await this.aggregate({
        where: {
          status: 'A',
          del_yn: 'N',
        },
        groupBy: ['self_rlty_type'],
        attributes: [
          'self_rlty_type',
          [getSequelize().fn('COUNT', '*'), 'count'],
        ],
      });

      // THEME_CONSTANTS.ALL_CODES를 사용하여 동적으로 초기화
      const counts: DataThemeCountsRes = {} as DataThemeCountsRes;
      THEME_CONSTANTS.ALL_CODES.forEach((code) => {
        counts[code] = 0;
      });

      results.forEach((item: any) => {
        const themeCode = item.self_rlty_type as ThemeCode;
        const count = parseInt(item.dataValues.count);
        
        // THEME_CONSTANTS.ALL_CODES로 검증
        if (THEME_CONSTANTS.ALL_CODES.includes(themeCode)) {
          counts[themeCode] = count;
        }
      });

      return counts;
    } catch (error) {
      logger.error('데이터 Repository - 테마별 건수 조회 오류', { error });
      throw error;
    }
  }

  // 데이터 유형별 건수 조회
  async getTypeCounts(): Promise<DataTypeCountsRes> {
    try {
      logger.debug('데이터 Repository - 데이터 유형별 건수 조회');
      
      const results = await this.aggregate({
        where: {
          status: 'A',
          del_yn: 'N',
        },
        groupBy: ['data_type'],
        attributes: [
          'data_type',
          [getSequelize().fn('COUNT', '*'), 'count'],
        ],
      });

      const counts: DataTypeCountsRes = {
        basic: 0,
        poi: 0,
        emp: 0,
      };

      results.forEach((item: any) => {
        const dataType = item.data_type as DataTypeCode;
        const count = parseInt(item.dataValues.count);
        
        // 유효한 데이터 타입인지 확인
        if (DATA_TYPE_CONSTANTS.ALL_CODES.includes(dataType)) {
          counts[dataType] = count;
        }
      });

      return counts;
    } catch (error) {
      logger.error('데이터 Repository - 데이터 유형별 건수 조회 오류', { error });
      throw error;
    }
  }

  // 데이터 검색
  async searchData(options: {
    searchQuery?: string;
    filterConditions: Record<string, any>;
    page: number;
    pageSize: number;
    orderBy: string;
    direction: 'ASC' | 'DESC';
  }): Promise<{ data: any[]; totalItems: number }> {
    try {
      logger.debug('데이터 Repository - 데이터 검색', { options });
      
      const where: any = {
        status: 'A',
        del_yn: 'N',
      };

      // 필터 조건 적용
      Object.entries(options.filterConditions).forEach(([key, value]) => {
        if (value) {
          if (Array.isArray(value)) {
            where[key] = { [Op.in]: value };
          } else {
            where[key] = value;
          }
        }
      });

      const { data, totalItems } = await this.search({
        searchQuery: options.searchQuery,
        searchFields: ['title'],
        where,
        page: options.page,
        pageSize: options.pageSize,
        order: buildDataOrder(options.orderBy, options.direction),
        attributes: [
          'data_id',
          'title',
          'data_type',
          'self_rlty_type',
          'category',
          'data_keywords',  // ✅ 추가
          'sys_tbl_id',
          'src_org_name',
          'src_latest_chn_dt',
          'sys_data_reg_dt',
          'data_format',    // [2026-10] 목록 "제공 포맷" 표시용 (기존에는 내려주지 않아 화면이 항상 'csv' 로 표시)
        ],
      });

      return {
        data: data.map(item => ({
          id: item.data_id,
          title: item.title,
          data_type: item.data_type as DataTypeCode,
          self_rlty_type: item.self_rlty_type as SelfRltyTypeCode | undefined,
          category: item.category || undefined,
          data_keywords: item.data_keywords || undefined,  // ✅ 추가
          sys_tbl_id: item.sys_tbl_id,
          src_org_name: item.src_org_name,
          src_latest_chn_dt: item.src_latest_chn_dt,
          sys_data_reg_dt: item.sys_data_reg_dt,
          data_format: item.data_format || undefined,
        })),
        totalItems,
      };
    } catch (error) {
      logger.error('데이터 Repository - 데이터 검색 오류', { error });
      throw error;
    }
  }

  // 테마 리스트 조회
  async getThemes(): Promise<DataThemeItem[]> {
    try {
      logger.debug('데이터 Repository - 테마 리스트 조회');
      
      const results = await this.aggregate({
        where: {
          status: 'A',
          del_yn: 'N',
        },
        groupBy: ['self_rlty_type'],
        attributes: [
          'self_rlty_type',
          [getSequelize().fn('COUNT', '*'), 'total_count'],
        ],
      });

      return results.map((item: any) => {
        const themeCode = item.self_rlty_type as ThemeCode;
        const count = parseInt(item.dataValues.total_count);
        const themeInfo = THEME_CONSTANTS.THEMES[themeCode];
        
        return {
          id: themeCode,
          name: themeInfo.name,
          description: themeInfo.description,
          total_count: count,
        };
      });
    } catch (error) {
      logger.error('데이터 Repository - 테마 리스트 조회 오류', { error });
      throw error;
    }
  }

  // 테마별 아이템 조회
  async getThemeItems(theme: string, options: {
    page: number;
    pageSize: number;
    orderBy: string;
    direction: 'ASC' | 'DESC';
  }): Promise<{ data: any[]; totalItems: number }> {
    try {
      logger.debug('데이터 Repository - 테마별 아이템 조회', { theme, options });
      
      // DB에 이미 ThemeCode 형식으로 저장되어 있음
      const themeCode = theme as ThemeCode;
      
      if (!THEME_CONSTANTS.ALL_CODES.includes(themeCode)) {
        throw new Error(`유효하지 않은 테마 코드: ${theme}`);
      }

      const { data, totalItems } = await this.findWithPagination({
        where: {
          status: 'A',
          del_yn: 'N',
          self_rlty_type: themeCode,
        },
        page: options.page,
        pageSize: options.pageSize,
        order: buildDataOrder(options.orderBy, options.direction),
        attributes: [
          'data_id',
          'title',
          'data_type',
          'self_rlty_type',
          'category',
          'data_keywords',  // ✅ 추가
          'sys_tbl_id',
          'src_org_name',
          'src_latest_chn_dt',
          'sys_data_reg_dt',
          'data_format',    // [2026-10] 목록 "제공 포맷" 표시용 (기존에는 내려주지 않아 화면이 항상 'csv' 로 표시)
        ],
      });

      return {
        data: data.map(item => ({
          id: item.data_id,
          title: item.title,
          data_type: item.data_type as DataTypeCode,
          self_rlty_type: item.self_rlty_type as SelfRltyTypeCode | undefined,
          category: item.category || undefined,
          data_keywords: item.data_keywords || undefined,  // ✅ 추가
          sys_tbl_id: item.sys_tbl_id,
          src_org_name: item.src_org_name,
          src_latest_chn_dt: item.src_latest_chn_dt,
          sys_data_reg_dt: item.sys_data_reg_dt,
          data_format: item.data_format || undefined,
        })),
        totalItems,
      };
    } catch (error) {
      logger.error('데이터 Repository - 테마별 아이템 조회 오류', { error });
      throw error;
    }
  }

  // 데이터 유형 리스트 조회
  async getTypes(): Promise<DataTypeItem[]> {
    try {
      logger.debug('데이터 Repository - 데이터 유형 리스트 조회');
      
      const results = await this.aggregate({
        where: {
          status: 'A',
          del_yn: 'N',
        },
        groupBy: ['data_type'],
        attributes: [
          'data_type',
          [getSequelize().fn('COUNT', '*'), 'total_count'],
        ],
      });

      return results.map((item: any) => {
        const dataType = item.data_type as DataTypeCode;
        const count = parseInt(item.dataValues.total_count);
        const typeInfo = DATA_TYPE_CONSTANTS.DATA_TYPES[dataType];
        
        return {
          id: dataType,
          name: typeInfo.name,
          description: typeInfo.description,
          total_count: count,
        };
      });
    } catch (error) {
      logger.error('데이터 Repository - 데이터 유형 리스트 조회 오류', { error });
      throw error;
    }
  }

  // 데이터 유형별 아이템 조회
  async getTypeItems(type: string, options: {
    page: number;
    pageSize: number;
    orderBy: string;
    direction: 'ASC' | 'DESC';
  }): Promise<{ data: any[]; totalItems: number }> {
    try {
      logger.debug('데이터 Repository - 데이터 유형별 아이템 조회', { type, options });
      
      const { data, totalItems } = await this.findWithPagination({
        where: {
          status: 'A',
          del_yn: 'N',
          data_type: type,
        },
        page: options.page,
        pageSize: options.pageSize,
        order: buildDataOrder(options.orderBy, options.direction),
        attributes: [
          'data_id',
          'title',
          'data_type',
          'self_rlty_type',
          'category',
          'data_keywords',  // ✅ 추가
          'sys_tbl_id',
          'src_org_name',
          'src_latest_chn_dt',
          'sys_data_reg_dt',
          'data_format',    // [2026-10] 목록 "제공 포맷" 표시용 (기존에는 내려주지 않아 화면이 항상 'csv' 로 표시)
        ],
      });

      return {
        data: data.map(item => ({
          id: item.data_id,
          title: item.title,
          data_type: item.data_type as DataTypeCode,
          self_rlty_type: item.self_rlty_type as SelfRltyTypeCode | undefined,
          category: item.category || undefined,
          data_keywords: item.data_keywords || undefined,  // ✅ 추가
          sys_tbl_id: item.sys_tbl_id,
          src_org_name: item.src_org_name,
          src_latest_chn_dt: item.src_latest_chn_dt,
          sys_data_reg_dt: item.sys_data_reg_dt,
          data_format: item.data_format || undefined,
        })),
        totalItems,
      };
    } catch (error) {
      logger.error('데이터 Repository - 데이터 유형별 아이템 조회 오류', { error });
      throw error;
    }
  }

  // 데이터 상세 조회
  async getDataDetail(id: number): Promise<DataDetailRes> {
    try {
      logger.debug('데이터 Repository - 데이터 상세 조회', { id });
      
      const item = await this.findOne({
        where: {
          data_id: id,
          status: 'A',
          del_yn: 'N',
        },
        attributes: [
          'data_id',
          'title',
          'data_type',
          'self_rlty_type',
          'category',
          'sys_tbl_id',
          'data_desc',
          'data_keywords',
          'data_format',
          'data_usage_scope',
          'src_org_name',
          'src_latest_chn_dt',
          'sys_data_ref_dt',
          'sys_data_reg_dt',
          'open_api_url',
        ],
      });

      if (!item) {
        throw new Error('데이터를 찾을 수 없습니다.');
      }

      return {
        id: item.data_id,
        title: item.title,
        data_type: item.data_type as DataTypeCode,
        self_rlty_type: item.self_rlty_type as SelfRltyTypeCode | undefined,
        category: item.category || undefined,
        sys_tbl_id: item.sys_tbl_id,
        data_desc: item.data_desc || undefined,
        data_keywords: item.data_keywords || undefined,
        data_format: item.data_format || undefined,
        data_usage_scope: item.data_usage_scope || undefined,
        src_org_name: item.src_org_name,
        src_latest_chn_dt: item.src_latest_chn_dt,
        sys_data_ref_dt: item.sys_data_ref_dt || undefined,
        sys_data_reg_dt: item.sys_data_reg_dt,
        open_api_url: item.open_api_url,
        // [2026-10] 상세 화면 시각화(Metabase 공개 대시보드) 임베드 주소.
        // sys_tbl_id 별 대시보드 매핑은 config/visualDashboards.json (없으면 기본 대시보드, 기능 꺼짐이면 undefined)
        visual_url: buildVisualUrl(item.sys_tbl_id),
      };
    } catch (error) {
      logger.error('데이터 Repository - 데이터 상세 조회 오류', { error });
      throw error;
    }
  }

  // 데이터 미리보기 조회
  async getDataPreview(id: number, query: any): Promise<DataPreviewRes> {
    try {
      logger.debug('데이터 Repository - 데이터 미리보기 조회 시작', { id, query });
      
      // 데이터 상세 정보 조회 (open_api_url 필요)
      const item = await this.findOne({
        where: {
          data_id: id,
          status: 'A',
          del_yn: 'N',
        },
        // title: 로깅용, data_type: [2026-10] 기초(통계) 데이터 미리보기 정렬(최신 연도 우선) 판단용
        attributes: ['data_id', 'title', 'open_api_url', 'data_type'],
      });

      if (!item) {
        const notFoundError = new Error('데이터를 찾을 수 없습니다.') as any;
        notFoundError.statusCode = 404;
        throw notFoundError;
      }

      if (!item.open_api_url) {
        logger.warn('OpenAPI URL이 DB에 설정되지 않음', { 
          data_id: item.data_id, 
          title: item.title 
        });
        const configError = new Error('OpenAPI URL이 설정되지 않았습니다.') as any;
        configError.statusCode = 500;
        throw configError;
      }

      // DB에서 조회한 URL 로깅
      logger.info('DB에서 OpenAPI URL 조회 완료', {
        data_id: item.data_id,
        title: item.title,
        open_api_url: item.open_api_url,  // ← DB 원본 URL
        hasTemplate: item.open_api_url.includes('{{P_SIZE}}'),
        query
      });

      // OpenAPI 서비스를 통해 실제 데이터 조회
      // [2026-10] 기초(통계, basic) 데이터는 09 Open API 가 prd_de(통계연도) 오름차순으로 주고
      //   여기서 앞쪽 N건만 잘라 보내기 때문에 화면에는 가장 오래된 연도만 보였다.
      //   → basic 이면 자르기 전에 연도 내림차순으로 정렬하도록 옵션 전달 (그 외 유형은 기존 순서 유지)
      const result = await openApiService.getDataPreview(item.open_api_url, query, {
        sortByPeriodDesc: item.data_type === 'basic',
      });
      
      return result;
    } catch (error) {
      // OpenAPI 에러는 그대로 전달 (statusCode, openApiError 보존)
      // DB 조회 에러만 로깅 추가
      if (!(error as any).openApiError) {
        logger.error('데이터 Repository - 데이터 미리보기 조회 오류', { 
          id, 
          error: error instanceof Error ? error.message : String(error) 
        });
      }
      throw error;
    }
  }
}

// Repository 인스턴스 생성 및 내보내기
export const dataRepository = new DataRepository();
