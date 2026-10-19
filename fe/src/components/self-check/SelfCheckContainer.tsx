import { ReactNode, Ref } from 'react';

interface SelfCheckContainerProps {
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  /** 제목(h1) 요소 id — 선택지 라디오 그룹의 aria-labelledby 로 연결할 때 사용 */
  titleId?: string;
  /** 제목(h1) ref — 문항이 바뀔 때 초점을 제목으로 옮길 때 사용 */
  titleRef?: Ref<HTMLHeadingElement>;
}

/**
 * 자가진단 패널 안 본문(제목·부제·내용).
 *
 * [2026-10 개편]
 *  - 기존: margin-top 120px, 좌우 padding 60px, min-height 600px 고정 → 패널이 화면보다 길어지는 주원인.
 *    → 여백을 걷어 내고 내용 높이만큼만 차지(.sc-body).
 *  - 기존: title 이 빈 문자열이어도 빈 <h1> 을 그려, 문항 화면에 h1 이 2개였다(빈 h1 + 문항 h1).
 *    → title 이 있을 때만 h1 을 그린다.
 */
export function SelfCheckContainer({ title, subtitle, children, titleId, titleRef }: SelfCheckContainerProps) {
  return (
    <div className="sc-body">
      {title ? (
        <h1 id={titleId} ref={titleRef} tabIndex={titleRef ? -1 : undefined} className="sc-title">
          {title}
        </h1>
      ) : null}

      {subtitle && (
        <p className="sc-subtitle">
          {subtitle}
        </p>
      )}

      {children}
    </div>
  );
}
