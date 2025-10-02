// 자가진단 관련 타입 및 상수 정의
import { SelfRltyTypeCode, SELF_RLTY_TYPE_CONSTANTS, DIS_LEVEL_CONSTANTS } from './constants.js';

// ============================================================================
// 상수 정의
// ============================================================================

// 시간 관련 상수
export const SELF_CHECK_CONSTANTS = {
  // 문항당 소요시간 (초)
  TIME_PER_QUESTION: 20,
  
  // 총 문항 수
  TOTAL_QUESTIONS: {
    IDENTITY: 4,        // 본인 확인 문항
    SELF_CHECK: 31,     // 자가진단 문항
    TOTAL: 35           // 전체 문항
  },
  
  // 영역별 문항 수
  QUESTIONS_PER_AREA: {
    phys: 8,        // 신체적 자립 (PI)
    emo: 7,         // 정서적 자립 (MI)  
    econ: 8,        // 경제적 자립 (EI)
    soc: 8          // 사회적 자립 (SI)
  },
  
  // 점수 관련
  SCORE: {
    MIN: 1,
    MAX: 5,
    INTERVAL: 1
  },
  
  // 미달 기준 점수
  DEFICIENCY_THRESHOLD: 70,
  
  // 정책 노출 우선순위 (SELF_RLTY_TYPE_CONSTANTS에서 동적으로 가져옴, basic 제외)
  POLICY_PRIORITY_ORDER: SELF_RLTY_TYPE_CONSTANTS.ALL_CODES.filter(code => code !== SELF_RLTY_TYPE_CONSTANTS.SELF_REL_TYPES.basic.code) as Exclude<SelfRltyTypeCode, 'basic'>[]
} as const;

// 총 소요시간 계산 (초)
export const TOTAL_TIME_SECONDS = SELF_CHECK_CONSTANTS.TIME_PER_QUESTION * SELF_CHECK_CONSTANTS.TOTAL_QUESTIONS.TOTAL;

// ============================================================================
// 타입 정의
// ============================================================================

// 자립 영역 타입 (constants.ts의 SelfRltyTypeCode에서 자가진단 관련 영역만 사용)
// SelfCheckAreaType은 SelfRltyTypeCode의 subset으로 정의 (basic 제외)
export type SelfCheckAreaType = Exclude<SelfRltyTypeCode, typeof SELF_RLTY_TYPE_CONSTANTS.SELF_REL_TYPES.basic.code>;

// 본인 확인 문항 타입
export type IdentityQuestionType = 
  | 'is_person_with_disability'    // 장애인 본인입니까?
  | 'gender'                       // 성별
  | 'disability_level'            // 장애정도
  | 'age_group';                  // 연령

// 본인 확인 응답 타입
export type IdentityResponse = {
  is_person_with_disability: 'yes' | 'no';
  gender: 'male' | 'female';
  disability_level: typeof DIS_LEVEL_CONSTANTS.ALL_CODES[number];
  age_group: 'minor' | 'adult';
};

// 자가진단 점수 타입 (1~5점)
export type SelfCheckScore = 1 | 2 | 3 | 4 | 5;

// 자가진단 문항 ID 타입
export type SelfCheckQuestionId = 
  // 신체적 자립 (PI1~PI8)
  | 'PI1' | 'PI2' | 'PI3' | 'PI4' | 'PI5' | 'PI6' | 'PI7' | 'PI8'
  // 정서적 자립 (MI1~MI7)
  | 'MI1' | 'MI2' | 'MI3' | 'MI4' | 'MI5' | 'MI6' | 'MI7'
  // 경제적 자립 (EI1~EI8)
  | 'EI1' | 'EI2' | 'EI3' | 'EI4' | 'EI5' | 'EI6' | 'EI7' | 'EI8'
  // 사회적 자립 (SI1~SI8)
  | 'SI1' | 'SI2' | 'SI3' | 'SI4' | 'SI5' | 'SI6' | 'SI7' | 'SI8';

// 자가진단 응답 타입
export type SelfCheckResponse = {
  [K in SelfCheckQuestionId]?: SelfCheckScore;
};

// 자가진단 결과 타입
export type SelfCheckResult = {
  areaScores: { [key in SelfCheckAreaType]: number }; // 영역별 최종 환산 점수 (0~100)
  deficientAreas: SelfCheckAreaType[]; // 미달 영역 리스트
  recommendedPolicies: string[]; // 추천 정책 리스트
  totalScore: number; // 전체 평균 점수
};

// 전체 응답 타입
export type CompleteSelfCheckResponse = {
  identity: IdentityResponse;
  selfCheck: SelfCheckResponse;
  result?: SelfCheckResult;
};

