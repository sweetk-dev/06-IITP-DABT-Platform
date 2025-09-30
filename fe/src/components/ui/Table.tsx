import { ReactNode } from 'react';

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
        data.map((item, index) => renderRow(item, index))
      )}
    </TableBody>
  );
}
