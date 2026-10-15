import { KeyboardEvent, useRef } from 'react';

export interface RadioOption<V extends string | number> {
  value: V;
  /** 화면에 보이는 글자 (예: "3", "여성") */
  label: string;
  /** 스크린리더가 읽을 이름. 생략하면 label (예: "1 전혀 아니다") */
  ariaLabel?: string;
}

interface SelfCheckRadioGroupProps<V extends string | number> {
  options: ReadonlyArray<RadioOption<V>>;
  value: V | null | undefined;
  onChange: (value: V) => void;
  /** 그룹 이름을 제공하는 요소 id (문항 제목 h1) */
  labelledBy?: string;
  /** labelledBy 가 없을 때 쓸 그룹 이름 */
  ariaLabel?: string;
  /** 'scale' = 1~5 동그라미, 'choice' = 글자형 큰 버튼 */
  variant: 'scale' | 'choice';
  className?: string;
  idPrefix?: string;
}

/**
 * 자가진단 선택지 — WAI-ARIA 라디오 그룹(radiogroup) 패턴.
 *
 * [2026-10 접근성 개편] 기존 선택지는 단순 <button> 나열이라
 *   - 스크린리더가 "하나만 고르는 질문"인지, 몇 번째가 선택됐는지 알 수 없었고(색으로만 표시),
 *   - 1~5 버튼은 "1", "2" 처럼 숫자만 읽혀 척도의 의미(전혀 아니다~매우 그렇다)를 알 수 없었다.
 * 변경 내용
 *   - role="radiogroup"(문항 제목으로 이름 연결) + 각 선택지 role="radio" + aria-checked
 *   - 접근 가능한 이름: "1 전혀 아니다", "3 보통", "5 매우 그렇다" 등 (ariaLabel)
 *   - 로빙 tabindex: 그룹 전체가 Tab 정지점 1개. 선택된 항목(없으면 첫 항목)만 tabIndex=0
 *   - 키보드: ←/↑ 이전, →/↓ 다음(끝에서 처음으로 순환), Home 처음, End 마지막 — 이동과 동시에 선택
 *            Space/Enter 현재 항목 선택 (button 요소라 클릭 이벤트로 처리됨)
 *   - 마우스/터치 클릭은 기존과 동일하게 즉시 선택
 */
export function SelfCheckRadioGroup<V extends string | number>({
  options,
  value,
  onChange,
  labelledBy,
  ariaLabel,
  variant,
  className = '',
  idPrefix = 'sc-radio'
}: SelfCheckRadioGroupProps<V>) {
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedIndex = options.findIndex((option) => option.value === value);
  // Tab 으로 들어왔을 때 초점을 받을 항목: 선택된 항목, 없으면 첫 항목
  const tabbableIndex = selectedIndex >= 0 ? selectedIndex : 0;

  const selectAt = (index: number) => {
    const count = options.length;
    const next = ((index % count) + count) % count; // 처음↔끝 순환
    onChange(options[next].value);
    itemRefs.current[next]?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        selectAt(index + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        selectAt(index - 1);
        break;
      case 'Home':
        e.preventDefault();
        selectAt(0);
        break;
      case 'End':
        e.preventDefault();
        selectAt(options.length - 1);
        break;
      default:
        break;
    }
  };

  const groupClass = variant === 'scale' ? 'sc-scale-options' : 'sc-choices';
  const itemClass = variant === 'scale' ? 'sc-scale-option' : 'sc-choice';

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : ariaLabel}
      className={`${groupClass} ${className}`}
    >
      {options.map((option, index) => {
        const checked = index === selectedIndex;
        return (
          <button
            key={String(option.value)}
            ref={(el) => { itemRefs.current[index] = el; }}
            id={`${idPrefix}-option-${option.value}`}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={option.ariaLabel || undefined}
            tabIndex={index === tabbableIndex ? 0 : -1}
            className={itemClass}
            onClick={() => onChange(option.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
