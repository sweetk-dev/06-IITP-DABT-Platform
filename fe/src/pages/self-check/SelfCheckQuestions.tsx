import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SelfCheckLayout, SelfCheckProgress, SelfCheckContainer } from '../../components/self-check';
import { Modal } from '../../components/ui/Modal';
import { 
  SELF_CHECK_QUESTIONS, 
  SELF_CHECK_CONSTANTS, 
  AREA_NAMES, 
  type SelfCheckAreaType,
  type SelfCheckResponse 
} from '../../../../packages/common/src/types';

export function SelfCheckQuestions() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [currentAreaIndex, setCurrentAreaIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<SelfCheckResponse>({});
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);

  // 현재 영역과 질문 정보
  const areas: SelfCheckAreaType[] = ['phys', 'emo', 'econ', 'soc'];
  const currentArea = areas[currentAreaIndex];
  const currentAreaQuestions = SELF_CHECK_QUESTIONS[currentArea];
  const currentQuestion = currentAreaQuestions[currentQuestionIndex];
  const currentQuestionId = currentQuestion.id;
  
  const isFirstQuestion = currentAreaIndex === 0 && currentQuestionIndex === 0;
  const isLastQuestion = currentAreaIndex === areas.length - 1 && currentQuestionIndex === currentAreaQuestions.length - 1;
  const isLastQuestionInArea = currentQuestionIndex === currentAreaQuestions.length - 1;

  // 모달 핸들러
  const handleExit = () => {
    localStorage.removeItem('selfCheckUserInfo');
    localStorage.removeItem('selfCheckResponses');
    navigate('/');
  };

  // 컴포넌트 마운트 시 사용자 정보 로드
  useEffect(() => {
    const savedUserInfo = localStorage.getItem('selfCheckUserInfo');
    if (savedUserInfo) {
      setUserInfo(JSON.parse(savedUserInfo));
    } else {
      navigate('/self-check/identity');
    }
  }, [navigate]);

  // 현재 질문의 응답 로드
  useEffect(() => {
    const currentResponse = responses[currentQuestionId];
    setSelectedValue(currentResponse || null);
  }, [currentQuestionId, responses]);

  // 사용자 정보가 없으면 로딩 표시
  if (!userInfo) {
    return (
      <SelfCheckLayout 
        idPrefix="self-check-questions" 
        showBackButton={true}
        onBackClick={() => setShowExitModal(true)}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh' 
        }}>
          로딩 중...
        </div>
      </SelfCheckLayout>
    );
  }

  // 이전 버튼 처리
  const handlePrevious = () => {
    if (isFirstQuestion) {
      navigate('/self-check/identity');
    } else if (currentQuestionIndex === 0) {
      // 이전 영역의 마지막 질문으로 이동
      const prevAreaIndex = currentAreaIndex - 1;
      const prevArea = areas[prevAreaIndex];
      const prevAreaQuestions = SELF_CHECK_QUESTIONS[prevArea];
      setCurrentAreaIndex(prevAreaIndex);
      setCurrentQuestionIndex(prevAreaQuestions.length - 1);
    } else {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // 다음 버튼 처리
  const handleNext = () => {
    if (selectedValue !== null) {
      // 현재 응답 저장
      const newResponses = {
        ...responses,
        [currentQuestionId]: selectedValue
      };
      setResponses(newResponses);

      if (isLastQuestion) {
        // 모든 질문 완료 - 결과 페이지로 이동
        localStorage.setItem('selfCheckResponses', JSON.stringify(newResponses));
        navigate('/self-check/result');
      } else if (isLastQuestionInArea) {
        // 다음 영역의 첫 번째 질문으로 이동
        setCurrentAreaIndex(prev => prev + 1);
        setCurrentQuestionIndex(0);
      } else {
        // 같은 영역의 다음 질문으로 이동
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }
  };

  // 영역별 진행 상태 계산
  const getAreaProgress = () => {
    const progress: { [key: string]: string } = {};
    areas.forEach((area, index) => {
      const areaName = AREA_NAMES[area];
      const totalQuestions = SELF_CHECK_CONSTANTS.QUESTIONS_PER_AREA[area];
      
      if (index < currentAreaIndex) {
        // 완료된 영역
        progress[areaName] = `${areaName}(${totalQuestions}/${totalQuestions})`;
      } else if (index === currentAreaIndex) {
        // 현재 진행 중인 영역
        const currentProgress = currentQuestionIndex + (selectedValue !== null ? 1 : 0);
        progress[areaName] = `${areaName}(${currentProgress}/${totalQuestions})`;
      } else {
        // 아직 시작하지 않은 영역
        progress[areaName] = `${areaName}(0/${totalQuestions})`;
      }
    });
    return progress;
  };

  return (
    <>
      <SelfCheckLayout 
      idPrefix="self-check-questions" 
      showBackButton={true}
      onBackClick={() => setShowExitModal(true)}
      onPrevious={handlePrevious}
      onNext={handleNext}
      previousText="이전"
      nextText={isLastQuestion ? '결과보기' : isLastQuestionInArea ? '다음 영역' : '다음'}
      showPrevious={true}
      showNext={true}
      isNextDisabled={selectedValue === null}
    >
      {/* Progress Steps */}
      <SelfCheckProgress 
        currentStep={currentAreaIndex + 2} // 본인 확인(1) + 현재 영역 인덱스 + 1
        totalSteps={Object.keys(SELF_CHECK_CONSTANTS.QUESTIONS_PER_AREA).length + 1} // 본인 확인 + 영역 수
        stepNames={undefined} // 기본값 사용 (상수에서 동적 생성)
        areaProgress={getAreaProgress()}
      />

      {/* Main Container */}
      <SelfCheckContainer>
        {/* Category Title */}
        <div style={{
          textAlign: 'center',
          color: '#0090ff',
          fontSize: '20px',
          fontFamily: 'Pretendard',
          fontWeight: 700,
          marginBottom: '20px'
        }}>
          {AREA_NAMES[currentArea]} 영역
        </div>

        {/* Question Title */}
        <h1 style={{
          color: 'black',
          fontSize: '32px',
          fontFamily: 'Pretendard',
          fontWeight: 700,
          lineHeight: '48px',
          wordWrap: 'break-word',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          {currentQuestionIndex + 1}. {currentQuestion.question}
        </h1>

        {/* Scale Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          margin: '0 auto 40px auto',
          maxWidth: '1000px',
          width: '100%'
        }}>
          {/* Scale Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '48px'
          }}>
            {/* Left Label */}
            <div style={{
              color: 'black',
              fontSize: '24px',
              fontFamily: 'Pretendard',
              fontWeight: 500,
              textAlign: 'right',
              wordWrap: 'break-word',
              whiteSpace: 'nowrap'
            }}>
              전혀 아니다
            </div>
            
            {/* Scale Buttons */}
            {Array.from({ length: SELF_CHECK_CONSTANTS.SCORE.MAX - SELF_CHECK_CONSTANTS.SCORE.MIN + 1 }, (_, i) => i + SELF_CHECK_CONSTANTS.SCORE.MIN).map((value) => (
              <button
                key={value}
                onClick={() => setSelectedValue(value)}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: selectedValue === value ? 'var(--color-primary)' : 'var(--figma-white)',
                  color: selectedValue === value ? 'var(--figma-white)' : 'var(--color-text-primary)',
                  border: selectedValue === value ? '5px solid var(--color-primary)' : '5px solid #b2deff',
                  fontSize: '28px',
                  fontFamily: 'var(--font-family-primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: selectedValue === value 
                    ? '0 4px 12px rgba(0, 144, 255, 0.3)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  if (selectedValue !== value) {
                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                    e.currentTarget.style.background = '#f0f8ff';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedValue !== value) {
                    e.currentTarget.style.borderColor = '#b2deff';
                    e.currentTarget.style.background = 'var(--figma-white)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                  }
                }}
              >
                {value}
              </button>
            ))}
            
            {/* Right Label */}
            <div style={{
              color: 'black',
              fontSize: '24px',
              fontFamily: 'Pretendard',
              fontWeight: 500,
              wordWrap: 'break-word',
              whiteSpace: 'nowrap'
            }}>
              매우 그렇다
            </div>
          </div>
        </div>
      </SelfCheckContainer>

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