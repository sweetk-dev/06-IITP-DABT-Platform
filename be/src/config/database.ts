// 데이터베이스 연결 설정 - 완벽한 모듈화
import { Sequelize } from 'sequelize';
import { logger } from './logger';
import { env } from './env';

// Sequelize 인스턴스
let sequelize: Sequelize | null = null;

// 데이터베이스 연결 함수
export async function connectDatabase(): Promise<Sequelize> {
  if (sequelize) {
    return sequelize;
  }

  try {
    // 데이터베이스 연결 설정
    const dbConfig = {
      host: env.DB_HOST,
      port: env.DB_PORT,
      database: env.DB_NAME,
      username: env.DB_USER,
      password: env.DB_PASSWORD,
      dialect: 'postgres' as const,
      logging: (sql: string, timing?: number) => {
        if (env.NODE_ENV === 'development') {
          logger.debug('SQL 쿼리 실행', { sql, timing });
        }
      },
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      dialectOptions: {
        ssl: env.DB_SSL ? {
          require: true,
          rejectUnauthorized: false,
        } : false,
      },
      define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true,
        //paranoid: true, // soft delete 활성화
      },
    };

    // Sequelize 인스턴스 생성
    sequelize = new Sequelize(dbConfig);

    // 연결 테스트
    await sequelize.authenticate();
    
    logger.info('데이터베이스 연결이 성공적으로 완료되었습니다.', {
      host: env.DB_HOST,
      port: env.DB_PORT,
      database: env.DB_NAME,
      ssl: env.DB_SSL,
    });

    // 모델 동기화 (개발 환경에서만)
    if (env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
      logger.info('데이터베이스 모델이 동기화되었습니다.');
    }

    return sequelize;

  } catch (error) {
    logger.error('데이터베이스 연결에 실패했습니다.', { error });
    throw error;
  }
}

// 데이터베이스 연결 해제 함수
export async function disconnectDatabase(): Promise<void> {
  if (sequelize) {
    await sequelize.close();
    sequelize = null;
    logger.info('데이터베이스 연결이 해제되었습니다.');
  }
}

// Sequelize 인스턴스 반환
export function getSequelize(): Sequelize {
  if (!sequelize) {
    throw new Error('데이터베이스가 연결되지 않았습니다. connectDatabase()를 먼저 호출하세요.');
  }
  return sequelize;
}

// 트랜잭션 헬퍼 함수
export async function withTransaction<T>(
  callback: (transaction: any) => Promise<T>
): Promise<T> {
  const sequelizeInstance = getSequelize();
  const transaction = await sequelizeInstance.transaction();
  
  try {
    const result = await callback(transaction);
    await transaction.commit();
    return result;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

// 연결 상태 확인
export async function isConnected(): Promise<boolean> {
  try {
    if (!sequelize) return false;
    await sequelize.authenticate();
    return true;
  } catch {
    return false;
  }
}
