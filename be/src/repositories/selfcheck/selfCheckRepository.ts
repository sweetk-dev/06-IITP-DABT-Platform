// 자가진단 Repository - 완벽한 모듈화
import { 
  SelfCheckPolicyItem,
  SelfCheckPoliciesRes,
  SelfCheckProvidersRes,
  SelfCheckFacilitiesRes,
  SelfRltyTypeCode,
  GenderCode,
  AgeCondCode,
  DisLevelCode
} from '@iitp-dabt-platform/common';
import { BaseRepository } from '../base/BaseRepository';
import { SelfDiagPolicy } from '../../models/selfcheck/SelfDiagPolicy';
import { SelfDiagProvider } from '../../models/selfcheck/SelfDiagProvider';
import { SelfDiagFacility } from '../../models/selfcheck/SelfDiagFacility';
import { logger } from '../../config/logger';
import { getSequelize } from '../../config/database';
import { Op } from 'sequelize';

// 구체적인 Repository 클래스들
class PolicyRepository extends BaseRepository<SelfDiagPolicy> {
  constructor() {
    super(SelfDiagPolicy, 'SelfDiagPolicy');
  }
}

class ProviderRepository extends BaseRepository<SelfDiagProvider> {
  constructor() {
    super(SelfDiagProvider, 'SelfDiagProvider');
  }
}

class FacilityRepository extends BaseRepository<SelfDiagFacility> {
  constructor() {
    super(SelfDiagFacility, 'SelfDiagFacility');
  }
}

// 자가진단 Repository 클래스
class SelfCheckRepository {
  private policyRepo: PolicyRepository;
  private providerRepo: ProviderRepository;
  private facilityRepo: FacilityRepository;

  constructor() {
    this.policyRepo = new PolicyRepository();
    this.providerRepo = new ProviderRepository();
    this.facilityRepo = new FacilityRepository();
  }

  // 추천 정책 조회 - 각 테마별로 limit개씩 조회
  async getRecommendations(options: {
    filterConditions: Record<string, any>;
    limit: number;
  }): Promise<SelfCheckPolicyItem[]> {
    try {
      logger.debug('자가진단 Repository - 추천 정책 조회', { options });
      
      const themes = options.filterConditions.self_rlty_type as SelfRltyTypeCode[] | undefined;
      const allResults: any[] = [];

      // themes가 있으면 각 테마별로 limit개씩 병렬 조회 (성능 최적화)
      if (themes && Array.isArray(themes) && themes.length > 0) {
        // 각 테마별 쿼리를 병렬로 실행
        const queryPromises = themes.map(async (theme) => {
          const where: any = {
            self_rlty_type: theme,
            link: { [Op.ne]: null }, // 링크가 있는 정책만
          };

          // 추가 필터 조건 적용
          if (options.filterConditions.gender) {
            where.gender = options.filterConditions.gender;
          }
          if (options.filterConditions.disLevel) {
            where.dis_level = options.filterConditions.disLevel;
          }
          if (options.filterConditions.ageCond) {
            where.age_cond = options.filterConditions.ageCond;
          }

          // 각 테마별로 limit개씩 조회
          return await this.policyRepo.findAll({
            where,
            limit: options.limit,
            order: [['created_at', 'DESC']],
            attributes: [
              'policy_id',
              'category',
              'policy_name',
              'self_rlty_type',
              'region',
              'gender',
              'age_cond',
              'dis_level',
              'fin_cond',
              'link',
            ],
          });
        });

        // 모든 쿼리를 병렬로 실행
        const results = await Promise.all(queryPromises);
        results.forEach(data => allResults.push(...data));
      } else {
        // themes가 없으면 기존 로직대로 전체 조회
        const where: any = {
          link: { [Op.ne]: null }, // 링크가 있는 정책만
        };

        if (options.filterConditions.gender) {
          where.gender = options.filterConditions.gender;
        }
        if (options.filterConditions.disLevel) {
          where.dis_level = options.filterConditions.disLevel;
        }
        if (options.filterConditions.ageCond) {
          where.age_cond = options.filterConditions.ageCond;
        }

        const data = await this.policyRepo.findAll({
          where,
          limit: options.limit,
          order: [['created_at', 'DESC']],
          attributes: [
            'policy_id',
            'category',
            'policy_name',
            'self_rlty_type',
            'region',
            'gender',
            'age_cond',
            'dis_level',
            'fin_cond',
            'link',
          ],
        });

        allResults.push(...data);
      }

      logger.info('추천 정책 조회 완료', { 
        themesCount: themes?.length || 0, 
        totalResults: allResults.length,
        limit: options.limit,
        perTheme: themes && themes.length > 0 ? `${options.limit}개씩` : 'N/A'
      });

      return allResults.map(item => ({
        policy_id: item.policy_id,
        category: item.category,
        policy_name: item.policy_name,
        self_rlty_type: item.self_rlty_type as SelfRltyTypeCode | undefined,
        region: item.region || undefined,
        gender: item.gender as GenderCode | undefined,
        age_cond: item.age_cond as AgeCondCode | undefined,
        dis_level: item.dis_level as DisLevelCode | undefined,
        fin_cond: item.fin_cond || undefined,
        link: item.link || undefined,
      }));
    } catch (error) {
      logger.error('자가진단 Repository - 추천 정책 조회 오류', { error });
      throw error;
    }
  }

