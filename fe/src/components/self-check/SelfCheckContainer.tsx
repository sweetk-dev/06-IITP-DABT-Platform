import { ReactNode } from 'react';

interface SelfCheckContainerProps {
  title: ReactNode;
  subtitle?: ReactNode;
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
      {/* Title - HTML Design Style */}
      <h1 style={{
        color: 'black',
        fontSize: '32px',
        fontFamily: 'Pretendard',
        fontWeight: 700,
        lineHeight: '48px',
        wordWrap: 'break-word',
        marginBottom: subtitle ? '20px' : '40px',
        textAlign: 'center'
      }}>
        {title}
      </h1>

      {/* Subtitle - HTML Design Style */}
      {subtitle && (
        <p style={{
          color: 'black',
          fontSize: '20px',
          fontFamily: 'Pretendard',
          fontWeight: 400,
          lineHeight: '30px',
          wordWrap: 'break-word',
          marginBottom: '40px',
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
