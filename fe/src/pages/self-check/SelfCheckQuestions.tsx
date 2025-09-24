import { Link } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';

export function SelfCheckQuestions() {
  // 현재 진행 상태 (예시)
  const currentArea = '신체적 자립';
  const currentQuestion = 1;
  const totalQuestionsInArea = 8;
  const areaProgress = '1/8';
  
  const question = "나의 건강유지에 관심이 있다.";
  const selectedValue = null; // 선택된 값

  return (
    <Layout idPrefix="self-check-questions">
      {/* Progress Steps */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '40px',
        gap: '8px'
      }}>
        {/* Step 1 - Completed */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#0090ff',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            ✓
          </div>
          <div style={{
            color: 'black',
            fontSize: '16px',
            fontFamily: 'Pretendard',
            fontWeight: 500
          }}>
            본인 확인
          </div>
        </div>

        {/* Separator */}
        <div style={{
          width: '40px',
          height: '2px',
          background: '#0090ff'
        }} />

        {/* Step 2 - Active */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#0090ff',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            1
          </div>
          <div style={{
            color: 'black',
            fontSize: '16px',
            fontFamily: 'Pretendard',
            fontWeight: 500
          }}>
            {currentArea}({areaProgress})
          </div>
        </div>

        {/* Separator */}
        <div style={{
          width: '40px',
          height: '2px',
          background: '#e0e0e0'
        }} />

        {/* Step 3 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#e0e0e0',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            2
          </div>
          <div style={{
            color: '#666',
            fontSize: '16px',
            fontFamily: 'Pretendard',
            fontWeight: 400
          }}>
            정서적 자립(0/7)
          </div>
        </div>

        {/* Separator */}
        <div style={{
          width: '40px',
          height: '2px',
          background: '#e0e0e0'
        }} />

        {/* Step 4 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#e0e0e0',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            3
          </div>
          <div style={{
            color: '#666',
            fontSize: '16px',
            fontFamily: 'Pretendard',
            fontWeight: 400
          }}>
            경제적 자립(0/8)
          </div>
        </div>

        {/* Separator */}
        <div style={{
          width: '40px',
          height: '2px',
          background: '#e0e0e0'
        }} />

        {/* Step 5 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#e0e0e0',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            4
          </div>
          <div style={{
            color: '#666',
            fontSize: '16px',
            fontFamily: 'Pretendard',
            fontWeight: 400
          }}>
            사회적 자립(0/8)
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        width: '100%',
        minHeight: '460px',
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #efefef'
      }}>
        {/* Category Title */}
        <div style={{
          fontSize: '24px',
          fontFamily: 'Pretendard',
          fontWeight: 700,
          color: 'black',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          {currentArea} 영역
        </div>

        {/* Question Section */}
        <div style={{
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '28px',
            fontFamily: 'Pretendard',
            fontWeight: 600,
            color: 'black',
            lineHeight: '1.4'
          }}>
            {currentQuestion}. {question}
          </div>
        </div>

        {/* Scale Section */}
        <div style={{
          marginBottom: '60px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              fontSize: '16px',
              fontFamily: 'Pretendard',
              fontWeight: 500,
              color: '#666'
            }}>
              전혀 아니다
            </div>
            
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: selectedValue === value ? '#0090ff' : '#f8f9fa',
                  border: selectedValue === value ? '2px solid #0090ff' : '2px solid #e0e0e0',
                  color: selectedValue === value ? 'white' : '#666',
                  fontSize: '18px',
                  fontFamily: 'Pretendard',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  if (selectedValue !== value) {
                    e.currentTarget.style.borderColor = '#0090ff';
                    e.currentTarget.style.background = '#e3f2fd';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedValue !== value) {
                    e.currentTarget.style.borderColor = '#e0e0e0';
                    e.currentTarget.style.background = '#f8f9fa';
                  }
                }}
              >
                {value}
              </button>
            ))}
            
            <div style={{
              fontSize: '16px',
              fontFamily: 'Pretendard',
              fontWeight: 500,
              color: '#666'
            }}>
              매우 그렇다
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: '#f8f9fa',
            color: '#666',
            borderRadius: '8px',
            fontSize: '16px',
            fontFamily: 'Pretendard',
            fontWeight: '500',
            cursor: 'pointer',
            border: '1px solid #e0e0e0',
            transition: 'all 0.2s ease'
          }}>
            <img src="/left_arrow2.svg" alt="이전" style={{ width: '16px', height: '16px' }} />
            <span>이전</span>
          </button>
          
          {/* 다음 버튼 - 현재는 임시로 결과 페이지로 이동 */}
          <Link to="/self-check/result" style={{ textDecoration: 'none' }}>
            <button 
              disabled={!selectedValue}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: selectedValue ? '#0090ff' : '#e0e0e0',
                color: selectedValue ? 'white' : '#999',
                borderRadius: '8px',
                fontSize: '16px',
                fontFamily: 'Pretendard',
                fontWeight: '500',
                cursor: selectedValue ? 'pointer' : 'not-allowed',
                border: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{currentQuestion === totalQuestionsInArea ? '다음 영역' : '다음'}</span>
              <img src="/right_arrow2.svg" alt="다음" style={{ width: '16px', height: '16px' }} />
            </button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}