import React from 'react';
import { SELF_CHECK_CONSTANTS, AREA_NAMES } from '../../../../packages/common/src/types';

interface SelfCheckProgressProps {
  currentStep: number;
  totalSteps: number;
  stepNames?: string[];
  areaProgress?: { [key: string]: string }; // 영역별 진행상태 (예: "신체적 자립(1/8)")
}

// 기본 stepNames를 상수에서 동적으로 생성
const getDefaultStepNames = () => {
  const areaKeys = Object.keys(SELF_CHECK_CONSTANTS.QUESTIONS_PER_AREA);
  return ['본인 확인', ...areaKeys.map(key => AREA_NAMES[key as keyof typeof AREA_NAMES])];
};

export function SelfCheckProgress({ 
  currentStep, 
  totalSteps, 
  stepNames = getDefaultStepNames(), 
  areaProgress = {}
}: SelfCheckProgressProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      marginBottom: '40px',
      padding: '24px 32px',
      background: 'white',
      borderRadius: '100px',
      boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.05)',
      width: 'fit-content'
    }}>
      {/* Progress Steps - HTML Design */}
      {stepNames.map((name, index) => {
        const isActive = index < currentStep;
        const isCompleted = index < currentStep - 1;
        const isCurrent = index === currentStep - 1;
        
        return (
          <React.Fragment key={index}>
            {/* Step Item - HTML Structure */}
            <div className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {/* Step Icon/Number - HTML Style */}
              {isCompleted ? (
                <div className="step-icon" style={{
                  width: '22px',
                  height: '22px',
                  background: '#0090ff',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <div className="check-icon" style={{
                    width: '11.31px',
                    height: '8.01px',
                    background: 'white',
                    clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 70%)',
                    transform: 'rotate(-45deg)'
                  }} />
                </div>
              ) : (
                <div className={`step-number ${isActive ? 'active' : ''}`} style={{
                  width: '22px',
                  height: '22px',
                  background: isActive ? '#0090ff' : '#d9d9d9',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: isActive ? 'white' : 'black',
                  fontSize: '15px',
                  fontWeight: '500',
                  fontFamily: 'Pretendard'
                }}>
                  {index + 1}
                </div>
              )}
              
              {/* Step Text - HTML Style */}
              <div className="step-text" style={{
                fontSize: '16px',
                fontWeight: isActive ? '500' : '400',
                color: isActive ? 'black' : '#666',
                fontFamily: 'Pretendard',
                lineHeight: '1.2'
              }}>
                {index === 0 ? name : areaProgress[name] || name}
              </div>
            </div>
            
            {/* Separator - HTML Design (실선, 1px 높이) */}
            {index < stepNames.length - 1 && (
              <div 
                className={`step-separator ${isActive ? 'active' : ''}`}
                style={{ 
                  width: '60px', 
                  height: '1px', 
                  background: isActive ? '#0090ff' : '#a4a4a4'
                }} 
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
