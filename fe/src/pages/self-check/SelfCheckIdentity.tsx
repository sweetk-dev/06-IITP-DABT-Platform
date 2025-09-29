import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '../App';
import { SelfCheckLayout, SelfCheckProgress, SelfCheckNavigation, SelfCheckContainer } from '../../components/self-check';
import { Modal } from '../../components/ui/Modal';
import { IDENTITY_QUESTIONS, SELF_CHECK_CONSTANTS, AREA_NAMES, type IdentityQuestionType, type IdentityResponse } from '../../../../packages/common/src/types';

export function SelfCheckIdentity() {
  const navigate = useNavigate();
  const [showExitModal, setShowExitModal] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<Partial<IdentityResponse>>({});

  // 현재 질문 정보
  const currentQuestion = IDENTITY_QUESTIONS[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === IDENTITY_QUESTIONS.length - 1;

  // 현재 질문에 대한 응답이 있는지 확인
  const hasResponse = userResponses[currentQuestion.id] !== undefined;

  // 다음 버튼 활성화 조건
  const canProceed = hasResponse;

  // 응답 처리 함수
  const handleResponse = (value: string) => {
    setUserResponses(prev => ({
      ...prev,
      [currentQuestion.id]: value as any
    }));
  };

  // 이전 버튼 처리
  const handlePrevious = () => {
    if (isFirstQuestion) {
      navigate(ROUTE_PATHS.SELF_CHECK_START);
    } else {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // 다음 버튼 처리
  const handleNext = () => {
    if (isLastQuestion) {
      // 모든 질문이 완료되었으므로 자가진단 질문으로 이동
      localStorage.setItem('selfCheckUserInfo', JSON.stringify(userResponses));
      navigate(ROUTE_PATHS.SELF_CHECK_QUESTIONS);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // 종료 처리
  const handleExit = () => {
    navigate(ROUTE_PATHS.HOME);
  };

  return (
    <>
    <SelfCheckLayout 
      idPrefix="self-check-identity"
      onBackClick={() => setShowExitModal(true)}
      showBackButton={true}
    >
      {/* Progress Steps */}
      <SelfCheckProgress 
        currentStep={1}
        totalSteps={Object.keys(SELF_CHECK_CONSTANTS.QUESTIONS_PER_AREA).length + 1} // 본인 확인 + 영역 수
        stepNames={undefined} // 기본값 사용 (상수에서 동적 생성)
        areaProgress={Object.keys(SELF_CHECK_CONSTANTS.QUESTIONS_PER_AREA).reduce((acc, key) => {
          const areaName = AREA_NAMES[key as keyof typeof AREA_NAMES];
          const questionCount = SELF_CHECK_CONSTANTS.QUESTIONS_PER_AREA[key as keyof typeof SELF_CHECK_CONSTANTS.QUESTIONS_PER_AREA];
          acc[areaName] = `${areaName}(0/${questionCount})`;
          return acc;
        }, {} as { [key: string]: string })}
      />

      {/* Main Container */}
      <SelfCheckContainer 
        title={currentQuestion.question}
      >
        {/* Answer Options - 1840px 컨테이너에 맞게 배치 */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '60px',
          margin: '0 auto 80px auto', // 상하좌우 중앙 정렬, 하단 80px
          justifyContent: 'center',
          flexWrap: 'wrap',
          maxWidth: '1400px',
          width: '100%'
        }}>
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleResponse(option.value)}
              style={{
                width: '280px',
                height: '77px',
                background: userResponses[currentQuestion.id] === option.value ? 'var(--color-primary)' : 'var(--figma-white)',
                color: userResponses[currentQuestion.id] === option.value ? 'var(--figma-white)' : 'var(--color-text-primary)',
                border: 'none',
                borderRadius: '16px',
                fontSize: '24px',
                fontFamily: 'var(--font-family-primary)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: userResponses[currentQuestion.id] === option.value 
                  ? '0 4px 12px rgba(0, 144, 255, 0.3)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                if (userResponses[currentQuestion.id] !== option.value) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (userResponses[currentQuestion.id] !== option.value) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              {option.label}
            </button>
          ))}
        </div>

      </SelfCheckContainer>

      {/* Navigation */}
      <SelfCheckNavigation
        onPrevious={handlePrevious}
        onNext={handleNext}
        previousText="이전"
        nextText={isLastQuestion ? '자가진단 시작' : '다음'}
        isNextDisabled={!canProceed}
        showPrevious={!isFirstQuestion}
      />
    </SelfCheckLayout>

    {/* Exit Modal */}
    <Modal
      isOpen={showExitModal}
      onClose={() => setShowExitModal(false)}
      title="메인화면으로 이동"
      description="진행중인 자가 진단이 초기화 됩니다. 메인화면으로 이동하시겠습니까?"
      primaryButtonText="이동하기"
      secondaryButtonText="취소"
      onPrimaryClick={handleExit}
      onSecondaryClick={() => setShowExitModal(false)}
    />
    </>
  );
}