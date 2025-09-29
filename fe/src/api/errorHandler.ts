// API 에러 처리 및 알림 관리
import { ErrorCode } from '../../../packages/common/src/types/errorCodes.js';

// ============================================================================
// 에러 타입 정의
// ============================================================================

export interface ApiError {
  code: ErrorCode;
  message: string;
  details?: any;
  statusCode?: number;
}

export interface ErrorAlertState {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
}

// ============================================================================
// 에러 처리 클래스
// ============================================================================

export class ApiErrorHandler {
  private static instance: ApiErrorHandler;
  private errorCallbacks: ((error: ErrorAlertState) => void)[] = [];

  private constructor() {}

  static getInstance(): ApiErrorHandler {
    if (!ApiErrorHandler.instance) {
      ApiErrorHandler.instance = new ApiErrorHandler();
    }
    return ApiErrorHandler.instance;
  }

  /**
   * 에러 알림 콜백 등록
   */
  subscribe(callback: (error: ErrorAlertState) => void): () => void {
    this.errorCallbacks.push(callback);
    
    // 구독 해제 함수 반환
    return () => {
      const index = this.errorCallbacks.indexOf(callback);
      if (index > -1) {
        this.errorCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * 에러 알림 표시
   */
  showError(error: ApiError): void {
    const errorAlert: ErrorAlertState = {
      isOpen: true,
      title: this.getErrorTitle(error.code),
      message: this.getErrorMessage(error),
      type: this.getErrorType(error.code)
    };

    this.errorCallbacks.forEach(callback => callback(errorAlert));
  }

  /**
   * 네트워크 에러 처리
   */
  handleNetworkError(error: any): void {
    const apiError: ApiError = {
      code: ErrorCode.NETWORK_ERROR,
      message: '네트워크 연결을 확인해주세요.',
      details: error
    };
    this.showError(apiError);
  }

  /**
   * HTTP 응답 에러 처리
   */
  handleHttpError(response: Response, errorData?: any): void {
    const apiError: ApiError = {
      code: this.getErrorCodeFromStatus(response.status),
      message: errorData?.message || this.getDefaultErrorMessage(response.status),
      statusCode: response.status,
      details: errorData
    };
    this.showError(apiError);
  }

  /**
   * 일반 에러 처리
   */
  handleError(error: any): void {
    if (error instanceof Error) {
      const apiError: ApiError = {
        code: ErrorCode.UNKNOWN_ERROR,
        message: error.message,
        details: error
      };
      this.showError(apiError);
    } else {
      this.handleNetworkError(error);
    }
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  private getErrorTitle(code: ErrorCode): string {
    const titleMap: Record<ErrorCode, string> = {
      [ErrorCode.UNKNOWN_ERROR]: '오류 발생',
      [ErrorCode.VALIDATION_ERROR]: '입력 오류',
      [ErrorCode.DATABASE_ERROR]: '데이터베이스 오류',
      [ErrorCode.NETWORK_ERROR]: '네트워크 오류',
      [ErrorCode.INVALID_REQUEST]: '잘못된 요청',
      [ErrorCode.MISSING_REQUIRED_FIELD]: '필수 정보 누락',
      [ErrorCode.INVALID_PARAMETER]: '잘못된 파라미터',
      [ErrorCode.REQUEST_TIMEOUT]: '요청 시간 초과',
      [ErrorCode.SYS_INTERNAL_SERVER_ERROR]: '서버 오류',
      [ErrorCode.SYS_SERVICE_UNAVAILABLE]: '서비스 이용 불가',
      [ErrorCode.SYS_MAINTENANCE_MODE]: '시스템 점검 중'
    };
    return titleMap[code] || '오류 발생';
  }

  private getErrorMessage(error: ApiError): string {
    if (error.details?.message) {
      return error.details.message;
    }
    return error.message;
  }

  private getErrorType(code: ErrorCode): 'error' | 'warning' | 'info' {
    if (code >= ErrorCode.SYS_INTERNAL_SERVER_ERROR) {
      return 'error';
    }
    if (code >= ErrorCode.INVALID_REQUEST) {
      return 'warning';
    }
    return 'error';
  }

  private getErrorCodeFromStatus(status: number): ErrorCode {
    switch (status) {
      case 400: return ErrorCode.INVALID_REQUEST;
      case 401: return ErrorCode.INVALID_REQUEST;
      case 403: return ErrorCode.INVALID_REQUEST;
      case 404: return ErrorCode.INVALID_REQUEST;
      case 408: return ErrorCode.REQUEST_TIMEOUT;
      case 500: return ErrorCode.SYS_INTERNAL_SERVER_ERROR;
      case 503: return ErrorCode.SYS_SERVICE_UNAVAILABLE;
      default: return ErrorCode.UNKNOWN_ERROR;
    }
  }

  private getDefaultErrorMessage(status: number): string {
    switch (status) {
      case 400: return '잘못된 요청입니다.';
      case 401: return '인증이 필요합니다.';
      case 403: return '접근 권한이 없습니다.';
      case 404: return '요청한 리소스를 찾을 수 없습니다.';
      case 408: return '요청 시간이 초과되었습니다.';
      case 500: return '서버 내부 오류가 발생했습니다.';
      case 503: return '서비스가 일시적으로 이용 불가능합니다.';
      default: return '알 수 없는 오류가 발생했습니다.';
    }
  }
}

// ============================================================================
// 전역 에러 핸들러 인스턴스
// ============================================================================

export const apiErrorHandler = ApiErrorHandler.getInstance();
