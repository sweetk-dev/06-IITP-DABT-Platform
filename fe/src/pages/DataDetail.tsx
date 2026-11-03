import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ROUTE_PATHS } from './App';
import { Layout } from '../components/layout/Layout';
import { Modal } from '../components/ui/Modal';
import { Tag } from '../components/ui/Tag';
import { Button } from '../components/ui/Button';
import { useDataDetail, useDataPreview } from '../api/hooks';
import { CRISIS_HELPLINE_CONSTANTS, DATA_TYPE_CONSTANTS, type DataTypeCode, needsCrisisHelpline, parseKeywords } from '@iitp-dabt-platform/common';
import { formatDataFormat, formatDisplayDate, formatPreviewNumber } from '../utils/format';
import '../styles/data-detail.css';

/*
 * 기초(통계) 데이터 미리보기 열 순서와 한글 머리글.
 * (기존 컴포넌트 안에 있던 값을 그대로 밖으로 옮김 — 렌더마다 새로 만들 필요가 없음)
 */
const BASIC_COLUMN_ORDER = ['prdDe', 'c1ObjNm', 'c1Nm', 'c2ObjNm', 'c2Nm', 'c3ObjNm', 'c3Nm', 'itmNm', 'data', 'unitNm', 'lstChnDe'];
const BASIC_COLUMN_LABELS: Record<string, string> = {
  'prdDe': '년도',
  'c1ObjNm': '분류1',
  'c1Nm': '분류1 항목',
  'c2ObjNm': '분류2',
  'c2Nm': '분류2 항목',
  'c3ObjNm': '분류3',
  'c3Nm': '분류3 항목',
  'itmNm': '데이터 항목',
  'data': '데이터',
  'unitNm': '단위',
  'lstChnDe': '최종 수정일'
};

/*
 * 숫자 정리(천 단위·끝 0 제거)를 하면 안 되는 열 — 연도/날짜/코드/ID 류.
 * 이름이 이 패턴에 맞으면 원본 문자열 그대로 표시한다. (예: prdDe 2022 → "2,022" 로 바뀌면 안 됨)
 */
const RAW_VALUE_KEY = /(prdde|lstchnde|year|yr|date|_dt$|dt$|de$|id$|_id|code|cd$|_no$|zip|tel|phone|fax)/i;

/**
 * 미리보기 표 칸 값 표시.
 *  - 기초(통계) 데이터의 "data" 열: "616.000" → "616", "12345.000" → "12,345" (천 단위 구분)
 *  - 그 밖의 숫자 문자열 열: 의미 없는 소수점 0 만 제거 ("126.000" → "126"), 천 단위 구분 없음
 *  - 연도·날짜·코드 열과 숫자가 아닌 값: 원본 그대로
 */
function formatPreviewCell(key: string, value: unknown, isBasicType: boolean): string {
  if (value === null || value === undefined || value === '') return '-';
  if (RAW_VALUE_KEY.test(key)) return String(value);
  if (isBasicType && key === 'data') return formatPreviewNumber(value, true);
  return formatPreviewNumber(value, false);
}

/**
 * 데이터 상세 화면.
 *
 * [2026-10 개편 요약]
 *  1) 반응형: 정보 표(라벨 200px + 값) 와 미리보기 표를 CSS 클래스(data-detail.css)로 옮기고,
 *     좁은 화면에서는 라벨/값을 위아래로 쌓는다. 넓은 미리보기 표는 "표 상자 안"에서만 가로 스크롤.
 *  2) 접근성:
 *     - 정보 표를 <dl>(용어-설명 목록)으로 변경 → "데이터 유형: 기초 데이터" 처럼 짝지어 읽힘
 *     - 미리보기 표: <caption>, <th scope="col">, 스크롤 상자에 키보드 초점(tabIndex=0)+이름 부여
 *       (axe scrollable-region-focusable: 키보드만 쓰는 사용자도 표를 좌우로 스크롤할 수 있어야 함)
 *  3) 시각화(Metabase) 임베드: 기존 "차트보기 → 확인 모달 → 새 창(데이터와 무관한 단일 URL)" 대신
 *     이 데이터에 맞는 공개 대시보드를 화면 안 <iframe> 으로 보여 준다.
 *     - 대시보드 주소는 BE 상세 응답의 visual_url (sys_tbl_id → 대시보드 매핑, be/src/config/visualDashboards.json)
 *     - visual_url 이 없으면(구버전 BE 등) 기존 환경변수 VITE_VISUAL_TOOL 로 대체
 *     - "차트보기" 버튼은 이제 아래 시각화 구역으로 스크롤 + 초점 이동
 *     - "새 창으로 크게 보기" 링크 제공
 *  4) 숫자 표시: 미리보기의 "616.000" 같은 값을 "616" 으로 (formatPreviewCell)
 *  5) 미리보기 정렬: 기초(통계) 데이터는 BE 가 최신 연도부터 내려준다(openApiService.sortPreviewRows).
 */
