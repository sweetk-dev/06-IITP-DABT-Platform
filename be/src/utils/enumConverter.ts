// Common Enum 변환 유틸리티 - 일관된 enum 처리 (common 패키지 완전 활용)
import { 
  ThemeCode, 
  DataTypeCode, 
  SelfRltyTypeCode,
  GenderCode,
  DisLevelCode,
  AgeCondCode,
  THEME_CONSTANTS,
  DATA_TYPE_CONSTANTS,
  SELF_RLTY_TYPE_CONSTANTS,
  GENDER_CONSTANTS,
  DIS_LEVEL_CONSTANTS,
  AGE_COND_CONSTANTS
} from '@iitp-dabt-platform/common';
import { logger } from '../config/logger';

/**
 * ThemeCode 변환 및 검증 - common 패키지 상수 활용
 */
export function convertToThemeCode(value: string): ThemeCode {
  if (!value) {
    throw new Error('테마 코드가 필요합니다.');
  }
  
  if (!THEME_CONSTANTS.ALL_CODES.includes(value as ThemeCode)) {
    throw new Error(`유효하지 않은 테마 코드입니다: ${value}. 유효한 값: ${THEME_CONSTANTS.ALL_CODES.join(', ')}`);
  }
  
  logEnumConversion(value, value, 'ThemeCode');
  return value as ThemeCode;
}

/**
 * DataTypeCode 변환 및 검증 - common 패키지 상수 활용
 */
export function convertToDataTypeCode(value: string): DataTypeCode {
  if (!value) {
    throw new Error('데이터 타입 코드가 필요합니다.');
  }
  
  if (!DATA_TYPE_CONSTANTS.ALL_CODES.includes(value as DataTypeCode)) {
    throw new Error(`유효하지 않은 데이터 타입 코드입니다: ${value}. 유효한 값: ${DATA_TYPE_CONSTANTS.ALL_CODES.join(', ')}`);
  }
  
  logEnumConversion(value, value, 'DataTypeCode');
  return value as DataTypeCode;
}

/**
 * SelfRltyTypeCode 변환 및 검증 - common 패키지 상수 활용
 */
export function convertToSelfRltyTypeCode(value: string): SelfRltyTypeCode {
  if (!value) {
    throw new Error('자립 유형 코드가 필요합니다.');
  }
  
  if (!SELF_RLTY_TYPE_CONSTANTS.ALL_CODES.includes(value as SelfRltyTypeCode)) {
    throw new Error(`유효하지 않은 자립 유형 코드입니다: ${value}. 유효한 값: ${SELF_RLTY_TYPE_CONSTANTS.ALL_CODES.join(', ')}`);
  }
  
  logEnumConversion(value, value, 'SelfRltyTypeCode');
  return value as SelfRltyTypeCode;
}

/**
 * GenderCode 변환 및 검증 - common 패키지 상수 활용
 */
export function convertToGenderCode(value: string): GenderCode {
  if (!value) {
    throw new Error('성별 코드가 필요합니다.');
  }
  
  if (!GENDER_CONSTANTS.ALL_CODES.includes(value as GenderCode)) {
    throw new Error(`유효하지 않은 성별 코드입니다: ${value}. 유효한 값: ${GENDER_CONSTANTS.ALL_CODES.join(', ')}`);
  }
  
  logEnumConversion(value, value, 'GenderCode');
  return value as GenderCode;
}

/**
 * DisLevelCode 변환 및 검증 - common 패키지 상수 활용
 */
export function convertToDisLevelCode(value: string): DisLevelCode {
  if (!value) {
    throw new Error('장애 수준 코드가 필요합니다.');
  }
  
  if (!DIS_LEVEL_CONSTANTS.ALL_CODES.includes(value as DisLevelCode)) {
    throw new Error(`유효하지 않은 장애 수준 코드입니다: ${value}. 유효한 값: ${DIS_LEVEL_CONSTANTS.ALL_CODES.join(', ')}`);
  }
  
  logEnumConversion(value, value, 'DisLevelCode');
  return value as DisLevelCode;
}

/**
 * AgeCondCode 변환 및 검증 - common 패키지 상수 활용
 */
export function convertToAgeCondCode(value: string): AgeCondCode {
  if (!value) {
    throw new Error('연령 조건 코드가 필요합니다.');
  }
  
  if (!AGE_COND_CONSTANTS.ALL_CODES.includes(value as AgeCondCode)) {
    throw new Error(`유효하지 않은 연령 조건 코드입니다: ${value}. 유효한 값: ${AGE_COND_CONSTANTS.ALL_CODES.join(', ')}`);
  }
  
  logEnumConversion(value, value, 'AgeCondCode');
  return value as AgeCondCode;
}

/**
 * 문자열을 숫자로 변환 (ID 파라미터용)
 */
export function convertToNumber(value: string, paramName: string = 'id'): number {
  if (!value) {
    throw new Error(`${paramName} 파라미터가 필요합니다.`);
  }
  
  const num = parseInt(value, 10);
  if (isNaN(num) || num <= 0) {
    throw new Error(`${paramName} 파라미터는 양수여야 합니다: ${value}`);
  }
  
  return num;
}

/**
 * null 값을 undefined로 변환
 */
export function convertNullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

/**
 * 여러 null 값을 undefined로 변환
 */
export function convertNullsToUndefined<T extends Record<string, any>>(obj: T): T {
  const result = { ...obj };
  for (const key in result) {
    if (result[key] === null) {
      (result as any)[key] = undefined;
    }
  }
  return result;
}

/**
 * enum 변환 결과 로깅
 */
export function logEnumConversion(
  originalValue: string, 
  convertedValue: any, 
  enumType: string
): void {
  logger.debug('Enum 변환 완료', {
    originalValue,
    convertedValue,
    enumType,
    timestamp: new Date().toISOString()
  });
}
