// 자가진단 데이터 카테고리 모델 - 완벽한 모듈화
import { Model, DataTypes, Sequelize } from 'sequelize';

export class SelfDiagDataCategory extends Model {
  public id!: number;
  public category!: string;
  public name!: string;
  public menu_id!: string;
  public menu_name!: string;
  public description!: string;
  public created_at!: Date;
  public updated_at!: Date | null;
}

// 모델 초기화
export function initSelfDiagDataCategory(sequelize: Sequelize): typeof SelfDiagDataCategory {
  SelfDiagDataCategory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'PK',
      },
      category: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: '카테고리: theme, data_type',
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: '카테고리명: 자립테마별, 데이터 유형별',
      },
      menu_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: '메뉴 id (theme : physical,emotional, economic,social, data_type : basic, poi, emp)',
      },
      menu_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: '메뉴 항목명: 신체적 자립, 정서적 자립 등',
      },
      description: {
        type: DataTypes.STRING(600),
        allowNull: false,
        comment: '메뉴별 간단한 설명',
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
      tableName: 'selfdiag_data_category',
      timestamps: true,
      underscored: true,
    }
  );

  return SelfDiagDataCategory;
}
