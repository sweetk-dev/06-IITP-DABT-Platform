import { Link } from 'react-router-dom';
import { ROUTE_PATHS, getDataSearchPath } from '../App';
import { Layout } from '../../components/layout/Layout';
import { SelfThemaCard, CardContent, CardTitle, CardSubtitle, CardIcon } from '../../components/ui/SelfThemaCard';
import { SELF_CHECK_CONSTANTS } from '@iitp-dabt-platform/common';

export function SelfCheckResult() {
  const scores = {
    physical: 45,
    emotional: 32,
    economic: 88,
    social: 73
  };

  const recommendations = [
    {
      category: '신체적 자립을 위한',
      title: '활동보조사(주/야간) 지원 사업 신청',
      description: '일상생활 지원을 위한 활동보조사 서비스',
      link: getDataSearchPath({ category: SELF_CHECK_CONSTANTS.POLICY_PRIORITY_ORDER[0] }) // phys
    },
    {
      category: '경제적 자립을 위한',
      title: '장애 수당 신청',
      description: '경제적 지원을 위한 장애 수당 신청',
      link: getDataSearchPath({ category: SELF_CHECK_CONSTANTS.POLICY_PRIORITY_ORDER[1] }) // econ
    },
    {
      category: '경제적 자립을 위한',
      title: '나에게 맞는 일자리 정보',
      description: '개인 맞춤형 취업 정보 제공',
      link: getDataSearchPath({ category: SELF_CHECK_CONSTANTS.POLICY_PRIORITY_ORDER[1] }) // econ
    }
  ];

  return (
    <Layout idPrefix="self-check-result" showBreadcrumb={true}>
      {/* Main Result Content */}
      <div style={{
        width: '100%',
        maxWidth: '1840px',
        margin: '0 auto',
        padding: '40px 0'
      }}>
        {/* Result Title Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          <h1 style={{
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
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '40px',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto 80px auto'
        }}>
          {/* Physical Card */}
          <div style={{
            background: '#ffeef2',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            border: '1px solid #ffdde5',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'url(/medal2.png) no-repeat center center / contain',
              margin: '0 auto 16px',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
            }} />
            <h3 style={{
              fontSize: '20px',
              fontFamily: 'Pretendard',
              fontWeight: 600,
              color: 'black',
              margin: '0 0 12px 0'
            }}>
              신체적 자립
            </h3>
            <div style={{
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
          <div style={{
            background: '#fffdee',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            border: '1px solid #fff3cd',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'url(/medal2.png) no-repeat center center / contain',
              margin: '0 auto 16px',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
            }} />
            <h3 style={{
              fontSize: '20px',
              fontFamily: 'Pretendard',
              fontWeight: 600,
              color: 'black',
              margin: '0 0 12px 0'
            }}>
              정서적 자립
            </h3>
            <div style={{
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
          <div style={{
            background: '#eefff2',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            border: '1px solid #c8e6c9',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'url(/medal2.png) no-repeat center center / contain',
              margin: '0 auto 16px',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
            }} />
            <h3 style={{
              fontSize: '20px',
              fontFamily: 'Pretendard',
              fontWeight: 600,
              color: 'black',
              margin: '0 0 12px 0'
            }}>
              경제적 자립
            </h3>
            <div style={{
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
          <div style={{
            background: '#eef8ff',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            border: '1px solid #bbdefb',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'url(/medal2.png) no-repeat center center / contain',
              margin: '0 auto 16px',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
            }} />
            <h3 style={{
              fontSize: '20px',
              fontFamily: 'Pretendard',
              fontWeight: 600,
              color: 'black',
              margin: '0 0 12px 0'
            }}>
              사회적 자립
            </h3>
            <div style={{
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
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '80px auto 0 auto',
        padding: '0'
      }}>
        <h3 style={{
          fontSize: '32px',
          fontFamily: 'Pretendard',
          fontWeight: 700,
          color: 'black',
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          이런 정보를 확인해보세요
        </h3>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: '24px',
          flexWrap: 'wrap',
          marginBottom: '60px',
          width: '1200px',
          margin: '0 auto'
        }}>
          {recommendations.map((rec, index) => (
            <Link key={index} to={rec.link} style={{ textDecoration: 'none' }}>
              <SelfThemaCard 
                variant="recommendation" 
                size="md"
                onClick={() => window.location.href = rec.link}
              >
                <CardContent style={{ flex: 1 }}>
                  <CardSubtitle>
                    {rec.category}
                  </CardSubtitle>
                  <CardTitle style={{ 
                    marginBottom: 0
                  }}>
                    {rec.title}
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
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          marginTop: '40px'
        }}>
          <Link to={ROUTE_PATHS.SELF_CHECK_START} style={{ textDecoration: 'none' }}>
            <button style={{
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
          <Link to={ROUTE_PATHS.SELF_CHECK_MORE} style={{ textDecoration: 'none' }}>
            <button style={{
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
          </Link>
        </div>

      </div>
    </Layout>
  );
}