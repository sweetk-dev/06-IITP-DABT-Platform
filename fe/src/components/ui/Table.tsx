import { ReactNode, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { parseKeywords } from '@iitp-dabt-platform/common';
import { formatDataFormat, formatDisplayDate } from '../../utils/format';

/*
 * [2026-10 접근성 개편] 목록 "표"의 의미 구조
 *  - 화면은 표처럼 보이지만 실제로는 "데이터 항목 목록"이다. 행마다 제목·메타·태그를 묶어 읽는 것이
 *    자연스러워 div 표 대신 목록(role="list"/"listitem") 의미를 부여했다.
 *  - 머리글 줄("데이터명 | 태그")은 시각용 안내라 aria-hidden 으로 스크린리더에서 제외한다.
 */

interface TableProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

export function Table({ children, className = '', style = {}, id }: TableProps) {
  return (
    <div id={id} className={`data-table ${className}`} style={style}>
      {children}
    </div>
  );
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

export function TableHeader({ children, className = '', style = {}, id }: TableHeaderProps) {
  return (
    <div id={id} className={`data-table-header ${className}`} style={style} aria-hidden="true">
      {children}
    </div>
  );
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

export function TableBody({ children, className = '', style = {}, id }: TableBodyProps) {
  return (
    <div id={id} className={`data-table-body ${className}`} style={style} role="list">
      {children}
    </div>
  );
}

interface TableRowProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

/**
 * 목록 한 줄.
 * onClick 은 "마우스로 줄 아무 곳이나 눌러도 이동"하는 보조 동작으로만 쓴다.
 * 키보드·스크린리더용 실제 이동 수단은 줄 안의 링크(DataItemRow 의 제목 링크)여야 한다.
 */
export function TableRow({ children, onClick, className = '', style = {}, id }: TableRowProps) {
  const rowStyle = {
    cursor: onClick ? 'pointer' : 'default',
    ...style
  };

  return (
    <div 
      id={id}
      role="listitem"
      className={`data-row ${className}`} 
      style={rowStyle}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'info' | 'tags';
  id?: string;
}

export function TableCell({ children, className = '', style = {}, variant = 'info', id }: TableCellProps) {
  const variantClass = variant === 'info' ? 'data-info' : 'data-tags';
  
  return (
    <div 
      id={id} 
      className={`${variantClass} ${className}`} 
      style={style}
    >
      {children}
    </div>
  );
}

interface TableColumnProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'title' | 'tags';
  id?: string;
}

export function TableColumn({ children, className = '', style = {}, variant = 'title', id }: TableColumnProps) {
  const variantClass = variant === 'title' ? 'table-column-title' : 'table-column-tags';
  
  return (
    <div id={id} className={`${variantClass} ${className}`} style={style}>
      {children}
    </div>
  );
}

interface DataTitleProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

export function DataTitle({ children, className = '', style = {}, id }: DataTitleProps) {
  return (
    <div id={id} className={`data-title ${className}`} style={style}>
      {children}
    </div>
  );
}

interface DataMetaProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

export function DataMeta({ children, className = '', style = {}, id }: DataMetaProps) {
  return (
    <div id={id} className={`data-meta ${className}`} style={style}>
      {children}
    </div>
  );
}

interface MetaItemProps {
  label: string;
  value: string;
  className?: string;
  style?: React.CSSProperties;
  labelId?: string;
  valueId?: string;
  separatorId?: string;
}

export function MetaItem({ label, value, className = '', style = {}, labelId, valueId, separatorId }: MetaItemProps) {
  return (
    <>
      <div className={`meta-item ${className}`} style={style}>
        <span id={labelId} className="meta-label">{label}</span>
        {/* 스크린리더가 "제공 포맷 JSON" 처럼 라벨과 값을 붙여 읽지 않도록 숨김 구분자 */}
        <span className="sr-only">: </span>
        <span id={valueId} className="meta-value">{value}</span>
      </div>
      {/* 세로 구분선은 장식 */}
      {separatorId && <div id={separatorId} className="meta-separator" aria-hidden="true"></div>}
    </>
  );
}

interface DataTagsProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

export function DataTags({ children, className = '', style = {}, id }: DataTagsProps) {
  return (
    <div id={id} className={`data-tags ${className}`} style={style}>
      {children}
    </div>
  );
}

interface TagProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

export function Tag({ children, className = '', style = {}, id }: TagProps) {
  return (
    <div id={id} className={`tag ${className}`} style={style}>
      {children}
    </div>
  );
}

// ============================================================================
// 상태 표시 전용 컴포넌트
// ============================================================================

interface TableEmptyRowProps {
  message: string;
  variant?: 'normal' | 'error' | 'warning';
  id?: string;
}

export function TableEmptyRow({ message, variant = 'normal', id }: TableEmptyRowProps) {
  const colorMap = {
    normal: 'inherit',
    error: 'var(--color-danger)',
    warning: 'var(--color-warning)'
  };
  
  return (
    <div 
      id={id}
      role="listitem"
      className="data-row data-row-empty" 
      style={{ 
        padding: '40px', 
        textAlign: 'center',
        color: colorMap[variant],
        justifyContent: 'center',
        cursor: 'default'
      }}
    >
      {message}
    </div>
  );
}

// ============================================================================
// 조건부 렌더링 헬퍼 컴포넌트
// ============================================================================

interface TableBodyWithStateProps<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  emptyMessage?: string;
  loadingMessage?: string;
  errorMessage?: string;
  renderRow: (item: T, index: number) => ReactNode;
  id?: string;
}

export function TableBodyWithState<T>({ 
  data, 
  loading, 
  error,
  emptyMessage = '데이터가 없습니다.',
  loadingMessage = '로딩 중...',
  errorMessage = '데이터를 불러오는 중 오류가 발생했습니다.',
  renderRow,
  id
}: TableBodyWithStateProps<T>) {
  return (
    <TableBody id={id}>
      {loading ? (
        <TableEmptyRow message={loadingMessage} />
      ) : error ? (
        <TableEmptyRow message={errorMessage || error} variant="error" />
      ) : data.length === 0 ? (
        <TableEmptyRow message={emptyMessage} />
      ) : (
        data.map((item: any, index) => (
          <Fragment key={item?.id || index}>
            {renderRow(item, index)}
          </Fragment>
        ))
      )}
    </TableBody>
  );
}

// ============================================================================
// 복합 컴포넌트 - 재사용을 위한 고수준 컴포넌트
// ============================================================================

interface DataItemRowProps {
  item: any;
  index: number;
  idPrefix: string;
  onTitleRender?: (title: string) => ReactNode; // 제목 커스터마이징 (검색어 강조 등)
  /** 상세 화면 경로. 지정하면 제목이 실제 링크(<a>)가 되고, 줄 전체를 눌러도 이동한다. */
  href?: string;
}

/**
 * 데이터 아이템 테이블 행 공통 컴포넌트
 * DataList, DataSearch 등에서 사용
 *
 * [2026-10 개편]
 *  - 접근성: 기존에는 div 줄에 onClick 만 있어 키보드로 상세 화면에 갈 수 없었다.
 *    → 제목을 <Link> 로 만들고, CSS(.data-row-link::after)로 링크의 클릭 영역을 줄 전체로 넓혔다
 *      ("stretched link" 방식: Tab 정지점은 줄마다 1개, 마우스는 줄 어디를 눌러도 이동).
 *  - 날짜: 기존에는 "등록일"(sys_data_reg_dt, 최초 등록일·갱신되지 않음)을 보여 주고,
 *    검색 화면에서는 같은 값을 "최종 수정일"이라고 잘못 표기했다. 값이 없으면 '2023.01.07' 을 하드코딩 표시했다.
 *    → 목록·검색 모두 "최종 수정일" = 원천 최종 변경일(src_latest_chn_dt), 값이 없으면 "-".
 *      (상세 화면의 "최종 수정일"과 같은 값이라 화면 간 표기가 일치한다)
 *  - 제공 포맷: BE 가 목록에 data_format 을 내려주지 않아 항상 'csv' 로 표시되던 문제
 *    → BE 목록 응답에 data_format 추가, 화면은 "[json]" → "JSON" 으로 정리해 표시. 없으면 "-".
 *  - 제공 기관이 없을 때 '제공 기관' 이라는 자리표시 글자 대신 "-".
 */
export function DataItemRow({ 
  item, 
  index, 
  idPrefix,
  onTitleRender,
  href
}: DataItemRowProps) {
  const keywords = parseKeywords(item.data_keywords);
  const title = item.title || item.data_name || '데이터 제목';
  const titleContent = onTitleRender ? onTitleRender(title) : title;

  return (
    <TableRow id={`${idPrefix}-row-${index + 1}`} className={href ? 'data-row--linked' : ''}>
      <TableCell variant="info" id={`${idPrefix}-row-${index + 1}-info`}>
        <DataTitle id={`${idPrefix}-row-${index + 1}-title`}>
          {href ? (
            <Link to={href} className="data-row-link">
              {titleContent}
            </Link>
          ) : titleContent}
        </DataTitle>
        <DataMeta id={`${idPrefix}-row-${index + 1}-meta`}>
          <MetaItem
            label="제공 포맷"
            value={formatDataFormat(item.data_format)}
            labelId={`${idPrefix}-row-${index + 1}-meta-format-label`}
            valueId={`${idPrefix}-row-${index + 1}-meta-format-value`}
            separatorId={`${idPrefix}-row-${index + 1}-meta-separator-1`}
          />
          <MetaItem
            label="제공 기관"
            value={item.src_org_name || '-'}
            labelId={`${idPrefix}-row-${index + 1}-meta-org-label`}
            valueId={`${idPrefix}-row-${index + 1}-meta-org-value`}
            separatorId={`${idPrefix}-row-${index + 1}-meta-separator-2`}
          />
          <MetaItem
            label="최종 수정일"
            value={formatDisplayDate(item.src_latest_chn_dt)}
            labelId={`${idPrefix}-row-${index + 1}-meta-date-label`}
            valueId={`${idPrefix}-row-${index + 1}-meta-date-value`}
          />
        </DataMeta>
      </TableCell>
      <TableCell variant="tags" id={`${idPrefix}-row-${index + 1}-tags`}>
        <DataTags>
          {keywords.length > 0 ? (
            <>
              {/* 스크린리더: 태그 목록 앞에 "태그" 라고 알려 줌 (시각용 머리글은 aria-hidden) */}
              <span className="sr-only">태그:</span>
              {keywords.map((keyword: string, tagIndex: number) => (
                <Tag key={tagIndex} id={`${idPrefix}-row-${index + 1}-tag-${tagIndex + 1}`}>
                  {keyword}
                </Tag>
              ))}
            </>
          ) : (
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>-</span>
          )}
        </DataTags>
      </TableCell>
    </TableRow>
  );
}