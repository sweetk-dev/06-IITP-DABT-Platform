// 에러 알림 컴포넌트
import React, { useEffect, useState } from 'react';
import { ErrorAlertState } from '../../api/errorHandler';

interface ErrorAlertProps {
  error: ErrorAlertState | null;
  onClose: () => void;
}

export function ErrorAlert({ error, onClose }: ErrorAlertProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (error?.isOpen) {
      setIsVisible(true);
    }
  }, [error]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // 애니메이션 완료 후 상태 초기화
  };

  if (!error || !isVisible) {
    return null;
  }

  const getIcon = () => {
    switch (error.type) {
      case 'error':
        return (
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            !
          </div>
        );
      case 'warning':
        return (
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            ⚠
          </div>
        );
      case 'info':
        return (
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            i
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        maxWidth: '400px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        border: `2px solid ${
          error.type === 'error' ? '#ef4444' : 
          error.type === 'warning' ? '#f59e0b' : '#3b82f6'
        }`,
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease-in-out',
        overflow: 'hidden'
      }}
    >
      {/* 헤더 */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: error.type === 'error' ? '#fef2f2' : 
                        error.type === 'warning' ? '#fffbeb' : '#eff6ff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {getIcon()}
          <h3 style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: '600',
            color: error.type === 'error' ? '#dc2626' : 
                   error.type === 'warning' ? '#d97706' : '#2563eb'
          }}>
            {error.title}
          </h3>
        </div>
        <button
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            color: '#6b7280',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          ×
        </button>
      </div>

      {/* 내용 */}
      <div style={{
        padding: '16px 20px',
        fontSize: '14px',
        lineHeight: '1.5',
        color: '#374151'
      }}>
        {error.message}
      </div>

      {/* 하단 액션 */}
      <div style={{
        padding: '12px 20px',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'flex-end',
        backgroundColor: '#f9fafb'
      }}>
        <button
          onClick={handleClose}
          style={{
            padding: '8px 16px',
            backgroundColor: error.type === 'error' ? '#ef4444' : 
                            error.type === 'warning' ? '#f59e0b' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          확인
        </button>
      </div>
    </div>
  );
}
