// API 파라미터 변환 미들웨어 - API_MAPPING 기반 자동 변환
import { Request, Response, NextFunction } from 'express';
import { API_MAPPING, ExtractParamsType, ApiMappingKey } from '@iitp-dabt-platform/common';
import { logger } from '../config/logger';
import { convertIdParams, convertEnumParams } from '../utils/paramConverterUtils';

/**
 * API_MAPPING에서 파라미터 타입 정보를 추출하여 자동 변환
 * - number 타입: string → number 변환
 * - enum 타입: string → enum 변환 및 검증
 */
export function paramConverter(req: Request, res: Response, next: NextFunction): void {
  try {
    const method = req.method;
    const path = req.path;
    const apiKey = `${method} ${path}` as ApiMappingKey;
    
    // API_MAPPING에서 해당 API 찾기
    const apiMapping = API_MAPPING[apiKey];
    
    if (!apiMapping || !apiMapping.req.params || apiMapping.req.params === 'void') {
      return next();
    }
    
    // 파라미터 타입 정보 추출
    const paramsType = apiMapping.req.params;
    
    // 파라미터 타입별 변환 처리
    if (paramsType === 'DataDetailParams' || paramsType === 'DataPreviewParams') {
      // ID 파라미터 변환 (string → number)
      const convertedId = convertIdParams(req.params);
      if (convertedId.error) {
        res.status(400).json(convertedId.error);
        return;
      }
      req.convertedParams = convertedId.data;
      
    } else if (paramsType === 'DataThemeItemsParams') {
      // Theme 파라미터 변환 (string → ThemeCode)
      const convertedTheme = convertEnumParams(req.params, 'theme');
      if (convertedTheme.error) {
        res.status(400).json(convertedTheme.error);
        return;
      }
      req.convertedParams = convertedTheme.data;
      
    } else if (paramsType === 'DataTypeItemsParams') {
      // Type 파라미터 변환 (string → DataTypeCode)
      const convertedType = convertEnumParams(req.params, 'type');
      if (convertedType.error) {
        res.status(400).json(convertedType.error);
        return;
      }
      req.convertedParams = convertedType.data;
    }
    
    logger.debug('파라미터 변환 완료', { 
      apiKey, 
      originalParams: req.params, 
      convertedParams: req.convertedParams 
    });
    
    next();
  } catch (error) {
    logger.error('파라미터 변환 중 오류 발생', { error });
    next(error);
  }
}

// Express Request 타입 확장
declare global {
  namespace Express {
    interface Request {
      convertedParams?: Record<string, any>;
    }
  }
}
