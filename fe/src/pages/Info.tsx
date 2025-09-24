import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';

export function Info() {
  return (
    <Layout idPrefix="info">
      {/* Breadcrumb Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '32px'
      }}>
        <div style={{
          color: 'black',
          fontSize: '16px',
          fontFamily: 'Pretendard',
          fontWeight: 500,
          lineHeight: '20.8px',
          wordWrap: 'break-word'
        }}>
          홈
        </div>
        <div style={{
          width: '24px',
          height: '24px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '7.78px',
            height: '12.73px',
            position: 'absolute',
            left: '8.22px',
            top: '-1.3px',
            color: '#666'
          }}>
            ›
          </div>
        </div>
        <div style={{
          color: '#0090ff',
          fontSize: '16px',
          fontFamily: 'Pretendard',
          fontWeight: 700,
          lineHeight: '20.8px',
          wordWrap: 'break-word'
        }}>
          사이트 소개
        </div>
      </div>

      {/* Hero Section with Background Image */}
      <div style={{
        width: '100%',
        position: 'relative',
        background: 'url(/info_back.png) no-repeat center center / cover',
        borderRadius: '16px',
        marginBottom: '60px',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{
          position: 'relative',
          zIndex: 2,
          width: '100%'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '40px'
          }}>
            {/* Hero Left Content */}
            <div style={{
              flex: 1,
              color: 'white',
              padding: '60px 0'
            }}>
              <div style={{
                fontSize: '48px',
                fontFamily: 'Pretendard',
                fontWeight: 700,
                lineHeight: '1.2',
                marginBottom: '32px',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
              }}>
                장애인 자립 지원 허브란?
              </div>
              <div style={{
                fontSize: '18px',
                fontFamily: 'Pretendard',
                fontWeight: 400,
                lineHeight: '1.6',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
              }}>
                장애인 자립 지원 허브는 장애인의<br />
                신체적·경제적·사회적 자립을 지원하기 위한<br />
                특화 데이터 허브로서, 장애인의 삶을<br />
                통합적으로 이해하고 자립 단계별 현황을<br />
                분석할 수 있는 양질의 데이터를 제공합니다.<br /><br />
                본 플랫폼은 공공·민간·학계 등 다양한<br />
                기관에서 수집된 데이터를 체계적으로<br />
                통합·시각화하여, 장애인 본인과 가족은 물론<br />
                복지기관, 연구자, 정책 담당자가 효과적으로<br />
                활용할 수 있도록 설계되었습니다.<br /><br />
                이를 통해 단순한 데이터 제공을 넘어, 자립<br />
                진단·맞춤형 서비스 추천·정책 지원 등<br />
                실질적인 가치 창출을 목표로 하며, 나아가<br />
                장애인의 주체적 선택과 사회적 참여를<br />
                뒷받침하는 '정서적 지지' 역할을 수행합니다.
              </div>
            </div>

            {/* Hero Right Image */}
            <div style={{
              flex: '0 0 300px',
              height: '400px',
              background: 'url(/info_main.png) no-repeat center center / contain',
              position: 'relative'
            }} />
          </div>
        </div>
      </div>

      {/* About Section */}
      <div style={{
        width: '100%',
        background: 'white',
        borderRadius: '16px',
        padding: '60px 40px',
        marginBottom: '60px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{
          fontSize: '32px',
          fontFamily: 'Pretendard',
          fontWeight: 700,
          color: 'black',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          장애인 자립에 관하여
        </div>

        {/* Independence Definition */}
        <div style={{
          fontSize: '18px',
          fontFamily: 'Pretendard',
          fontWeight: 400,
          lineHeight: '1.6',
          color: 'black',
          marginBottom: '48px',
          textAlign: 'center'
        }}>
          <span style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#0090ff'
          }}>
            자립(自立)
          </span>
          은 남에게 의존하지 않고 스스로 살아가는 것을
          의미하며, 경제적으로나 사회적으로 스스로의
          힘으로 생활하는 것을 포함합니다. 특히 장애인
          자립생활의 경우, 주체적인 선택과 결정을 통해
          삶을 통제하는 것이 강조됩니다. 장애인의 자립을
          위한 3가지 단계를 소개합니다.
        </div>

        {/* Independence Stages */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          {/* Stage 1 */}
          <div style={{
            background: '#ffeef2',
            borderRadius: '16px',
            padding: '32px 24px',
            textAlign: 'center',
            border: '1px solid #ffdde5',
            minWidth: '200px',
            flex: '1'
          }}>
            <div style={{
              fontSize: '20px',
              fontFamily: 'Pretendard',
              fontWeight: 700,
              color: 'black',
              marginBottom: '16px'
            }}>
              1단계 : 신체적 자립
            </div>
            <div style={{
              fontSize: '16px',
              fontFamily: 'Pretendard',
              fontWeight: 400,
              lineHeight: '1.5',
              color: 'black'
            }}>
              신체적 장애를 일부 극복하고<br />
              스스로의 힘으로 기본적인<br />
              생활이 가능한 상태
            </div>
          </div>

          {/* Arrow 1 */}
          <div style={{
            width: '40px',
            height: '2px',
            background: '#0090ff',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              right: '-8px',
              top: '-6px',
              width: '0',
              height: '0',
              borderLeft: '12px solid #0090ff',
              borderTop: '6px solid transparent',
              borderBottom: '6px solid transparent'
            }} />
          </div>

          {/* Stage 2 */}
          <div style={{
            background: '#fffdee',
            borderRadius: '16px',
            padding: '32px 24px',
            textAlign: 'center',
            border: '1px solid #fff6b4',
            minWidth: '200px',
            flex: '1'
          }}>
            <div style={{
              fontSize: '20px',
              fontFamily: 'Pretendard',
              fontWeight: 700,
              color: 'black',
              marginBottom: '16px'
            }}>
              2단계 : 경제적 자립
            </div>
            <div style={{
              fontSize: '16px',
              fontFamily: 'Pretendard',
              fontWeight: 400,
              lineHeight: '1.5',
              color: 'black'
            }}>
              경제적 지원에 의존하지 않고<br />
              직접 일하며 생계를 유지할 수<br />
              있는 상태
            </div>
          </div>

          {/* Arrow 2 */}
          <div style={{
            width: '40px',
            height: '2px',
            background: '#0090ff',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              right: '-8px',
              top: '-6px',
              width: '0',
              height: '0',
              borderLeft: '12px solid #0090ff',
              borderTop: '6px solid transparent',
              borderBottom: '6px solid transparent'
            }} />
          </div>

          {/* Stage 3 */}
          <div style={{
            background: '#eefff2',
            borderRadius: '16px',
            padding: '32px 24px',
            textAlign: 'center',
            border: '1px solid #d9f5df',
            minWidth: '200px',
            flex: '1'
          }}>
            <div style={{
              fontSize: '20px',
              fontFamily: 'Pretendard',
              fontWeight: 700,
              color: 'black',
              marginBottom: '16px'
            }}>
              3단계 : 사회적 자립
            </div>
            <div style={{
              fontSize: '16px',
              fontFamily: 'Pretendard',
              fontWeight: 400,
              lineHeight: '1.5',
              color: 'black'
            }}>
              고립된 삶이 아닌 지역사회<br />
              안에서 주체적으로 사회적<br />
              역할을 수행하는 상태
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        width: '100%',
        background: '#f8f9fa',
        padding: '60px 40px',
        borderRadius: '16px',
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <h2 style={{
          fontSize: '32px',
          fontFamily: 'Pretendard',
          fontWeight: 700,
          marginBottom: '20px',
          color: 'black'
        }}>
          지금 시작해보세요
        </h2>
        <p style={{
          fontSize: '18px',
          color: '#666',
          marginBottom: '40px',
          maxWidth: '600px',
          margin: '0 auto 40px'
        }}>
          간단한 자가진단을 통해 개인의 자립 수준을 확인하고, 
          맞춤형 정보와 서비스를 만나보세요.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/self-check/start" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'inline-block',
              padding: '16px 32px',
              background: '#0090ff',
              color: 'white',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: 600,
              textDecoration: 'none'
            }}>
              자가진단 시작하기
            </div>
          </Link>
          <Link to="/data" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'inline-block',
              padding: '16px 32px',
              background: 'white',
              color: '#0090ff',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: 600,
              textDecoration: 'none',
              border: '2px solid #0090ff'
            }}>
              데이터 둘러보기
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
}