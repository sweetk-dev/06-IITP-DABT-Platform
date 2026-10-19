import { SELF_CHECK_CONSTANTS, getAreaName } from '@iitp-dabt-platform/common';

interface SelfCheckProgressProps {
  currentStep: number;
  totalSteps: number;
  stepNames?: string[];
  areaProgress?: { [key: string]: string }; // 영역별 진행상태 (예: "신체적 자립(1/8)")
}

// 기본 stepNames를 상수에서 동적으로 생성
const getDefaultStepNames = () => {
  const areaKeys = Object.keys(SELF_CHECK_CONSTANTS.QUESTIONS_PER_AREA);
  return ['본인 확인', ...areaKeys.map(key => getAreaName(key as any))];
};

/**
 * 자가진단 진행 단계 표시 (본인 확인 → 신체적 → 정서적 → 경제적 → 사회적).
 *
 * [2026-10 반응형·접근성 개편]
 *  - 기존: 폭 1200px 고정 알약 모양 + position:absolute → 좁은 화면에서 넘치고, 단계가 색으로만 구분됐다.
 *  - 넓은 화면(1025px↑): 5단계 전체 목록(<ol>). 현재 단계에 aria-current="step",
 *    완료 단계는 숫자 대신 ✓ 와 "(완료)" 숨김 텍스트.
 *  - 좁은 화면(1024px↓): "2/5 신체적 자립(0/8)" 한 줄 요약 + 진행 막대 (layout.css 에서 전환)
 *    목록은 display:none 이 되어 스크린리더도 요약 한 줄만 읽는다(중복 낭독 방지).
 *  - 단계 숫자 원 배경: 흰 글자 대비를 위해 --color-primary-strong 사용
 */
export function SelfCheckProgress({ 
  currentStep, 
  totalSteps, 
  stepNames = getDefaultStepNames(), 
  areaProgress = {}
}: SelfCheckProgressProps) {
  const labelOf = (name: string, index: number) => (index === 0 ? name : areaProgress[name] || name);
  const currentIndex = Math.min(Math.max(currentStep - 1, 0), stepNames.length - 1);
  const currentLabel = labelOf(stepNames[currentIndex], currentIndex);
  const percent = Math.round((currentStep / Math.max(totalSteps, 1)) * 100);

  return (
    <div className="sc-progress">
      {/* 넓은 화면: 단계 전체 목록 */}
      <ol className="sc-progress-list" aria-label="자가진단 진행 단계">
        {stepNames.map((name, index) => {
          const isActive = index < currentStep;
          const isCompleted = index < currentStep - 1;
          const isCurrent = index === currentStep - 1;
          
          return (
            <li key={index} className="sc-progress-item" aria-current={isCurrent ? 'step' : undefined}>
              <span className={`sc-progress-step ${isActive ? 'is-active' : ''}`}>
                <span className="sc-progress-num" aria-hidden="true">
                  {isCompleted ? '✓' : index + 1}
                </span>
                <span>{labelOf(name, index)}</span>
                {isCompleted && <span className="sr-only">(완료)</span>}
                {isCurrent && <span className="sr-only">(현재 단계)</span>}
              </span>
              {index < stepNames.length - 1 && (
                <span className={`sc-progress-sep ${index < currentStep - 1 ? 'is-active' : ''}`} aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>

      {/* 좁은 화면: 한 줄 요약 (예: "2/5 신체적 자립(0/8)") */}
      <p className="sc-progress-compact" style={{ margin: 0 }}>
        <span className="sr-only">진행 단계 </span>
        <span className="sc-progress-compact-count">{currentStep}/{totalSteps}</span>
        <span>{currentLabel}</span>
      </p>
      <div className="sc-progress-bar" aria-hidden="true">
        <span style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
