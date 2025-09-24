import { ReactNode } from 'react';

interface FilterSectionProps {
  idPrefix: string;
  title: string;
  children: ReactNode;
  marginBottom?: boolean;
}

export function FilterSection({ idPrefix, title, children, marginBottom = true }: FilterSectionProps) {
  return (
    <div id={`${idPrefix}-filter-section`} style={{
      marginBottom: marginBottom ? '40px' : '0'
    }}>
      <h4 id={`${idPrefix}-filter-title`} style={{
        color: 'black',
        fontSize: '20px',
        fontFamily: 'Pretendard',
        fontWeight: 600,
        marginBottom: '16px'
      }}>
        {title}
      </h4>
      <div id={`${idPrefix}-filter-options`} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {children}
      </div>
    </div>
  );
}
