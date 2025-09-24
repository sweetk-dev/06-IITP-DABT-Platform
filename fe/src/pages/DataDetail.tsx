import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';

export function DataDetail() {
  const { id } = useParams<{ id: string }>();

  return (
    <Layout idPrefix="data-detail">
      {/* Header Section - Figma Design */}
      <div style={{
        width: '100%',
        marginBottom: '32px'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px', 
          marginBottom: '16px' 
        }}>
          <Link to="/data" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: '#f8f9fa',
              borderRadius: '8px',
              color: '#666',
              fontSize: '14px',
              fontWeight: 500,
              border: '1px solid #e9ecef',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}>
              ← 목록으로
            </div>
          </Link>
        </div>
        
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 700, 
          marginBottom: '8px',
          color: 'black'
        }}>
          장애인 생활체육 실행 유형
        </h1>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: '16px' 
        }}>
          <div style={{
            padding: '4px 12px',
            background: 'rgba(0, 144, 255, 0.1)',
            color: '#0090ff',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 600
          }}>
            기초
          </div>
          <div style={{
            padding: '4px 12px',
            background: 'rgba(0, 144, 255, 0.1)',
            color: '#0090ff',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 600
          }}>
            생활체육
          </div>
          <div style={{
            padding: '4px 12px',
            background: 'rgba(0, 144, 255, 0.1)',
            color: '#0090ff',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 600
          }}>
            신체적 자립
          </div>
        </div>
        
        <p style={{
          fontSize: '16px',
          color: '#666',
          lineHeight: '1.6',
          maxWidth: '800px',
          marginBottom: '24px'
        }}>
          장애인의 생활체육 참여 현황 및 실행 유형별 통계 데이터로, 신체적 자립을 위한 체육 활동 현황을 파악할 수 있습니다.
        </p>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: '#0090ff',
            color: 'white',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}>
            다운로드 ↗
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: 'white',
            color: '#0090ff',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            border: '2px solid #0090ff',
            transition: 'all 0.2s ease'
          }}>
            공유하기
          </div>
        </div>
      </div>

      {/* Main Content - Figma Design */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr', 
        gap: '32px' 
      }}>
        {/* Main Information */}
        <div>
          {/* Data Information Card */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #efefef'
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: 600, 
              marginBottom: '20px', 
              color: 'black' 
            }}>
              데이터 정보
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '16px', 
              marginBottom: '20px' 
            }}>
              <div>
                <label style={{ 
                  fontSize: '14px', 
                  color: '#666', 
                  marginBottom: '4px', 
                  display: 'block' 
                }}>
                  제공기관
                </label>
                <div style={{ 
                  fontSize: '16px', 
                  color: 'black', 
                  fontWeight: 500 
                }}>
                  한국장애인고용공단
                </div>
              </div>
              <div>
                <label style={{ 
                  fontSize: '14px', 
                  color: '#666', 
                  marginBottom: '4px', 
                  display: 'block' 
                }}>
                  최종수정일
                </label>
                <div style={{ 
                  fontSize: '16px', 
                  color: 'black', 
                  fontWeight: 500 
                }}>
                  2025.01.15
                </div>
              </div>
              <div>
                <label style={{ 
                  fontSize: '14px', 
                  color: '#666', 
                  marginBottom: '4px', 
                  display: 'block' 
                }}>
                  파일 크기
                </label>
                <div style={{ 
                  fontSize: '16px', 
                  color: 'black', 
                  fontWeight: 500 
                }}>
                  2.3MB
                </div>
              </div>
              <div>
                <label style={{ 
                  fontSize: '14px', 
                  color: '#666', 
                  marginBottom: '4px', 
                  display: 'block' 
                }}>
                  파일 형식
                </label>
                <div style={{ 
                  fontSize: '16px', 
                  color: 'black', 
                  fontWeight: 500 
                }}>
                  CSV, JSON
                </div>
              </div>
            </div>
          </div>

          {/* Data Preview */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #efefef'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 600, 
              marginBottom: '16px', 
              color: 'black' 
            }}>
              데이터 미리보기
            </h3>
            <div style={{ 
              background: '#f8f9fa', 
              padding: '16px', 
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '14px',
              color: '#666',
              overflow: 'auto'
            }}>
              <div>장애유형,생활체육참여율,실행유형,참여빈도,만족도</div>
              <div>지체장애,85.2%,개인운동,주3회,4.2</div>
              <div>시각장애,78.9%,단체운동,주2회,4.0</div>
              <div>청각장애,82.1%,개인운동,주4회,4.3</div>
              <div>...</div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Download Stats */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #efefef',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: 600, 
              marginBottom: '16px', 
              color: 'black' 
            }}>
              다운로드 현황
            </h3>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: 700, 
              color: '#0090ff', 
              marginBottom: '8px' 
            }}>
              156
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: '#666' 
            }}>
              총 다운로드 수
            </div>
          </div>

          {/* Related Data */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #efefef'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: 600, 
              marginBottom: '16px', 
              color: 'black' 
            }}>
              관련 데이터
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { id: '2', title: '일상생활 도와주는 사람 1순위', tags: ['기초', '일상지원'] },
                { id: '3', title: '서울시 지하철역 엘리베이터 위치정보', tags: ['이동권', '접근성'] },
                { id: '4', title: '장애인 고용 현황 통계', tags: ['고용', '통계'] }
              ].map((item) => (
                <Link key={item.id} to={`/data/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{
                    padding: '12px',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: 500, 
                      marginBottom: '4px', 
                      color: 'black' 
                    }}>
                      {item.title}
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {item.tags.map((tag, idx) => (
                        <div key={idx} style={{
                          padding: '2px 8px',
                          background: 'rgba(0, 144, 255, 0.1)',
                          color: '#0090ff',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 500
                        }}>
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}