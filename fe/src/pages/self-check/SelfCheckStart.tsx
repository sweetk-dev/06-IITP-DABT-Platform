import { Link, useNavigate } from 'react-router-dom';
import { SelfCheckLayout, SelfCheckContainer } from '../../components/self-check';
import { SELF_CHECK_CONSTANTS, AREA_NAMES } from '../../../../packages/common/src/types';

export function SelfCheckStart() {
  // Constants에서 계산된 값들
  const totalQuestions = SELF_CHECK_CONSTANTS.TOTAL_QUESTIONS.SELF_CHECK;
  const totalTimeMinutes = Math.round((totalQuestions * SELF_CHECK_CONSTANTS.TIME_PER_QUESTION) / 60);
  const totalAreas = Object.keys(SELF_CHECK_CONSTANTS.QUESTIONS_PER_AREA).length;
  
  return (
    <SelfCheckLayout idPrefix="self-check-start" showBackButton={false}>
      {/* Main Content Area - SelfCheckContainer 사용 */}
      <SelfCheckContainer 
        title={
          <div style={{ textAlign: 'center' }}>
            자립 수준 자가 진단을 시작합니다.<br />
            자가 진단 문항은 총{' '}
            <span style={{ color: '#0090ff' }}>{totalQuestions}개</span>로, 약{' '}
            <span style={{ color: '#0090ff' }}>{totalTimeMinutes}분</span> 정도 소요됩니다.
          </div>
        }
        subtitle={
          <div style={{ textAlign: 'center' }}>
            테스트는 {Object.keys(SELF_CHECK_CONSTANTS.QUESTIONS_PER_AREA).length}개 영역으로 구성되어 있으며<br />
            각 문항에 대해 {SELF_CHECK_CONSTANTS.SCORE.MIN}(전혀 아니다) ~ {SELF_CHECK_CONSTANTS.SCORE.MAX}(매우 그렇다) 중<br />
            하나를 선택해 주세요.
          </div>
        }
      >
        {/* Start Button */}
        <Link to="/self-check/identity" style={{ textDecoration: 'none' }}>
          <button style={{
            width: '600px',
            minWidth: '400px',
            padding: '32px 48px',
            background: '#0090ff',
            boxShadow: '0px 1px 30px 8px rgba(0, 143.88, 255, 0.2)',
            borderRadius: '20px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            display: 'inline-flex',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            border: 'none',
            marginTop: '40px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#007acc';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0px 4px 40px 12px rgba(0, 143.88, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#0090ff';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0px 1px 30px 8px rgba(0, 143.88, 255, 0.2)';
          }}
          >
            <span style={{
              textAlign: 'center',
              color: 'white',
              fontSize: '24px',
              fontFamily: 'Pretendard',
              fontWeight: 600,
              wordWrap: 'break-word'
            }}>
              자가 진단 시작하기
            </span>
          </button>
        </Link>
      </SelfCheckContainer>
    </SelfCheckLayout>
  );
}