// ============================================================================
// 문항 데이터 정의
// ============================================================================

// 본인 확인 문항 데이터
export const IDENTITY_QUESTIONS = [
  {
    id: 'is_person_with_disability' as IdentityQuestionType,
    question: '장애인 본인입니까?',
    options: [
      { value: 'yes', label: '네, 본인입니다.' },
      { value: 'no', label: '아니오, 가족입니다.' }
    ]
  },
  {
    id: 'gender' as IdentityQuestionType,
    question: '성별을 알려주세요.',
    options: [
      { value: 'female', label: '여성' },
      { value: 'male', label: '남성' }
    ],
    note: '남성인 경우, 여성 관련 정책 필터링 필요'
  },
  {
    id: 'disability_level' as IdentityQuestionType,
    question: '장애 정도를 알려주세요.',
    options: [
      { value: DIS_LEVEL_CONSTANTS.DIS_LEVEL.mild.code, label: DIS_LEVEL_CONSTANTS.DIS_LEVEL.mild.name },
      { value: DIS_LEVEL_CONSTANTS.DIS_LEVEL.severe.code, label: DIS_LEVEL_CONSTANTS.DIS_LEVEL.severe.name },
      { value: DIS_LEVEL_CONSTANTS.DIS_LEVEL.unknown.code, label: DIS_LEVEL_CONSTANTS.DIS_LEVEL.unknown.name }
    ],
    note: '모름의 경우, \'기초\' 정책 안내'
  },
  {
    id: 'age_group' as IdentityQuestionType,
    question: '연령을 알려주세요.',
    options: [
      { value: 'minor', label: '미성년자(만 18세 이하)' },
      { value: 'adult', label: '성인(만 19세 이상)' }
    ],
    note: '연령 필터링'
  }
] as const;

// 자가진단 문항 데이터
export const SELF_CHECK_QUESTIONS = {
  // 신체적 자립 (Physical Independence, PI)
  phys: [
    { id: 'PI1', question: '나의 건강유지에 관심이 있다.' },
    { id: 'PI2', question: '나는 매일 적당한 운동 (걷기 등)을 하고 있다.' },
    { id: 'PI3', question: '나의 건강상태(장애)를 구체적으로 설명할 수 있다.' },
    { id: 'PI4', question: '내가 아플 경우(감기, 간질, 욕창, 방광역류 등) 기본적인 처치법을 알고 있다.' },
    { id: 'PI5', question: '기호품의 섭취를 조절할 수 있다. (술, 담배, 커피 등)' },
    { id: 'PI6', question: '나는 세끼 식사를 규칙적으로 하고 있다.' },
    { id: 'PI7', question: '나는 청결한 위생상태(신체청결, 청소 등)를 유지하기 위해 관리한다.' },
    { id: 'PI8', question: '내 나이의 다른 사람들과 비교했을 때 나는 외모를 잘 가꾸고 있다.' }
  ],
  
  // 정서적 자립 (Mental Independence, MI)
  emo: [
    { id: 'MI1', question: '나는 내 모습에 자신감을 가지고 있다' },
    { id: 'MI2', question: '나의 미래에 대한 자신감과 인생의 목표가 있다' },
    { id: 'MI3', question: '내 인생은 지금보다 더 행복해질 수 있다' },
    { id: 'MI4', question: '나의 생활에 대해서는 내가 주관을 가지고 결정한다' },
    { id: 'MI5', question: '장애로 인해 부당한 대우를 받았을 경우 이에 대해 항의할 수 있다' },
    { id: 'MI6', question: '나는 어리석거나 즐겁지 않은 생각에서 금방 벗어날 수 있다' },
    { id: 'MI7', question: '나는 화가 났을 경우 긴장을 풀고 나 자신을 통제할 수 있다' }
  ],
  
  // 경제적 자립 (Economic Independence, EI)
  econ: [
    { id: 'EI1', question: '나는 현재 일을 하고 있으며 고정적인 수입이 있다.' },
    { id: 'EI2', question: '나는 장애 수당을 포함한 소득으로 식비, 주거비, 공과금 등 기본적인 생활비를 충당할 수 있다.' },
    { id: 'EI3', question: '나는 고정 수입이 없어도 예금이나 적금으로 현재의 생활을 6개월 정도 유지할 수 있다.' },
    { id: 'EI4', question: '나는 예상치 못한 지출(병원비, 수리비 등)을 감당할 수 있는 예비비가 있다.' },
    { id: 'EI5', question: '나는 지난 12개월 동안 전기세, 수도세, 통신요금 등을 제때 납부하지 못한 경험이 있다.' },
    { id: 'EI6', question: '나는 현재 소득 수준에 만족한다.' },
    { id: 'EI7', question: '나는 스스로 돈 관리를 하며 계획된 저축이나 투자를 하고 있다.' },
    { id: 'EI8', question: '향후 6개월 내 재정 상황이 좋아질 것으로 예상한다.' }
  ],
  
  // 사회적 자립 (Social Independence, SI)
  soc: [
    { id: 'SI1', question: '나는 사람(장애인, 비장애인 모두 포함)들을 만나는 것이 즐겁다.' },
    { id: 'SI2', question: '한달에 편지나 전화, 방문할 정도의 친한 사람이 5명 이상 있다.' },
    { id: 'SI3', question: '한달동안 처음으로 대화 또는 말해본 사람이 1명 이상 있다.' },
    { id: 'SI4', question: '나는 나만의 여가활동 (종교활동 제외) 이 있다.' },
    { id: 'SI5', question: '나는 지역의 일반시설을 이용하고 있다. (도서관, 문화센터, 스포츠센터 등)' },
    { id: 'SI6', question: '나는 광고나 쇼핑을 통해 어떤 방법으로든 물건을 살 수 있다.' },
    { id: 'SI7', question: '나는 상황에 따라 적절한 교통수단을 선택하여 독립적으로 혹은 타인의 도움을 받아 교통수단을 이용할 수 있다.' },
    { id: 'SI8', question: '나는 장애인의 권리와 서비스를 알고 싶을 때 어디에 가면 되는지 알고 있다. (동사무소, 복지관 등)' }
  ]
} as const;

