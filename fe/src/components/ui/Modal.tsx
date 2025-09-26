import { ReactNode, useEffect } from 'react';

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
}

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
  onSecondaryClick
}: ModalProps) {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // 스크롤 방지
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

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
        opacity: isOpen ? 1 : 0,
        visibility: isOpen ? 'visible' : 'hidden',
        transition: 'all 0.3s ease'
      }}
    >
      <div 
        className="modal-content"
        style={{
          width: '408px',
          height: '252px',
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
            gap: '24px'
          }}
        >
          {/* 아이콘 - 이미지 디자인에 맞게 (24x24px 검은색 원형) */}
          <div 
            className="modal-icon"
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
              width: '344px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: '12px'
            }}
          >
            <div 
              className="modal-title"
              style={{
                textAlign: 'center',
                color: 'black',
                fontSize: '20px',
                fontFamily: 'Pretendard',
                fontWeight: 700,
                lineHeight: '26px',
                wordWrap: 'break-word',
                width: '100%'
              }}
            >
              {title}
            </div>
            
            <div 
              className="modal-description"
              style={{
                textAlign: 'center',
                color: 'black',
                fontSize: '16px',
                fontFamily: 'Pretendard',
                fontWeight: 400,
                lineHeight: '20.8px',
                wordWrap: 'break-word',
                whiteSpace: 'pre-line',
                width: '100%'
              }}
            >
              {description}
            </div>
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
              width: '100%'
            }}
          >
            {secondaryButtonText && (
              <button
                className="btn btn-secondary"
                onClick={handleSecondaryClick}
                style={{
                  flex: '1 1 0',
                  minWidth: '120px',
                  padding: '14px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'Pretendard',
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
              className="btn btn-primary"
              onClick={handlePrimaryClick}
              style={{
                flex: '1 1 0',
                minWidth: '120px',
                padding: '14px 24px',
                borderRadius: '16px',
                fontSize: '20px',
                fontFamily: 'Pretendard',
                fontWeight: 600,
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
      </div>
    </div>
  );
}