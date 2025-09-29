import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from './App';
import { Layout } from '../components/layout/Layout';

export function Info() {
  return (
    <Layout idPrefix="info">
      {/* Hero Section Container */}
      <div id="info-hero-section-container" style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden'
      }}>
        {/* Hero Background Image */}
        <div id="info-hero-image" style={{
          width: '1920px',
          height: '100%',
          position: 'absolute',
          top: 0,
          right: '-51px',
          background: 'url(/info_back.png) center/cover no-repeat',
          zIndex: 2
        }} />
        
        {/* Hero Overlay */}
        <div id="info-hero-overlay" style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          background: 'linear-gradient(360deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 100%)',
          backdropFilter: 'blur(15px)',
          zIndex: 1
        }} />

        {/* Hero Section */}
        <div id="info-hero-section" style={{
          position: 'relative',
          width: '100%',
          zIndex: 2
        }}>
          <div id="info-hero-content" style={{
            display: 'inline',
            paddingTop: '60px',
            paddingBottom: '60px'
          }}>
            <div style={{
              margin: '0 auto',
              width: '1200px'
            }}>
              <div id="info-hero-left" style={{
                float: 'left'
              }}>
                {/* Main Title */}
                <div id="info-main-title" style={{
                  position: 'relative',
                  width: '511px',
                  color: 'black',
                  fontSize: '32px',
                  fontFamily: 'Pretendard',
                  fontWeight: 700,
                  wordWrap: 'break-word',
                  zIndex: 2
                }}>
                  장애인 자립 지원 허브란?
                </div>

                {/* Main Description */}
                <div id="info-main-description" style={{
                  position: 'relative',
                  width: '689px',
                  color: 'black',
                  fontSize: '16px',
                  fontFamily: 'Pretendard',
                  fontWeight: 400,
                  lineHeight: '24px',
                  wordWrap: 'break-word',
                  zIndex: 2,
                  marginTop: '24px'
                }}>
                  장애인 자립 지원 허브는 장애인의
                  신체적·경제적·사회적 자립을 지원하기 위한
                  특화 데이터 허브로서, 장애인의 삶을
                  통합적으로 이해하고 자립 단계별 현황을
                  분석할 수 있는 양질의 데이터를 제공합니다.
                  본 플랫폼은 공공·민간·학계 등 다양한
                  기관에서 수집된 데이터를 체계적으로
                  통합·시각화하여, 장애인 본인과 가족은 물론
                  복지기관, 연구자, 정책 담당자가 효과적으로
                  활용할 수 있도록 설계되었습니다.<br /><br />이를
                  통해 단순한 데이터 제공을 넘어, 자립
                  진단·맞춤형 서비스 추천·정책 지원 등
                  실질적인 가치 창출을 목표로 하며, 나아가
                  장애인의 주체적 선택과 사회적 참여를
                  뒷받침하는 '정서적 지지' 역할을 수행합니다.
                </div>
              </div>
              
              <div id="info-hero-right" style={{
                float: 'right'
              }}>
                {/* Hero Side Image */}
                <div id="info-hero-side-image" style={{
                  position: 'relative',
                  width: '486px',
                  height: '347px',
                  background: 'url(/info_main.png) center/cover no-repeat',
                  zIndex: 2
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* About Inner Section */}
        <div id="info-about-inner-section" style={{
          marginBottom: '60px',
          position: 'relative',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          display: 'flex',
          zIndex: 2,
          padding: '60px 0',
          width: '100%'
        }}>
          <div style={{
            margin: '0 auto',
            width: '1200px'
          }}>
            <div id="info-about-section-title" style={{
              color: 'black',
              fontSize: '28px',
              fontFamily: 'Pretendard',
              fontWeight: 600,
              wordWrap: 'break-word',
              marginBottom: '32px'
            }}>
              장애인 자립에 관하여
            </div>

            {/* Independence Definition */}
            <div id="info-independence-definition" style={{
              marginBottom: '50px'
            }}>
              <span style={{
                color: 'black',
                fontSize: '16px',
                fontFamily: 'Pretendard',
                fontWeight: 700,
                lineHeight: '24px',
                wordWrap: 'break-word'
              }}>
                자립(自立)
              </span>
              <span style={{
                color: 'black',
                fontSize: '16px',
                fontFamily: 'Pretendard',
                fontWeight: 400,
                lineHeight: '24px',
                wordWrap: 'break-word'
              }}>
                은 남에게 의존하지 않고 스스로 살아가는 것을
                의미하며, 경제적으로나 사회적으로 스스로의
                힘으로 생활하는 것을 포함합니다. 특히 장애인
                자립생활의 경우, 주체적인 선택과 결정을 통해
                삶을 통제하는 것이 강조됩니다. 장애인의 자립을
                위한 3가지 단계를 소개합니다.
              </span>
            </div>

            {/* Independence Stages - 퍼블리싱 CSS 정확히 적용 */}
            <div id="info-independence-stages" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '70px',
              marginBottom: '80px',
              marginLeft: '120px',
              position: 'relative',
              width: '85%'
            }}>
              {/* Stage 1 - 원형, 연한 파란색 */}
              <div id="info-stage-card-1" style={{
                width: '240px',
                height: '240px',
                borderRadius: '50%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                textAlign: 'center',
                padding: '20px',
                background: '#e5f4ff'
              }}>
                <div id="info-stage-title-1" style={{
                  fontSize: '18px',
                  fontFamily: 'Pretendard',
                  fontWeight: 700,
                  lineHeight: '27px',
                  wordWrap: 'break-word',
                  color: 'black'
                }}>
                  1단계 : 신체적 자립
                </div>
                <div id="info-stage-description-1" style={{
                  fontSize: '16px',
                  fontFamily: 'Pretendard',
                  fontWeight: 400,
                  lineHeight: '24px',
                  wordWrap: 'break-word',
                  color: 'black'
                }}>
                  신체적 장애를 일부 극복하고<br />
                  스스로의 힘으로 기본적인<br />
                  생활이 가능한 상태
                </div>
              </div>

              {/* Arrow 1 - 퍼블리싱 CSS 정확히 적용 */}
              <div id="info-stage-arrow-1" style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '87px',
                height: '2px',
                background: 'none',
                border: 'none',
                zIndex: 1,
                left: 'calc(240px + 40px)'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'repeating-linear-gradient(to right, rgba(0, 144, 255, 0.8) 0px, rgba(0, 144, 255, 0.8) 4px, transparent 4px, transparent 8px)',
                  transform: 'translateY(-50%)'
                }} />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  right: 0,
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid rgba(0, 144, 255, 0.8)',
                  borderTop: '4px solid transparent',
                  borderBottom: '4px solid transparent',
                  transform: 'translateY(-50%)'
                }} />
              </div>

              {/* Stage 2 - 원형, 중간 파란색 */}
              <div id="info-stage-card-2" style={{
                width: '240px',
                height: '240px',
                borderRadius: '50%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                textAlign: 'center',
                padding: '20px',
                background: '#b2deff'
              }}>
                <div id="info-stage-title-2" style={{
                  fontSize: '18px',
                  fontFamily: 'Pretendard',
                  fontWeight: 700,
                  lineHeight: '27px',
                  wordWrap: 'break-word',
                  color: 'black'
                }}>
                  2단계 : 경제적 자립
                </div>
                <div id="info-stage-description-2" style={{
                  fontSize: '16px',
                  fontFamily: 'Pretendard',
                  fontWeight: 400,
                  lineHeight: '24px',
                  wordWrap: 'break-word',
                  color: 'black'
                }}>
                  경제적 지원에 의존하지 않고<br />
                  직접 일하며 생계를 유지할 수<br />
                  있는 상태
                </div>
              </div>

              {/* Arrow 2 - 퍼블리싱 CSS 정확히 적용 */}
              <div id="info-stage-arrow-2" style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '87px',
                height: '2px',
                background: 'none',
                border: 'none',
                zIndex: 1,
                right: 'calc(245px + 35px)'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'repeating-linear-gradient(to right, rgba(0, 144, 255, 0.8) 0px, rgba(0, 144, 255, 0.8) 4px, transparent 4px, transparent 8px)',
                  transform: 'translateY(-50%)'
                }} />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  right: 0,
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid rgba(0, 144, 255, 0.8)',
                  borderTop: '4px solid transparent',
                  borderBottom: '4px solid transparent',
                  transform: 'translateY(-50%)'
                }} />
              </div>

              {/* Stage 3 - 원형, 진한 파란색, 흰 글자 */}
              <div id="info-stage-card-3" style={{
                width: '240px',
                height: '240px',
                borderRadius: '50%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                textAlign: 'center',
                padding: '20px',
                background: '#4db1ff',
                color: 'white'
              }}>
                <div id="info-stage-title-3" style={{
                  fontSize: '18px',
                  fontFamily: 'Pretendard',
                  fontWeight: 700,
                  lineHeight: '27px',
                  wordWrap: 'break-word',
                  color: 'white'
                }}>
                  3단계 : 사회적 자립
                </div>
                <div id="info-stage-description-3" style={{
                  fontSize: '16px',
                  fontFamily: 'Pretendard',
                  fontWeight: 400,
                  lineHeight: '24px',
                  wordWrap: 'break-word',
                  color: 'white'
                }}>
                  고립된 삶이 아닌 지역사회<br />
                  안에서 주체적으로 사회적<br />
                  역할을 수행하는 상태
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnosis Section - 퍼블리싱 CSS 정확히 적용 */}
      <div id="info-diagnosis-section" style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '80px',
        padding: '80px 40px',
        marginBottom: '100px',
        background: '#f0f8ff',
        borderRadius: '0',
        boxShadow: 'inset 0 -1px 0 rgba(0, 0, 0, 0.05)'
      }}>
        {/* Left Contract Images */}
        <div id="info-diagnosis-left-images" style={{
          flex: '0 0 200px',
          position: 'relative',
          width: '200px',
          height: '250px'
        }}>
          <div id="info-contract-image" style={{
            width: '191px',
            height: '191px',
            background: 'url(/contract.png) center/contain no-repeat',
            transform: 'rotate(14deg)',
            filter: 'drop-shadow(12px -1px 14px rgba(0, 0, 0, 0.3))'
          }} />
        </div>

        {/* Center Content */}
        <div id="info-diagnosis-content" style={{
          flex: '0 0 640px',
          textAlign: 'center'
        }}>
          <div id="info-diagnosis-info-title" style={{
            fontSize: '28px',
            fontWeight: 700,
            marginBottom: '20px',
            color: 'black'
          }}>
            자립 수준 자가 진단
          </div>
          <div id="info-diagnosis-info-description" style={{
            fontSize: '20px',
            lineHeight: '1.6',
            marginBottom: '40px',
            color: '#333'
          }}>
            간단한 자가 진단으로 자립 수준을 확인하고, 맞춤 정보를
            바로 만나보세요.
          </div>
          <Link to={ROUTE_PATHS.SELF_CHECK_START} style={{ textDecoration: 'none' }}>
            <button id="info-diagnosis-info-button" style={{
              minWidth: '320px',
              padding: '22px 36px',
              background: '#0090ff',
              border: 'none',
              borderRadius: '16px',
              color: 'white',
              fontSize: '22px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0px 4px 20px rgba(0, 144, 255, 0.4)',
              transition: 'all 0.2s ease'
            }}>
              자립 수준 자가진단
            </button>
          </Link>
        </div>

        {/* Right Folder and Search Images */}
        <div id="info-diagnosis-right-images" style={{
          flex: '0 0 200px',
          position: 'relative',
          width: '200px',
          height: '250px'
        }}>
          <div id="info-folder-image" style={{
            width: '177px',
            height: '213px',
            background: 'url(/folder.png) center/contain no-repeat',
            filter: 'drop-shadow(12px -1px 14px rgba(0, 0, 0, 0.3))'
          }} />
          <div id="info-search-icon2" style={{
            width: '152px',
            height: '151px',
            position: 'absolute',
            right: '-40px',
            bottom: '-30px',
            background: 'url(/search.png) center/cover no-repeat'
          }} />
        </div>
      </div>

      {/* Role Section - 퍼블리싱 CSS 정확히 적용 */}
      <div style={{
        margin: '0 auto',
        width: '1200px'
      }}>
        <div id="info-role-section" style={{
          marginBottom: '60px'
        }}>
          <div id="info-role-section-title" style={{
            color: 'black',
            fontSize: '28px',
            fontFamily: 'Pretendard',
            fontWeight: 600,
            wordWrap: 'break-word',
            marginBottom: '32px'
          }}>
            장애인 자립 지원 허브의 역할
          </div>

          {/* Role Cards - 퍼블리싱 CSS 정확히 적용 */}
          <div id="info-role-cards" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px'
          }}>
            {/* Role Card 1 */}
            <div id="info-role-card-1" style={{
              padding: '28px',
              background: '#f4f4f4',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <div id="info-role-category-1" style={{
                color: '#0086ed',
                fontSize: '18px',
                fontFamily: 'Pretendard',
                fontWeight: 600,
                lineHeight: '27px',
                wordWrap: 'break-word'
              }}>
                일반/사회적 기업
              </div>
              <div id="info-role-title-1" style={{
                color: 'black',
                fontSize: '24px',
                fontFamily: 'Pretendard',
                fontWeight: 700,
                lineHeight: '33.6px',
                wordWrap: 'break-word'
              }}>
                장애인 대상 제품 및 서비스<br />개발을
                지원합니다
              </div>
              <div id="info-role-description-1" style={{
                color: 'black',
                fontSize: '16px',
                fontFamily: 'Pretendard',
                fontWeight: 400,
                lineHeight: '24px',
                wordWrap: 'break-word'
              }}>
                자립 현황과 취약 영역을 데이터로 파악하여, 이를
                기반으로 장애인 맞춤형 제품과<br />서비스를
                기획·개발할 수 있도록 돕습니다.
              </div>
            </div>

            {/* Role Card 2 */}
            <div id="info-role-card-2" style={{
              padding: '28px',
              background: '#f4f4f4',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <div id="info-role-category-2" style={{
                color: '#0086ed',
                fontSize: '18px',
                fontFamily: 'Pretendard',
                fontWeight: 600,
                lineHeight: '27px',
                wordWrap: 'break-word'
              }}>
                공공기관
              </div>
              <div id="info-role-title-2" style={{
                color: 'black',
                fontSize: '24px',
                fontFamily: 'Pretendard',
                fontWeight: 700,
                lineHeight: '33.6px',
                wordWrap: 'break-word'
              }}>
                장애인 민원 및 복지 업무의<br />효율화를
                지원합니다
              </div>
              <div id="info-role-description-2" style={{
                color: 'black',
                fontSize: '16px',
                fontFamily: 'Pretendard',
                fontWeight: 400,
                lineHeight: '24px',
                wordWrap: 'break-word'
              }}>
                지역별 자립 현황을 분석해 정책 수립과 예산
                집행의 효율성을 높일 수 있도록 근거 데이터를
                제공합니다.
              </div>
            </div>

            {/* Role Card 3 */}
            <div id="info-role-card-3" style={{
              padding: '28px',
              background: '#f4f4f4',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <div id="info-role-category-3" style={{
                color: '#0086ed',
                fontSize: '18px',
                fontFamily: 'Pretendard',
                fontWeight: 600,
                lineHeight: '27px',
                wordWrap: 'break-word'
              }}>
                복지관/센터
              </div>
              <div id="info-role-title-3" style={{
                color: 'black',
                fontSize: '24px',
                fontFamily: 'Pretendard',
                fontWeight: 700,
                lineHeight: '33.6px',
                wordWrap: 'break-word'
              }}>
                현장 중심의 자립 실무를<br />지원합니다
              </div>
              <div id="info-role-description-3" style={{
                color: 'black',
                fontSize: '16px',
                fontFamily: 'Pretendard',
                fontWeight: 400,
                lineHeight: '24px',
                wordWrap: 'break-word'
              }}>
                지역사회에서 장애인을 직접 지원하는 복지관과
                센터가 현장의 요구를 반영한 프로그램을
                설계·운영할 수 있도록 데이터 기반 근거를
                제공합니다.
              </div>
            </div>

            {/* Role Card 4 */}
            <div id="info-role-card-4" style={{
              padding: '28px',
              background: '#f4f4f4',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <div id="info-role-category-4" style={{
                color: '#0086ed',
                fontSize: '18px',
                fontFamily: 'Pretendard',
                fontWeight: 600,
                lineHeight: '27px',
                wordWrap: 'break-word'
              }}>
                연구기관
              </div>
              <div id="info-role-title-4" style={{
                color: 'black',
                fontSize: '24px',
                fontFamily: 'Pretendard',
                fontWeight: 700,
                lineHeight: '33.6px',
                wordWrap: 'break-word'
              }}>
                자립 관련 연구와 평가를<br />지원합니다
              </div>
              <div id="info-role-description-4" style={{
                color: 'black',
                fontSize: '16px',
                fontFamily: 'Pretendard',
                fontWeight: 400,
                lineHeight: '24px',
                wordWrap: 'break-word'
              }}>
                자립 현황과 관련된 기초 데이터를 제공하여
                연구기관이 장애인 자립과 관련된 새로운 연구
                과제를 발굴할 수 있도록 돕습니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}