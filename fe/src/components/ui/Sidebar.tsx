import { ReactNode } from 'react';

interface SidebarProps {
  idPrefix: string;
  title: string;
  children: ReactNode;
}

/**
 * 목록 화면 왼쪽 필터 영역.
 *
 * [2026-10 반응형·접근성]
 *  - 폭 280px 을 inline style 에서 CSS(.sidebar, data-pages.css)로 옮김 → 1024px 이하에서 위쪽 가로 배치로 전환 가능
 *  - <aside aria-label="필터"> 로 보조 영역(complementary) 랜드마크 이름 부여 (기존 title prop 은 받기만 하고 쓰지 않았음)
 */
export function Sidebar({ idPrefix, title, children }: SidebarProps) {
  return (
    <aside id={`${idPrefix}-sidebar`} className="sidebar" aria-label={title}>
      {/* 필터 섹션들이 직접 .sidebar 의 flex 자식이 되도록 display: contents */}
      <div id={`${idPrefix}-sidebar-content`} style={{ display: 'contents' }}>
        {children}
      </div>
    </aside>
  );
}
