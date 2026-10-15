import { ReactNode } from 'react';
import { publicAsset } from '../../utils/publicAsset';

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

/**
 * 자가진단 이전/다음 버튼 줄.
 *
 * [2026-10 개편]
 *  - 기존: 피그마 좌표(left 362px / 1280px, top 863×0.952px)로 position:absolute 배치
 *    → 패널 높이·화면 크기가 다르면 버튼이 경계에 걸리거나 화면 밖으로 나감.
 *  - 변경: 문서 흐름 안의 가운데 정렬 flex 줄(.sc-nav). 좁은 화면에서는 두 버튼이 반반 폭 + 하단 고정(sticky).
 *  - 다음 버튼 글자는 굵게(700) 19px 이상 → 흰 글자/브랜드 파랑 대비를 "큰 글자" 기준(3:1)으로 충족.
 *  - 화살표 이미지는 장식(alt="") — 기존 alt="이전"/"다음" 은 버튼 글자와 중복되어 "이전 이전" 으로 읽혔다.
 *  - 비활성(응답 전) 다음 버튼은 native disabled 로 키보드 초점에서도 제외.
 *  - 이전 버튼 표시 조건은 기존 동작(showPrevious && onNext 가 있을 때)을 그대로 유지.
 */
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
    <div className="sc-nav">
      {showPrevious && onNext && (
        <button
          type="button"
          onClick={onPrevious}
          className="sc-nav-button sc-nav-button--prev"
        >
          {previousIcon || (
            <img src={publicAsset('/left_arrow2.svg')} alt="" />
          )}
          <span>{previousText}</span>
        </button>
      )}

      {showNext && onNext && (
        <button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled}
          className="sc-nav-button sc-nav-button--next"
        >
          <span>{nextText}</span>
          {nextIcon || (
            <img src={publicAsset('/right_arrow2.svg')} alt="" />
          )}
        </button>
      )}
    </div>
  );
}
