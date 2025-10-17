// OpenAPI 연동 서비스 - 완벽한 모듈화
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { logger } from '../../config/logger';
import { env } from '../../config/env';

// OpenAPI 클라이언트 클래스
class OpenApiClient {
  private client: AxiosInstance;
  private timeout: number;

  constructor() {
    this.timeout = env.OPEN_API_TIMEOUT;
    
    // Axios 인스턴스 생성
    this.client = axios.create({
      baseURL: env.OPEN_API_SERVER_URL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // 요청 인터셉터
    this.client.interceptors.request.use(
      (config) => {
        // 실제 호출될 full URL 생성 (params 포함)
        const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
        const queryString = config.params 
          ? `?${new URLSearchParams(config.params).toString()}` 
          : '';
        const fullUrlWithParams = fullUrl + queryString;
        
        logger.debug('OpenAPI 요청 시작', {
          method: config.method?.toUpperCase(),
          fullUrl: fullUrlWithParams,  // params 포함한 완전한 URL
          baseURL: config.baseURL,
          url: config.url,
          params: config.params,  // query string 파라미터
        });

        // 인증 헤더 추가 (동적 헤더 이름 지원)
        if (env.OPEN_API_AUTH_HEADER && env.OPEN_API_AUTH_KEY) {
          // OPEN_API_AUTH_HEADER에 지정된 헤더 이름으로 설정
          config.headers[env.OPEN_API_AUTH_HEADER] = env.OPEN_API_AUTH_KEY;
          logger.debug('OpenAPI 인증 헤더 추가', { 
            header: env.OPEN_API_AUTH_HEADER 
          });
        } else if (env.OPEN_API_AUTH_KEY) {
          // 하위 호환: HEADER 미지정 시 기본값 사용
          config.headers['X-API-Key'] = env.OPEN_API_AUTH_KEY;
          logger.debug('OpenAPI 인증 헤더 추가 (기본값)', { header: 'X-API-Key' });
        }

        return config;
      },
      (error) => {
        logger.error('OpenAPI 요청 인터셉터 오류', { error });
        return Promise.reject(error);
      }
    );

    // 응답 인터셉터
    this.client.interceptors.response.use(
      (response) => {
        logger.debug('OpenAPI 응답 성공', {
          status: response.status,
          statusText: response.statusText,
          url: response.config.url,
        });
        return response;
      },
      (error) => {
        logger.error('OpenAPI 응답 오류', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          message: error.message,
        });
        return Promise.reject(error);
      }
    );
  }

  // URL에서 템플릿 변수 치환
  private replaceTemplateVars(url: string, pageSize?: number): string {
    // {{P_SIZE}} 치환: query.limit 우선, 없으면 env.OPEN_API_PAGE_SIZE 사용
    const size = pageSize || env.OPEN_API_PAGE_SIZE;
    return url.replace(/\{\{P_SIZE\}\}/g, size.toString());
  }

  // GET 요청 (pageSize 파라미터 지원)
  async get<T = any>(url: string, config?: AxiosRequestConfig & { pageSize?: number }): Promise<T> {
    try {
      const { pageSize, ...axiosConfig } = config || {};
      const processedUrl = this.replaceTemplateVars(url, pageSize);
      const response: AxiosResponse<T> = await this.client.get(processedUrl, axiosConfig);
      return response.data;
    } catch (error) {
      // 간결한 로깅 (axios error는 인터셉터에서 이미 로깅됨)
      logger.error('OpenAPI GET 요청 실패', { 
        url,
        errorMessage: error instanceof Error ? error.message : String(error)
      });
      throw this.handleError(error);
    }
  }

  // POST 요청
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig & { pageSize?: number }): Promise<T> {
    try {
      const { pageSize, ...axiosConfig } = config || {};
      const processedUrl = this.replaceTemplateVars(url, pageSize);
      const response: AxiosResponse<T> = await this.client.post(processedUrl, data, axiosConfig);
      return response.data;
    } catch (error) {
      logger.error('OpenAPI POST 요청 실패', { 
        url, 
        errorMessage: error instanceof Error ? error.message : String(error)
      });
      throw this.handleError(error);
    }
  }

