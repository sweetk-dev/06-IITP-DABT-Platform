import { Link } from 'react-router-dom';
import { SelfCheckLayout } from '../../components/self-check/SelfCheckLayout';

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
      title: '활동보조사(주/야간) 지원 사업\n신청',
      description: '일상생활 지원을 위한 활동보조사 서비스'
    },
    {
      category: '정서적 자립을 위한',
      title: '장애인 심리상담 서비스\n이용',
      description: '정서적 안정과 자립 의지 향상을 위한 상담'
    },
    {
      category: '경제적 자립을 위한',
      title: '장애인 고용 지원 프로그램\n참여',
      description: '직업 재활 및 고용 기회 제공'
    }
  ];

  return (
    <>
      <SelfCheckLayout 
        idPrefix="self-check-result" 
        showBackButton={true}
        onBackClick={() => window.history.back()}
      >
        {/* Result Content - SelfCheckLayout 안에 배치 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '60px',
          width: '100%',
          maxWidth: '1400px',
          padding: '0 40px'
        }}>
          {/* Title */}
          <h1 style={{
            fontSize: '32px',
            fontFamily: 'Pretendard',
            fontWeight: 700,
            color: 'black',
            textAlign: 'center',
            margin: 0
          }}>
            자립 수준 자가진단 결과
          </h1>

          {/* Score Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '40px',
            width: '100%',
            maxWidth: '1200px'
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
              <div style={{
                fontSize: '18px',
                fontFamily: 'Pretendard',
                fontWeight: 600,
                color: 'black',
                marginBottom: '12px'
              }}>
                신체적 자립
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'center',
                gap: '4px'
              }}>
                <div style={{
                  fontSize: '32px',
                  fontFamily: 'Pretendard',
                  fontWeight: 700,
                  color: '#0090ff'
                }}>
                  {scores.physical}
                </div>
                <div style={{
                  fontSize: '16px',
                  fontFamily: 'Pretendard',
                  fontWeight: 500,
                  color: '#666'
                }}>
                  점
                </div>
              </div>
            </div>

            {/* Emotional Card */}
            <div style={{
              background: '#fffdee',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              border: '1px solid #fff6b4',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'url(/lightbulb.png) no-repeat center center / contain',
                margin: '0 auto 16px',
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
              }} />
              <div style={{
                fontSize: '18px',
                fontFamily: 'Pretendard',
                fontWeight: 600,
                color: 'black',
                marginBottom: '12px'
              }}>
                정서적 자립
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'center',
                gap: '4px'
              }}>
                <div style={{
                  fontSize: '32px',
                  fontFamily: 'Pretendard',
                  fontWeight: 700,
                  color: '#0090ff'
                }}>
                  {scores.emotional}
                </div>
                <div style={{
                  fontSize: '16px',
                  fontFamily: 'Pretendard',
                  fontWeight: 500,
                  color: '#666'
                }}>
                  점
                </div>
              </div>
            </div>

            {/* Economic Card */}
            <div style={{
              background: '#eefff2',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              border: '1px solid #d9f5df',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'url(/money.png) no-repeat center center / contain',
                margin: '0 auto 16px',
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
              }} />
              <div style={{
                fontSize: '18px',
                fontFamily: 'Pretendard',
                fontWeight: 600,
                color: 'black',
                marginBottom: '12px'
              }}>
                경제적 자립
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'center',
                gap: '4px'
              }}>
                <div style={{
                  fontSize: '32px',
                  fontFamily: 'Pretendard',
                  fontWeight: 700,
                  color: '#0090ff'
                }}>
                  {scores.economic}
                </div>
                <div style={{
                  fontSize: '16px',
                  fontFamily: 'Pretendard',
                  fontWeight: 500,
                  color: '#666'
                }}>
                  점
                </div>
              </div>
            </div>

            {/* Social Card */}
            <div style={{
              background: '#eef8ff',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              border: '1px solid #d0ecff',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'url(/contract.png) no-repeat center center / contain',
                margin: '0 auto 16px',
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
              }} />
              <div style={{
                fontSize: '18px',
                fontFamily: 'Pretendard',
                fontWeight: 600,
                color: 'black',
                marginBottom: '12px'
              }}>
                사회적 자립
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'center',
                gap: '4px'
              }}>
                <div style={{
                  fontSize: '32px',
                  fontFamily: 'Pretendard',
                  fontWeight: 700,
                  color: '#0090ff'
                }}>
                  {scores.social}
                </div>
                <div style={{
                  fontSize: '16px',
                  fontFamily: 'Pretendard',
                  fontWeight: 500,
                  color: '#666'
                }}>
                  점
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '20px',
            marginTop: '20px'
          }}>
            <Link to="/self-check/start" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '16px 32px',
                background: '#f8f9fa',
                color: '#0090ff',
                border: '1px solid #e9ecef',
                borderRadius: '12px',
                fontSize: '16px',
                fontFamily: 'Pretendard',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
                자가 진단 다시하기
              </button>
            </Link>
            <Link to="/self-check/more" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '16px 32px',
                background: '#0090ff',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontFamily: 'Pretendard',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
                더 많은 지원 정보 보기
              </button>
            </Link>
          </div>
        </div>
      </SelfCheckLayout>

      {/* "이런 정보를 확인해보세요" 섹션 - SelfCheckLayout 밖에 배치 */}
      <div style={{
        margin: '40px auto',
        width: '100%',
        maxWidth: '1200px',
        padding: '0 20px'
      }}>
        <h3 style={{
          fontSize: '24px',
          fontFamily: 'Pretendard',
          fontWeight: 700,
          color: 'black',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          이런 정보를 확인해보세요
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px'
        }}>
          {recommendations.map((rec, index) => (
            <div key={index} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              border: '1px solid #efefef',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
            }}
            >
              <div style={{
                flex: 1
              }}>
                <div style={{
                  fontSize: '14px',
                  fontFamily: 'Pretendard',
                  fontWeight: 500,
                  color: '#0090ff',
                  marginBottom: '8px'
                }}>
                  {rec.category}
                </div>
                <div style={{
                  fontSize: '16px',
                  fontFamily: 'Pretendard',
                  fontWeight: 600,
                  color: 'black',
                  lineHeight: '1.4',
                  whiteSpace: 'pre-line'
                }}>
                  {rec.title}
                </div>
              </div>
              <div style={{
                width: '32px',
                height: '32px',
                background: '#f8f9fa',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: '#0090ff',
                  borderRadius: '50%'
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* More Info Button */}
        <div style={{
          textAlign: 'center',
          marginTop: '40px'
        }}>
          <Link to="/self-check/more" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 32px',
              background: '#f8f9fa',
              color: '#0090ff',
              border: '1px solid #e9ecef',
              borderRadius: '12px',
              fontSize: '16px',
              fontFamily: 'Pretendard',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e9ecef';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f8f9fa';
            }}
            >
              <span>더 많은 지원 정보 보기</span>
              <img src="/right_arrow2.svg" alt=">" style={{ width: '16px', height: '16px' }} />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}