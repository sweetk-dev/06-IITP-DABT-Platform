import { ReactNode, useEffect, useId, useRef } from 'react';

interface ModalProps {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  children?: ReactNode;
  showIcon?: boolean;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  helpText?: string;
  helpTextLink?: string;
  allowHtml?: boolean;
  autoHeight?: boolean;
}

// 대화상자 안에서 Tab 으로 이동할 수 있는 요소 선택자 (초점 가두기용)
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * 안내/확인 대화상자.
 *
 * [2026-10 접근성 개편 — WAI-ARIA Dialog (Modal) 패턴]
 *  - role="dialog" + aria-modal="true" + aria-labelledby(제목) + aria-describedby(설명)
 *    기존에는 일반 div 라 스크린리더가 대화상자가 열린 사실을 알 수 없었다.
 *  - 열릴 때 초점을 대화상자 안(주 버튼)으로 옮기고, Tab/Shift+Tab 이 대화상자 밖으로 나가지 않게 가둔다.
 *  - Esc 로 닫기(기존 유지), 닫히면 초점을 대화상자를 연 버튼으로 되돌린다.
 *  - 도움말("Open API 센터는 무엇인가요?")은 div+onClick+window.open → 실제 <a target="_blank"> 링크로 변경.
 *  - 고정 폭 408px / 고정 높이 252px → 화면 폭에 맞게 줄어들고 내용만큼 늘어나게 변경 (.modal-dialog).
 *  - "!" 아이콘은 장식이므로 aria-hidden.
 *
 * 기존 props(이름·기본값)는 그대로 유지해 호출부 변경 없이 동작한다.
 */
