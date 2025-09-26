import { ReactNode } from 'react';

interface SelfCheckContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function SelfCheckContainer({ title, subtitle, children }: SelfCheckContainerProps) {
  return (
    <div style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    }}>
      {/* Title - Figma Style */}
      <h1 style={{
        fontSize: '36px',
        fontWeight: 700,
        fontFamily: 'var(--font-family-primary)',
        color: 'var(--color-text-primary)',
        textAlign: 'center',
        marginBottom: subtitle ? '16px' : '40px',
        lineHeight: '1.2'
      }}>
        {title}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <p style={{
          fontSize: '18px',
          fontFamily: 'var(--font-family-primary)',
          fontWeight: 500,
          color: 'var(--figma-gray-500)',
          marginBottom: '40px',
          lineHeight: '1.6',
          textAlign: 'center'
        }}>
          {subtitle}
        </p>
      )}

      {/* Content */}
      <div style={{ width: '100%' }}>
        {children}
      </div>
    </div>
  );
}
