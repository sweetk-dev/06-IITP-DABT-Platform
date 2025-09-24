import { Link } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';

export function SelfCheckStart() {
  return (
    <Layout idPrefix="self-check-start">
      {/* Main Content Area - 퍼블리싱 파일과 정확히 일치 */}
      <div style={{
        width: '100%',
        minHeight: '750px',
        background: '#f0f8ff',
        borderRadius: '16px',
        padding: '60px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        {/* Title Section */}
        <div style={{
          maxWidth: '800px',
          marginBottom: '40px'
        }}>
          <h2 style={{
            color: 'black',
            fontSize: '32px',
            fontFamily: 'Pretendard',
            fontWeight: 700,
            lineHeight: '48px',
            marginBottom: '24px',
            wordWrap: 'break-word'
          }}>
            자립 수준 자가 진단을 시작합니다.<br />
            자가 진단 문항은 총{' '}
            <span style={{ color: '#0090ff' }}>31개</span>로, 약{' '}
            <span style={{ color: '#0090ff' }}>10분</span> 정도 소요됩니다.
          </h2>
          <p style={{
            color: 'black',
            fontSize: '20px',
            fontFamily: 'Pretendard',
            fontWeight: 400,
            lineHeight: '30px',
            wordWrap: 'break-word'
          }}>
            테스트는 4개 영역으로 구성되어 있으며<br />
            각 문항에 대해 1(전혀 아니다) ~ 5(매우 그렇다) 중<br />
            하나를 선택해 주세요.
          </p>
        </div>

        {/* Start Button */}
        <Link to="/self-check/questions" style={{ textDecoration: 'none' }}>
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
      </div>
    </Layout>
  );
}