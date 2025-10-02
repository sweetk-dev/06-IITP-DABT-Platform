import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ROUTE_PATHS } from '../App';
import { Layout } from '../../components/layout/Layout';
import { SelfThemaCard, CardContent, CardTitle, CardSubtitle, CardIcon } from '../../components/ui/SelfThemaCard';
import { 
  SELF_CHECK_CONSTANTS, 
  SELF_CHECK_MORE_CONSTANTS,
  SELF_REL_TYPE_CONSTANTS,
  type SelfRelTypeCode,
  type SelfCheckResponse,
  type IdentityResponse,
  calculateAreaScore
} from '@iitp-dabt-platform/common';
import { useRecommendations } from '../../api/hooks';

export function SelfCheckResult() {
  const navigate = useNavigate();
  
  // localStorage에서 실제 데이터 가져오기
  const [identityInfo, setIdentityInfo] = useState<IdentityResponse | null>(null);
  const [responses, setResponses] = useState<SelfCheckResponse>({});
  const [scores, setScores] = useState({
    physical: 0,
    emotional: 0,
    economic: 0,
    social: 0
  });

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
      
      // 점수 계산 - SELF_CHECK_CONSTANTS.POLICY_PRIORITY_ORDER 사용
      const calculatedScores = {
        physical: 0,
        emotional: 0,
        economic: 0,
        social: 0
      };
      
      SELF_CHECK_CONSTANTS.POLICY_PRIORITY_ORDER.forEach((area) => {
        const score = Math.round(calculateAreaScore(parsedResponses, area));
        
        // area 코드를 scores 객체 키로 매핑
        if (area === 'phys') calculatedScores.physical = score;
        else if (area === 'emo') calculatedScores.emotional = score;
        else if (area === 'econ') calculatedScores.economic = score;
        else if (area === 'soc') calculatedScores.social = score;
      });
      
      setScores(calculatedScores);
    } else {
      // 자가진단을 하지 않았으면 시작 페이지로 리다이렉트
      navigate(ROUTE_PATHS.SELF_CHECK_START);
    }
  }, [navigate]);

  // 자가진단 결과를 기반으로 themes 파라미터 생성 (SelfRelTypeCode 사용)
  const getThemesFromScores = (): string => {
    const themes: SelfRelTypeCode[] = [];
    const THRESHOLD = SELF_CHECK_CONSTANTS.DEFICIENCY_THRESHOLD; // 미달 기준점 (70점)
    
    // ThemeCode가 아닌 SelfRelTypeCode 사용 ('phy' → 'phys')
    if (scores.physical < THRESHOLD) themes.push(SELF_REL_TYPE_CONSTANTS.SELF_REL_TYPES.phys.code);
    if (scores.emotional < THRESHOLD) themes.push(SELF_REL_TYPE_CONSTANTS.SELF_REL_TYPES.emo.code);
    if (scores.economic < THRESHOLD) themes.push(SELF_REL_TYPE_CONSTANTS.SELF_REL_TYPES.econ.code);
    if (scores.social < THRESHOLD) themes.push(SELF_REL_TYPE_CONSTANTS.SELF_REL_TYPES.soc.code);
    
    return themes.join(',');
  };

  // 미달 영역 정보 계산 (우선순위대로 정렬)
  const getUnderThresholdAreas = () => {
    const THRESHOLD = SELF_CHECK_CONSTANTS.DEFICIENCY_THRESHOLD; // 70점
    const underAreas: Array<{theme: SelfRelTypeCode, score: number}> = [];
    
    // SelfRelTypeCode 사용 ('phy' → 'phys')
    if (scores.physical < THRESHOLD) underAreas.push({ theme: 'phys', score: scores.physical });
    if (scores.economic < THRESHOLD) underAreas.push({ theme: 'econ', score: scores.economic });
    if (scores.emotional < THRESHOLD) underAreas.push({ theme: 'emo', score: scores.emotional });
    if (scores.social < THRESHOLD) underAreas.push({ theme: 'soc', score: scores.social });
    
    // 점수가 낮은 순으로 정렬
    return underAreas.sort((a, b) => a.score - b.score);
  };

  // 정책 추천 API 호출 파라미터 계산
  const getRecommendationParams = () => {
    const underAreas = getUnderThresholdAreas();
    const count = underAreas.length;
    let themesArray: string[] = [];
    
    // 장애정도 "모름"일 경우 basic 추가
    const isDisLevelUnknown = identityInfo?.disability_level === 'unknown';
    if (isDisLevelUnknown) {
      themesArray.push('basic');
    }
    
    if (count === 0) {
      // 모두 양호: basic만 또는 빈 themes
      return { 
        themes: themesArray.join(','), 
        limit: 3 
      };
    } else if (count === 1) {
      // Case4: 1개 미달 - 해당 영역 추가
      themesArray.push(underAreas[0].theme);
      return { themes: themesArray.join(','), limit: 3 };
    } else if (count === 2) {
      // Case3: 2개 미달 - 두 영역 추가
      themesArray.push(...underAreas.map(a => a.theme));
      return { 
        themes: themesArray.join(','), 
        limit: 3 
      };
    } else if (count === 3) {
      // Case2: 3개 미달 - 세 영역 추가
      themesArray.push(...underAreas.map(a => a.theme));
      return { 
        themes: themesArray.join(','), 
        limit: 3 
      };
    } else {
      // Case1: 4개 모두 미달 - 신체, 경제, 정서 추가 (우선순위 사용)
      themesArray.push(...SELF_CHECK_CONSTANTS.POLICY_PRIORITY_ORDER.slice(0, 3) as SelfRelTypeCode[]); // ['phys', 'econ', 'emo']
      return { 
        themes: themesArray.join(','), 
        limit: 3 
      };
    }
  };

  // Recommendations API 호출
  const recommendationParams = getRecommendationParams();
  const recommendationsState = useRecommendations(recommendationParams, true);

  // API 응답 데이터를 필터링하여 최종 표시할 정책 선택
  const getDisplayRecommendations = () => {
    const apiData = recommendationsState.data || [];
    if (apiData.length === 0) return [];

    const underAreas = getUnderThresholdAreas();
    const isDisLevelUnknown = identityInfo?.disability_level === 'unknown';
    
    // basic 정책 분리
    const basicPolicies = apiData.filter((p: any) => p.self_rlty_type === 'basic');
    const themePolicies = apiData.filter((p: any) => p.self_rlty_type !== 'basic');
    
    const result: any[] = [];
    
    // 장애정도 모름이면 basic 1개 먼저 추가
    if (isDisLevelUnknown && basicPolicies.length > 0) {
      result.push(basicPolicies[0]);
    }
    
    // 미달 영역에 따라 정책 선택
    const count = underAreas.length;
    
    if (count === 0) {
      // 모두 양호: basic만 표시하거나 일반 정책
      if (!isDisLevelUnknown && themePolicies.length > 0) {
        result.push(...themePolicies.slice(0, 3));
      }
    } else if (count === 1) {
      // Case4: 1개 미달 - 해당 테마 3개
      const theme = underAreas[0].theme;
      const filtered = themePolicies.filter((p: any) => p.self_rlty_type === theme);
      result.push(...filtered.slice(0, 3));
    } else if (count === 2) {
      // Case3: 2개 미달 - 낮은 점수 테마 2개 + 나머지 테마 1개
      const lowerTheme = underAreas[0].theme;
      const higherTheme = underAreas[1].theme;
      
      const lowerPolicies = themePolicies.filter((p: any) => p.self_rlty_type === lowerTheme);
      const higherPolicies = themePolicies.filter((p: any) => p.self_rlty_type === higherTheme);
      
      result.push(...lowerPolicies.slice(0, 2));
      result.push(...higherPolicies.slice(0, 1));
    } else if (count === 3) {
      // Case2: 3개 미달 - 각 1개씩
      for (const area of underAreas) {
        const filtered = themePolicies.filter((p: any) => p.self_rlty_type === area.theme);
        if (filtered.length > 0) {
          result.push(filtered[0]);
        }
      }
    } else {
      // Case1: 4개 모두 미달 - 신체, 경제, 정서 각 1개 (우선순위 사용)
      const priorities = SELF_CHECK_CONSTANTS.POLICY_PRIORITY_ORDER.slice(0, 3) as SelfRelTypeCode[]; // ['phys', 'econ', 'emo']
      for (const theme of priorities) {
        const filtered = themePolicies.filter((p: any) => p.self_rlty_type === theme);
        if (filtered.length > 0) {
          result.push(filtered[0]);
        }
      }
    }
    
    return result;
  };

  const recommendations = getDisplayRecommendations();

  // 추천 항목 클릭 핸들러
  const handleRecommendationClick = (recommendation: any) => {
    if (recommendation.link) {
      // API에서 받은 link가 있으면 새창으로 열기
      window.open(recommendation.link, '_blank', 'noopener,noreferrer');
    } else {
      // link가 없으면 SelfCheckMore 페이지로 이동 (기본 메뉴, 자가진단 결과 전달)
      const themes = getThemesFromScores();
      navigate(`${ROUTE_PATHS.SELF_CHECK_MORE}?menu=${SELF_CHECK_MORE_CONSTANTS.MENU_TYPES.policies.code}&themes=${themes}`);
    }
  };

  return (
    <Layout idPrefix="self-check-result" showBreadcrumb={true}>
      {/* Main Result Content */}
      <div id="self-check-result-main-container" style={{
        width: '100%',
        maxWidth: '1840px',
        margin: '0 auto',
        padding: '40px 0'
      }}>
        {/* Result Title Section */}
        <div id="self-check-result-title-section" style={{
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          <h1 id="self-check-result-main-title" style={{
            fontSize: '48px',
            fontFamily: 'Pretendard',
            fontWeight: 700,
            color: 'black',
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            나의 자립 점수는?<br />
            <span style={{ color: '#0090ff' }}>신체적 자립</span>,{' '}
            <span style={{ color: '#0090ff' }}>정서적 자립</span>이 조금 더 필요해요.
          </h1>
        </div>

        {/* Score Cards */}
        <div id="self-check-result-score-cards-container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '40px',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto 80px auto'
        }}>
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
              background: 'url(/medal2.png) no-repeat center center / contain',
              margin: '0 auto 16px',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
            }} />
            <h3 id="self-check-result-physical-title" style={{
              fontSize: '20px',
              fontFamily: 'Pretendard',
              fontWeight: 600,
              color: 'black',
              margin: '0 0 12px 0'
            }}>
              신체적 자립
            </h3>
            <div id="self-check-result-physical-score" style={{
              fontSize: '36px',
              fontFamily: 'Pretendard',
              fontWeight: 700,
              color: '#e91e63',
              margin: '0'
            }}>
              {scores.physical}점
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
              background: 'url(/medal2.png) no-repeat center center / contain',
              margin: '0 auto 16px',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
            }} />
            <h3 id="self-check-result-emotional-title" style={{
              fontSize: '20px',
              fontFamily: 'Pretendard',
              fontWeight: 600,
              color: 'black',
              margin: '0 0 12px 0'
            }}>
              정서적 자립
            </h3>
            <div id="self-check-result-emotional-score" style={{
              fontSize: '36px',
              fontFamily: 'Pretendard',
              fontWeight: 700,
              color: '#ff9800',
              margin: '0'
            }}>
              {scores.emotional}점
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
              background: 'url(/medal2.png) no-repeat center center / contain',
              margin: '0 auto 16px',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
            }} />
            <h3 id="self-check-result-economic-title" style={{
              fontSize: '20px',
              fontFamily: 'Pretendard',
              fontWeight: 600,
              color: 'black',
              margin: '0 0 12px 0'
            }}>
              경제적 자립
            </h3>
            <div id="self-check-result-economic-score" style={{
              fontSize: '36px',
              fontFamily: 'Pretendard',
              fontWeight: 700,
              color: '#4caf50',
              margin: '0'
            }}>
              {scores.economic}점
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
              background: 'url(/medal2.png) no-repeat center center / contain',
              margin: '0 auto 16px',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
            }} />
            <h3 id="self-check-result-social-title" style={{
              fontSize: '20px',
              fontFamily: 'Pretendard',
              fontWeight: 600,
              color: 'black',
              margin: '0 0 12px 0'
            }}>
              사회적 자립
            </h3>
            <div id="self-check-result-social-score" style={{
              fontSize: '36px',
              fontFamily: 'Pretendard',
              fontWeight: 700,
              color: '#2196f3',
              margin: '0'
            }}>
              {scores.social}점
            </div>
          </div>
        </div>

      </div>

      {/* Recommendations Section - SelfCheckLayout 밖에 배치 */}
      <div id="self-check-result-recommendations-section" style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '80px auto 0 auto',
        padding: '0'
      }}>
        <h3 id="self-check-result-recommendations-title" style={{
          fontSize: '32px',
          fontFamily: 'Pretendard',
          fontWeight: 700,
          color: 'black',
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          이런 정보를 확인해보세요
        </h3>
        
        <div id="self-check-result-recommendations-grid" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: '24px',
          flexWrap: 'wrap',
          marginBottom: '60px',
          width: '1200px',
          margin: '0 auto'
        }}>
          {recommendationsState.loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              로딩 중...
            </div>
          ) : recommendationsState.error ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#e91e63' }}>
              추천 정책을 불러오는 중 오류가 발생했습니다.
            </div>
          ) : recommendations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              추천 정책이 없습니다.
            </div>
          ) : (
            recommendations.map((rec, index) => (
              <div 
                key={rec.policy_id || index} 
                onClick={() => handleRecommendationClick(rec)}
                style={{ 
                  textDecoration: 'none', 
                  cursor: rec.link ? 'pointer' : 'default'
                }}
              >
                <SelfThemaCard 
                  variant="recommendation" 
                  size="md"
                >
                  <CardContent style={{ flex: 1 }}>
                    <CardSubtitle>
                      {rec.self_rlty_type 
                        ? `${SELF_REL_TYPE_CONSTANTS.SELF_REL_TYPES[rec.self_rlty_type as SelfRelTypeCode].name}을 위한`
                        : '정책'}
                    </CardSubtitle>
                    <CardTitle style={{ 
                      marginBottom: 0
                    }}>
                      {rec.policy_name || '정책명'}
                    </CardTitle>
                  </CardContent>
                  <CardIcon style={{ alignSelf: 'flex-end' }}>
                    <img 
                      src="/right_up.svg" 
                      alt="arrow" 
                      style={{
                        width: '20px',
                        height: '20px'
                      }} 
                    />
                  </CardIcon>
                </SelfThemaCard>
              </div>
            ))
          )}
        </div>

        {/* Action Buttons */}
        <div id="self-check-result-action-buttons" style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          marginTop: '40px'
        }}>
          <Link to={ROUTE_PATHS.SELF_CHECK_START} style={{ textDecoration: 'none' }}>
            <button id="self-check-result-restart-button" style={{
              width: '280px',
              height: '77px',
              minWidth: '280px',
              padding: '24px',
              fontSize: '18px',
              fontFamily: 'Pretendard',
              fontWeight: 600,
              color: 'black',
              background: '#FFFFFF',
              border: '1px solid #DADADA',
              borderRadius: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}>
              자가 진단 다시하기
            </button>
          </Link>
          <button 
            id="self-check-result-more-info-button" 
            onClick={() => {
              const themes = getThemesFromScores();
              navigate(`${ROUTE_PATHS.SELF_CHECK_MORE}?menu=${SELF_CHECK_MORE_CONSTANTS.MENU_TYPES.policies.code}&themes=${themes}`);
            }}
            style={{
              width: '280px',
              height: '77px',
              minWidth: '280px',
              padding: '24px',
              fontSize: '18px',
              fontFamily: 'Pretendard',
              fontWeight: 600,
              color: 'white',
              background: '#0090FF',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}>
              더 많은 지원 정보 보기
            </button>
        </div>

      </div>
    </Layout>
  );
}