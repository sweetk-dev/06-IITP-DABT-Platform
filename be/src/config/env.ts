// 환경변수 관리 - 완벽한 모듈화
import { config } from 'dotenv';
import { z } from 'zod';

// .env 파일 로드
config();

// 환경변수 스키마 정의
const envSchema = z.object({
  // 서버 설정
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3001'),
  
  // 데이터베이스 설정
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().transform(Number).default('5432'),
  DB_NAME: z.string().default('iitp_dabt_platform'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default(''),
  DB_SSL: z.string().transform(val => val === 'true').default('false'),
  
  // CORS 설정
  CORS_ORIGINS: z.string().transform(val => val.split(',')).default('http://localhost:3000'),
  
  // OpenAPI 서버 설정
  OPEN_API_SERVER_URL: z.string().default('https://api.example.com'),
  OPEN_API_AUTH_KEY: z.string().optional(),
  OPEN_API_AUTH_SECRET: z.string().optional(),
  OPEN_API_PAGE_SIZE: z.string().transform(Number).default('100'),
  OPEN_API_TIMEOUT: z.string().transform(Number).default('30000'),
  
  // 로깅 설정
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_DIR: z.string().default('./logs'),
  
  // 기타 설정
  API_RATE_LIMIT: z.string().transform(Number).default('100'),
  REQUEST_TIMEOUT: z.string().transform(Number).default('30000'),
});

// 환경변수 검증 및 파싱
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('환경변수 검증 실패:', error);
    process.exit(1);
  }
};

// 환경변수 객체
export const env = parseEnv();

// 환경변수 타입
export type Env = z.infer<typeof envSchema>;

// 환경변수 검증 함수
export function validateEnv(): void {
  const requiredVars = [
    'DB_HOST',
    'DB_NAME',
    'DB_USER',
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('필수 환경변수가 누락되었습니다:', missingVars);
    process.exit(1);
  }
}

// 개발 환경 확인
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
