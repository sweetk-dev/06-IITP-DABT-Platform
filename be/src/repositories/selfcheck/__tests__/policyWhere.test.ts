// 자가진단 정책 조회 조건 회귀 테스트 (v1.2.0)
import { Op } from 'sequelize';
import { buildPolicyWhere, listItemPattern } from '../policyWhere';

describe('buildPolicyWhere', () => {
  it('추천은 유형 1개와 비어 있지 않은 링크를 요구한다', () => {
    const w = buildPolicyWhere({ self_rlty_type: ['emo', 'soc'] }, { theme: 'emo', requireLink: true });
    const and = w[Op.and];
    expect(and).toContainEqual({ self_rlty_type: 'emo' });
    expect(and).toContainEqual({ link: { [Op.ne]: '' } });
  });

  it('더보기는 themes 목록으로 거른다(키 이름 self_rlty_type)', () => {
    const w = buildPolicyWhere({ self_rlty_type: ['phys', 'econ'] });
    expect(w[Op.and]).toContainEqual({ self_rlty_type: { [Op.in]: ['phys', 'econ'] } });
  });

  it('성별·장애정도는 쉼표 목록 원소 일치, 연령은 all 도 허용한다', () => {
    const w = buildPolicyWhere({ gender: 'male', dis_level: 'mild', age_cond: 'minor' });
    const and = w[Op.and];
    expect(and).toContainEqual({ [Op.or]: [{ gender: { [Op.iRegexp]: listItemPattern('male') } }, { gender: null }, { gender: '' }] });
    expect(and).toContainEqual({ [Op.or]: [{ dis_level: { [Op.iRegexp]: listItemPattern('mild') } }, { dis_level: null }, { dis_level: '' }] });
    expect(and).toContainEqual({ age_cond: { [Op.in]: ['minor', 'all'] } });
  });

  it("'male' 은 'female' 에 걸리지 않고, 'female, male' 에는 걸린다", () => {
    // PostgreSQL ~ 와 같은 의미로 JS 에서 확인([[:space:]] → \s)
    const re = new RegExp(String(listItemPattern('male')).replace(/\[\[:space:\]\]/g, '\\s'));
    expect(re.test('female')).toBe(false);
    expect(re.test('female, male')).toBe(true);
    expect(re.test('male')).toBe(true);
    expect(listItemPattern("x' OR 1=1")).toBeNull();
  });

  it('조건이 없으면 빈 조건, 테마 하나는 문자열로도 받는다', () => {
    expect(buildPolicyWhere({})).toEqual({});
    expect(buildPolicyWhere(undefined as any)).toEqual({});
    expect(buildPolicyWhere({ self_rlty_type: 'phys' })[Op.and]).toContainEqual({ self_rlty_type: { [Op.in]: ['phys'] } });
  });
});
