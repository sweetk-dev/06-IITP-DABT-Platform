// 파라미터 변환 유틸리티 - 용도별 분리 처리
import { 
  ThemeCode, 
  DataTypeCode,
  THEME_CONSTANTS,
  DATA_TYPE_CONSTANTS
} from '@iitp-dabt-platform/common';
import { logger } from '../config/logger';

// 변환 결과 타입 정의
interface ConvertResult<T> {
  success: boolean;
  data?: T;
  error?: {
    success: false;
    error: {
      code: string;
      message: string;
      details?: any;
    };
  };
}

/**
 * ID 파라미터 변환 (string → number)
 * DataDetailParams, DataPreviewParams용
 */
export function convertIdParams(params: Record<string, string>): ConvertResult<{ id: number }> {
  try {
    if (!params.id) {
      return {
        success: false,
        error: {
          success: false,
          error: {
            code: 'MISSING_REQUIRED_FIELD',
            message: 'ID 파라미터가 필요합니다.',
            details: { param: 'id' }
          }
        }
      };
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return {
        success: false,
        error: {
          success: false,
          error: {
            code: 'INVALID_PARAMETER',
            message: 'ID 파라미터는 양수여야 합니다.',
            details: { param: 'id', value: params.id }
          }
        }
      };
    }

    logger.debug('ID 파라미터 변환 완료', { original: params.id, converted: id });
    
    return {
      success: true,
      data: { id }
    };
  } catch (error) {
    logger.error('ID 파라미터 변환 중 오류 발생', { error, params });
    return {
      success: false,
      error: {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'ID 파라미터 변환 중 오류가 발생했습니다.',
          details: { error: error instanceof Error ? error.message : 'Unknown error' }
        }
      }
    };
  }
}

/**
 * Enum 파라미터 변환 (string → enum)
 * DataThemeItemsParams, DataTypeItemsParams용
 */
export function convertEnumParams(
  params: Record<string, string>, 
  paramName: 'theme' | 'type'
): ConvertResult<{ [K in typeof paramName]: string }> {
  try {
    const value = params[paramName];
    
    if (!value) {
      return {
        success: false,
        error: {
          success: false,
          error: {
            code: 'MISSING_REQUIRED_FIELD',
            message: `${paramName} 파라미터가 필요합니다.`,
            details: { param: paramName }
          }
        }
      };
    }

    // enum 검증
    let isValid = false;
    if (paramName === 'theme') {
      isValid = THEME_CONSTANTS.ALL_CODES.includes(value as ThemeCode);
    } else if (paramName === 'type') {
      isValid = DATA_TYPE_CONSTANTS.ALL_CODES.includes(value as DataTypeCode);
    }

    if (!isValid) {
      return {
        success: false,
        error: {
          success: false,
          error: {
            code: 'INVALID_PARAMETER',
            message: `유효하지 않은 ${paramName} 코드입니다.`,
            details: { param: paramName, value, validValues: getValidValues(paramName) }
          }
        }
      };
    }

    logger.debug(`${paramName} 파라미터 변환 완료`, { original: value, converted: value });
    
    return {
      success: true,
      data: { [paramName]: value } as { [K in typeof paramName]: string }
    };
  } catch (error) {
    logger.error(`${paramName} 파라미터 변환 중 오류 발생`, { error, params });
    return {
      success: false,
      error: {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: `${paramName} 파라미터 변환 중 오류가 발생했습니다.`,
          details: { error: error instanceof Error ? error.message : 'Unknown error' }
        }
      }
    };
  }
}

/**
 * 유효한 값 목록 반환
 */
function getValidValues(paramName: 'theme' | 'type'): string[] {
  if (paramName === 'theme') {
    return [...THEME_CONSTANTS.ALL_CODES];
  } else if (paramName === 'type') {
    return [...DATA_TYPE_CONSTANTS.ALL_CODES];
  }
  return [];
}

/**
 * 파라미터 변환 결과 로깅
 */
export function logParamConversion(
  originalParams: Record<string, string>,
  convertedParams: Record<string, any>,
  apiKey: string
): void {
  logger.debug('파라미터 변환 완료', {
    apiKey,
    originalParams,
    convertedParams,
    timestamp: new Date().toISOString()
  });
}
