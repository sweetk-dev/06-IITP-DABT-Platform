// API 에러 처리 및 알림 관리 - common 패키지의 ErrorCode 완전 활용
import { ErrorCode, ErrorMetaMap } from '@iitp-dabt-platform/common';

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
    // common 패키지의 ErrorMetaMap 활용
    const errorMeta = ErrorMetaMap[code];
    if (errorMeta) {
      return errorMeta.statusCode >= 500 ? '서버 오류' : 
             errorMeta.statusCode >= 400 ? '요청 오류' : '오류 발생';
    }
    return '오류 발생';
  }

  private getErrorMessage(error: ApiError): string {
    if (error.details?.message) {
      return error.details.message;
    }
    // common 패키지의 ErrorMetaMap에서 기본 메시지 가져오기
    const errorMeta = ErrorMetaMap[error.code];
    return errorMeta?.message || error.message;
  }

  private getErrorType(code: ErrorCode): 'error' | 'warning' | 'info' {
    // common 패키지의 ErrorMetaMap 활용
    const errorMeta = ErrorMetaMap[code];
    if (errorMeta) {
      if (errorMeta.statusCode >= 500) return 'error';
      if (errorMeta.statusCode >= 400) return 'warning';
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
    // common 패키지의 ErrorMetaMap에서 기본 메시지 가져오기
    const errorCode = this.getErrorCodeFromStatus(status);
    const errorMeta = ErrorMetaMap[errorCode];
    return errorMeta?.message || '알 수 없는 오류가 발생했습니다.';
  }
}

// ============================================================================
// 전역 에러 핸들러 인스턴스
// ============================================================================

export const apiErrorHandler = ApiErrorHandler.getInstance();
