import { ReactNode } from 'react';
import { Layout } from '../layout/Layout';

interface SelfCheckLayoutProps {
  idPrefix: string;
  children: ReactNode;
  onBackClick?: () => void;
  showBackButton?: boolean;
}

export function SelfCheckLayout({ 
  idPrefix, 
  children, 
  onBackClick,
  showBackButton = true 
}: SelfCheckLayoutProps) {
  return (
    <Layout idPrefix={idPrefix} showBreadcrumb={!showBackButton}>
      {/* Self Check Container - HTML Design */}
      <div
        id={`${idPrefix}-container`}
        style={{
          margin: '40px auto',
          width: '1840px',
          height: '840px',
          background: '#f0f8ff',
          borderRadius: '40px',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      >
        {/* 메인화면으로 이동 - 왼쪽 상단에 위치 */}
        {showBackButton && (
          <div
            id={`${idPrefix}-back-button`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: '0.5',
              cursor: 'pointer',
              transition: 'opacity 0.2s ease',
              position: 'absolute',
              top: '40px',
              left: '40px',
              zIndex: 10
            }}
            onClick={onBackClick}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.5';
            }}
          >
            <img
              src="/left-arrow.svg"
              alt="메인화면으로 이동"
              style={{ 
                width: '18px', 
                height: '18px'
              }}
            />
            <span style={{
              color: 'black',
              fontSize: '16px',
              fontFamily: 'Pretendard',
              fontWeight: 500,
              lineHeight: '20.8px'
            }}>
              메인화면으로 이동
            </span>
          </div>
        )}

        {/* Main Content - Absolute positioned elements */}
        <div
          id={`${idPrefix}-main-content`}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%'
          }}
        >
          {children}
        </div>
      </div>
    </Layout>
  );
}
