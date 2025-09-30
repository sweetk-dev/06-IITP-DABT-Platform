import { ReactNode, Fragment } from 'react';
import { parseKeywords } from '@iitp-dabt-platform/common';

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
    <div id={id} className={`data-table-header ${className}`} style={style}>
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
    <div id={id} className={`data-table-body ${className}`} style={style}>
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

export function TableRow({ children, onClick, className = '', style = {}, id }: TableRowProps) {
  const rowStyle = {
    cursor: onClick ? 'pointer' : 'default',
    ...style
  };

  return (
    <div 
      id={id}
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
        <span id={valueId} className="meta-value">{value}</span>
      </div>
      {separatorId && <div id={separatorId} className="meta-separator"></div>}
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
  showModifiedDate?: boolean; // true면 "최종 수정일", false면 "등록일"
  onRowClick?: () => void; // 행 클릭 핸들러
}

/**
 * 데이터 아이템 테이블 행 공통 컴포넌트
 * DataList, DataSearch 등에서 사용
 */
export function DataItemRow({ 
  item, 
  index, 
  idPrefix,
  onTitleRender,
  showModifiedDate = false,
  onRowClick
}: DataItemRowProps) {
  const keywords = parseKeywords(item.data_keywords);
  const title = item.title || item.data_name || '데이터 제목';

  return (
    <TableRow id={`${idPrefix}-row-${index + 1}`} onClick={onRowClick}>
      <TableCell variant="info" id={`${idPrefix}-row-${index + 1}-info`}>
        <DataTitle id={`${idPrefix}-row-${index + 1}-title`}>
          {onTitleRender ? onTitleRender(title) : title}
        </DataTitle>
        <DataMeta id={`${idPrefix}-row-${index + 1}-meta`}>
          <MetaItem
            label="제공 포맷"
            value={item.format || 'csv'}
            labelId={`${idPrefix}-row-${index + 1}-meta-format-label`}
            valueId={`${idPrefix}-row-${index + 1}-meta-format-value`}
            separatorId={`${idPrefix}-row-${index + 1}-meta-separator-1`}
          />
          <MetaItem
            label="제공 기관"
            value={item.src_org_name || '제공 기관'}
            labelId={`${idPrefix}-row-${index + 1}-meta-org-label`}
            valueId={`${idPrefix}-row-${index + 1}-meta-org-value`}
            separatorId={`${idPrefix}-row-${index + 1}-meta-separator-2`}
          />
          <MetaItem
            label={showModifiedDate ? "최종 수정일" : "등록일"}
            value={item.sys_data_reg_dt || '2023.01.07'}
            labelId={`${idPrefix}-row-${index + 1}-meta-date-label`}
            valueId={`${idPrefix}-row-${index + 1}-meta-date-value`}
          />
        </DataMeta>
      </TableCell>
      <TableCell variant="tags" id={`${idPrefix}-row-${index + 1}-tags`}>
        <DataTags>
          {keywords.length > 0 ? (
            keywords.map((keyword: string, tagIndex: number) => (
              <Tag key={tagIndex} id={`${idPrefix}-row-${index + 1}-tag-${tagIndex + 1}`}>
                {keyword}
              </Tag>
            ))
          ) : (
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>-</span>
          )}
        </DataTags>
      </TableCell>
    </TableRow>
  );
}