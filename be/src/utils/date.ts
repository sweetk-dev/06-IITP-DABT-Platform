// 날짜 처리 유틸리티 - 완벽한 모듈화
import { format, parseISO, isValid, addDays, subDays, startOfDay, endOfDay } from 'date-fns';
import { ko } from 'date-fns/locale';

// 날짜 포맷 상수
export const DATE_FORMATS = {
  DATE: 'yyyy-MM-dd',
  DATETIME: 'yyyy-MM-dd HH:mm:ss',
  DATETIME_MS: 'yyyy-MM-dd HH:mm:ss.SSS',
  DISPLAY_DATE: 'yyyy년 MM월 dd일',
  DISPLAY_DATETIME: 'yyyy년 MM월 dd일 HH:mm',
  API_DATE: 'yyyyMMdd',
  LOG_DATE: 'yyyy-MM-dd',
} as const;

// 날짜 유틸리티 함수들
export const dateUtils = {
  // 현재 날짜/시간 가져오기
  now: (): Date => new Date(),
  
  // 현재 날짜 (시간 제거)
  today: (): Date => startOfDay(new Date()),
  
  // 날짜 문자열을 Date 객체로 변환
  parse: (dateString: string): Date => {
    const date = parseISO(dateString);
    if (!isValid(date)) {
      throw new Error(`유효하지 않은 날짜 형식입니다: ${dateString}`);
    }
    return date;
  },

  // Date 객체를 문자열로 변환
  format: (date: Date, formatStr: string = DATE_FORMATS.DATE): string => {
    return format(date, formatStr, { locale: ko });
  },

  // 날짜 유효성 검사
  isValid: (date: any): boolean => {
    if (date instanceof Date) {
      return isValid(date);
    }
    if (typeof date === 'string') {
      return isValid(parseISO(date));
    }
    return false;
  },

  // 날짜 비교
  isAfter: (date1: Date, date2: Date): boolean => date1 > date2,
  isBefore: (date1: Date, date2: Date): boolean => date1 < date2,
  isSame: (date1: Date, date2: Date): boolean => date1.getTime() === date2.getTime(),

  // 날짜 연산
  addDays: (date: Date, days: number): Date => addDays(date, days),
  subDays: (date: Date, days: number): Date => subDays(date, days),

  // 날짜 범위
  startOfDay: (date: Date): Date => startOfDay(date),
  endOfDay: (date: Date): Date => endOfDay(date),

  // 상대적 날짜
  getRelativeDate: (days: number): Date => addDays(new Date(), days),
  getPastDate: (days: number): Date => subDays(new Date(), days),

  // 날짜 차이 계산 (일 단위)
  diffInDays: (date1: Date, date2: Date): number => {
    const diffTime = Math.abs(date1.getTime() - date2.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  // 날짜 차이 계산 (시간 단위)
  diffInHours: (date1: Date, date2: Date): number => {
    const diffTime = Math.abs(date1.getTime() - date2.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60));
  },

  // 날짜 차이 계산 (분 단위)
  diffInMinutes: (date1: Date, date2: Date): number => {
    const diffTime = Math.abs(date1.getTime() - date2.getTime());
    return Math.ceil(diffTime / (1000 * 60));
  },

  // 상대적 시간 표시
  getRelativeTime: (date: Date): string => {
    const now = new Date();
    const diffInMinutes = dateUtils.diffInMinutes(now, date);

    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    
    const diffInHours = dateUtils.diffInHours(now, date);
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    
    const diffInDays = dateUtils.diffInDays(now, date);
    if (diffInDays < 7) return `${diffInDays}일 전`;
    
    return dateUtils.format(date, DATE_FORMATS.DISPLAY_DATE);
  },

  // 날짜 범위 생성
  createDateRange: (startDate: Date, endDate: Date): Date[] => {
    const dates: Date[] = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }
    
    return dates;
  },

  // 주간 범위 생성
  getWeekRange: (date: Date): { start: Date; end: Date } => {
    const start = startOfDay(date);
    const end = endOfDay(addDays(start, 6));
    return { start, end };
  },

  // 월간 범위 생성
  getMonthRange: (date: Date): { start: Date; end: Date } => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return { start, end };
  },

  // 년도 범위 생성
  getYearRange: (date: Date): { start: Date; end: Date } => {
    const start = new Date(date.getFullYear(), 0, 1);
    const end = new Date(date.getFullYear(), 11, 31);
    return { start, end };
  },

  // 날짜 정규화 (시간 제거)
  normalize: (date: Date): Date => startOfDay(date),

  // 타임존 변환 (UTC 기준)
  toUTC: (date: Date): Date => new Date(date.getTime() + (date.getTimezoneOffset() * 60000)),
  fromUTC: (date: Date): Date => new Date(date.getTime() - (date.getTimezoneOffset() * 60000)),

  // 타임스탬프 변환
  toTimestamp: (date: Date): number => date.getTime(),
  fromTimestamp: (timestamp: number): Date => new Date(timestamp),

  // ISO 문자열 변환
  toISOString: (date: Date): string => date.toISOString(),
  fromISOString: (isoString: string): Date => new Date(isoString),

  // 한국 시간대 변환
  toKST: (date: Date): Date => {
    const kstOffset = 9 * 60; // UTC+9
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    return new Date(utc + (kstOffset * 60000));
  },

  // 날짜 검증 및 변환
  safeParse: (dateString: string): Date | null => {
    try {
      const date = parseISO(dateString);
      return isValid(date) ? date : null;
    } catch {
      return null;
    }
  },

  // 날짜 범위 검증
  isInRange: (date: Date, startDate: Date, endDate: Date): boolean => {
    return date >= startDate && date <= endDate;
  },

  // 날짜 정렬
  sortDates: (dates: Date[], ascending: boolean = true): Date[] => {
    return [...dates].sort((a, b) => ascending ? a.getTime() - b.getTime() : b.getTime() - a.getTime());
  },

  // 중복 날짜 제거
  uniqueDates: (dates: Date[]): Date[] => {
    const unique = new Set(dates.map(d => d.getTime()));
    return Array.from(unique).map(timestamp => new Date(timestamp));
  },
};

