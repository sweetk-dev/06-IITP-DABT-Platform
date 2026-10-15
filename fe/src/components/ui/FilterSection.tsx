import { Children, ReactNode } from 'react';

interface FilterSectionProps {
  idPrefix: string;
  title: string;
  children: ReactNode;
  marginBottom?: boolean;
}

/**
 * 필터 묶음 (예: "자립 테마별", "데이터 유형별").
 *
 * [2026-10 접근성]
 *  - 제목을 h4 → h2 로 변경: 페이지 h1 아래 h4 가 바로 오면 제목 단계가 건너뛰어진다.
 *    (보이는 글자 크기·굵기는 기존과 동일, .sidebar-filter-title)
 *  - 선택지를 <ul>/<li> 목록으로 감싸 "목록 4개 항목" 처럼 개수를 알 수 있게 함
 *  - 목록에 aria-labelledby 로 제목을 연결
 */
export function FilterSection({ idPrefix, title, children, marginBottom = true }: FilterSectionProps) {
  const titleId = `${idPrefix}-filter-title`;
  return (
    <div id={`${idPrefix}-filter-section`} className="sidebar-filter-section" style={{
      marginBottom: marginBottom ? '40px' : '0'
    }}>
      <h2 id={titleId} className="sidebar-filter-title">
        {title}
      </h2>
      <ul id={`${idPrefix}-filter-options`} className="sidebar-filter-list" aria-labelledby={titleId}>
        {Children.map(children, (child) => (child ? <li>{child}</li> : null))}
      </ul>
    </div>
  );
}
