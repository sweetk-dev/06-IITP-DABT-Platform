// 모델 초기화 및 연결 - 완벽한 모듈화
import { Sequelize } from 'sequelize';
import { getSequelize } from '../config/database';
import { initDataSummaryInfo, DataSummaryInfo } from './data/DataSummaryInfo';
import { initSelfDiagDataCategory, SelfDiagDataCategory } from './data/SelfDiagDataCategory';
import { initSelfDiagPolicy, SelfDiagPolicy } from './selfcheck/SelfDiagPolicy';
import { initSelfDiagProvider, SelfDiagProvider } from './selfcheck/SelfDiagProvider';
import { initSelfDiagFacility, SelfDiagFacility } from './selfcheck/SelfDiagFacility';
import { logger } from '../config/logger';

// 모델 초기화 함수
export async function initializeModels(): Promise<void> {
  try {
    const sequelize = getSequelize();
    
    logger.info('모델 초기화를 시작합니다...');

    // 데이터 모델 초기화
    initDataSummaryInfo(sequelize);
    initSelfDiagDataCategory(sequelize);
    
    // 자가진단 모델 초기화
    initSelfDiagPolicy(sequelize);
    initSelfDiagProvider(sequelize);
    initSelfDiagFacility(sequelize);

    // 모델 간 관계 설정
    setupModelAssociations();

    logger.info('모델 초기화가 완료되었습니다.');
  } catch (error) {
    logger.error('모델 초기화 중 오류가 발생했습니다.', { error });
    throw error;
  }
}

// 모델 간 관계 설정
function setupModelAssociations(): void {
  try {
    // 현재는 단순한 모델들이므로 복잡한 관계는 없음
    // 필요시 여기에 관계 설정 추가
    
    logger.debug('모델 간 관계 설정이 완료되었습니다.');
  } catch (error) {
    logger.error('모델 간 관계 설정 중 오류가 발생했습니다.', { error });
    throw error;
  }
}

// 모델 내보내기
export {
  DataSummaryInfo,
  SelfDiagDataCategory,
  SelfDiagPolicy,
  SelfDiagProvider,
  SelfDiagFacility,
};
