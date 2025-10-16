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
        logger.debug('OpenAPI 요청 시작', {
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
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
      logger.error('OpenAPI GET 요청 실패', { url, error });
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
      logger.error('OpenAPI POST 요청 실패', { url, data, error });
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
      logger.error('OpenAPI PUT 요청 실패', { url, data, error });
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
      logger.error('OpenAPI DELETE 요청 실패', { url, error });
      throw this.handleError(error);
    }
  }

  // 에러 처리
  private handleError(error: any): Error {
    if (error.response) {
      // 서버 응답이 있는 경우
      const { status, statusText, data } = error.response;
      const message = `OpenAPI 서버 오류: ${status} ${statusText}`;
      
      logger.error('OpenAPI 서버 오류', {
        status,
        statusText,
        data,
        message,
      });
      
      return new Error(message);
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      const message = 'OpenAPI 서버에 연결할 수 없습니다.';
      
      logger.error('OpenAPI 연결 오류', {
        message: error.message,
        code: error.code,
      });
      
      return new Error(message);
    } else {
      // 요청 설정 중 오류가 발생한 경우
      const message = `OpenAPI 요청 설정 오류: ${error.message}`;
      
      logger.error('OpenAPI 요청 설정 오류', {
        message: error.message,
      });
      
      return new Error(message);
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
      
      // URL에 이미 query string이 포함되어 있고 {{P_SIZE}} 템플릿이 있음
      // query.limit이 있으면 {{P_SIZE}}를 query.limit으로 치환
      // 없으면 env.OPEN_API_PAGE_SIZE로 치환 (client.get에서 자동 처리)
      const pageSize = query?.limit || undefined;
      
      logger.debug('OpenAPI URL 치환', { 
        originalUrl: openApiUrl, 
        pageSize: pageSize || env.OPEN_API_PAGE_SIZE,
        query 
      });
      
      // OpenAPI URL 호출
      // - baseURL + openApiUrl 자동 합쳐짐
      // - {{P_SIZE}} 치환됨 (pageSize 파라미터 사용)
      // - URL에 이미 query string이 있으므로 추가 params 전달하지 않음
      const data = await this.client.get(openApiUrl, { pageSize });
      
      const duration = Date.now() - startTime;
      logger.info('OpenAPI 데이터 미리보기 조회 완료', {
        openApiUrl,
        pageSize,
        duration: `${duration}ms`,
      });
      
      return data;
    } catch (error) {
      logger.error('OpenAPI 데이터 미리보기 조회 실패', { openApiUrl, error });
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
