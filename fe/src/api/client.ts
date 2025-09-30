// API 클라이언트 (fetch 래퍼) - common 패키지의 모든 API 타입 활용
import { apiErrorHandler, ApiError } from './errorHandler';
import { 
  API_MAPPING, 
  API_URLS,
  type ExtractReqType, 
  type ExtractResType,
  type ExtractBodyType,
  type ExtractParamsType,
  type ExtractQueryType,
  type ApiMappingKey
} from '@iitp-dabt-platform/common';

// ============================================================================
// API 클라이언트 설정
// ============================================================================

// FULL_API_URLS를 사용하므로 baseUrl은 빈 문자열
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';


// ============================================================================
// API 클라이언트 클래스
// ============================================================================

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * 타입 안전한 API 호출 (body, params, query 구분)
   * common 패키지의 API_MAPPING을 완전히 활용
   */
  async call<T extends ApiMappingKey>(
    url: T,
    request?: {
      body?: ExtractBodyType<T>;
      params?: ExtractParamsType<T>;
      query?: ExtractQueryType<T>;
    }
  ): Promise<ExtractResType<T>> {
    const [method, path] = String(url).split(' ');
    let fullUrl = `${this.baseUrl}${path}`;
    
    // URL 경로 파라미터 치환
    if (request?.params) {
      Object.entries(request.params).forEach(([key, value]) => {
        fullUrl = fullUrl.replace(`{${key}}`, String(value));
      });
    }
    
    // 쿼리 파라미터 추가
    if (request?.query) {
      const searchParams = new URLSearchParams();
      Object.entries(request.query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        fullUrl += `?${queryString}`;
      }
    }
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    // 요청 본문 추가
    if (request?.body && method !== 'GET') {
      options.body = JSON.stringify(request.body);
    }
    
    try {
      const response = await fetch(fullUrl, options);
      
      if (!response.ok) {
        await this.handleHttpError(response);
        // 이미 에러 핸들러에서 처리했으므로 silent error throw
        const handledError = new Error('API_ERROR_HANDLED');
        (handledError as any).isHandled = true;
        throw handledError;
      }
      
      const result = await response.json();
      // BE 응답 형식: { success: true, data: T } 에서 data만 추출
      return result.data !== undefined ? result.data : result;
    } catch (error) {
      // 이미 처리된 에러가 아닌 경우에만 에러 핸들러 호출
      if (!(error as any).isHandled) {
        this.handleError(error);
      }
      throw error;
    }
  }

  /**
   * GET 요청용 API 호출 (params, query 구분)
   */
  async get<T extends ApiMappingKey>(
    url: T,
    request?: {
      params?: ExtractParamsType<T>;
      query?: ExtractQueryType<T>;
    }
  ): Promise<ExtractResType<T>> {
    return this.call(url, request);
  }

  /**
   * POST 요청용 API 호출 (body, params, query 구분)
   */
  async post<T extends ApiMappingKey>(
    url: T,
    request?: {
      body?: ExtractBodyType<T>;
      params?: ExtractParamsType<T>;
      query?: ExtractQueryType<T>;
    }
  ): Promise<ExtractResType<T>> {
    return this.call(url, request);
  }

  /**
   * PUT 요청용 API 호출 (body, params, query 구분)
   */
  async put<T extends ApiMappingKey>(
    url: T,
    request?: {
      body?: ExtractBodyType<T>;
      params?: ExtractParamsType<T>;
      query?: ExtractQueryType<T>;
    }
  ): Promise<ExtractResType<T>> {
    return this.call(url, request);
  }

  /**
   * DELETE 요청용 API 호출 (params, query 구분)
   */
  async delete<T extends ApiMappingKey>(
    url: T,
    request?: {
      params?: ExtractParamsType<T>;
      query?: ExtractQueryType<T>;
    }
  ): Promise<ExtractResType<T>> {
    return this.call(url, request);
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  private async handleHttpError(response: Response): Promise<void> {
    try {
      const errorData = await response.json();
      apiErrorHandler.handleHttpError(response, errorData);
    } catch {
      apiErrorHandler.handleHttpError(response);
    }
  }

  private handleError(error: any): void {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      apiErrorHandler.handleNetworkError(error);
    } else {
      apiErrorHandler.handleError(error);
    }
  }
}

// ============================================================================
// 전역 API 클라이언트 인스턴스
// ============================================================================

export const apiClient = new ApiClient();
