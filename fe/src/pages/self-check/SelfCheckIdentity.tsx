import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '../App';
import { SelfCheckLayout, SelfCheckProgress, SelfCheckNavigation, SelfCheckContainer, SelfCheckRadioGroup } from '../../components/self-check';
import { Modal } from '../../components/ui/Modal';
import { IDENTITY_QUESTIONS, SELF_CHECK_CONSTANTS, getAreaName, type IdentityQuestionType, type IdentityResponse } from '@iitp-dabt-platform/common';

/**
 * 자가진단 본인 확인(4문항) 화면.
 *
 * [2026-10 반응형·접근성 개편] — 문항·선택지 값·저장 방식은 변경 없음
 *  - 선택지: 단순 버튼 → 라디오 그룹(SelfCheckRadioGroup, variant="choice"), 문항 제목(h1)과 연결
 *  - 280×77px 고정 버튼 + 60px 간격 → 데스크톱은 같은 크기(최소 폭 280px), 768px 이하에서는 전체 폭 세로 목록
 *  - 문항이 바뀌면 초점을 새 문항 제목으로 이동
 */
export function SelfCheckIdentity() {
  const navigate = useNavigate();
  const questionTitleRef = useRef<HTMLHeadingElement>(null);
  const hasNavigatedRef = useRef(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<Partial<IdentityResponse>>({});

  // 현재 질문 정보
  const currentQuestion = IDENTITY_QUESTIONS[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === IDENTITY_QUESTIONS.length - 1;

  // [2026-10 접근성] 문항 전환 시 새 문항 제목으로 초점 이동 (첫 진입 제외)
  useEffect(() => {
    if (!hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      return;
    }
    questionTitleRef.current?.focus();
  }, [currentQuestionIndex]);

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
          const areaName = getAreaName(key as any);
          const questionCount = SELF_CHECK_CONSTANTS.QUESTIONS_PER_AREA[key as keyof typeof SELF_CHECK_CONSTANTS.QUESTIONS_PER_AREA];
          acc[areaName] = `${areaName}(0/${questionCount})`;
          return acc;
        }, {} as { [key: string]: string })}
      />

      {/* Main Container */}
      <SelfCheckContainer 
        title={currentQuestion.question}
        titleId="self-check-identity-title"
        titleRef={questionTitleRef}
      >
        {/* Answer Options — 라디오 그룹 (기존: 280×77px 버튼 나열, 1400px 폭 고정 줄) */}
        <SelfCheckRadioGroup
          variant="choice"
          idPrefix={`self-check-identity-${currentQuestion.id}`}
          labelledBy="self-check-identity-title"
          value={userResponses[currentQuestion.id] as string | undefined}
          onChange={(value) => handleResponse(value)}
          options={currentQuestion.options.map((option) => ({ value: option.value as string, label: option.label }))}
        />
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