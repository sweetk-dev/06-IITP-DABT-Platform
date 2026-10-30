// 위기 상담 안내 대상 판정 (v1.4.0) — 데이터 상세 화면이 쓰는 공통 규칙
import { CRISIS_HELPLINE_CONSTANTS, needsCrisisHelpline } from '@iitp-dabt-platform/common';

describe('needsCrisisHelpline', () => {
  it('자살 생각 통계에는 안내를 띄운다', () => {
    expect(needsCrisisHelpline('stats_dis_emo_suicide_ideation')).toBe(true);
    expect(needsCrisisHelpline(' stats_dis_emo_suicide_ideation ')).toBe(true);
  });

  it('다른 데이터에는 띄우지 않는다', () => {
    expect(needsCrisisHelpline('stats_dis_emo_depression')).toBe(false);
    expect(needsCrisisHelpline('stats_dis_reg_natl_by_new')).toBe(false);
    expect(needsCrisisHelpline('')).toBe(false);
    expect(needsCrisisHelpline(null)).toBe(false);
    expect(needsCrisisHelpline(undefined)).toBe(false);
  });

  it('상담전화는 109 와 1577-0199 를 안내한다', () => {
    expect(CRISIS_HELPLINE_CONSTANTS.LINES.map((l) => l.tel)).toEqual(['109', '1577-0199']);
  });
});
