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
        title="자립 수준 자가 진단을 시작합니다."
        subtitle={`자가 진단 문항은 총 ${totalQuestions}개로, 약 ${totalTimeMinutes}분 정도 소요됩니다.`}
      >

        {/* Start Button */}
        <Link to="/self-check/identity" style={{ textDecoration: 'none' }}>
          <button style={{
            width: '486px',
            minWidth: '280px',
            padding: '24px',
            background: '#0090ff',
            boxShadow: '0px 1px 30px 8px rgba(0, 143.88, 255, 0.2)',
            borderRadius: '16px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            display: 'inline-flex',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            border: 'none'
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