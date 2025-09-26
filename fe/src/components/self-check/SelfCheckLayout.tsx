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
          width: '100%', // 홈의 메인 컨텐츠 폭과 동일 (1200px)
          background: '#f0f8ff',
          borderRadius: '40px',
          padding: '40px',
          minHeight: '600px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        {/* 메인화면으로 이동 - 헤더와 왼쪽 정렬 */}
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
              top: '44px', // 헤더의 page-title과 동일한 margin-top
              left: '0px' // 컨테이너의 왼쪽 끝 (padding 내부)
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
