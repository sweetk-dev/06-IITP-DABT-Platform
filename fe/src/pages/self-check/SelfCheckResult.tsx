import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ROUTE_PATHS } from '../App';
import { Layout } from '../../components/layout/Layout';
import { SelfThemaCard, CardContent, CardTitle, CardSubtitle, CardIcon } from '../../components/ui/SelfThemaCard';
import { 
  SELF_CHECK_CONSTANTS, 
  SELF_CHECK_MORE_CONSTANTS,
  SELF_RLTY_TYPE_CONSTANTS,
  DIS_LEVEL_CONSTANTS,
  type SelfRltyTypeCode,
  type SelfCheckResponse,
  type IdentityResponse,
  calculateAreaScore,
  getAreaName,
  type SelfCheckRecommendationsQuery,
  planRecommendations,
  pickRecommendedPolicies,
  identityFilterQuery
} from '@iitp-dabt-platform/common';
import { useRecommendations } from '../../api/hooks';
import { publicAsset } from '../../utils/publicAsset';

/*
 * [2026-10 반응형·접근성 개편] — 점수 계산·70점 기준·추천 케이스 로직·추천 API 호출은 변경 없음(화면 표현만 변경)
 *  - 점수 카드 4열 고정 → 1024px 이하 2열 (layout.css .sc-result-scores)
 *  - 추천 카드: div+onClick → 실제 링크(<a target="_blank"> 외부 정책 / <Link> 더보기 화면)
 *    384px 고정 카드·1200px 고정 줄 → 최대 384px, 좁은 화면 전체 폭
 *  - 하단 버튼: <Link><button/></Link> 중첩 → 버튼 모양 링크 / 버튼 하나씩
 *  - 강조 글자·점수 색: 배경 대비 3:1(큰 글자) 이상 되도록 진한 톤으로 조정
 *  - 제목 구조: h1(결과) → h2(영역별 점수, 추천 정보) → h3(각 영역)
 */
