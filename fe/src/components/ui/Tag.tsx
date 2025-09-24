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
    background: 'var(--color-bg-secondary)',
    color: 'var(--color-text-secondary)',
    border: '1px solid var(--color-border-secondary)'
  },
  primary: {
    background: 'var(--color-primary-light)',
    color: 'var(--color-primary)',
    border: '1px solid var(--color-primary)'
  },
  secondary: {
    background: 'var(--color-bg-tertiary)',
    color: 'var(--color-text-primary)',
    border: '1px solid var(--color-border-primary)'
  },
  success: {
    background: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb'
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
    background: 'var(--color-bg-info)',
    color: 'var(--color-info)',
    border: '1px solid var(--color-info)'
  }
};

const tagSizes = {
  s: {
    padding: '4px 8px',
    fontSize: '12px',
    borderRadius: 'var(--radius-sm)'
  },
  m: {
    padding: '6px 12px',
    fontSize: '14px',
    borderRadius: 'var(--radius-md)'
  },
  l: {
    padding: '8px 16px',
    fontSize: '16px',
    borderRadius: 'var(--radius-lg)'
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
    lineHeight: '1.2'
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
