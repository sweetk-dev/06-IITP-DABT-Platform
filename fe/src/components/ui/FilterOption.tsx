import { ReactNode } from 'react';
import { Tag } from './Tag';

interface FilterOptionProps {
  id: string;
  name: string;
  count: number;
  icon?: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

export function FilterOption({ id, name, count, icon, isActive = false, onClick }: FilterOptionProps) {
  return (
    <button
      id={id}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: isActive ? '#e3f2fd' : 'transparent',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontSize: '16px',
        fontFamily: 'Pretendard',
        fontWeight: isActive ? 600 : 400,
        color: isActive ? '#0090ff' : 'black',
        width: '100%',
        textAlign: 'left'
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = '#f5f5f5';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'transparent';
        }
      }}
    >
      <div id={`${id}-content`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {icon}
        <span id={`${id}-name`}>{name}</span>
      </div>
      <span id={`${id}-count`} style={{
        fontSize: '14px',
        fontFamily: 'Pretendard',
        fontWeight: 500,
        color: isActive ? '#0090ff' : '#666'
      }}>
        {count}
      </span>
    </button>
  );
}
