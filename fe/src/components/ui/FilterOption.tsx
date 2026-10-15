import { ReactNode } from 'react';
import { Tag } from './Tag';

interface FilterOptionProps {
  id: string;
  name: string;
  count?: number;
  icon?: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

/**
 * 필터 선택 버튼.
 *
 * [2026-10 접근성]
 *  - aria-pressed 로 현재 선택된 필터인지 스크린리더에 전달 (기존: 배경색으로만 구분 → 색만으로 정보 전달)
 *  - 선택된 항목 글자색 #0090ff(연파랑 배경 위 2.9:1) → --color-primary-text(4.9:1)
 *  - type="button" 명시 (form 안에서 쓰여도 제출되지 않도록)
 */
export function FilterOption({ id, name, count, icon, isActive = false, onClick }: FilterOptionProps) {
  return (
    <button
      id={id}
      type="button"
      className={`filter-option ${isActive ? 'is-active' : ''}`}
      aria-pressed={isActive}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: isActive ? '#e3f2fd' : 'transparent',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        // 'all' 이면 초점 테두리(outline)까지 서서히 나타나 키보드 초점이 늦게 보임 → 배경·글자색만 전환
        transition: 'background-color 0.2s ease, color 0.2s ease',
        fontSize: '16px',
        fontFamily: 'var(--font-family-primary)',
        fontWeight: isActive ? 600 : 400,
        color: isActive ? 'var(--color-primary-text)' : 'black',
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
      {count !== undefined && (
        <span id={`${id}-count`} style={{
          fontSize: '14px',
          fontFamily: 'var(--font-family-primary)',
          fontWeight: 500,
          color: isActive ? 'var(--color-primary-text)' : '#595959'
        }}>
          {count}
        </span>
      )}
    </button>
  );
}
