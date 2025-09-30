// API 및 FE 화면에서 사용하는 공통 상수 정의

// ============================================================================
// 페이지네이션 관련 상수
// ============================================================================

export const PAGINATION_CONSTANTS = {
  // 기본 페이지 크기
  DEFAULT_PAGE_SIZE: 20,
  
  // 페이지 크기 옵션
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100] as const,
  
  // 기본 페이지 번호 (FE는 0-based 사용)
  DEFAULT_PAGE: 0,
  
  // 최대 페이지 크기
  MAX_PAGE_SIZE: 100,
  
  // 최소 페이지 크기
  MIN_PAGE_SIZE: 1
} as const;

// ============================================================================
// 자립 테마 (theme) 관련 상수
// ============================================================================

export type ThemeCode = 'phy' | 'emo' | 'econ' | 'soc';

export const THEME_CONSTANTS = {
  // 자립테마별 코드와 정보
  THEMES: {
    phy: {
      code: 'phy',
      name: '신체적 자립',
      description: '신체적 자립 수준 및 건강 상태 등 신체 기능과 관련된 데이터'
    },
    emo: {
      code: 'emo', 
      name: '정서적 자립',
      description: '심리적 안정 및 지원 등 정서 안정과 관련된 데이터'
    },
    econ: {
      code: 'econ',
      name: '경제적 자립', 
      description: '장애인 진로교육 및 고용 현황 등 일자리와 관련된 데이터'
    },
    soc: {
      code: 'soc',
      name: '사회적 자립',
      description: '사회복지시설 및 지역사회 참여 현황 등 사회적 기능과 관련된 데이터'
    }
  },
  
  // 모든 자립테마 코드 배열
  ALL_CODES: ['phy', 'emo', 'econ', 'soc'] as const,
  
  // 자립테마별 한글명 매핑
  NAMES: {
    phy: '신체적 자립',
    emo: '정서적 자립',
    econ: '경제적 자립', 
    soc: '사회적 자립'
  } as const
} as const;

// ============================================================================
// 데이터 유형 (data_type) 관련 상수
// ============================================================================

export type DataTypeCode = 'basic' | 'poi' | 'emp';

export const DATA_TYPE_CONSTANTS = {
  // 데이터 유형별 코드와 정보
  DATA_TYPES: {
    basic: {
      code: 'basic',
      name: '기초 데이터',
      shortName: '기초',
      description: '장애인과 관련된 기본 통계 및 기초 자료'
    },
    poi: {
      code: 'poi',
      name: '이동권 데이터', 
      shortName: '이동권',
      description: '교통·보행 등 장애인 이동 및 접근성과 관련된 자료'
    },
    emp: {
      code: 'emp',
      name: '고용 데이터',
      shortName: '고용',
      description: '고용 현황, 취업 지원, 직업 활동과 관련된 자료'
    }
  },
  
  // 모든 데이터 유형 코드 배열
  ALL_CODES: ['basic', 'poi', 'emp'] as const,
  
  // 데이터 유형별 한글명 매핑
  NAMES: {
    basic: '기초 데이터',
    poi: '이동권 데이터',
    emp: '일자리 데이터'
  } as const
} as const;

// ============================================================================
// 자립유형 (self_rlty_type) 관련 상수
// ============================================================================

export type SelfRelTypeCode = 'basic' | 'phys' | 'emo' | 'econ' | 'soc';

export const SELF_REL_TYPE_CONSTANTS = {
  // 자립유형별 코드와 정보
  SELF_REL_TYPES: {
    basic: {
      code: 'basic',
      name: '기초',
      description: '기본 적인 장애 자립 관련 정보(정책, 기관, 시설)'
    },
    phys: {
      code: 'phys',
      name: '신체',
      description: '신체적 자립 관련 정보 (정책, 기관, 시설)'
    },
    emo: {
      code: 'emo',
      name: '정서', 
      description: '정서적 자립 관련된 정보 (정책, 기관, 시설)'
    },
    econ: {
      code: 'econ',
      name: '경제',
      description: '경제적 자립 관련된 정보 (정책, 기관, 시설)'
    },
    soc: {
      code: 'soc',
      name: '사회',
      description: '사회적 자립 관련된 정보 (정책, 기관, 시설)'
    }
  },
  
  // 모든 자립유형 코드 배열
  ALL_CODES: ['basic', 'phys', 'emo', 'econ', 'soc'] as const,
  
  // 자립유형별 한글명 매핑
  NAMES: {
    basic: '기초',
    phys: '신체',
    emo: '정서',
    econ: '경제',
    soc: '사회'
  } as const
} as const;

// ============================================================================
// 성별/연령/장애정도 관련 상수
// ============================================================================

export type GenderCode = 'male' | 'female';
export type AgeCondCode = 'minor' | 'adult' | 'all';
export type DisLevelCode = 'mild' | 'severe';

// ============================================================================
// 성별 관련 상수
// ============================================================================

export const GENDER_CONSTANTS = {
  // 성별 코드와 정보
  GENDER: {
    male: {
      code: 'male',
      name: '남성'
    },
    female: {
      code: 'female', 
      name: '여성'
    }
  },
  
  // ALL_CODES 배열
  ALL_CODES: ['male', 'female'] as const
} as const;

// ============================================================================
// 연령 조건 관련 상수
// ============================================================================

export const AGE_COND_CONSTANTS = {
  // 연령 조건 코드와 정보
  AGE_COND: {
    minor: {
      code: 'minor',
      name: '미성년자'
    },
    adult: {
      code: 'adult',
      name: '성인'
    },
    all: {
      code: 'all',
      name: '전체'
    }
  },
  
  // ALL_CODES 배열
  ALL_CODES: ['minor', 'adult', 'all'] as const
} as const;

