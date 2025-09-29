// 자가진단 시설 모델 - 완벽한 모듈화
import { Model, DataTypes, Sequelize } from 'sequelize';

export class SelfDiagFacility extends Model {
  public facility_id!: number;
  public device!: string;
  public install_area!: string | null;
  public install_site!: string | null;
  public install_spot!: string | null;
  public hang_dong!: string | null;
  public address!: string | null;
  public opening_hours!: string | null;
  public quantity!: number | null;
  public note!: string | null;
  public created_at!: Date;
  public updated_at!: Date | null;
}

// 모델 초기화
export function initSelfDiagFacility(sequelize: Sequelize): typeof SelfDiagFacility {
  SelfDiagFacility.init(
    {
      facility_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'PK',
      },
      device: {
        type: DataTypes.STRING(300),
        allowNull: false,
        comment: '설치 기기',
      },
      install_area: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: '설치 지역',
      },
      install_site: {
        type: DataTypes.STRING(300),
        allowNull: true,
        comment: '설치 장소',
      },
      install_spot: {
        type: DataTypes.STRING(300),
        allowNull: true,
        comment: '설치 위치 (건물 내 위치 등)',
      },
      hang_dong: {
        type: DataTypes.STRING(60),
        allowNull: true,
        comment: '행정동',
      },
      address: {
        type: DataTypes.STRING(300),
        allowNull: true,
        comment: '상세 주소',
      },
      opening_hours: {
        type: DataTypes.STRING(300),
        allowNull: true,
        comment: '이용 시간',
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: '설치 대수',
      },
      note: {
        type: DataTypes.STRING(900),
        allowNull: true,
        comment: '비고',
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
      tableName: 'selfdiag_facility',
      timestamps: true,
      underscored: true,
    }
  );

  return SelfDiagFacility;
}
