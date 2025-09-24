// 에러 코드 정의
export enum ErrorCode {
  // 기본 에러
  UNKNOWN_ERROR = 11000,
  VALIDATION_ERROR = 11001,
  DATABASE_ERROR = 11002,
  NETWORK_ERROR = 11003,
  
    // 요청 관련
  INVALID_REQUEST = 12000,
  MISSING_REQUIRED_FIELD = 12001,
  INVALID_PARAMETER = 12002,
  REQUEST_TIMEOUT = 12003,
  
  
  // 서버 관련
  SYS_INTERNAL_SERVER_ERROR = 19000,
  SYS_SERVICE_UNAVAILABLE = 19001,
  SYS_MAINTENANCE_MODE = 19002,



  ////////////////////////
  //// Service Bessiness Logic 에러 코드
  /// start with 2xxxx
  ///////////////////////



}


// 기본 에러 메타데이터 (BE/FE 공통)
export interface ErrorMeta {
  message: string;
  statusCode: number;
}

// 기본 에러 메타데이터 맵 (모든 ErrorCode 포함)
export const ErrorMetaMap: Record<ErrorCode, ErrorMeta> = {
  // 기본 에러
  [ErrorCode.UNKNOWN_ERROR]: {
    message: '알 수 없는 오류가 발생했습니다.',
    statusCode: 500
  },
  [ErrorCode.VALIDATION_ERROR]: {
    message: '입력 데이터가 올바르지 않습니다.',
    statusCode: 400
  },
  [ErrorCode.DATABASE_ERROR]: {
    message: '데이터베이스 오류가 발생했습니다.',
    statusCode: 500
  },
  [ErrorCode.NETWORK_ERROR]: {
    message: '네트워크 오류가 발생했습니다.',
    statusCode: 503
  },
  
   // 요청 관련
  [ErrorCode.INVALID_REQUEST]: {
    message: '잘못된 요청입니다.',
    statusCode: 400
  },
  [ErrorCode.MISSING_REQUIRED_FIELD]: {
    message: '필수 필드가 누락되었습니다.',
    statusCode: 400
  },
  [ErrorCode.INVALID_PARAMETER]: {
    message: '잘못된 파라미터입니다.',
    statusCode: 400
  },
  [ErrorCode.REQUEST_TIMEOUT]: {
    message: '요청 시간이 초과되었습니다.',
    statusCode: 408
  },
  
  // 서버 관련
  [ErrorCode.SYS_INTERNAL_SERVER_ERROR]: {
    message: '서버 내부 오류가 발생했습니다.',
    statusCode: 500
  },
  [ErrorCode.SYS_SERVICE_UNAVAILABLE]: {
    message: '서비스가 일시적으로 사용할 수 없습니다.',
    statusCode: 503
  },
  [ErrorCode.SYS_MAINTENANCE_MODE]: {
    message: '시스템 점검 중입니다. 잠시 후 다시 시도해주세요.',
    statusCode: 503
  },

   
}; 