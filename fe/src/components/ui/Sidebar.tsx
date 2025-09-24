import { ReactNode } from 'react';

interface SidebarProps {
  idPrefix: string;
  title: string;
  children: ReactNode;
}

export function Sidebar({ idPrefix, title, children }: SidebarProps) {
  return (
    <aside id={`${idPrefix}-sidebar`} style={{
      width: '280px',
      flexShrink: 0
    }}>
      <div id={`${idPrefix}-sidebar-content`}>
        {children}
      </div>
    </aside>
  );
}
