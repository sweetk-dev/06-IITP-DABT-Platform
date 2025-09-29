// 자가진단 정책 모델 - 완벽한 모듈화
import { Model, DataTypes, Sequelize } from 'sequelize';

export class SelfDiagPolicy extends Model {
  public policy_id!: number;
  public category!: string;
  public policy_name!: string;
  public self_rlty_type!: string | null;
  public region!: string | null;
  public gender!: string | null;
  public age_cond!: string | null;
  public dis_level!: string | null;
  public fin_cond!: string | null;
  public target!: string | null;
  public benefit!: string | null;
  public link!: string | null;
  public created_at!: Date;
  public updated_at!: Date | null;
}

// 모델 초기화
export function initSelfDiagPolicy(sequelize: Sequelize): typeof SelfDiagPolicy {
  SelfDiagPolicy.init(
    {
      policy_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'PK',
      },
      category: {
        type: DataTypes.STRING(90),
        allowNull: false,
        comment: '구분 (예: 생활 안정 지원, 생활요금 감면)',
      },
      policy_name: {
        type: DataTypes.STRING(300),
        allowNull: false,
        comment: '항목명 (예: 장애인연금, 장애수당)',
      },
      self_rlty_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: '관련 자립 유형 (기초, 경제, 정서, 사회 등)',
      },
      region: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: '사업 단위 (전국, 시군구 등)',
      },
      gender: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: '대상 성별 (남성, 여성, "여성, 남성")',
      },
      age_cond: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: '연령 조건 (minor=미성년자, adult=성인, all=미성년+성인)',
      },
      dis_level: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: '장애 정도 (중증, 경증)',
      },
      fin_cond: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: '재정 조건 (중위소득 50~100% 등)',
      },
      target: {
        type: DataTypes.STRING(3000),
        allowNull: true,
        comment: '대상자 설명',
      },
      benefit: {
        type: DataTypes.STRING(6000),
        allowNull: true,
        comment: '지원 내용 설명',
      },
      link: {
        type: DataTypes.STRING(512),
        allowNull: true,
        comment: '상세 이동 링크(URL)',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: '생성 시각',
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: '수정 시각',
      },
    },
    {
      sequelize,
      tableName: 'selfdiag_policy',
      timestamps: true,
      underscored: true,
    }
  );

  return SelfDiagPolicy;
}
