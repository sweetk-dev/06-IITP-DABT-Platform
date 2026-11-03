// 자가진단 성별·장애정도 필터 값 정규화 (v1.2.3)
// - DB(selfdiag_policy)의 gender·dis_level 칸은 영문 코드(male/female, mild/severe)로 저장된다
// - 요청은 코드와 한글 이름(남성/여성, 경증/중증/모름)을 모두 받는다. 조회 전에 코드로 바꾼다
// - 장애정도 '모름'(unknown)은 장애정도로 거르지 않는다(누구에게나 해당하는 정책까지 모두 대상)
import { GENDER_CONSTANTS, DIS_LEVEL_CONSTANTS } from '@iitp-dabt-platform/common';

type CodeTable = Record<string, { code: string; name: string }>;

function valuesOf(table: CodeTable): string[] {
  return Object.values(table).flatMap(item => [item.code, item.name]);
}

function toCode(table: CodeTable, value: unknown): string | null {
  const v = String(value ?? '').trim();
  if (!v) {
    return null;
  }
  const hit = Object.values(table).find(item => item.code === v.toLowerCase() || item.name === v);
  return hit ? hit.code : null;
}

// 요청 검증에서 허용하는 값(코드 + 한글 이름)
export const GENDER_FILTER_VALUES = valuesOf(GENDER_CONSTANTS.GENDER as unknown as CodeTable) as [string, ...string[]];
export const DIS_LEVEL_FILTER_VALUES = valuesOf(DIS_LEVEL_CONSTANTS.DIS_LEVEL as unknown as CodeTable) as [string, ...string[]];

// 성별 필터 값 → DB 코드. 알 수 없는 값은 null(조건 없음)
export function toGenderCode(value: unknown): string | null {
  return toCode(GENDER_CONSTANTS.GENDER as unknown as CodeTable, value);
}

// 장애정도 필터 값 → DB 코드. '모름'·알 수 없는 값은 null(조건 없음)
export function toDisLevelCode(value: unknown): string | null {
  const code = toCode(DIS_LEVEL_CONSTANTS.DIS_LEVEL as unknown as CodeTable, value);
  return code === DIS_LEVEL_CONSTANTS.DIS_LEVEL.unknown.code ? null : code;
}
