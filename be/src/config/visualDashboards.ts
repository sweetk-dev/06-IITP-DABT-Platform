// 데이터 상세 화면 시각화(Metabase 공개 대시보드) URL 계산 — 2026-10 추가
//
// 배경: 기존 FE 는 "차트보기"를 누르면 빌드 환경변수(VITE_VISUAL_TOOL)의 대시보드 하나로만 새 창을 열었다.
//       데이터가 무엇이든 같은 대시보드가 열려, 사용자가 해당 데이터의 차트를 다시 찾아야 했다.
// 변경: 데이터의 sys_tbl_id(원천 테이블 ID)로 전용 공개 대시보드를 찾아 상세 응답(visual_url)에 실어 보낸다.
//       FE 는 이 주소를 화면 안 iframe 으로 임베드한다.
//
// 매핑 파일: ./visualDashboards.json (인스턴스별 값 — 갱신 방법은 파일 안 _howToUpdate 참고)
// 주소 앞부분: 환경변수 VISUAL_TOOL_BASE_URL
//   - 미설정: 기본값 https://www.sweetk.ai/iitp/analysis/public/dashboard/
//   - "off" 또는 "none": 기능 끔 → visual_url 을 내려주지 않음(FE 는 VITE_VISUAL_TOOL 로 대체하거나 구역 숨김)
import visualDashboards from './visualDashboards.json';
import { env } from './env';

interface VisualDashboardConfig {
  default?: string;
  map: Record<string, string>;
}

const config = visualDashboards as unknown as VisualDashboardConfig;

// UUID 형식 검사 (설정 파일 오타로 엉뚱한 주소가 만들어지는 것을 방지)
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * sys_tbl_id 로 Metabase 공개 대시보드 전체 URL 을 만든다.
 *
 * @param sysTblId sys_data_summary_info.sys_tbl_id (예: 'stats_dis_reg_natl_by_new')
 * @returns 전체 URL. 기능이 꺼져 있거나 쓸 수 있는 UUID 가 없으면 undefined
 */
export function buildVisualUrl(sysTblId?: string | null): string | undefined {
  const base = (env.VISUAL_TOOL_BASE_URL || '').trim();
  if (!base || /^(off|none|false)$/i.test(base)) return undefined;

  const key = (sysTblId || '').trim();
  const uuid = (key && config.map[key]) || config.default;
  if (!uuid || !UUID_PATTERN.test(uuid)) return undefined;

  // 끝에 '/' 가 있든 없든 동일하게 동작
  return `${base.replace(/\/+$/, '')}/${uuid}`;
}
