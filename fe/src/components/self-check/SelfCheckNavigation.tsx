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
  // 피그마 기준 (1840px × 882px)을 현재 SelfCheckLayout (1840px × 840px)로 비율 계산
  // 높이 비율: 840/882 = 0.952
  const heightRatio = 840 / 882;
  
  // 피그마 기준 위치를 SelfCheckLayout 내부 기준으로 변환
  const getButtonPosition = (figmaLeft: number, figmaTop: number, isCentered = false) => ({
    position: 'absolute' as const,
    left: isCentered ? 'calc(50% - 140px)' : `${figmaLeft}px`, // 중앙이면 SelfCheckLayout 내부 중앙, 아니면 피그마 기준
    top: `${figmaTop * heightRatio}px`, // 높이 비율 적용
    width: '280px',
    height: '77px',
    minWidth: '280px',
    borderRadius: '16px',
    padding: '24px',
    gap: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontFamily: 'var(--font-family-primary)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center' as const,
    border: 'none'
  });

  return (
    <>
      {/* Previous Button - 피그마 스펙 적용 */}
      {showPrevious && onNext && (
        <button
          onClick={onPrevious}
          style={{
            ...getButtonPosition(362, 863), // 피그마 기준 위치
            background: '#FFFFFF',
            color: 'var(--color-text-primary)',
            border: '1px solid #DADADA',
            opacity: 1
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
            e.currentTarget.style.borderColor = '#999';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = '#DADADA';
          }}
        >
          {previousIcon || (
            <img src="/left_arrow2.svg" alt="이전" style={{ width: '20px', height: '20px' }} />
          )}
          <span>{previousText}</span>
        </button>
      )}

      {/* Next Button - 피그마 스펙 적용 */}
      {showNext && onNext && (
        <button
          onClick={onNext}
          disabled={isNextDisabled}
          style={{
            ...getButtonPosition(showPrevious ? 1280 : 0, 863, !showPrevious), // 이전 버튼이 있으면 1280px, 없으면 브라우저 중앙
            background: '#0090FF',
            color: '#FFFFFF',
            opacity: isNextDisabled ? 0.3 : 1,
            cursor: isNextDisabled ? 'not-allowed' : 'pointer'
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
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          <span>{nextText}</span>
          {nextIcon || (
            <img src="/right_arrow2.svg" alt="다음" style={{ width: '20px', height: '20px' }} />
          )}
        </button>
      )}
    </>
  );
}