// ============================================================================
// 유틸리티 함수
// ============================================================================

// AREA_NAMES와 AREA_CODES는 SELF_RLTY_TYPE_CONSTANTS에서 가져옴
export function getAreaName(area: SelfCheckAreaType): string {
  return SELF_RLTY_TYPE_CONSTANTS.SELF_REL_TYPES[area].name;
}

export function getAreaCode(area: SelfCheckAreaType): string {
  // 자가진단 영역별 코드 매핑
  const areaCodeMap: Record<SelfCheckAreaType, string> = {
    phys: 'PI',
    emo: 'MI', 
    econ: 'EI',
    soc: 'SI'
  };
  return areaCodeMap[area];
}

/**
 * 모든 영역의 코드 배열을 우선순위 순으로 반환
 * @returns 영역 코드 배열 ['phys', 'econ', 'emo', 'soc']
 */
export function getAreasInPriorityOrder(): SelfCheckAreaType[] {
  return [...SELF_CHECK_CONSTANTS.POLICY_PRIORITY_ORDER];
}

// 영역별 문항 수 가져오기
export function getQuestionCountByArea(area: SelfCheckAreaType): number {
  return SELF_CHECK_QUESTIONS[area].length;
}

// 전체 문항 목록 가져오기 (순서대로)
export function getAllSelfCheckQuestions() {
  const allQuestions: Array<{ id: string; question: string }> = [];
  
  // 영역 순서: SELF_CHECK_CONSTANTS.POLICY_PRIORITY_ORDER 사용
  const areas: SelfCheckAreaType[] = SELF_CHECK_CONSTANTS.POLICY_PRIORITY_ORDER;
  
  for (const area of areas) {
    allQuestions.push(...SELF_CHECK_QUESTIONS[area]);
  }
  
  return allQuestions;
}

// 특정 영역의 문항 목록 가져오기
export function getQuestionsByArea(area: SelfCheckAreaType) {
  return SELF_CHECK_QUESTIONS[area];
}

// 문항 ID로 문항 정보 가져오기
export function getQuestionById(questionId: SelfCheckQuestionId) {
  const allQuestions = getAllSelfCheckQuestions();
  return allQuestions.find(q => q.id === questionId) || null;
}

// ============================================================================
// 점수 계산 및 결과 판단 로직
// ============================================================================

/**
 * 개별 문항 점수를 환산 점수로 변환
 * @param rawScore 원점수 (1~5점)
 * @returns 환산 점수 (20~100점)
 */
export function convertToPercentageScore(rawScore: SelfCheckScore): number {
  return (rawScore / SELF_CHECK_CONSTANTS.SCORE.MAX) * 100;
}

/**
 * 영역별 최종 점수 계산 (환산 점수 평균)
 * @param responses 사용자 응답
 * @param area 자립 영역
 * @returns 영역별 최종 환산 점수 (0~100점)
 */