  // 자립 지원 정책 조회
  async getPolicies(options: {
    filterConditions: Record<string, any>;
    page: number;
    pageSize: number;
  }): Promise<{ data: any[]; totalItems: number }> {
    try {
      logger.debug('자가진단 Repository - 자립 지원 정책 조회', { options });
      
      const where: any = {};

      // 필터 조건 적용
      Object.entries(options.filterConditions).forEach(([key, value]) => {
        if (value) {
          if (key === 'themes' && Array.isArray(value)) {
            where.self_rlty_type = { [Op.in]: value };
          } else if (key === 'gender' && value) {
            where.gender = value;
          } else if (key === 'disLevel' && value) {
            where.dis_level = value;
          } else if (key === 'ageCond' && value) {
            where.age_cond = value;
          }
        }
      });

      const { data, totalItems } = await this.policyRepo.findWithPagination({
        where,
        page: options.page,
        pageSize: options.pageSize,
        order: [['created_at', 'DESC']],
        attributes: [
          'policy_id',
          'category',
          'policy_name',
          'self_rlty_type',
          'region',
          'gender',
          'age_cond',
          'dis_level',
          'fin_cond',
        ],
      });

      return {
        data: data.map(item => ({
          policy_id: item.policy_id,
          category: item.category,
          policy_name: item.policy_name,
          self_rlty_type: item.self_rlty_type,
          region: item.region,
          gender: item.gender,
          age_cond: item.age_cond,
          dis_level: item.dis_level,
          fin_cond: item.fin_cond,
        })),
        totalItems,
      };
    } catch (error) {
      logger.error('자가진단 Repository - 자립 지원 정책 조회 오류', { error });
      throw error;
    }
  }

  // 자립 지원 기관 조회
  async getProviders(options: {
    page: number;
    pageSize: number;
  }): Promise<{ data: any[]; totalItems: number }> {
    try {
      logger.debug('자가진단 Repository - 자립 지원 기관 조회', { options });
      
      const { data, totalItems } = await this.providerRepo.findWithPagination({
        where: {},
        page: options.page,
        pageSize: options.pageSize,
        order: [['created_at', 'DESC']],
        attributes: [
          'provider_id',
          'provider_name',
          'service_name',
          'address',
          'phone',
          'description',
        ],
      });

      return {
        data: data.map(item => ({
          provider_id: item.provider_id,
          provider_name: item.provider_name,
          service_name: item.service_name,
          address: item.address,
          phone: item.phone,
          description: item.description,
        })),
        totalItems,
      };
    } catch (error) {
      logger.error('자가진단 Repository - 자립 지원 기관 조회 오류', { error });
      throw error;
    }
  }

  // 자립 지원 시설 조회
  async getFacilities(options: {
    page: number;
    pageSize: number;
  }): Promise<{ data: any[]; totalItems: number }> {
    try {
      logger.debug('자가진단 Repository - 자립 지원 시설 조회', { options });
      
      const { data, totalItems } = await this.facilityRepo.findWithPagination({
        where: {},
        page: options.page,
        pageSize: options.pageSize,
        order: [['created_at', 'DESC']],
        attributes: [
          'facility_id',
          'device',
          'install_area',
          'install_site',
          'install_spot',
          'hang_dong',
          'address',
          'opening_hours',
          'quantity',
          'note',
        ],
      });

      return {
        data: data.map(item => ({
          facility_id: item.facility_id,
          device: item.device,
          install_area: item.install_area,
          install_site: item.install_site,
          install_spot: item.install_spot,
          hang_dong: item.hang_dong,
          address: item.address,
          opening_hours: item.opening_hours,
          quantity: item.quantity,
          note: item.note,
        })),
        totalItems,
      };
    } catch (error) {
      logger.error('자가진단 Repository - 자립 지원 시설 조회 오류', { error });
      throw error;
    }
  }
}

// Repository 인스턴스 생성 및 내보내기
export const selfCheckRepository = new SelfCheckRepository();
