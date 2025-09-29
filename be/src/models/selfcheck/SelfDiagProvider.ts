// 자가진단 기관 모델 - 완벽한 모듈화
import { Model, DataTypes, Sequelize } from 'sequelize';

export class SelfDiagProvider extends Model {
  public provider_id!: number;
  public provider_name!: string;
  public service_name!: string;
  public address!: string;
  public phone!: string | null;
  public rep_name!: string | null;
  public description!: string | null;
  public created_at!: Date;
  public updated_at!: Date | null;
}

// 모델 초기화
export function initSelfDiagProvider(sequelize: Sequelize): typeof SelfDiagProvider {
  SelfDiagProvider.init(
    {
      provider_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'PK',
      },
      provider_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: '제공기관명 (지점명까지 포함)',
      },
      service_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: '제공 서비스명',
      },
      address: {
        type: DataTypes.STRING(300),
        allowNull: false,
        comment: '주소 (시군구 + 상세주소 포함)',
      },
      phone: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: '전화번호',
      },
      rep_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: '대표자명 (선택 입력)',
      },
      description: {
        type: DataTypes.STRING(900),
        allowNull: true,
        comment: '비고/기관 상세설명',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: '생성일시',
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: '수정일시',
      },
    },
    {
      sequelize,
      tableName: 'selfdiag_provider',
      timestamps: true,
      underscored: true,
    }
  );

  return SelfDiagProvider;
}
