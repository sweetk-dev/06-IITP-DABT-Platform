// 성별·장애정도 필터 값 정규화 회귀 테스트 (v1.2.3)
import { toGenderCode, toDisLevelCode, GENDER_FILTER_VALUES, DIS_LEVEL_FILTER_VALUES } from '../filterCodes';
// 검증 스키마만 확인한다 — 설정(env)·로거를 읽는 모듈은 대역으로 바꾼다
jest.mock('../../config/logger', () => ({ logger: { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() } }));
jest.mock('../../middleware/errorHandler', () => ({ createError: jest.fn() }));
import { commonSchemas } from '../../middleware/validator';

describe('filterCodes', () => {
  it('한글 이름과 코드를 모두 DB 코드로 바꾼다', () => {
    expect(toGenderCode('남성')).toBe('male');
    expect(toGenderCode('여성')).toBe('female');
    expect(toGenderCode('female')).toBe('female');
    expect(toGenderCode(' MALE ')).toBe('male');
    expect(toDisLevelCode('경증')).toBe('mild');
    expect(toDisLevelCode('중증')).toBe('severe');
    expect(toDisLevelCode('severe')).toBe('severe');
  });

  it("장애정도 '모름'과 알 수 없는 값은 조건 없음(null)", () => {
    expect(toDisLevelCode('모름')).toBeNull();
    expect(toDisLevelCode('unknown')).toBeNull();
    expect(toDisLevelCode('보통')).toBeNull();
    expect(toGenderCode('')).toBeNull();
    expect(toGenderCode(undefined)).toBeNull();
  });

  it('허용 값 목록은 코드와 한글 이름을 함께 담는다', () => {
    expect(GENDER_FILTER_VALUES).toEqual(expect.arrayContaining(['male', 'female', '남성', '여성']));
    expect(DIS_LEVEL_FILTER_VALUES).toEqual(expect.arrayContaining(['mild', 'severe', 'unknown', '경증', '중증', '모름']));
  });

  it('요청 검증은 코드와 한글 이름을 받고 그 밖의 값은 거절한다', () => {
    expect(commonSchemas.selfCheckQuery.parse({ gender: 'female', disLevel: 'severe' })).toMatchObject({ gender: 'female', disLevel: 'severe' });
    expect(commonSchemas.selfCheckQuery.parse({ gender: '여성', disLevel: '중증' })).toMatchObject({ gender: '여성', disLevel: '중증' });
    expect(() => commonSchemas.selfCheckQuery.parse({ gender: 'x' })).toThrow();
    expect(() => commonSchemas.selfCheckQuery.parse({ disLevel: '보통' })).toThrow();
  });
});
