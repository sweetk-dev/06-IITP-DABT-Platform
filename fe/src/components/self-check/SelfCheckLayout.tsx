import { ReactNode } from 'react';
import { Layout } from '../layout/Layout';
import { SelfCheckNavigation } from './SelfCheckNavigation';
import { publicAsset } from '../../utils/publicAsset';

interface SelfCheckLayoutProps {
  idPrefix: string;
  children: ReactNode;
  onBackClick?: () => void;
  showBackButton?: boolean;
  // Navigation props
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

/**
 * 자가진단(시작·본인 확인·문항) 화면 공통 패널.
 *
 * [2026-10 반응형 개편 — 사용자 스크린샷 지적 사항 대응]
 *  기존 문제
 *   - 1840×840px 고정 패널을 position:absolute + left:50% 로 띄워 1440px 화면에서도 문서 폭이 1640px 로 넘쳤다.
 *   - 이전/다음 버튼을 피그마 좌표(top 822px)에 절대 배치 → 화면 높이 900px 대에서는 버튼이 화면 맨 아래에 붙거나
 *     패널 경계에 걸렸고, 360px 휴대폰에서는 아예 화면 밖이었다.
 *  변경
 *   - 패널은 문서 흐름(normal flow) 안의 블록, 높이는 내용만큼(min-height 강제 없음), 폭은 본문 폭(최대 1840px).
 *   - [메인화면으로 이동] → 진행 단계 → 문항 → 선택지 → [이전/다음] 을 위에서 아래로 한 열로 쌓고 간격을 줄여
 *     1920×920, 1440×900, 360×780 에서 스크롤 없이 한 화면에 들어오게 했다 (스타일: layout.css .sc-*).
 *   - 이전/다음은 패널 "안" 맨 아래. 768px 이하에서는 position: sticky 로 화면 하단에 고정.
 *   - "메인화면으로 이동"을 div+onClick → <button> 으로 (키보드 사용 가능).
 */
export function SelfCheckLayout({ 
  idPrefix, 
  children, 
  onBackClick,
  showBackButton = true,
  // Navigation props
  onPrevious,
  onNext,
  previousText = '이전',
  nextText = '다음',
  showPrevious = true,
  showNext = true,
  isNextDisabled = false,
  nextIcon,
  previousIcon
}: SelfCheckLayoutProps) {
  return (
    <Layout idPrefix={idPrefix} showBreadcrumb={!showBackButton} wide>
      <div id={`${idPrefix}-container`} className="sc-panel">
        {/* 메인화면으로 이동 - 패널 왼쪽 위 */}
        {showBackButton && (
          <div className="sc-panel-top">
            <button
              type="button"
              id={`${idPrefix}-back-button`}
              className="sc-back-button"
              onClick={onBackClick}
            >
              {/* 화살표는 장식 (버튼 이름은 옆 글자) */}
              <img src={publicAsset('/left-arrow.svg')} alt="" />
              <span>메인화면으로 이동</span>
            </button>
          </div>
        )}

        {/* Main Content */}
        <div id={`${idPrefix}-main-content`} className="sc-panel-content" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'inherit' }}>
          {children}
        </div>

        {/* Navigation - 패널 안 맨 아래 (문서 흐름) */}
        {(onPrevious || onNext) && (
          <SelfCheckNavigation
            onPrevious={onPrevious}
            onNext={onNext}
            previousText={previousText}
            nextText={nextText}
            showPrevious={showPrevious}
            showNext={showNext}
            isNextDisabled={isNextDisabled}
            nextIcon={nextIcon}
            previousIcon={previousIcon}
          />
        )}
      </div>
    </Layout>
  );
}
