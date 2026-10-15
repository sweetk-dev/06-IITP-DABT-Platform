import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  id?: string;
  items: BreadcrumbItem[];
}

/**
 * 브레드크럼(현재 위치) — nav 랜드마크.
 *
 * [2026-10 접근성 개편]
 *  - <nav aria-label="현재 위치"> + <ol> 목록 구조로 변경 (기존: nav 안에 div 나열)
 *  - 현재 화면 항목에 aria-current="page"
 *  - 구분 기호(›)는 aria-hidden 으로 스크린리더가 읽지 않게 함
 *  - 기존 전체 opacity 0.5 처리로 글자 대비가 약 2:1 이었던 것을 대비 4.5:1 이상 색으로 교체 (layout.css)
 *  - hover 색 변경을 onMouseEnter/Leave inline style 대신 CSS :hover 로 처리
 */
export function Breadcrumb({ id, items }: BreadcrumbProps) {
  return (
    <nav id={id} className="breadcrumb-nav" aria-label="현재 위치">
      <ol className="breadcrumb-list">
        {items.map((item, index) => (
          <li key={index}>
            {item.href && !item.active ? (
              <Link to={item.href} className="breadcrumb-link">
                {item.label}
              </Link>
            ) : (
              <span
                className={item.active ? 'breadcrumb-current' : 'breadcrumb-link'}
                aria-current={item.active ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
            {index < items.length - 1 && (
              <span className="breadcrumb-sep" aria-hidden="true">›</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// getBreadcrumbItems는 App.tsx에서 import하여 사용
