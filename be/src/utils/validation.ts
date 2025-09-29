// 검증 유틸리티 - 완벽한 모듈화
import { z } from 'zod';
import { 
  ThemeCode, 
  DataTypeCode, 
  SelfRelTypeCode,
  THEME_CONSTANTS,
  DATA_TYPE_CONSTANTS,
  SELF_REL_TYPE_CONSTANTS
} from '../../../packages/common/src/types';

// 공통 검증 스키마들
export const validationSchemas = {
  // ID 검증
  id: z.number().int().positive(),
  idString: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().positive()),

  // 페이지네이션 검증
  page: z.number().int().min(0),
  pageSize: z.number().int().min(1).max(100),

  // 정렬 검증
  sort: z.enum(['recent', 'alpha']),

  // 테마 코드 검증
  theme: z.enum(THEME_CONSTANTS.CODES as [string, ...string[]]),
  themes: z.string().regex(/^[a-z,]+$/).transform(str => 
    str.split(',').map(t => t.trim()).filter(t => t.length > 0)
  ),

  // 데이터 타입 코드 검증
  dataType: z.enum(DATA_TYPE_CONSTANTS.CODES as [string, ...string[]]),
  dataTypes: z.string().regex(/^[a-z,]+$/).transform(str => 
    str.split(',').map(t => t.trim()).filter(t => t.length > 0)
  ),

  // 자립 유형 코드 검증
  selfRelType: z.enum(SELF_REL_TYPE_CONSTANTS.CODES as [string, ...string[]]),

  // 검색어 검증
  searchQuery: z.string().min(1).max(100).regex(/^[가-힣a-zA-Z0-9\s]+$/),

  // 성별 검증
  gender: z.enum(['남성', '여성']),

  // 장애 정도 검증
  disLevel: z.enum(['경증', '중증']),

  // 연령 조건 검증
  ageCond: z.enum(['minor', 'adult', 'all']),

  // 제한값 검증
  limit: z.number().int().min(1).max(10),

  // 날짜 검증
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dateTime: z.string().regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/),
};

// 검증 헬퍼 함수들
export const validators = {
  // 숫자 ID 검증
  validateId: (value: any): number => {
    const num = typeof value === 'string' ? parseInt(value, 10) : value;
    if (!Number.isInteger(num) || num <= 0) {
      throw new Error('유효하지 않은 ID입니다.');
    }
    return num;
  },

  // 페이지 번호 검증
  validatePage: (value: any, defaultPage: number = 0): number => {
    if (value === undefined || value === null) return defaultPage;
    const num = typeof value === 'string' ? parseInt(value, 10) : value;
    if (!Number.isInteger(num) || num < 0) {
      throw new Error('유효하지 않은 페이지 번호입니다.');
    }
    return num;
  },

  // 페이지 크기 검증
  validatePageSize: (value: any, defaultPageSize: number = 20): number => {
    if (value === undefined || value === null) return defaultPageSize;
    const num = typeof value === 'string' ? parseInt(value, 10) : value;
    if (!Number.isInteger(num) || num < 1 || num > 100) {
      throw new Error('유효하지 않은 페이지 크기입니다.');
    }
    return num;
  },

  // 테마 코드 검증
  validateTheme: (value: string): ThemeCode => {
    if (!THEME_CONSTANTS.CODES.includes(value as ThemeCode)) {
      throw new Error('유효하지 않은 테마 코드입니다.');
    }
    return value as ThemeCode;
  },

  // 데이터 타입 코드 검증
  validateDataType: (value: string): DataTypeCode => {
    if (!DATA_TYPE_CONSTANTS.CODES.includes(value as DataTypeCode)) {
      throw new Error('유효하지 않은 데이터 타입 코드입니다.');
    }
    return value as DataTypeCode;
  },

  // 자립 유형 코드 검증
  validateSelfRelType: (value: string): SelfRelTypeCode => {
    if (!SELF_REL_TYPE_CONSTANTS.CODES.includes(value as SelfRelTypeCode)) {
      throw new Error('유효하지 않은 자립 유형 코드입니다.');
    }
    return value as SelfRelTypeCode;
  },

  // 검색어 검증
  validateSearchQuery: (value: string): string => {
    if (!value || value.trim().length === 0) {
      throw new Error('검색어를 입력해주세요.');
    }
    if (value.length > 100) {
      throw new Error('검색어는 100자 이하여야 합니다.');
    }
    return value.trim();
  },

  // 정렬 옵션 검증
  validateSort: (value: string, defaultSort: string = 'recent'): string => {
    const validSorts = ['recent', 'alpha'];
    if (!value) return defaultSort;
    if (!validSorts.includes(value)) {
      throw new Error('유효하지 않은 정렬 옵션입니다.');
    }
    return value;
  },

  // 제한값 검증
  validateLimit: (value: any, maxLimit: number = 10): number => {
    if (value === undefined || value === null) return 3;
    const num = typeof value === 'string' ? parseInt(value, 10) : value;
    if (!Number.isInteger(num) || num < 1 || num > maxLimit) {
      throw new Error(`제한값은 1 이상 ${maxLimit} 이하여야 합니다.`);
    }
    return num;
  },

  // 날짜 검증
  validateDate: (value: string): string => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value)) {
      throw new Error('유효하지 않은 날짜 형식입니다. (YYYY-MM-DD)');
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error('유효하지 않은 날짜입니다.');
    }
    return value;
  },

  // 이메일 검증
  validateEmail: (value: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new Error('유효하지 않은 이메일 형식입니다.');
    }
    return value.toLowerCase();
  },

  // URL 검증
  validateUrl: (value: string): string => {
    try {
      new URL(value);
      return value;
    } catch {
      throw new Error('유효하지 않은 URL 형식입니다.');
    }
  },
};

// 검증 에러 생성 함수
export function createValidationError(
  field: string,
  message: string,
  value?: any
): Error {
  const error = new Error(message);
  (error as any).field = field;
  (error as any).value = value;
  return error;
}

// 다중 필드 검증 함수
export function validateMultipleFields(
  data: Record<string, any>,
  rules: Record<string, (value: any) => any>
): Record<string, any> {
  const result: Record<string, any> = {};
  const errors: string[] = [];

  for (const [field, validator] of Object.entries(rules)) {
    try {
      result[field] = validator(data[field]);
    } catch (error) {
      errors.push(`${field}: ${error.message}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`검증 실패: ${errors.join(', ')}`);
  }

  return result;
}

// 조건부 검증 함수
export function validateConditionally(
  condition: boolean,
  validator: () => any,
  errorMessage: string
): any {
  if (condition) {
    return validator();
  }
  throw new Error(errorMessage);
}
