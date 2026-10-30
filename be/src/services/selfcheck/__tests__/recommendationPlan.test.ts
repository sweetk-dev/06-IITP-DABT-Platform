/**
 * [v1.2.1] 자가진단 추천 케이스 — 등록특허 10-3012613 청구항 1·3~6 과 같은 동작인지 고정하는 테스트.
 * 규칙 본체는 packages/common/src/types/selfcheck-logic.ts 의 planRecommendations / pickRecommendedPolicies.
 *  - 미달 기준: 70점 미만(공통 기준값)
 *  - 추천 우선순위: 신체(phys) > 경제(econ) > 정서(emo) > 사회(soc) — 명세서 【0067】, 특허 작성용 엑셀
 */
import {
  planRecommendations,
  pickRecommendedPolicies,
  determineRecommendationCase,
} from '@iitp-dabt-platform/common';

// 유형마다 후보 3건씩(BE 가 유형별 무작위로 준 결과를 흉내)
const pool = (['phys', 'econ', 'emo', 'soc'] as const).flatMap(t =>
  [1, 2, 3].map(i => ({ policy_id: `${t}${i}`, self_rlty_type: t }))
);

describe('determineRecommendationCase — 미달 개수 → 케이스(청구항 1)', () => {
  it('4개 이상=1, 3=2, 2=3, 1=4, 0=0', () => {
    expect([4, 5, 3, 2, 1, 0].map(determineRecommendationCase)).toEqual([1, 1, 2, 3, 4, 0]);
  });
});

describe('Case 1 — 4개 모두 미달: 우선순위 상위 3개 유형 1건씩(청구항 3)', () => {
  it('점수와 관계없이 신체·경제·정서 순, 사회는 빠진다', () => {
    // 사회가 가장 낮아도 우선순위가 4위라 빠진다(점수순 아님)
    const plan = planRecommendations({ phys: 60, econ: 50, emo: 40, soc: 10 });
    expect(plan.caseNo).toBe(1);
    expect(plan.slots).toEqual([
      { area: 'phys', count: 1 },
      { area: 'econ', count: 1 },
      { area: 'emo', count: 1 },
    ]);
    expect(pickRecommendedPolicies(pool, plan).map(p => p.policy_id)).toEqual(['phys1', 'econ1', 'emo1']);
  });
});

describe('Case 2 — 3개 미달: 우선순위 순 1건씩(청구항 4)', () => {
  it('정서·경제·사회 미달 → 경제, 정서, 사회 순(점수 낮은 순이 아님)', () => {
    const plan = planRecommendations({ phys: 80, econ: 65, emo: 20, soc: 30 });
    expect(plan.caseNo).toBe(2);
    expect(plan.slots.map(s => s.area)).toEqual(['econ', 'emo', 'soc']);
    expect(plan.slots.every(s => s.count === 1)).toBe(true);
  });
  it('명세서 【0070】 예: 신체·경제·사회 미달 → 신체, 경제, 사회', () => {
    const plan = planRecommendations({ phys: 50, econ: 60, emo: 90, soc: 10 });
    expect(plan.slots.map(s => s.area)).toEqual(['phys', 'econ', 'soc']);
  });
});

describe('Case 3 — 2개 미달: 더 낮은 점수 유형 2건 + 다른 유형 1건(청구항 5)', () => {
  it('엑셀 예: 신체 55, 경제 32 → 경제 2건, 신체 1건', () => {
    const plan = planRecommendations({ phys: 55, econ: 32, emo: 90, soc: 90 });
    expect(plan.caseNo).toBe(3);
    expect(plan.slots).toEqual([{ area: 'econ', count: 2 }, { area: 'phys', count: 1 }]);
    expect(pickRecommendedPolicies(pool, plan).map(p => p.policy_id)).toEqual(['econ1', 'econ2', 'phys1']);
  });
  it('동점이면 우선순위가 높은 유형을 2건', () => {
    const plan = planRecommendations({ phys: 90, econ: 50, emo: 50, soc: 90 });
    expect(plan.slots).toEqual([{ area: 'econ', count: 2 }, { area: 'emo', count: 1 }]);
  });
});

describe('Case 4 — 1개 미달: 그 유형만 3건(청구항 6)', () => {
  it('사회만 미달 → 사회 3건, 다른 유형 없음', () => {
    const plan = planRecommendations({ phys: 90, econ: 90, emo: 90, soc: 40 });
    expect(plan.caseNo).toBe(4);
    const picked = pickRecommendedPolicies(pool, plan);
    expect(picked.map(p => p.self_rlty_type)).toEqual(['soc', 'soc', 'soc']);
  });
});

describe('경계·예외', () => {
  it('70점은 미달이 아니다(70 미만만 미달)', () => {
    expect(planRecommendations({ phys: 70, econ: 70, emo: 70, soc: 69 }).caseNo).toBe(4);
  });
  it('미달 없음 → 케이스 0, 추천 없음', () => {
    const plan = planRecommendations({ phys: 100, econ: 80, emo: 75, soc: 70 });
    expect(plan.caseNo).toBe(0);
    expect(pickRecommendedPolicies(pool, plan)).toEqual([]);
  });
  it('후보가 슬롯보다 적으면 있는 만큼만(다른 유형으로 채우지 않음)', () => {
    const thin = pool.filter(p => p.policy_id !== 'soc2' && p.policy_id !== 'soc3');
    const plan = planRecommendations({ phys: 90, econ: 90, emo: 90, soc: 40 });
    expect(pickRecommendedPolicies(thin, plan).map(p => p.policy_id)).toEqual(['soc1']);
  });
});
