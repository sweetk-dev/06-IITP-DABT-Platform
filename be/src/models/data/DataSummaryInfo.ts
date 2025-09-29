// 데이터 요약 정보 모델 - 완벽한 모듈화
import { Model, DataTypes, Sequelize } from 'sequelize';
import { getSequelize } from '../../config/database';

export class DataSummaryInfo extends Model {
  public data_id!: number;
  public target_data_id!: number | null;
  public data_type!: string;
  public self_rel_type!: string | null;
  public category!: string | null;
  public title!: string;
  public sys_tbl_id!: string;
  public src_org_name!: string;
  public src_latest_chn_dt!: string;
  public sys_data_ref_dt!: string | null;
  public sys_data_reg_dt!: string;
  public data_keywords!: string | null;
  public data_format!: string | null;
  public data_desc!: string | null;
  public data_usage_scope!: string | null;
  public open_api_url!: string;
  public status!: string;
  public del_yn!: string;
  public created_at!: Date;
  public updated_at!: Date | null;
  public deleted_at!: Date | null;
}

// 모델 초기화
export function initDataSummaryInfo(sequelize: Sequelize): typeof DataSummaryInfo {
  DataSummaryInfo.init(
    {
      data_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '시스템 ID, 고유 식별자 (자동 증가)',
      },
      target_data_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Target Data info sys ID, data_type 에 따라서 id 참조',
      },
      data_type: {
        type: DataTypes.STRING(16),
        allowNull: false,
        comment: 'Data Type (basic/poi/emp)',
      },
      self_rel_type: {
        type: DataTypes.STRING(24),
        allowNull: true,
        comment: '자립 테마 타입 (physical,emotional, economic,social)',
      },
      category: {
        type: DataTypes.STRING(24),
        allowNull: true,
        comment: '카테고리 (기초, 신체 자립 현황, 의료 자립현황, 보조기기 사용 현황, 진로 교육 현황, 고용 현황, 사회망 현황, ...)',
      },
      title: {
        type: DataTypes.STRING(300),
        allowNull: false,
        comment: '데이터명',
      },
      sys_tbl_id: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true,
        comment: 'iitp 데이터 테이블 ID',
      },
      src_org_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: '데이터 제공처(기관명)',
      },
      src_latest_chn_dt: {
        type: DataTypes.STRING(12),
        allowNull: false,
        comment: '수집기관 최종 자료갱신일 (예:2024-07-19)',
      },
      sys_data_ref_dt: {
        type: DataTypes.STRING(12),
        allowNull: true,
        comment: '데이터를 iitp 시스템에서 마지막 수집/참조 일자 (예:2024-07-19)',
      },
      sys_data_reg_dt: {
        type: DataTypes.STRING(12),
        allowNull: false,
        comment: '데이터를 iitp 시스템에 등록한 일자 (예:2024-07-19)',
      },
      data_keywords: {
        type: DataTypes.STRING(220),
        allowNull: true,
        comment: '데이터 키워드 (최대 3개), 데이터 포맷 :: [,,] 형식',
      },
      data_format: {
        type: DataTypes.STRING(60),
        allowNull: true,
        comment: '제공 데이터 포맷 ([csv, json])',
      },
      data_desc: {
        type: DataTypes.STRING(300),
        allowNull: true,
        comment: '데이터 설명',
      },
      data_usage_scope: {
        type: DataTypes.STRING(300),
        allowNull: true,
        comment: '이용 데이터 범위 설명',
      },
      open_api_url: {
        type: DataTypes.STRING(300),
        allowNull: false,
        comment: 'open api req url',
      },
      status: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: 'A',
        comment: '데이터 상태, "data_status" comm code 참조',
      },
      del_yn: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: 'N',
        comment: '삭제여부 (Y: 삭제)',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: '레코드 생성 시각',
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: '레코드 수정 시각',
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: '삭제 일시 (논리 삭제 시 기록)',
      },
    },
    {
      sequelize,
      tableName: 'sys_data_summary_info',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['sys_tbl_id'],
          name: 'uidx_sys_data_sumary_info_sys_tbl_id',
        },
        {
          fields: ['title'],
          name: 'idx_sys_data_sumary_info_title',
        },
        {
          fields: ['data_type'],
          name: 'idx_sys_data_sumary_info_data_type',
        },
        {
          fields: ['self_rel_type'],
          name: 'idx_sys_data_sumary_info_self_rel_type',
        },
      ],
    }
  );

  return DataSummaryInfo;
}
