import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '../App';
import { useEffect, useRef, useState } from 'react';
import { SelfCheckLayout, SelfCheckProgress, SelfCheckContainer, SelfCheckRadioGroup } from '../../components/self-check';
import { Modal } from '../../components/ui/Modal';
import { 
  SELF_CHECK_QUESTIONS, 
  SELF_CHECK_CONSTANTS, 
  getAreaName, 
  type SelfCheckAreaType,
  type SelfCheckResponse 
} from '@iitp-dabt-platform/common';

/**
 * 1~5 척도 선택지. 값 범위는 기존과 같이 SELF_CHECK_CONSTANTS.SCORE(MIN~MAX)에서 만든다.
 * 스크린리더 이름: 양끝은 "1 전혀 아니다" / "5 매우 그렇다", 가운데는 숫자만(척도 의미는 양끝 이름으로 전달).
 */
const SCALE_OPTIONS = Array.from(
  { length: SELF_CHECK_CONSTANTS.SCORE.MAX - SELF_CHECK_CONSTANTS.SCORE.MIN + 1 },
  (_, i) => i + SELF_CHECK_CONSTANTS.SCORE.MIN
).map((value) => ({
  value,
  label: String(value),
  ariaLabel:
    value === SELF_CHECK_CONSTANTS.SCORE.MIN ? `${value} 전혀 아니다`
    : value === SELF_CHECK_CONSTANTS.SCORE.MAX ? `${value} 매우 그렇다`
    : undefined
}));

/**
 * 자가진단 문항 화면.
 *
 * [2026-10 반응형·접근성 개편] — 문항·점수 산식·영역 구성 등 진단 로직은 변경 없음(화면 표현만 변경)
 *  - 1~5 선택지: 단순 버튼 → 라디오 그룹(SelfCheckRadioGroup). 이름 "1 전혀 아니다" … "5 매우 그렇다",
 *    화살표 키로 선택 이동, 문항 제목(h1)과 그룹 연결.
 *  - 레이아웃: 120px 동그라미 + 48px 간격 고정 → 데스크톱 100px, 휴대폰은 한 줄 5개(44px 이상)로 축소,
 *    "전혀 아니다/매우 그렇다" 는 좁은 화면에서 버튼 줄 위 양끝에 표시 (layout.css .sc-scale).
 *  - 문항이 바뀌면 초점을 새 문항 제목으로 옮겨 스크린리더가 새 문항을 읽게 함
 *    (기존: 초점이 "다음" 버튼에 남아 문항이 바뀐 것을 알 수 없었음).
 */
export function SelfCheckQuestions() {
  const navigate = useNavigate();
  // 문항 제목(h1) — 문항 전환 시 초점 이동 대상
  const questionTitleRef = useRef<HTMLHeadingElement>(null);
  // 첫 렌더에는 초점을 옮기지 않기 위한 표시 (화면 진입 직후 건너뛰기 링크 등 기본 초점 흐름 유지)
  const hasNavigatedRef = useRef(false);
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
    navigate(ROUTE_PATHS.HOME);
  };

  // 컴포넌트 마운트 시 사용자 정보 로드
  useEffect(() => {
    const savedUserInfo = localStorage.getItem('selfCheckUserInfo');
    if (savedUserInfo) {
      setUserInfo(JSON.parse(savedUserInfo));
    } else {
      navigate(ROUTE_PATHS.SELF_CHECK_IDENTITY);
    }
  }, [navigate]);

  // 현재 질문의 응답 로드
  useEffect(() => {
    const currentResponse = responses[currentQuestionId];
    setSelectedValue(currentResponse || null);
  }, [currentQuestionId, responses]);

  // [2026-10 접근성] 문항이 바뀌면 새 문항 제목으로 초점 이동 (첫 진입 시에는 이동하지 않음)
  useEffect(() => {
    if (!hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      return;
    }
    questionTitleRef.current?.focus();
  }, [currentQuestionId]);

  // 사용자 정보가 없으면 로딩 표시
  if (!userInfo) {
    return (
      <SelfCheckLayout 
        idPrefix="self-check-questions" 
        showBackButton={true}
        onBackClick={() => setShowExitModal(true)}
      >
        <div role="status" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '200px'
        }}>
          로딩 중...
        </div>
      </SelfCheckLayout>
    );
  }

  // 이전 버튼 처리
  const handlePrevious = () => {
    if (isFirstQuestion) {
      navigate(ROUTE_PATHS.SELF_CHECK_IDENTITY);
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
        navigate(ROUTE_PATHS.SELF_CHECK_RESULT);
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
      const areaName = getAreaName(area);
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

      {/* Main Container — 영역명 → 문항 제목(h1) → 1~5 척도 */}
      <SelfCheckContainer
        title={<>{currentQuestionIndex + 1}. {currentQuestion.question}</>}
        titleId="self-check-question-title"
        titleRef={questionTitleRef}
      >
        {/* Category Title — 문항 앞 영역 표시 (h1 보다 위에 보이도록 order 로 배치) */}
        <div className="sc-area-label" style={{ order: -1 }}>
          {getAreaName(currentArea)} 영역
        </div>

        {/* Scale Section — 라디오 그룹. 양끝 라벨은 시각용(aria-hidden), 이름은 각 선택지 aria-label 에 포함 */}
        <div className="sc-scale">
          <span className="sc-scale-label sc-scale-label--min" aria-hidden="true">전혀 아니다</span>
          <SelfCheckRadioGroup
            variant="scale"
            idPrefix={`self-check-${currentQuestionId}`}
            labelledBy="self-check-question-title"
            value={selectedValue}
            onChange={(value) => setSelectedValue(value)}
            options={SCALE_OPTIONS}
          />
          <span className="sc-scale-label sc-scale-label--max" aria-hidden="true">매우 그렇다</span>
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