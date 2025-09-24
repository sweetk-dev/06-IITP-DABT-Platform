import { Link } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';

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
    <Layout idPrefix="self-check-result">
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
          color: 'black',
          fontSize: '16px',
          fontFamily: 'Pretendard',
          fontWeight: 500,
          lineHeight: '20.8px',
          wordWrap: 'break-word'
        }}>
          사이트 소개
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
          color: 'black',
          fontSize: '16px',
          fontFamily: 'Pretendard',
          fontWeight: 500,
          lineHeight: '20.8px',
          wordWrap: 'break-word'
        }}>
          자립 수준 자가진단
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
          결과보기
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        width: '100%',
        background: 'linear-gradient(180deg, #f0f8ff 0%, rgba(240, 248, 255, 0) 100%)',
        padding: '60px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: '16px',
        marginBottom: '60px'
      }}>
        {/* Result Title Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px',
          position: 'relative'
        }}>
          {/* Result Images */}
          <div style={{
            marginBottom: '32px',
            position: 'relative'
          }}>
            <div style={{
              width: '200px',
              height: '200px',
              background: 'url(/medal.png) no-repeat center center / contain',
              margin: '0 auto',
              position: 'relative'
            }} />
            <div style={{
              width: '100px',
              height: '100px',
              background: 'url(/medal2.png) no-repeat center center / contain',
              position: 'absolute',
              right: '20%',
              bottom: '0',
              transform: 'rotate(15deg)'
            }} />
          </div>
          
          <h2 style={{
            fontSize: '36px',
            fontFamily: 'Pretendard',
            fontWeight: 700,
            color: 'black',
            lineHeight: '1.3',
            marginBottom: '16px'
          }}>
            나의 자립 점수는?<br />
            <span style={{ color: '#0090ff' }}>신체적 자립</span>,<br />
            <span style={{ color: '#0090ff' }}>정서적 자립</span>이 조금 더<br />
            필요해요.
          </h2>
        </div>

        {/* Score Cards Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
          marginBottom: '60px',
          width: '100%',
          maxWidth: '1000px'
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
              background: 'url(/chat.png) no-repeat center center / contain',
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

        {/* Recommendations Section */}
        <div style={{
          width: '100%',
          maxWidth: '1000px'
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
                borderRadius: '12px',
                fontSize: '18px',
                fontFamily: 'Pretendard',
                fontWeight: '600',
                cursor: 'pointer',
                border: '1px solid #e0e0e0',
                transition: 'all 0.2s ease'
              }}>
                더 많은 지원 정보 보기
                <img src="/right_arrow.svg" alt="화살표" style={{ width: '16px', height: '16px' }} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}