export function SelfCheckResult() {
  const navigate = useNavigate();
  
  // localStorage에서 실제 데이터 가져오기
  const [identityInfo, setIdentityInfo] = useState<IdentityResponse | null>(null);
  const [responses, setResponses] = useState<SelfCheckResponse>({});
  const [scores, setScores] = useState<Record<string, number>>({});

  // 컴포넌트 마운트 시 데이터 로드 및 점수 계산
  useEffect(() => {
    // 본인 확인 정보 로드
    const savedUserInfo = localStorage.getItem('selfCheckUserInfo');
    if (savedUserInfo) {
      const userInfo = JSON.parse(savedUserInfo) as IdentityResponse;
      setIdentityInfo(userInfo);
    }

    // 자가진단 응답 로드
    const savedResponses = localStorage.getItem('selfCheckResponses');
    if (savedResponses) {
      const parsedResponses = JSON.parse(savedResponses) as SelfCheckResponse;
      setResponses(parsedResponses);
      
      // 점수 계산 - SELF_RLTY_TYPE_CONSTANTS.SELF_REL_TYPES 사용
      const calculatedScores: Record<string, number> = {};
      
      SELF_CHECK_CONSTANTS.POLICY_PRIORITY_ORDER.forEach((area) => {
        const score = Math.round(calculateAreaScore(parsedResponses, area));
        calculatedScores[area] = score;
      });
      
      setScores(calculatedScores);
    } else {
      // 자가진단을 하지 않았으면 시작 페이지로 리다이렉트
      navigate(ROUTE_PATHS.SELF_CHECK_START);
    }
  }, [navigate]);

  // identityInfo와 scores가 모두 로드된 후 API 파라미터 설정
  useEffect(() => {
    if (identityInfo && Object.keys(scores).length > 0) {
      const params = getRecommendationParams(scores);
      setRecommendationParams(params);
    }
  }, [identityInfo, scores]);

  // 자가진단 결과를 기반으로 themes 파라미터 생성 (SelfRltyTypeCode 사용, basic 제외)
  const getThemesFromScores = (): string => {
    const themes: Exclude<SelfRltyTypeCode, 'basic'>[] = [];
    const THRESHOLD = SELF_CHECK_CONSTANTS.DEFICIENCY_THRESHOLD; // 미달 기준점 (70점)
    
    // SELF_CHECK_CONSTANTS.POLICY_PRIORITY_ORDER 사용 (basic 제외)
    SELF_CHECK_CONSTANTS.POLICY_PRIORITY_ORDER.forEach((area) => {
      const score = scores[area] || 0;
      if (score < THRESHOLD) {
        themes.push(area as Exclude<SelfRltyTypeCode, 'basic'>);
      }
    });
    
    return themes.join(',');
  };

  // 미달 영역 정보 계산 (우선순위대로 정렬)
  const getUnderThresholdAreas = (currentScores = scores) => {
    const THRESHOLD = SELF_CHECK_CONSTANTS.DEFICIENCY_THRESHOLD; // 70점
    const underAreas: Array<{theme: SelfRltyTypeCode, score: number}> = [];
    
    // SELF_CHECK_CONSTANTS.POLICY_PRIORITY_ORDER 사용
    SELF_CHECK_CONSTANTS.POLICY_PRIORITY_ORDER.forEach((area) => {
      const score = currentScores[area] || 0;
      if (score < THRESHOLD) {
        underAreas.push({ theme: area, score });
      }
    });
    
    // 점수가 낮은 순으로 정렬
    return underAreas.sort((a, b) => a.score - b.score);
  };

  // 정책 추천 API 호출 파라미터 계산
  const getRecommendationParams = (currentScores = scores) => {
    let themesArray: string[] = [];
    
    // 장애정도 "모름"일 경우 basic 추가
    const isDisLevelUnknown = identityInfo?.disability_level === DIS_LEVEL_CONSTANTS.DIS_LEVEL.unknown.code;
    
    if (isDisLevelUnknown) {
      themesArray.push('basic');
    }
    
    // 항상 모든 영역(4개) 조회 - 표시 로직은 common에서 처리
    themesArray.push(...SELF_CHECK_CONSTANTS.POLICY_PRIORITY_ORDER);
    
    // 본인 확인에서 받은 성별·장애정도·연령으로 대상이 아닌 정책을 거른다(v1.3.0, 모름은 조건 없음)
    const result: SelfCheckRecommendationsQuery = { 
      themes: themesArray.join(','), 
      limit: 3,
      ...identityFilterQuery(identityInfo)
    };
    
    return result;
  };

  // Recommendations API 호출 - scores가 계산된 후에만 호출
  const [recommendationParams, setRecommendationParams] = useState<SelfCheckRecommendationsQuery>({themes: '', limit: 3});
  const recommendationsState = useRecommendations(recommendationParams, !!recommendationParams.themes);

  // API 응답 데이터를 필터링하여 최종 표시할 정책 선택
  const getDisplayRecommendations = () => {
    const apiData = recommendationsState.data || [];
    
    if (apiData.length === 0) {

      return [];
    }

    // [v1.2.2] 기초(장애인 등록 안내, self_rlty_type=basic)는 추천 카드 목록에 넣지 않는다.
    //  추천 목록은 미달 유형의 콘텐츠만으로 구성한다(등록특허 청구항 6 "미달 유형에 대응되는 콘텐츠만").
    //  장애정도 '모름'일 때의 등록 안내는 결과 화면 위쪽의 별도 안내 상자(registrationNotice)로 보여 준다.
    const themePolicies = apiData.filter((p: any) => p.self_rlty_type !== 'basic');
     
    const result: any[] = [];
    
    // [v1.2.1] 케이스·노출 건수는 common planRecommendations 한 곳에서 정한다(등록특허 청구항 3~6).
    //  - Case 1(4개 미달): 우선순위(신체>경제>정서>사회) 상위 3개 유형 1건씩 — 이전에는 4개 유형을 점수 낮은 순으로 4건
    //  - Case 2(3개 미달): 우선순위 순 1건씩 — 이전에는 점수 낮은 순
    //  - Case 3·4: 이전과 같음(낮은 점수 유형 2건+1건 / 단일 유형 3건)
    //  화면 점수(반올림 정수 scores)로 판정해 제목 문구·점수 카드와 같은 기준을 쓴다.
    const plan = planRecommendations(scores as Record<string, number>);
    result.push(...pickRecommendedPolicies(themePolicies, plan));
    
    return result;
  };

  const recommendations = getDisplayRecommendations();

  // [v1.2.2] 장애정도 '모름' 안내 상자 — 표시 조건은 이전 등록 안내 카드와 같다(본인 확인에서 '모름' 선택).
  //  링크는 추천 API 가 주는 기초 정책(장애인등록/장애정도 심사제도)의 공식 안내 링크. 없으면 문구만 보여 준다.
  //  결과 화면을 보는 동안 계속 보이는 고정 안내이며(팝업·자동 사라짐 없음), 추천 카드 구성에는 영향이 없다.
  const isDisLevelUnknown = identityInfo?.disability_level === DIS_LEVEL_CONSTANTS.DIS_LEVEL.unknown.code;
  const registrationPolicy = isDisLevelUnknown
    ? (recommendationsState.data || []).find((p: any) => p.self_rlty_type === 'basic' && p.link)
    : undefined;

  // 미달인 테마 이름들을 가져오는 함수
  const getDeficientThemeNames = () => {
    const deficientThemes = getUnderThresholdAreas();
    return deficientThemes.map(area => getAreaName(area.theme as any));
  };

  // 더 많은 지원 정보(SelfCheckMore) 경로 — 정책 메뉴 + 미달 영역 전달 (기존 계산식 그대로)
  const getMorePath = () =>
    `${ROUTE_PATHS.SELF_CHECK_MORE}?menu=${SELF_CHECK_MORE_CONSTANTS.MENU_TYPES.policies.code}&themes=${getThemesFromScores()}`;

  /**
   * 추천 카드 하나 그리기.
   * [2026-10] 기존 div+onClick(window.open / navigate) → 실제 링크로 변경 (동작은 동일)
   *  - link 가 있으면: 외부 정책 페이지 새 창 <a target="_blank" rel="noopener noreferrer">
   *  - link 가 없으면: 자립 지원 정보(더보기) 화면 <Link>
   */
  const renderRecommendationCard = (rec: any, index: number) => {
    const card = (
      <SelfThemaCard variant="recommendation" size="md">
        <CardContent style={{ flex: 1 }}>
          <CardSubtitle>
            {rec.self_rlty_type 
              ? `${SELF_RLTY_TYPE_CONSTANTS.SELF_REL_TYPES[rec.self_rlty_type as SelfRltyTypeCode].name}을 위한`
              : '정책'}
          </CardSubtitle>
          <CardTitle style={{ marginBottom: 0 }}>
            {rec.policy_name || '정책명'}
          </CardTitle>
        </CardContent>
        <CardIcon style={{ alignSelf: 'flex-end' }}>
          {/* 화살표는 장식 (기존 alt="arrow") */}
          <img src={publicAsset('/right_up.svg')} alt="" style={{ width: '20px', height: '20px' }} />
        </CardIcon>
      </SelfThemaCard>
    );
    return (
      <li key={rec.policy_id || index} className="sc-result-rec-item">
        {rec.link ? (
          <a href={rec.link} target="_blank" rel="noopener noreferrer" className="sc-result-rec-link card-link">
            {card}
            <span className="sr-only">(새 창)</span>
          </a>
        ) : (
          <Link to={getMorePath()} className="sc-result-rec-link card-link">
            {card}
          </Link>
        )}
      </li>
    );
  };

  return (
    <Layout idPrefix="self-check-result" showBreadcrumb={true}>
      {/* Main Result Content */}
      <div id="self-check-result-main-container" style={{
        width: '100%',
        maxWidth: '1840px',
        margin: '0 auto',
        padding: '24px 0'
      }}>
        {/* Result Title Section */}
        <div id="self-check-result-title-section" style={{
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          <h1 id="self-check-result-main-title" className="sc-result-title">
            나의 자립 점수는?<br />
            {(() => {
              const deficientNames = getDeficientThemeNames();
              if (deficientNames.length === 0) {
                return <span className="sc-highlight">모든 영역이 충분해요!</span>;
              } else if (deficientNames.length === 1) {
                return <><span className="sc-highlight">{deficientNames[0]}</span>이 조금 더 필요해요.</>;
              } else if (deficientNames.length === 2) {
                return <><span className="sc-highlight">{deficientNames[0]}</span>, <span className="sc-highlight">{deficientNames[1]}</span>이 조금 더 필요해요.</>;
              } else if (deficientNames.length === 3) {
                return <><span className="sc-highlight">{deficientNames[0]}</span>, <span className="sc-highlight">{deficientNames[1]}</span>, <span className="sc-highlight">{deficientNames[2]}</span>이 조금 더 필요해요.</>;
              } else {
                return <><span className="sc-highlight">{deficientNames[0]}</span>, <span className="sc-highlight">{deficientNames[1]}</span>, <span className="sc-highlight">{deficientNames[2]}</span>, <span className="sc-highlight">{deficientNames[3]}</span>이 조금 더 필요해요.</>;
              }
            })()}
          </h1>
        </div>

        {/* Score Cards — 화면에는 제목이 없어 스크린리더용 h2 를 둔다 */}
        <h2 className="sr-only">영역별 자립 점수</h2>
        <div id="self-check-result-score-cards-container" className="sc-result-scores">
          {/* Physical Card */}
          <div id="self-check-result-physical-card" style={{
            background: '#ffeef2',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            border: '1px solid #ffdde5',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div id="self-check-result-physical-icon" style={{
              width: '80px',
              height: '80px',
              background: `url(${publicAsset('/medal2.png')}) no-repeat center center / contain`,
              margin: '0 auto 16px',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
            }} aria-hidden="true" />
            <h3 id="self-check-result-physical-title" style={{
              fontSize: '20px',
              fontFamily: 'var(--font-family-primary)',
              fontWeight: 600,
              color: 'black',
              margin: '0 0 12px 0'
            }}>
              신체적 자립
            </h3>
            <div id="self-check-result-physical-score" style={{
              fontSize: '36px',
              fontFamily: 'var(--font-family-primary)',
              fontWeight: 700,
              color: '#c2185b', /* [2026-10 접근성] #e91e63(3.9:1) → 진한 분홍(5.3:1) */
              margin: '0'
            }}>
              {scores.phys || 0}점
            </div>
          </div>

          {/* Emotional Card */}
          <div id="self-check-result-emotional-card" style={{
            background: '#fffdee',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            border: '1px solid #fff3cd',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div id="self-check-result-emotional-icon" style={{
              width: '80px',
              height: '80px',
              background: `url(${publicAsset('/medal2.png')}) no-repeat center center / contain`,
              margin: '0 auto 16px',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
            }} aria-hidden="true" />
            <h3 id="self-check-result-emotional-title" style={{
              fontSize: '20px',
              fontFamily: 'var(--font-family-primary)',
              fontWeight: 600,
              color: 'black',
              margin: '0 0 12px 0'
            }}>
              정서적 자립
            </h3>
            <div id="self-check-result-emotional-score" style={{
              fontSize: '36px',
              fontFamily: 'var(--font-family-primary)',
              fontWeight: 700,
              color: '#a35a00', /* [2026-10 접근성] #ff9800(2.1:1) → 같은 주황 계열 진한 톤(5.1:1) */
              margin: '0'
            }}>
              {scores.emo || 0}점
            </div>
          </div>

          {/* Economic Card */}
          <div id="self-check-result-economic-card" style={{
            background: '#eefff2',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            border: '1px solid #c8e6c9',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div id="self-check-result-economic-icon" style={{
              width: '80px',
              height: '80px',
              background: `url(${publicAsset('/medal2.png')}) no-repeat center center / contain`,
              margin: '0 auto 16px',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
            }} aria-hidden="true" />
            <h3 id="self-check-result-economic-title" style={{
              fontSize: '20px',
              fontFamily: 'var(--font-family-primary)',
              fontWeight: 600,
              color: 'black',
              margin: '0 0 12px 0'
            }}>
              경제적 자립
            </h3>
            <div id="self-check-result-economic-score" style={{
              fontSize: '36px',
              fontFamily: 'var(--font-family-primary)',
              fontWeight: 700,
              color: '#2e7d32', /* [2026-10 접근성] #4caf50(2.7:1) → 진한 초록(4.9:1) */
              margin: '0'
            }}>
              {scores.econ || 0}점
            </div>
          </div>

          {/* Social Card */}
          <div id="self-check-result-social-card" style={{
            background: '#eef8ff',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            border: '1px solid #bbdefb',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div id="self-check-result-social-icon" style={{
              width: '80px',
              height: '80px',
              background: `url(${publicAsset('/medal2.png')}) no-repeat center center / contain`,
              margin: '0 auto 16px',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
            }} aria-hidden="true" />
            <h3 id="self-check-result-social-title" style={{
              fontSize: '20px',
              fontFamily: 'var(--font-family-primary)',
              fontWeight: 600,
              color: 'black',
              margin: '0 0 12px 0'
            }}>
              사회적 자립
            </h3>
            <div id="self-check-result-social-score" style={{
              fontSize: '36px',
              fontFamily: 'var(--font-family-primary)',
              fontWeight: 700,
              color: '#1565c0', /* [2026-10 접근성] #2196f3(2.9:1) → 진한 파랑(5.3:1) */
              margin: '0'
            }}>
              {scores.soc || 0}점
            </div>
          </div>
        </div>

      </div>

      {/* [v1.2.2] 장애정도 '모름' 안내 상자 — 점수 카드와 추천 사이 */}
      {isDisLevelUnknown && (
        <aside id="self-check-result-registration-notice" className="sc-result-notice" aria-labelledby="self-check-result-registration-notice-title">
          <div className="sc-result-notice-text">
            <h2 id="self-check-result-registration-notice-title" className="sc-result-notice-title">
              장애 정도를 ‘모름’으로 답하셨어요.
            </h2>
            <p className="sc-result-notice-desc">
              장애인으로 등록하거나 장애 정도 심사를 받으면 아래 지원을 더 정확하게 안내받을 수 있어요.
            </p>
          </div>
          {registrationPolicy && (
            <a
              href={registrationPolicy.link}
              target="_blank"
              rel="noopener noreferrer"
              className="sc-result-notice-link"
            >
              장애인 등록 안내 보기
              <span className="sr-only">(새 창)</span>
            </a>
          )}
        </aside>
      )}

      {/* Recommendations Section - SelfCheckLayout 밖에 배치 */}
      <section id="self-check-result-recommendations-section" className="sc-result-recs" aria-labelledby="self-check-result-recommendations-title">
        <h2 id="self-check-result-recommendations-title" className="sc-result-recs-title">
          이런 정보를 확인해보세요
        </h2>
        
        <div id="self-check-result-recommendations-grid" className="sc-result-recs-grid">
          {recommendationsState.loading ? (
            <div role="status" style={{ textAlign: 'center', padding: '40px', color: '#595959' }}>
              로딩 중...
            </div>
          ) : recommendationsState.error ? (
            <div role="alert" style={{ textAlign: 'center', padding: '40px', color: '#c2185b' }}>
              추천 정책을 불러오는 중 오류가 발생했습니다.
            </div>
          ) : recommendations.length === 0 ? (
            // [v1.2.1] 추천 0건 — 모든 영역이 기준 이상이면 그 사실을, 아니면 후보 없음을 알린다
            <div className="sc-result-recs-empty">
              {getUnderThresholdAreas().length === 0
                ? <>모든 영역이 기준 점수({SELF_CHECK_CONSTANTS.DEFICIENCY_THRESHOLD}점) 이상이라 따로 추천할 정보가 없어요.<br />아래 ‘더 많은 지원 정보 보기’에서 다른 지원 정보를 확인할 수 있어요.</>
                : <>조건에 맞는 추천 정보를 찾지 못했어요.<br />아래 ‘더 많은 지원 정보 보기’에서 확인해 주세요.</>}
            </div>
          ) : (() => {
            // [v1.2.2] 추천 목록에는 미달 유형 정책만 있다(기초 등록 안내는 위 안내 상자로 이동)
            const themePolicies = recommendations;
            
            return (
              <>
                {/* 테마 정책들 표시 */}
                {/* [v1.2.1] data-count 로 건수별 배치(layout.css): 1~3건 한 줄, 4건 2×2, 5건 이상 3열 */}
                {themePolicies.length > 0 && (
                  <ul className="sc-result-rec-row" data-count={themePolicies.length}>
                    {themePolicies.map((rec, index) => renderRecommendationCard(rec, index))}
                  </ul>
                )}
              </>
            );
          })()}
        </div>

        {/* Action Buttons — 링크 안 버튼 중첩 제거 */}
        <div id="self-check-result-action-buttons" className="sc-result-actions">
          <Link
            to={ROUTE_PATHS.SELF_CHECK_START}
            id="self-check-result-restart-button"
            className="cta-button sc-result-action sc-result-action--secondary"
          >
            자가 진단 다시하기
          </Link>
          <button 
            type="button"
            id="self-check-result-more-info-button" 
            className="cta-button sc-result-action sc-result-action--primary"
            onClick={() => navigate(getMorePath())}
          >
            더 많은 지원 정보 보기
          </button>
        </div>

      </section>
    </Layout>
  );
}