import { ReactNode } from 'react';

interface SelfThemaCardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'default' | 'theme' | 'data-type' | 'recommendation' | 'score';
  size?: 'sm' | 'md' | 'lg';
}

export function SelfThemaCard({ 
  children, 
  onClick, 
  className = '', 
  style = {},
  variant = 'default',
  size = 'md'
}: SelfThemaCardProps) {
  const baseStyle: React.CSSProperties = {
    borderRadius: '16px',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    ...style
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      background: 'white',
      border: '1px solid #e0e0e0',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    theme: {
      background: 'white',
      border: '1px solid #e0e0e0',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: '28px'
    },
    'data-type': {
      background: '#fafcfd',
      border: '1px solid #e3e3e3',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: '20px'
    },
    recommendation: {
      background: '#f4f4f4',
      border: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: '28px',
      // [2026-10 반응형] 384px 고정 → 최대 384px (좁은 화면에서는 부모 폭에 맞춤)
      width: '100%',
      maxWidth: '384px',
      minHeight: '211px',
      boxShadow: 'none'
    },
    score: {
      background: 'white',
      border: '1px solid #e0e0e0',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px',
      textAlign: 'center',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    }
  };

  // [2026-10] 고정 height → minHeight: 정책명이 길어 2~3줄이 되면 글자가 카드 밖으로 넘쳤다
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { minHeight: '120px' },
    md: { minHeight: '160px' },
    lg: { minHeight: '200px' }
  };

  const combinedStyle = {
    ...baseStyle,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style
  };

  return (
    <div
      className={`self-thema-card self-thema-card-${variant} self-thema-card-${size} ${className}`}
      style={combinedStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = variantStyles[variant].boxShadow || '0 2px 8px rgba(0, 0, 0, 0.1)';
        }
      }}
    >
      {children}
    </div>
  );
}

// 카드 컨텐츠 컴포넌트들
interface CardContentProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function CardContent({ children, className = '', style = {} }: CardContentProps) {
  return (
    <div 
      className={`card-content ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: '8px',
        width: '100%', /* [2026-10] 328px 고정 → 카드 폭에 맞춤 */
        minWidth: 0,
        flex: 1,
        ...style
      }}
    >
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function CardTitle({ children, className = '', style = {} }: CardTitleProps) {
  return (
    <div 
      className={`card-title ${className}`}
      style={{
        color: 'black',
        fontSize: '24px',
        fontFamily: 'var(--font-family-primary)',
        fontWeight: 700,
        fontStyle: 'Bold',
        wordWrap: 'break-word',
        wordBreak: 'keep-all',
        width: '100%', /* [2026-10] 328px 고정 → 카드 폭에 맞춤 */
        lineHeight: '140%',
        letterSpacing: '0%',
        ...style
      }}
    >
      {children}
    </div>
  );
}

interface CardSubtitleProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function CardSubtitle({ children, className = '', style = {} }: CardSubtitleProps) {
  return (
    <div 
      className={`card-subtitle ${className}`}
      style={{
        // [2026-10 접근성] #0086ed(회색 카드 위 3.4:1) → 진한 파랑 토큰(5:1 이상)
        color: 'var(--color-primary-text)',
        fontSize: '18px',
        fontFamily: 'var(--font-family-primary)',
        fontWeight: 600,
        // 줄바꿈 허용 (nowrap 이면 좁은 화면에서 카드 밖으로 넘침)
        whiteSpace: 'normal',
        lineHeight: '150%',
        letterSpacing: '0%',
        ...style
      }}
    >
      {children}
    </div>
  );
}

interface CardIconProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function CardIcon({ children, className = '', style = {} }: CardIconProps) {
  return (
    <div 
      className={`card-icon ${className}`}
      style={{
        width: '52px',
        height: '52px',
        background: 'white',
        borderRadius: '100px',
        border: '1px solid #d9d9d9',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
        ...style
      }}
    >
      {children}
    </div>
  );
}