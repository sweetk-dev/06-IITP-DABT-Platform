import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '../App';
import { SelfCheckLayout, SelfCheckContainer } from '../../components/self-check';
import { SELF_CHECK_CONSTANTS } from '@iitp-dabt-platform/common';

/**
 * 자가진단 시작 안내 화면.
 *
 * [2026-10 개편] — 안내 문구·문항 수 계산은 기존과 동일
 *  - 기존 <Link><button/></Link> (링크 안 버튼 중첩: 키보드 Tab 이 두 번 멈추고 스크린리더가 혼동)
 *    → 버튼 모양의 링크 하나(.cta-button.sc-start-button)
 *  - 600px 고정 폭(최소 400px) 버튼 → 최대 600px, 좁은 화면에서는 패널 폭에 맞춤
 *  - 강조 글자(#0090ff) → 대비 확보 토큰(.sc-highlight), h1 안의 div(문법 오류) → fragment
 */
export function SelfCheckStart() {
  // Constants에서 계산된 값들
  const totalQuestions = SELF_CHECK_CONSTANTS.TOTAL_QUESTIONS.SELF_CHECK;
  const totalTimeMinutes = Math.round((totalQuestions * SELF_CHECK_CONSTANTS.TIME_PER_QUESTION) / 60);
  
  return (
    <SelfCheckLayout idPrefix="self-check-start" showBackButton={false}>
      {/* Main Content Area - SelfCheckContainer 사용 */}
      <SelfCheckContainer 
        title={
          <>
            자립 수준 자가 진단을 시작합니다.<br />
            자가 진단 문항은 총{' '}
            <span className="sc-highlight">{totalQuestions}개</span>로, 약{' '}
            <span className="sc-highlight">{totalTimeMinutes}분</span> 정도 소요됩니다.
          </>
        }
        subtitle={
          <>
            테스트는 {Object.keys(SELF_CHECK_CONSTANTS.QUESTIONS_PER_AREA).length}개 영역으로 구성되어 있으며<br />
            각 문항에 대해 {SELF_CHECK_CONSTANTS.SCORE.MIN}(전혀 아니다) ~ {SELF_CHECK_CONSTANTS.SCORE.MAX}(매우 그렇다) 중<br />
            하나를 선택해 주세요.
          </>
        }
      >
        {/* Start Button — 버튼 모양 링크 */}
        <Link
          to={ROUTE_PATHS.SELF_CHECK_IDENTITY}
          id="self-check-start-button"
          className="cta-button sc-start-button"
        >
          자가 진단 시작하기
        </Link>
      </SelfCheckContainer>
    </SelfCheckLayout>
  );
}