  // PUT 요청
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig & { pageSize?: number }): Promise<T> {
    try {
      const { pageSize, ...axiosConfig } = config || {};
      const processedUrl = this.replaceTemplateVars(url, pageSize);
      const response: AxiosResponse<T> = await this.client.put(processedUrl, data, axiosConfig);
      return response.data;
    } catch (error) {
      logger.error('OpenAPI PUT 요청 실패', { 
        url, 
        errorMessage: error instanceof Error ? error.message : String(error)
      });
      throw this.handleError(error);
    }
  }

  // DELETE 요청
  async delete<T = any>(url: string, config?: AxiosRequestConfig & { pageSize?: number }): Promise<T> {
    try {
      const { pageSize, ...axiosConfig } = config || {};
      const processedUrl = this.replaceTemplateVars(url, pageSize);
      const response: AxiosResponse<T> = await this.client.delete(processedUrl, axiosConfig);
      return response.data;
    } catch (error) {
      logger.error('OpenAPI DELETE 요청 실패', { 
        url, 
        errorMessage: error instanceof Error ? error.message : String(error)
      });
      throw this.handleError(error);
    }
  }

  // 에러 처리
  private handleError(error: any): Error {
    if (error.response) {
      // 서버 응답이 있는 경우 - ErrInfoDto 그대로 로깅
      const { status, statusText, data } = error.response;
      
      logger.error('OpenAPI 서버 오류', {
        httpStatus: status,
        httpStatusText: statusText,
        errorDto: data,  // ErrInfoDto 전체 구조 그대로 로깅
      });
      
      // 에러 메시지 추출
      const message = data?.error?.message || data?.message || `OpenAPI 서버 오류: ${status} ${statusText}`;
      const platformError = new Error(message) as any;
      platformError.statusCode = status;
      platformError.openApiError = data;  // 원본 에러 보존
      return platformError;
      
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우 (타임아웃, 네트워크 에러)
      const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout');
      
      logger.error('OpenAPI 연결 오류', {
        errorType: isTimeout ? 'TIMEOUT' : 'NETWORK',
        errorMessage: error.message,
        errorCode: error.code,
        timeout: env.OPEN_API_TIMEOUT,
      });
      
      const platformError = new Error(
        isTimeout 
          ? `OpenAPI 서버 응답 시간 초과 (${env.OPEN_API_TIMEOUT}ms)` 
          : 'OpenAPI 서버에 연결할 수 없습니다.'
      ) as any;
      platformError.statusCode = isTimeout ? 504 : 503;
      return platformError;
      
    } else {
      // 요청 설정 중 오류가 발생한 경우
      logger.error('OpenAPI 요청 설정 오류', {
        errorMessage: error.message,
      });
      
      const platformError = new Error(`OpenAPI 요청 설정 오류: ${error.message}`) as any;
      platformError.statusCode = 500;
      return platformError;
    }
  }

  // 헬스 체크
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get('/health');
      return true;
    } catch (error) {
      logger.warn('OpenAPI 헬스 체크 실패', { error });
      return false;
    }
  }
}

// OpenAPI 서비스 클래스
class OpenApiService {
  private client: OpenApiClient;

  constructor() {
    this.client = new OpenApiClient();
  }

  // 데이터 미리보기 조회
  async getDataPreview(openApiUrl: string, query?: any): Promise<any> {
    try {
      logger.debug('OpenAPI 데이터 미리보기 조회 시작', { openApiUrl, query });
      
      const startTime = Date.now();
      
      // pageSize 결정: query.limit > env.OPEN_API_PAGE_SIZE
      const pageSize = query?.limit || env.OPEN_API_PAGE_SIZE;
      const hasTemplate = openApiUrl.includes('{{P_SIZE}}');
      
      // URL 치환 미리 수행하여 로깅 (템플릿 있을 때만 치환됨)
      const replacedUrl = openApiUrl.replace(/\{\{P_SIZE\}\}/g, String(pageSize));
      
      logger.debug('OpenAPI URL 치환 및 호출 준비', { 
        originalUrl: openApiUrl,
        replacedUrl: replacedUrl,
        pageSize,
        hasTemplate,
        willReplace: hasTemplate,  // 치환 여부
        query 
      });
      
      // OpenAPI URL 호출
      // - {{P_SIZE}} 템플릿이 있으면 → pageSize로 치환
      // - 템플릿이 없으면 → DB URL 그대로 사용 (params 추가 안 함)
      const data = await this.client.get(openApiUrl, { 
        pageSize,  // {{P_SIZE}} 치환용 (템플릿 없으면 치환 안 됨)
      });
      
      const duration = Date.now() - startTime;
      
      logger.info('OpenAPI 데이터 미리보기 조회 완료', {
        originalUrl: openApiUrl,
        finalUrl: replacedUrl,  // 치환된 URL (템플릿 없으면 원본과 동일)
        duration: `${duration}ms`,
        dataSize: Array.isArray(data) ? data.length : (data?.content?.length || 'N/A'),
      });
      
      return data;
    } catch (error) {
      logger.error('OpenAPI 데이터 미리보기 조회 실패', { 
        openApiUrl,
        errorMessage: error instanceof Error ? error.message : String(error),
        statusCode: (error as any).statusCode
      });
      throw error;
    }
  }

  // 헬스 체크
  async healthCheck(): Promise<boolean> {
    return this.client.healthCheck();
  }

  // 연결 상태 확인
  async isConnected(): Promise<boolean> {
    try {
      await this.client.get('/');
      return true;
    } catch (error) {
      return false;
    }
  }
}

// 서비스 인스턴스 생성 및 내보내기
export const openApiService = new OpenApiService();
export { OpenApiClient, OpenApiService };