export function calculateAreaScore(responses: SelfCheckResponse, area: SelfCheckAreaType): number {
  const questions = getQuestionsByArea(area);
  const scores: number[] = [];
  
  for (const question of questions) {
    const rawScore = responses[question.id];
    if (rawScore !== undefined) {
      scores.push(convertToPercentageScore(rawScore));
    }
  }
  
  if (scores.length === 0) return 0;
  
  const sum = scores.reduce((total, score) => total + score, 0);
  return Math.round((sum / scores.length) * 100) / 100; // 소수점 둘째 자리까지
}

/**
 * 전체 평균 점수 계산
 * @param areaScores 영역별 점수
 * @returns 전체 평균 점수
 */
export function calculateTotalScore(areaScores: { [key in SelfCheckAreaType]: number }): number {
  const scores = Object.values(areaScores);
  const sum = scores.reduce((total, score) => total + score, 0);
  return Math.round((sum / scores.length) * 100) / 100;
}

/**
 * 미달 영역 식별
 * @param areaScores 영역별 점수
 * @returns 미달 영역 리스트
 */
export function identifyDeficientAreas(areaScores: { [key in SelfCheckAreaType]: number }): SelfCheckAreaType[] {
  const deficientAreas: SelfCheckAreaType[] = [];
  
  for (const area of SELF_CHECK_CONSTANTS.POLICY_PRIORITY_ORDER) {
    if (areaScores[area] < SELF_CHECK_CONSTANTS.DEFICIENCY_THRESHOLD) {
      deficientAreas.push(area);
    }
  }
  
  return deficientAreas;
}

/**
 * 정책 추천 로직
 * @param deficientAreas 미달 영역 리스트
 * @param areaScores 영역별 점수
 * @param userInfo 사용자 정보
 * @returns 추천 정책 리스트
 */
export function recommendPolicies(
  deficientAreas: SelfCheckAreaType[], 
  areaScores: { [key in SelfCheckAreaType]: number },
  userInfo?: IdentityResponse
): string[] {
  const policies: string[] = [];
  
  // Case: 장애정도 모름 - 기초 정책 무조건 추가
  const isDisLevelUnknown = userInfo?.disability_level === DIS_LEVEL_CONSTANTS.DIS_LEVEL.unknown.code;
  if (isDisLevelUnknown) {
    policies.push('기초 정책');
  }
  
  const numDeficient = deficientAreas.length;
  
  if (numDeficient === 0) {
    // 모든 영역 양호 - 기초만 있으면 기초만, 없으면 일반 정책
    if (!isDisLevelUnknown) {
      policies.push('전체 영역 양호 정책');
    }
  } else if (numDeficient >= 4) {
    // Case1: 4개 모두 미달 - 각 1개씩 (4개)
    for (const area of deficientAreas) {
      policies.push(`${area}_policy_1`);
    }
  } else if (numDeficient === 3) {
    // Case2: 3개 미달 - 각 1개씩 (3개)
    for (const area of deficientAreas) {
      policies.push(`${area}_policy_1`);
    }
  } else if (numDeficient === 2) {
    // Case3: 2개 미달 - 기존 로직 (최대 3개)
    const [area1, area2] = deficientAreas;
    if (areaScores[area1] < areaScores[area2]) {
      policies.push(`${area1}_policy_1`, `${area1}_policy_2`);
      policies.push(`${area2}_policy_1`);
    } else {
      policies.push(`${area2}_policy_1`, `${area2}_policy_2`);
      policies.push(`${area1}_policy_1`);
    }
  } else if (numDeficient === 1) {
    // Case4: 1개 미달 - 해당 영역 관련 정책 3개
    policies.push(`${deficientAreas[0]}_policy_1`, `${deficientAreas[0]}_policy_2`, `${deficientAreas[0]}_policy_3`);
  }
  
  return policies;
}

/**
 * 자가진단 결과 계산 (메인 함수)
 * @param responses 사용자 자가진단 응답
 * @param userInfo 사용자 본인 확인 정보
 * @returns 자가진단 결과
 */
export function calculateSelfCheckResult(
  responses: SelfCheckResponse,
  userInfo?: IdentityResponse
): SelfCheckResult {
  // 영역별 점수 계산 (동적으로)
  const areaScores: { [key in SelfCheckAreaType]: number } = {} as any;
  SELF_CHECK_CONSTANTS.POLICY_PRIORITY_ORDER.forEach(area => {
    areaScores[area] = calculateAreaScore(responses, area);
  });
  
  // 전체 평균 점수 계산
  const totalScore = calculateTotalScore(areaScores);
  
  // 미달 영역 식별
  const deficientAreas = identifyDeficientAreas(areaScores);
  
  // 정책 추천
  const recommendedPolicies = recommendPolicies(deficientAreas, areaScores, userInfo);
  
  return {
    areaScores,
    deficientAreas,
    recommendedPolicies,
    totalScore
  };
}
