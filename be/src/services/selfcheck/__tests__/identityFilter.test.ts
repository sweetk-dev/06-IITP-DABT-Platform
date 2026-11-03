// 본인 확인 답 → 추천·정책 조회 조건 (v1.3.0)
import { identityFilterQuery, readSavedIdentity } from '@iitp-dabt-platform/common';

describe('identityFilterQuery', () => {
  it('성별·장애정도·연령을 조회 조건으로 바꾼다', () => {
    expect(identityFilterQuery({ is_person_with_disability: 'yes', gender: 'female', disability_level: 'mild', age_group: 'adult' }))
      .toEqual({ gender: 'female', disLevel: 'mild', ageCond: 'adult' });
    expect(identityFilterQuery({ is_person_with_disability: 'no', gender: 'male', disability_level: 'severe', age_group: 'minor' }))
      .toEqual({ gender: 'male', disLevel: 'severe', ageCond: 'minor' });
  });

  it("장애정도 '모름'은 장애정도 조건을 보내지 않는다", () => {
    expect(identityFilterQuery({ gender: 'female', disability_level: 'unknown', age_group: 'adult' }))
      .toEqual({ gender: 'female', ageCond: 'adult' });
  });

  it('답이 없거나 알 수 없는 값이면 조건을 만들지 않는다', () => {
    expect(identityFilterQuery(null)).toEqual({});
    expect(identityFilterQuery(undefined)).toEqual({});
    expect(identityFilterQuery({ gender: 'x' as any, disability_level: 'x' as any, age_group: 'x' as any })).toEqual({});
  });
});

describe('readSavedIdentity', () => {
  it('저장된 JSON 을 읽고, 없거나 깨졌으면 null', () => {
    expect(readSavedIdentity('{"gender":"male","disability_level":"mild","age_group":"adult","is_person_with_disability":"yes"}'))
      .toMatchObject({ gender: 'male' });
    expect(readSavedIdentity(null)).toBeNull();
    expect(readSavedIdentity('')).toBeNull();
    expect(readSavedIdentity('{깨진')).toBeNull();
    expect(readSavedIdentity('"text"')).toBeNull();
  });
});