export function DataDetail() {
  const { id } = useParams<{ id: string }>();
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isOpenApiModalOpen, setIsOpenApiModalOpen] = useState(false);
  // 시각화 구역 제목 — "차트보기" 버튼을 누르면 여기로 초점 이동
  const visualHeadingRef = useRef<HTMLHeadingElement>(null);

  // ============================================================================
  // API 데이터 조회 (common 패키지의 모든 타입 활용)
  // ============================================================================

  // 데이터 상세 정보 조회
  const dataDetailState = useDataDetail(id ? parseInt(id) : 0);

  // 데이터 미리보기 조회
  const dataPreviewState = useDataPreview(id ? parseInt(id) : 0);

  const detailData = dataDetailState.data;

  // 키워드를 배열로 변환 (common 패키지의 parseKeywords 사용)
  const keywords = parseKeywords(detailData?.data_keywords);

  // 시각화 대시보드 주소: BE 가 데이터별로 계산한 visual_url 우선, 없으면 빌드 환경변수(기존 단일 링크)
  // (상세 정보가 오기 전에는 계산하지 않음 — 기본 주소로 먼저 그렸다가 바뀌며 iframe 을 두 번 불러오는 것 방지)
  const visualUrl: string | undefined = detailData
    ? (detailData.visual_url || import.meta.env.VITE_VISUAL_TOOL || undefined)
    : undefined;

  // 커스텀 브레드크럼 생성 (데이터 유형 기반)
  const customBreadcrumbItems = [
    { label: '홈', href: ROUTE_PATHS.HOME },
    { label: '데이터 목록', href: ROUTE_PATHS.DATA_LIST },
    // 데이터 유형(data_type)을 우선적으로 표시
    ...(detailData?.data_type ? [
      {
        label: DATA_TYPE_CONSTANTS.DATA_TYPES[detailData.data_type as DataTypeCode]?.name || detailData.data_type,
        href: `${ROUTE_PATHS.DATA_LIST}?type=${detailData.data_type}`
      }
    ] : []),
    {
      label: detailData?.title || '데이터 상세',
      active: true
    }
  ];

  // "차트보기": 화면 안 시각화 구역으로 이동하고 초점을 구역 제목으로 옮긴다.
  // 시각화 주소가 아예 없으면 버튼 자체를 숨기므로 여기 오지 않는다.
  const handleChartClick = () => {
    const heading = visualHeadingRef.current;
    if (heading) {
      heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
      heading.focus({ preventScroll: true });
    } else if (visualUrl) {
      // 예외적으로 구역이 렌더되지 않은 경우의 대비책: 새 창
      window.open(visualUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownloadClick = () => {
    setIsDownloadModalOpen(true);
  };

  const handleOpenApiClick = () => {
    setIsOpenApiModalOpen(true);
  };

  const handleOpenApiConfirm = () => {
    const openApiCenterUrl = import.meta.env.VITE_OPEN_API_CENTER_URL || '#';
    window.open(openApiCenterUrl, '_blank', 'noopener,noreferrer');
    setIsOpenApiModalOpen(false);
  };

  // 정보 표 한 줄 (dt: 항목명, dd: 값)
  const infoRows: Array<{ label: string; value: React.ReactNode }> = [
    {
      label: '데이터 유형',
      value: detailData?.data_type
        ? DATA_TYPE_CONSTANTS.DATA_TYPES[detailData.data_type as DataTypeCode]?.name || detailData.data_type
        : '-'
    },
    {
      label: '키워드',
      value: keywords.length > 0 ? (
        <span className="detail-info-tags">
          {keywords.map((keyword: string, index: number) => (
            <Tag key={index} variant="primary" size="s">
              {keyword}
            </Tag>
          ))}
        </span>
      ) : '-'
    },
    // 제공 포맷: "[json]" → "JSON" (목록 화면과 같은 규칙)
    { label: '제공 포맷', value: formatDataFormat(detailData?.data_format) },
    { label: '제공 기관', value: detailData?.src_org_name || '-' },
    { label: '최종 수정일', value: formatDisplayDate(detailData?.src_latest_chn_dt) },
    { label: '데이터 등록일', value: formatDisplayDate(detailData?.sys_data_reg_dt) },
    { label: '이용 허락 범위', value: detailData?.data_usage_scope || '-' }
  ];

  const pageTitle = dataDetailState.loading
    ? undefined
    : dataDetailState.error ? '데이터를 불러올 수 없습니다' : (detailData?.title || '데이터 상세');

  return (
    <Layout idPrefix="data-detail" customBreadcrumbItems={customBreadcrumbItems} pageTitle={pageTitle}>
      {/* Data Detail Header */}
      <div id="data-detail-header" className="data-detail-header">
        <h1 id="data-detail-title" className="data-title-large">
          {dataDetailState.loading ? '로딩 중...' :
           dataDetailState.error ? '데이터를 불러올 수 없습니다' :
           detailData?.title || '데이터 제목'}
        </h1>

        <p id="data-detail-description" className="data-description">
          {detailData?.data_desc || '데이터 설명이 없습니다.'}
        </p>
      </div>

      {/* 위기 상담 안내 — 자살 생각 등 위기 관련 통계에만 (v1.4.0) */}
      {detailData && needsCrisisHelpline(detailData.sys_tbl_id) && (
        <aside id="data-detail-crisis-helpline" className="crisis-helpline" aria-labelledby="data-detail-crisis-helpline-title">
          <h2 id="data-detail-crisis-helpline-title" className="crisis-helpline-title">
            {CRISIS_HELPLINE_CONSTANTS.TITLE}
          </h2>
          <p className="crisis-helpline-desc">{CRISIS_HELPLINE_CONSTANTS.DESCRIPTION}</p>
          <ul className="crisis-helpline-lines">
            {CRISIS_HELPLINE_CONSTANTS.LINES.map((line) => (
              <li key={line.tel}>
                <a className="crisis-helpline-call" href={`tel:${line.tel.replace(/-/g, '')}`}>
                  <span className="crisis-helpline-name">{line.name}</span>
                  <span className="crisis-helpline-tel">{line.tel}</span>
                  <span className="crisis-helpline-hours">{line.hours}</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="crisis-helpline-note">{CRISIS_HELPLINE_CONSTANTS.EMERGENCY_NOTE}</p>
        </aside>
      )}

      {/* Data Info Table — 용어/설명 목록 */}
      <dl id="data-info-table" className="data-info-table">
        {infoRows.map((row) => (
          <div className="info-row" key={row.label}>
            <dt className="info-label">{row.label}</dt>
            <dd className="info-value">{row.value}</dd>
          </div>
        ))}
      </dl>

      {/* Data View Section */}
      <section id="data-view-section" className="data-view-section" aria-labelledby="data-view-title">
        <div className="data-view-header">
          <h2 id="data-view-title" className="section-title">
            데이터 보기
          </h2>
          <div className="action-buttons">
            {visualUrl && (
              <Button
                variant="secondary"
                size="m"
                onClick={handleChartClick}
                aria-controls="data-visual-section"
              >
                차트보기
              </Button>
            )}
            <Button
              variant="primary"
              size="m"
              onClick={handleDownloadClick}
            >
              다운로드
            </Button>
          </div>
        </div>

        {/* Data Preview Table */}
        {dataPreviewState.loading ? (
          <div className="detail-preview-state" role="status">
            데이터를 불러오는 중...
          </div>
        ) : dataPreviewState.error ? (
          <div className="detail-preview-state detail-preview-state--error" role="alert">
            데이터 미리보기를 불러올 수 없습니다.
          </div>
        ) : dataPreviewState.data && Array.isArray(dataPreviewState.data) && dataPreviewState.data.length > 0 ? (() => {
          const isBasicType = detailData?.data_type === 'basic';

          // basic 타입일 경우에만 컬럼 순서 및 한글 매핑 적용
          let availableColumns: string[];

          if (isBasicType) {
            // 실제 데이터에 존재하는 컬럼만 필터링하고 순서대로 정렬
            availableColumns = BASIC_COLUMN_ORDER.filter(key =>
              dataPreviewState.data[0] && key in dataPreviewState.data[0]
            );
          } else {
            // basic 타입이 아닐 경우 기존 방식대로 모든 키 사용
            availableColumns = Object.keys(dataPreviewState.data[0]);
          }

          return (
            // 표가 넓으면 이 상자 안에서만 가로 스크롤. 키보드로도 스크롤할 수 있게 tabIndex=0 + 이름 부여
            <div
              className="detail-preview-scroll table-scroll"
              tabIndex={0}
              role="region"
              aria-label={`${detailData?.title || '데이터'} 미리보기 표 (좌우로 스크롤할 수 있습니다)`}
            >
              <table className="detail-preview-table">
                <caption className="sr-only">
                  {detailData?.title || '데이터'} 미리보기 {dataPreviewState.data.length}건
                  {isBasicType ? ' (최신 연도부터 표시)' : ''}
                </caption>
                <thead>
                  <tr>
                    {availableColumns.map((key, index) => (
                      <th key={index} scope="col">
                        {isBasicType ? (BASIC_COLUMN_LABELS[key] || key) : key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataPreviewState.data.map((row: any, rowIndex: number) => (
                    <tr key={rowIndex}>
                      {availableColumns.map((key, colIndex) => (
                        <td
                          key={colIndex}
                          // 숫자 "데이터" 열은 오른쪽 정렬 (자릿수 비교가 쉽도록)
                          className={isBasicType && key === 'data' ? 'is-numeric' : undefined}
                        >
                          {formatPreviewCell(key, row[key], isBasicType)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })() : (
          <div className="detail-preview-state">
            미리보기 데이터가 없습니다.
          </div>
        )}
      </section>

      {/* 시각화(Metabase 공개 대시보드) — 데이터별 대시보드를 화면 안에 임베드 */}
      {visualUrl && (
        <section id="data-visual-section" className="data-visual-section" aria-labelledby="data-visual-title">
          <div className="data-view-header">
            <h2 id="data-visual-title" ref={visualHeadingRef} tabIndex={-1} className="section-title">
              데이터 시각화
            </h2>
            <a
              className="data-visual-newwin"
              href={visualUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              새 창으로 크게 보기<span className="sr-only"> (새 창)</span>
              <span aria-hidden="true"> ↗</span>
            </a>
          </div>
          <p className="data-visual-help">
            Metabase 공개 대시보드입니다. 화면이 작아 잘 보이지 않으면 "새 창으로 크게 보기"를 이용하세요.
          </p>
          <div className="data-visual-frame-wrap">
            {/* title: 스크린리더가 iframe 내용을 알 수 있게 하는 필수 이름 (WCAG 4.1.2)
                loading="lazy": 화면 아래쪽이라 스크롤해 올 때 불러와 첫 화면 속도에 영향 없음 */}
            <iframe
              className="data-visual-frame"
              src={visualUrl}
              title={`${detailData?.title || '데이터'} 시각화 대시보드`}
              loading="lazy"
              referrerPolicy="no-referrer"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {/* Open API 센터 버튼 */}
      <div id="open-api-section" className="open-api-section">
        <button
          type="button"
          className="btn-open-api-center"
          onClick={handleOpenApiClick}
        >
          Open API 센터
        </button>
      </div>

      {/* 다운로드 준비중 모달 */}
      <Modal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        title="준비중인 기능입니다"
        description="데이터 다운로드 기능은 현재 준비 중입니다.\n빠른 시일 내에 서비스할 예정입니다."
        primaryButtonText="확인"
        onPrimaryClick={() => setIsDownloadModalOpen(false)}
      />

      {/* Open API 센터 모달 */}
      <Modal
        isOpen={isOpenApiModalOpen}
        onClose={() => setIsOpenApiModalOpen(false)}
        title="Open API 센터로 이동"
        description="Open API 센터로 이동이 필요합니다.<br/>이동하시겠습니까?"
        primaryButtonText="이동하기"
        secondaryButtonText="취소"
        onPrimaryClick={handleOpenApiConfirm}
        onSecondaryClick={() => setIsOpenApiModalOpen(false)}
        helpText="Open API 센터는 무엇인가요?"
        helpTextLink={import.meta.env.VITE_OPEN_API_CENTER_ABOUT_URL}
        allowHtml={true}
        autoHeight={true}
      />
    </Layout>
  );
}
