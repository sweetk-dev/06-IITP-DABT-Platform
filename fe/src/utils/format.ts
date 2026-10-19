/**
 * 화면 표시용 값 정리 함수 모음 (2026-10 데이터 표시 개선)
 *
 * DB/Open API 가 주는 원본 값은 그대로 두고, "보여 줄 때만" 사람이 읽기 좋은 형태로 바꾼다.
 */

/**
 * 제공 포맷 표시 정리.
 *
 * DB(sys_data_summary_info.data_format)에는 "[json]", "[json, csv]", "json/xml" 처럼
 * 대괄호·구분자가 섞인 문자열이 들어 있다. 화면에는 "JSON", "JSON, CSV" 처럼 대문자 목록으로 보여 준다.
 * 값이 없으면 "-" (기존 코드는 값이 없을 때 근거 없이 'csv' 를 표시했다).
 *
 * @example formatDataFormat('[json]')        // 'JSON'
 * @example formatDataFormat('[json, csv]')   // 'JSON, CSV'
 * @example formatDataFormat(undefined)       // '-'
 */
export function formatDataFormat(raw?: string | null): string {
  if (!raw) return '-';
  const parts = String(raw)
    .replace(/[[\]"']/g, ' ')        // 대괄호·따옴표 제거
    .split(/[,/|;\s]+/)              // 쉼표·슬래시·공백 등으로 분리
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => p.toUpperCase());
  // 중복 제거 (예: "[json, JSON]")
  const unique = Array.from(new Set(parts));
  return unique.length > 0 ? unique.join(', ') : '-';
}

/**
 * 날짜 문자열 표시 정리: "2026-08-24" → "2026.08.24", "20260824" → "2026.08.24", 없으면 "-".
 * (common 패키지 formatDate 는 '-' 만 '.' 로 바꾸므로 8자리 숫자형을 추가로 처리)
 */
export function formatDisplayDate(raw?: string | null): string {
  if (!raw) return '-';
  const value = String(raw).trim();
  if (!value) return '-';
  const compact = /^(\d{4})(\d{2})(\d{2})$/.exec(value);
  if (compact) return `${compact[1]}.${compact[2]}.${compact[3]}`;
  // "2026-08-24T00:00:00" 같은 시각 포함 값은 날짜 부분만
  return value.slice(0, 10).replace(/-/g, '.');
}

// "616.000", "-12.50", "1250" 처럼 숫자로만 이루어진 문자열
const NUMERIC_STRING = /^-?\d+(\.\d+)?$/;

/**
 * 미리보기 표의 숫자 값 표시 정리.
 *
 * Open API(09)는 통계 값을 "616.000" 처럼 소수점 이하 0 을 붙인 문자열로 준다.
 *  - grouping=true  : 정수는 천 단위 구분 기호(1,250), 소수는 의미 있는 자리만(12.5) — 통계 "데이터" 열
 *  - grouping=false : 천 단위 구분 없이 의미 없는 0 만 제거(126.000 → 126) — 좌표·코드 등 그 밖의 열
 * 숫자가 아닌 값은 그대로 문자열로 돌려준다. null/undefined/빈 값은 "-".
 *
 * 연도(prdDe: 2022)나 날짜 열은 호출하는 쪽에서 이 함수를 쓰지 않는다(2,022 로 바뀌면 안 되므로).
 */
export function formatPreviewNumber(value: unknown, grouping: boolean): string {
  if (value === null || value === undefined || value === '') return '-';
  const text = String(value).trim();
  if (!NUMERIC_STRING.test(text)) return text;

  // 소수부의 끝 0 제거: "616.000" → "616", "12.500" → "12.5"
  let [intPart, fracPart = ''] = text.split('.');
  fracPart = fracPart.replace(/0+$/, '');

  if (grouping) {
    const negative = intPart.startsWith('-');
    const digits = negative ? intPart.slice(1) : intPart;
    // 문자열 기반 천 단위 구분 (Number 변환 시 큰 수 정밀도 손실 방지)
    const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    intPart = (negative ? '-' : '') + grouped;
  }
  return fracPart ? `${intPart}.${fracPart}` : intPart;
}

/**
 * 정규식 특수문자 이스케이프 — 사용자가 입력한 검색어로 RegExp 를 만들 때 사용.
 * (기존 검색어 강조 코드는 "(" 같은 문자를 입력하면 RegExp 생성 오류로 화면이 깨졌다)
 */
export function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