// ============================================================================
// 장애정도 관련 상수
// ============================================================================

export const DIS_LEVEL_CONSTANTS = {
  // 장애정도 코드와 정보
  DIS_LEVEL: {
    mild: {
      code: 'mild',
      name: '경증'
    },
    severe: {
      code: 'severe',
      name: '중증'
    }
  },
  
  // ALL_CODES 배열
  ALL_CODES: ['mild', 'severe'] as const
} as const;


// ============================================================================
// 자립 지원 정보 메뉴 타입 관련 상수
// ============================================================================

export type SelfCheckMoreMenuType = 'policies' | 'providers' | 'facilities';

export const SELF_CHECK_MORE_CONSTANTS = {
  // 자립 지원 정보 메뉴별 코드와 정보 (API 엔드포인트와 일치)
  MENU_TYPES: {
    policies: {
      code: 'policies',
      name: '자립 지원 정책',
      description: '장애인 자립생활을 위한 다양한 정책 및 지원제도 정보'
    },
    providers: {
      code: 'providers', 
      name: '자립 지원 기관',
      description: '장애인 자립생활을 지원하는 기관 및 서비스 제공업체 정보'
    },
    facilities: {
      code: 'facilities',
      name: '자립 지원 시설', 
      description: '장애인 접근성을 고려한 시설 및 편의시설 정보'
    }
  },
  
  // 모든 메뉴 타입 코드 배열 (API 엔드포인트와 일치)
  ALL_CODES: ['policies', 'providers', 'facilities'] as const,
  
  // 메뉴 타입별 한글명 매핑
  NAMES: {
    policies: '자립 지원 정책',
    providers: '자립 지원 기관',
    facilities: '자립 지원 시설'
  } as const
} as const;

// ============================================================================
// 유틸리티 함수
// ============================================================================

/**
 * 자립테마 코드로 한글명 가져오기
 */
export function getThemeName(code: ThemeCode): string {
  return THEME_CONSTANTS.NAMES[code];
}

/**
 * 데이터 유형 코드로 한글명 가져오기
 */
export function getDataTypeName(code: DataTypeCode): string {
  return DATA_TYPE_CONSTANTS.NAMES[code];
}

/**
 * 자립유형 코드로 한글명 가져오기
 */
export function getSelfRelTypeName(code: SelfRelTypeCode): string {
  return SELF_REL_TYPE_CONSTANTS.NAMES[code];
}

/**
 * 자립 지원 정보 메뉴 타입 코드로 한글명 가져오기
 */
export function getSelfCheckMoreMenuName(code: SelfCheckMoreMenuType): string {
  return SELF_CHECK_MORE_CONSTANTS.NAMES[code];
}

/**
 * 성별 코드로 한글명 가져오기
 */
export function getGenderName(code: GenderCode): string {
  return GENDER_CONSTANTS.GENDER[code].name;
}

/**
 * 연령 조건 코드로 한글명 가져오기
 */
export function getAgeCondName(code: AgeCondCode): string {
  return AGE_COND_CONSTANTS.AGE_COND[code].name;
}

/**
 * 장애정도 코드로 한글명 가져오기
 */
export function getDisLevelName(code: DisLevelCode): string {
  return DIS_LEVEL_CONSTANTS.DIS_LEVEL[code].name;
}

/**
 * 자립테마 코드가 유효한지 확인
 */
export function isValidThemeCode(code: string): code is ThemeCode {
  return THEME_CONSTANTS.ALL_CODES.includes(code as ThemeCode);
}

/**
 * 데이터 유형 코드가 유효한지 확인
 */
export function isValidDataTypeCode(code: string): code is DataTypeCode {
  return DATA_TYPE_CONSTANTS.ALL_CODES.includes(code as DataTypeCode);
}

/**
 * 자립유형 코드가 유효한지 확인
 */
export function isValidSelfRelTypeCode(code: string): code is SelfRelTypeCode {
  return SELF_REL_TYPE_CONSTANTS.ALL_CODES.includes(code as SelfRelTypeCode);
}

// ============================================================================
// API 쿼리 파라미터용 상수
// ============================================================================

/**
 * 자립테마 코드들을 콤마로 구분된 문자열로 변환
 */
export function getThemeCodesString(codes: ThemeCode[]): string {
  return codes.join(',');
}

/**
 * 데이터 유형 코드들을 콤마로 구분된 문자열로 변환
 */
export function getDataTypeCodesString(codes: DataTypeCode[]): string {
  return codes.join(',');
}

/**
 * 자립유형 코드들을 콤마로 구분된 문자열로 변환
 */
export function getSelfRelTypeCodesString(codes: SelfRelTypeCode[]): string {
  return codes.join(',');
}

/**
 * 콤마로 구분된 문자열을 자립테마 코드 배열로 변환
 */
export function parseThemeCodesString(codesString: string): ThemeCode[] {
  return codesString.split(',').filter(isValidThemeCode) as ThemeCode[];
}

/**
 * 콤마로 구분된 문자열을 데이터 유형 코드 배열로 변환
 */
export function parseDataTypeCodesString(codesString: string): DataTypeCode[] {
  return codesString.split(',').filter(isValidDataTypeCode) as DataTypeCode[];
}

/**
 * 콤마로 구분된 문자열을 자립유형 코드 배열로 변환
 */
export function parseSelfRelTypeCodesString(codesString: string): SelfRelTypeCode[] {
  return codesString.split(',').filter(isValidSelfRelTypeCode) as SelfRelTypeCode[];
}
