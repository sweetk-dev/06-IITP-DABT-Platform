import { ReactNode } from 'react';

interface SelfCheckNavigationProps {
  onPrevious?: () => void;
  onNext?: () => void;
  previousText?: string;
  nextText?: string;
  showPrevious?: boolean;
  showNext?: boolean;
  isNextDisabled?: boolean;
  nextIcon?: ReactNode;
  previousIcon?: ReactNode;
}

export function SelfCheckNavigation({
  onPrevious,
  onNext,
  previousText = '이전',
  nextText = '다음',
  showPrevious = true,
  showNext = true,
  isNextDisabled = false,
  nextIcon,
  previousIcon
}: SelfCheckNavigationProps) {
  return (
    <div style={{
      position: 'absolute',
      bottom: '60px', // SelfCheckLayout 하단에서 60px 위
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '20px',
      maxWidth: '1200px',
      width: '100%',
      padding: '0 40px'
    }}>
      {/* Previous Button - Figma Style */}
      {showPrevious && onPrevious && (
        <button
          onClick={onPrevious}
          style={{
            width: '280px',
            height: '77px',
            background: 'var(--figma-white)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--figma-gray-300)',
            borderRadius: '16px',
            fontSize: '24px',
            fontFamily: 'var(--font-family-primary)',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
            e.currentTarget.style.borderColor = 'var(--figma-gray-400)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.borderColor = 'var(--figma-gray-300)';
          }}
        >
          {previousIcon || (
            <img src="/left_arrow2.svg" alt="이전" style={{ width: '20px', height: '20px' }} />
          )}
          <span>{previousText}</span>
        </button>
      )}

      {/* Next Button - Figma Style */}
      {showNext && onNext && (
        <button
          onClick={onNext}
          disabled={isNextDisabled}
          style={{
            width: '280px',
            height: '77px',
            background: isNextDisabled ? 'var(--figma-gray-300)' : 'var(--color-primary)',
            color: isNextDisabled ? 'var(--figma-gray-500)' : 'var(--figma-white)',
            border: 'none',
            borderRadius: '16px',
            fontSize: '24px',
            fontFamily: 'var(--font-family-primary)',
            fontWeight: 600,
            cursor: isNextDisabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: isNextDisabled ? 'none' : '0 4px 12px rgba(0, 144, 255, 0.3)'
          }}
          onMouseEnter={(e) => {
            if (!isNextDisabled) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 144, 255, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isNextDisabled) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 144, 255, 0.3)';
            }
          }}
        >
          <span>{nextText}</span>
          {nextIcon || (
            <img src="/right_arrow2.svg" alt="다음" style={{ width: '20px', height: '20px' }} />
          )}
        </button>
      )}
    </div>
  );
}
