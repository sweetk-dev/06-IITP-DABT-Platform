// 데이터 Repository - 완벽한 모듈화
import { 
  DataLatestRes,
  DataThemeCountsRes,
  DataTypeCountsRes,
  DataSearchRes,
  DataThemesRes,
  DataThemeItemsRes,
  DataTypesRes,
  DataTypeItemsRes,
  DataDetailRes,
  DataPreviewRes
} from '../../../../packages/common/src/types';
import { BaseRepository } from '../base/BaseRepository';
import { DataSummaryInfo } from '../../models/data/DataSummaryInfo';
import { SelfDiagDataCategory } from '../../models/data/SelfDiagDataCategory';
import { logger } from '../../config/logger';
import { getSequelize } from '../../config/database';

// 데이터 Repository 클래스
class DataRepository extends BaseRepository<DataSummaryInfo> {
  constructor() {
    super(DataSummaryInfo, 'DataSummaryInfo');
  }

  // 최신 데이터 조회
  async getLatestData(options: {
    page: number;
    pageSize: number;
    orderBy: string;
    direction: 'ASC' | 'DESC';
  }): Promise<DataLatestRes> {
    try {
      logger.debug('데이터 Repository - 최신 데이터 조회', { options });
      
      const { data } = await this.findWithPagination({
        where: {
          status: 'A',
          del_yn: 'N',
        },
        page: options.page,
        pageSize: options.pageSize,
        order: [[options.orderBy, options.direction]],
        attributes: ['data_id', 'title', 'data_type'],
      });

      return data.map(item => ({
        id: item.data_id,
        title: item.title,
        data_type: item.data_type,
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
        groupBy: ['self_rel_type'],
        attributes: [
          'self_rel_type',
          [getSequelize().fn('COUNT', '*'), 'count'],
        ],
      });

      const counts = {
        phy: 0,
        emo: 0,
        econ: 0,
        soc: 0,
      };

      results.forEach((item: any) => {
        const theme = item.self_rel_type;
        const count = parseInt(item.dataValues.count);
        
        if (theme === 'physical') counts.phy = count;
        else if (theme === 'emotional') counts.emo = count;
        else if (theme === 'economic') counts.econ = count;
        else if (theme === 'social') counts.soc = count;
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

      const counts = {
        basic: 0,
        poi: 0,
        emp: 0,
      };

      results.forEach((item: any) => {
        const type = item.data_type;
        const count = parseInt(item.dataValues.count);
        
        if (type === 'basic') counts.basic = count;
        else if (type === 'poi') counts.poi = count;
        else if (type === 'emp') counts.emp = count;
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
            where[key] = { [getSequelize().Op.in]: value };
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
        order: [[options.orderBy, options.direction]],
        attributes: [
          'data_id',
          'title',
          'data_type',
          'self_rel_type',
          'category',
          'sys_tbl_id',
          'src_org_name',
          'src_latest_chn_dt',
          'sys_data_reg_dt',
        ],
      });

      return {
        data: data.map(item => ({
          id: item.data_id,
          title: item.title,
          data_type: item.data_type,
          self_rel_type: item.self_rel_type,
          category: item.category,
          sys_tbl_id: item.sys_tbl_id,
          src_org_name: item.src_org_name,
          src_latest_chn_dt: item.src_latest_chn_dt,
          sys_data_reg_dt: item.sys_data_reg_dt,
        })),
        totalItems,
      };
    } catch (error) {
      logger.error('데이터 Repository - 데이터 검색 오류', { error });
      throw error;
    }
  }

  // 테마 리스트 조회
  async getThemes(): Promise<DataThemesRes> {
    try {
      logger.debug('데이터 Repository - 테마 리스트 조회');
      
      const results = await this.aggregate({
        where: {
          status: 'A',
          del_yn: 'N',
        },
        groupBy: ['self_rel_type'],
        attributes: [
          'self_rel_type',
          [getSequelize().fn('COUNT', '*'), 'total_count'],
        ],
      });

      return results.map((item: any) => {
        const theme = item.self_rel_type;
        const count = parseInt(item.dataValues.total_count);
        
        let id = '';
        let name = '';
        
        if (theme === 'physical') { id = 'phy'; name = '신체적 자립'; }
        else if (theme === 'emotional') { id = 'emo'; name = '정서적 자립'; }
        else if (theme === 'economic') { id = 'econ'; name = '경제적 자립'; }
        else if (theme === 'social') { id = 'soc'; name = '사회적 자립'; }
        
        return {
          id,
          name,
          description: `${name} 관련 데이터`,
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
      
      let selfRelType = '';
      if (theme === 'phy') selfRelType = 'physical';
      else if (theme === 'emo') selfRelType = 'emotional';
      else if (theme === 'econ') selfRelType = 'economic';
      else if (theme === 'soc') selfRelType = 'social';

      const { data, totalItems } = await this.findWithPagination({
        where: {
          status: 'A',
          del_yn: 'N',
          self_rel_type: selfRelType,
        },
        page: options.page,
        pageSize: options.pageSize,
        order: [[options.orderBy, options.direction]],
        attributes: [
          'data_id',
          'title',
          'data_type',
          'self_rel_type',
          'category',
          'sys_tbl_id',
          'src_org_name',
          'src_latest_chn_dt',
          'sys_data_reg_dt',
        ],
      });

      return {
        data: data.map(item => ({
          id: item.data_id,
          title: item.title,
          data_type: item.data_type,
          self_rel_type: item.self_rel_type,
          category: item.category,
          sys_tbl_id: item.sys_tbl_id,
          src_org_name: item.src_org_name,
          src_latest_chn_dt: item.src_latest_chn_dt,
          sys_data_reg_dt: item.sys_data_reg_dt,
        })),
        totalItems,
      };
    } catch (error) {
      logger.error('데이터 Repository - 테마별 아이템 조회 오류', { error });
      throw error;
    }
  }

  // 데이터 유형 리스트 조회
  async getTypes(): Promise<DataTypesRes> {
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
        const type = item.data_type;
        const count = parseInt(item.dataValues.total_count);
        
        let id = '';
        let name = '';
        
        if (type === 'basic') { id = 'basic'; name = '기초 데이터'; }
        else if (type === 'poi') { id = 'poi'; name = '이동권 데이터'; }
        else if (type === 'emp') { id = 'emp'; name = '일자리 데이터'; }
        
        return {
          id,
          name,
          description: `${name} 관련 자료`,
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
        order: [[options.orderBy, options.direction]],
        attributes: [
          'data_id',
          'title',
          'data_type',
          'self_rel_type',
          'category',
          'sys_tbl_id',
          'src_org_name',
          'src_latest_chn_dt',
          'sys_data_reg_dt',
        ],
      });

      return {
        data: data.map(item => ({
          id: item.data_id,
          title: item.title,
          data_type: item.data_type,
          self_rel_type: item.self_rel_type,
          category: item.category,
          sys_tbl_id: item.sys_tbl_id,
          src_org_name: item.src_org_name,
          src_latest_chn_dt: item.src_latest_chn_dt,
          sys_data_reg_dt: item.sys_data_reg_dt,
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
          'self_rel_type',
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
        data_type: item.data_type,
        self_rel_type: item.self_rel_type,
        category: item.category,
        sys_tbl_id: item.sys_tbl_id,
        data_desc: item.data_desc,
        data_keywords: item.data_keywords,
        data_format: item.data_format,
        data_usage_scope: item.data_usage_scope,
        src_org_name: item.src_org_name,
        src_latest_chn_dt: item.src_latest_chn_dt,
        sys_data_ref_dt: item.sys_data_ref_dt,
        sys_data_reg_dt: item.sys_data_reg_dt,
        open_api_url: item.open_api_url,
      };
    } catch (error) {
      logger.error('데이터 Repository - 데이터 상세 조회 오류', { error });
      throw error;
    }
  }

  // 데이터 미리보기 조회
  async getDataPreview(id: number, query: any): Promise<DataPreviewRes> {
    try {
      logger.debug('데이터 Repository - 데이터 미리보기 조회', { id, query });
      
      // 데이터 상세 정보 조회
      const item = await this.findOne({
        where: {
          data_id: id,
          status: 'A',
          del_yn: 'N',
        },
        attributes: ['open_api_url'],
      });

      if (!item) {
        throw new Error('데이터를 찾을 수 없습니다.');
      }

      // OpenAPI 호출은 별도 서비스에서 처리
      // 여기서는 기본 응답 구조만 반환
      return {
        data: [],
        meta: {
          totalItems: 0,
          page: query.page || 0,
          pageSize: query.pageSize || 20,
        },
      };
    } catch (error) {
      logger.error('데이터 Repository - 데이터 미리보기 조회 오류', { error });
      throw error;
    }
  }
}

// Repository 인스턴스 생성 및 내보내기
export const dataRepository = new DataRepository();