export function Modal({
  id,
  isOpen,
  onClose,
  title,
  description,
  children,
  showIcon = false,
  primaryButtonText = '확인',
  secondaryButtonText = '',
  onPrimaryClick,
  onSecondaryClick,
  helpText,
  helpTextLink,
  allowHtml = false,
  autoHeight = false
}: ModalProps) {
  // 제목/설명 요소 id — 같은 화면에 모달이 여러 개 있어도 겹치지 않도록 React useId 사용
  const autoId = useId();
  const titleId = `${id || 'modal'}-${autoId}-title`;
  const descId = `${id || 'modal'}-${autoId}-desc`;
  const dialogRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLButtonElement>(null);
  // 모달을 열기 직전 초점이 있던 요소 (닫힐 때 되돌려 줄 대상)
  const returnFocusRef = useRef<HTMLElement | null>(null);
  // onClose 가 매 렌더마다 새 함수여도 effect 를 다시 걸지 않도록 ref 로 최신값만 참조
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // 열림/닫힘에 따른 초점 이동 + 배경 스크롤 잠금
  useEffect(() => {
    if (!isOpen) return;

    returnFocusRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';

    // 렌더 직후 주 버튼(없으면 대화상자 자체)으로 초점 이동
    const timer = window.setTimeout(() => {
      (primaryRef.current || dialogRef.current)?.focus();
    }, 0);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = 'unset';
      // 닫힐 때: 대화상자를 연 요소가 아직 화면에 있으면 그곳으로 초점 복귀
      const target = returnFocusRef.current;
      if (target && document.contains(target)) {
        target.focus();
      }
    };
  }, [isOpen]);

  // Esc 닫기 + Tab 초점 가두기
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;

      const focusables = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => el.offsetParent !== null);
      if (focusables.length === 0) {
        e.preventDefault();
        dialogRef.current.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      // 마지막에서 Tab → 처음으로, 처음(또는 대화상자 자체)에서 Shift+Tab → 마지막으로
      if (e.shiftKey && (active === first || active === dialogRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      } else if (!dialogRef.current.contains(active)) {
        // 어떤 이유로 초점이 밖에 있으면 안으로 되돌림
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePrimaryClick = () => {
    if (onPrimaryClick) {
      onPrimaryClick();
    } else {
      onClose();
    }
  };

  const handleSecondaryClick = () => {
    if (onSecondaryClick) {
      onSecondaryClick();
    } else {
      onClose();
    }
  };

  // showIcon / autoHeight 는 기존 API 호환용 (아이콘은 기존에도 항상 표시, 높이는 이제 항상 내용 기준)
  void showIcon;
  void autoHeight;

  return (
    <div
      className={`modal ${isOpen ? 'show' : ''}`}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '16px'
      }}
    >
      <div
        id={id}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
        className="modal-content modal-dialog"
        style={{
          // 기존: autoHeight 가 아니면 height 252px 고정 → 좁은 화면에서 글이 넘쳤다. 이제 항상 "최소" 높이만 지정
          minHeight: '252px',
          padding: '28px 32px 24px 32px',
          background: 'white',
          boxShadow: '0px 0px 100px rgba(0, 0, 0, 0.08)',
          borderRadius: '16px',
          border: '1px solid #ECECEC',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '24px'
        }}
      >
        <div
          className="modal-header"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '24px',
            width: '100%'
          }}
        >
          {/* 아이콘 - 장식용 (24x24px 검은색 원형) */}
          <div
            className="modal-icon"
            aria-hidden="true"
            style={{
              width: '24px',
              height: '24px',
              background: 'black',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <span
              className="warning-icon"
              style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                lineHeight: '1'
              }}
            >
              !
            </span>
          </div>

          <div
            className="modal-text"
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: '12px'
            }}
          >
            <h2
              id={titleId}
              className="modal-title"
              style={{
                margin: 0,
                textAlign: 'center',
                color: 'black',
                fontSize: '20px',
                fontFamily: 'var(--font-family-primary)',
                fontWeight: 700,
                lineHeight: '26px',
                wordWrap: 'break-word',
                width: '100%'
              }}
            >
              {title}
            </h2>

            {allowHtml ? (
              <div
                id={descId}
                className="modal-description"
                style={{
                  textAlign: 'center',
                  color: 'black',
                  fontSize: '16px',
                  fontFamily: 'var(--font-family-primary)',
                  fontWeight: 400,
                  lineHeight: '20.8px',
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-line',
                  width: '100%'
                }}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <div
                id={descId}
                className="modal-description"
                style={{
                  textAlign: 'center',
                  color: 'black',
                  fontSize: '16px',
                  fontFamily: 'var(--font-family-primary)',
                  fontWeight: 400,
                  lineHeight: '20.8px',
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-line',
                  width: '100%'
                }}
              >
                {description.split('\\n').map((line, index, array) => (
                  <span key={index}>
                    {line}
                    {index < array.length - 1 && <br />}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {children || (
          <div
            className="modal-actions"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              flexWrap: 'wrap'
            }}
          >
            {secondaryButtonText && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleSecondaryClick}
                style={{
                  flex: '1 1 0',
                  minWidth: '120px',
                  padding: '14px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'var(--font-family-primary)',
                  fontWeight: 500,
                  wordWrap: 'break-word',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'white',
                  border: '2px solid #ddd',
                  color: 'black'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f5f5f5';
                  e.currentTarget.style.borderColor = '#999';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#ddd';
                }}
              >
                {secondaryButtonText}
              </button>
            )}

            <button
              ref={primaryRef}
              type="button"
              className="btn btn-primary"
              onClick={handlePrimaryClick}
              style={{
                flex: '1 1 0',
                minWidth: '120px',
                padding: '14px 24px',
                borderRadius: '16px',
                fontSize: '20px',
                fontFamily: 'var(--font-family-primary)',
                // [접근성] 20px 굵게(700)는 "큰 글자" 기준 → 흰 글자/브랜드 파랑(#0090ff) 대비 3:1 충족
                fontWeight: 700,
                wordWrap: 'break-word',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                background: '#0090ff',
                border: 'none',
                color: 'white'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#007acc';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#0090ff';
              }}
            >
              {primaryButtonText}
            </button>
          </div>
        )}

        {/* Help Text (optional) — 실제 링크(새 창) */}
        {helpText && (
          <div
            className="modal-footer"
            style={{
              marginTop: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {helpTextLink ? (
              <a
                className="help-link"
                href={helpTextLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--color-text-secondary)',
                  fontSize: '14px',
                  textDecoration: 'underline'
                }}
              >
                <span aria-hidden="true" className="help-icon" style={helpIconStyle}>?</span>
                <span>{helpText}</span>
                <span className="sr-only">(새 창)</span>
              </a>
            ) : (
              <span
                className="help-link"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-secondary)', fontSize: '14px' }}
              >
                <span aria-hidden="true" className="help-icon" style={helpIconStyle}>?</span>
                <span>{helpText}</span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// 도움말 "?" 원형 아이콘 (장식)
const helpIconStyle: React.CSSProperties = {
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  border: '1.5px solid currentColor',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  fontWeight: 'bold'
};
