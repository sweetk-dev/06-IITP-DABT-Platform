import { ReactNode } from 'react';

interface TagProps {
  id?: string;
  children: ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 's' | 'm' | 'l';
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

const tagVariants = {
  default: {
    background: 'var(--figma-gray-100)',
    color: 'var(--figma-gray-600)',
    border: '1px solid var(--figma-gray-200)'
  },
  primary: {
    background: 'var(--figma-blue-50)',
    // [2026-10 접근성] 12~14px 글자에 #0090ff(연파랑 배경 3.0:1) → 진한 파랑 토큰(5.2:1)
    color: 'var(--color-primary-text)',
    border: '1px solid var(--figma-blue-200)'
  },
  secondary: {
    background: 'var(--figma-gray-50)',
    color: 'var(--color-text-primary)',
    border: '1px solid var(--figma-gray-300)'
  },
  success: {
    background: 'var(--figma-economic-50)',
    color: '#1e7e34', // [2026-10 접근성] #28a745(3.0:1) → 진한 초록
    border: '1px solid var(--figma-economic-100)'
  },
  warning: {
    background: '#fff3cd',
    color: '#856404',
    border: '1px solid #ffeaa7'
  },
  danger: {
    background: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb'
  },
  info: {
    background: 'var(--figma-blue-50)',
    color: '#0b6b7b', // [2026-10 접근성] #17a2b8(2.9:1) → 같은 청록 계열 진한 톤
    border: '1px solid var(--figma-blue-200)'
  }
};

const tagSizes = {
  s: {
    padding: '6px 12px',
    fontSize: '12px',
    borderRadius: '6px',
    fontFamily: 'var(--font-family-primary)'
  },
  m: {
    padding: '8px 16px',
    fontSize: '14px',
    borderRadius: '8px',
    fontFamily: 'var(--font-family-primary)'
  },
  l: {
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '10px',
    fontFamily: 'var(--font-family-primary)'
  }
};

export function Tag({ 
  id, 
  children, 
  variant = 'default', 
  size = 'm',
  removable = false,
  onRemove,
  className = ''
}: TagProps) {
  const tagStyle = {
    ...tagVariants[variant],
    ...tagSizes[size],
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontWeight: '500',
    lineHeight: '1.2',
    transition: 'all 0.2s ease',
    cursor: 'default'
  };

  return (
    <span
      id={id}
      className={`tag tag--${variant} tag--${size} ${className}`}
      style={tagStyle}
    >
      {children}
      {removable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0',
            marginLeft: '4px',
            display: 'flex',
            alignItems: 'center',
            color: 'inherit',
            opacity: '0.7',
            transition: 'opacity 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.7';
          }}
        >
          ×
        </button>
      )}
    </span>
  );
}
