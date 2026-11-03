import { Op } from 'sequelize';
import { toGenderCode, toDisLevelCode } from '../../utils/filterCodes';

// 정책 조회 조건 — 추천·더보기 공통 (v1.2.0)
// - 링크가 빈 문자열인 정책은 외부 기관 정책 정보로 연결되지 않으므로 추천하지 않는다
// - 성별·장애정도는 DB 에 'female, male' / 'mild, severe' 처럼 여러 값이 쉼표로 저장되므로 목록 원소 일치로 거른다
//   ('male' 이 'female' 안에 문자열로 들어 있으므로 단순 LIKE 는 쓰지 않는다)
// - 연령은 'all' 이면 누구에게나 해당한다
// 필터 키는 processFilterConditions 가 만드는 이름(gender, dis_level, age_cond, self_rlty_type)을 쓴다
// - 성별·장애정도는 한글 이름(남성·중증 등)으로 들어와도 DB 코드로 바꿔 거른다(v1.2.3). 장애정도 '모름'은 거르지 않는다
// 쉼표 목록 칸에서 원소 하나와 정확히 맞는지 보는 정규식(값은 영문 코드만 허용)
export function listItemPattern(value: unknown): string | null {
  const v = String(value ?? '').trim().toLowerCase();
  if (!/^[a-z_]+$/.test(v)) {
    return null;
  }
  return `(^|,)[[:space:]]*${v}[[:space:]]*(,|$)`;
}

// 칸이 비어 있으면(제한 없음) 누구에게나 해당한다
function listItemOrAll(column: string, pattern: string): any {
  return { [Op.or]: [{ [column]: { [Op.iRegexp]: pattern } }, { [column]: null }, { [column]: '' }] };
}

export function buildPolicyWhere(filterConditions: Record<string, any> = {}, options: { theme?: string; requireLink?: boolean } = {}): any {
  const and: any[] = [];
  if (options.theme) {
    and.push({ self_rlty_type: options.theme });
  } else {
    const raw = filterConditions.self_rlty_type;
    const themes = Array.isArray(raw) ? raw : raw ? [raw] : [];
    if (themes.length > 0) {
      and.push({ self_rlty_type: { [Op.in]: themes } });
    }
  }
  if (options.requireLink) {
    // link <> '' 는 NULL 도 함께 걸러낸다(NULL <> '' 는 참이 아님)
    and.push({ link: { [Op.ne]: '' } });
  }
  const gender = listItemPattern(toGenderCode(filterConditions.gender));
  if (gender) {
    and.push(listItemOrAll('gender', gender));
  }
  const disLevel = listItemPattern(toDisLevelCode(filterConditions.dis_level));
  if (disLevel) {
    and.push(listItemOrAll('dis_level', disLevel));
  }
  const ageCond = filterConditions.age_cond;
  if (ageCond) {
    and.push({ age_cond: { [Op.in]: [String(ageCond), 'all'] } });
  }
  return and.length > 0 ? { [Op.and]: and } : {};
}
