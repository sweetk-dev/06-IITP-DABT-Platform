import { ReactNode } from 'react';

interface CardProps {
  id?: string;
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 's' | 'm' | 'l' | 'xl';
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

const cardVariants = {
  default: {
    background: 'var(--color-bg-primary)',
    border: '1px solid var(--color-border-secondary)',
    boxShadow: 'none'
  },
  elevated: {
    background: 'var(--color-bg-primary)',
    border: 'none',
    boxShadow: 'var(--shadow-md)'
  },
  outlined: {
    background: 'var(--color-bg-primary)',
    border: '2px solid var(--color-border-primary)',
    boxShadow: 'none'
  },
  filled: {
    background: 'var(--color-bg-secondary)',
    border: 'none',
    boxShadow: 'none'
  }
};

const cardPadding = {
  s: '12px',
  m: '16px',
  l: '24px',
  xl: '32px'
};

export function Card({ 
  id, 
  children, 
  variant = 'default', 
  padding = 'm', 
  className = '',
  onClick,
  hover = false
}: CardProps) {
  const cardStyle = {
    ...cardVariants[variant],
    borderRadius: 'var(--radius-lg)',
    padding: cardPadding[padding],
    cursor: onClick ? 'pointer' : 'default',
    transition: hover ? 'all 0.2s ease' : 'none',
    ...(hover && {
      transform: 'translateY(-2px)',
      boxShadow: 'var(--shadow-lg)'
    })
  };

  return (
    <div
      id={id}
      className={`card card--${variant} ${className}`}
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = cardVariants[variant].boxShadow;
        }
      }}
    >
      {children}
    </div>
  );
}