// 날짜 포맷팅 헬퍼 함수들
export const formatters = {
  // API 응답용 날짜 포맷
  apiDate: (date: Date): string => dateUtils.format(date, DATE_FORMATS.DATE),
  apiDateTime: (date: Date): string => dateUtils.format(date, DATE_FORMATS.DATETIME),

  // 로그용 날짜 포맷
  logDate: (date: Date): string => dateUtils.format(date, DATE_FORMATS.LOG_DATE),
  logDateTime: (date: Date): string => dateUtils.format(date, DATE_FORMATS.DATETIME_MS),

  // 사용자 표시용 날짜 포맷
  displayDate: (date: Date): string => dateUtils.format(date, DATE_FORMATS.DISPLAY_DATE),
  displayDateTime: (date: Date): string => dateUtils.format(date, DATE_FORMATS.DISPLAY_DATETIME),

  // 파일명용 날짜 포맷
  fileNameDate: (date: Date): string => dateUtils.format(date, DATE_FORMATS.API_DATE),
};

// 날짜 상수들
export const DATE_CONSTANTS = {
  // 일반적인 날짜 범위
  ONE_DAY_MS: 24 * 60 * 60 * 1000,
  ONE_WEEK_MS: 7 * 24 * 60 * 60 * 1000,
  ONE_MONTH_MS: 30 * 24 * 60 * 60 * 1000,
  ONE_YEAR_MS: 365 * 24 * 60 * 60 * 1000,

  // 기본 날짜 범위
  DEFAULT_START_DATE: '2020-01-01',
  DEFAULT_END_DATE: dateUtils.format(dateUtils.now(), DATE_FORMATS.DATE),

  // 최소/최대 날짜
  MIN_DATE: new Date('1900-01-01'),
  MAX_DATE: new Date('2100-12-31'),
} as const;
