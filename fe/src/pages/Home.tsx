import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Modal } from '../components/ui/Modal';
import { THEME_CONSTANTS, DATA_TYPE_CONSTANTS, type ThemeCode, type DataTypeCode } from '../../../packages/common/src/types';

export function Home() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const handleThemeClick = (theme: string) => {
    navigate(`/data-list?theme=${theme}`);
  };

  const handleDataTypeClick = (type: string) => {
    navigate(`/data-list?type=${type}`);
  };

  const handleViewAllThemes = () => {
    navigate('/data-search?type=theme');
  };

  const handleViewAllDataTypes = () => {
    navigate('/data-search?type=data_type');
  };


  const handleServiceClick = (service: string) => {
    if (service === '장애인 구인구직') {
      // 환경변수에서 URL 가져와서 새창 열기
      const employmentUrl = (import.meta as any).env?.VITE_EMPLOYMENT_SITE_URL || '#';
      window.open(employmentUrl, '_blank');
    } else {
      // 준비중 모달 표시 - 클릭한 서비스에 따라 다른 타이틀
      setModalContent({
        title: `${service}으로 이동`,
        description: '해당 서비스는 현재 준비 중입니다.\n빠른 시일 내에 서비스할 예정입니다.'
      });
      setIsModalOpen(true);
    }
  };

  const handleSearch = () => {
    navigate('/data-search');
  };

  return (
    <Layout idPrefix="home">
      {/* Body Area - Figma Design */}
      <div id="home-body-area" className="home-body-area">
        {/* About Section + Latest Data Section - 2열 구조 */}
        <div id="home-main-sections" className="home-main-sections">
          {/* About Section */}
          <div id="home-about-section" className="home-about-section">
            <div id="home-about-title" className="home-about-title">
              장애인의 자립에 관하여
            </div>

            <div id="home-about-description" className="home-about-description">
              장애인 자립 지원 허브와 장애인 자립<br />데이터에
              대해 소개합니다.
            </div>

            <Link 
              to="/info"
              id="home-about-detail-btn"
              className="home-about-link"
            >
              <div className="home-about-link-text">
                자세히 보기
              </div>
              <div className="icon-container">
                <div className="icon-container-inner" />
                <div 
                  className="icon-container-image"
                  style={{ backgroundImage: 'url(/right_arrow.svg)' }}
                />
              </div>
            </Link>

            <div 
              className="home-about-bg-image"
              style={{ background: 'url(/main_top.png) 50% / cover no-repeat' }}
            />
          </div>

          {/* Latest Data Section */}
          <div className="home-latest-data-section">
            <div className="home-latest-data-title">
              최신 데이터
            </div>
            <div className="home-latest-data-list">
              {[
                { category: '기초', title: '장애유형 및 산업별 장애인 근로자 고용현황' },
                { category: '이동권', title: '서울시 지하철역 엘리베이터 위치정보' },
                { category: '고용', title: '23패널 코드북 및 조사표' },
                { category: '기초', title: '운동 시 가장 도움이 되는 지원 사항' },
                { category: '기초', title: '장애인 생활체육 실행 유형' },
                { category: '고용', title: '한국장애인고용공단 신규고용장려금 지역별 지급 현황' }
              ].map((item, index) => (
                <div key={index} className="home-latest-data-item">
                  <div className="home-latest-data-item-content">
                    <div className="home-latest-data-category">
                      <div className="home-latest-data-category-text">
                        {item.category}
                      </div>
                    </div>
                    <div className="home-latest-data-title-text">
                      {item.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Theme Section */}
        <div id="home-theme-section" className="home-section">
          <div className="home-section-header">
            <div style={{ width: '633px', justifyContent: 'flex-start', alignItems: 'center', gap: '8px', display: 'flex' }}>
              <div id="home-theme-title" className="home-section-title">
                자립 테마별
              </div>
              <div className="icon-container">
                <div className="icon-container-inner" />
                <div 
                  className="icon-container-image"
                  style={{ backgroundImage: 'url(/question.svg)' }}
                />
              </div>
            </div>
            <div 
              id="home-theme-view-all-btn" 
              className="home-section-view-all"
              onClick={handleViewAllThemes}
            >
              <div id="home-theme-view-all-btn-text" className="home-section-view-all-text">
                전체보기
              </div>
              <div id="home-theme-view-all-btn-icon" className="icon-container">
                <div className="icon-container-inner" />
                <div 
                  className="icon-container-image"
                  style={{ backgroundImage: 'url(/right_arrow.svg)' }}
                />
              </div>
            </div>
          </div>
          <div className="home-theme-grid">
            {THEME_CONSTANTS.ALL_CODES.map((themeCode: ThemeCode) => {
              const themeInfo = THEME_CONSTANTS.THEMES[themeCode];
              
              // 각 테마별 스타일 설정 (피그마 디자인 보존)
              const themeStyles = {
                phy: {
                  background: '#ffeef2',
                  outline: '#ffdde5',
                  image: '/medal2.png',
                  count: '181',
                  imageStyle: { right: 0, bottom: '-20px', filter: 'drop-shadow(12px -1px 14px rgba(0, 0, 0, 0.3))' }
                },
                emo: {
                  background: '#fffdee',
                  outline: '#fff6b4',
                  image: '/lightbulb.png',
                  count: '2,311',
                  imageStyle: { right: 0, bottom: '-25px', transform: 'rotate(-8deg)', transformOrigin: 'top left', filter: 'drop-shadow(12px -1px 14px rgba(0, 0, 0, 0.3))' }
                },
                econ: {
                  background: '#eefff2',
                  outline: '#d9f5df',
                  image: '/money.png',
                  count: '31',
                  imageStyle: { right: 0, bottom: '-40px', transform: 'rotate(-19deg)', transformOrigin: 'top left', filter: 'drop-shadow(12px -1px 14px rgba(0, 0, 0, 0.3))' }
                },
                soc: {
                  background: '#eef8ff',
                  outline: '#d0ecff',
                  image: '/chat.png',
                  count: '75',
                  imageStyle: { right: 0, bottom: 0, filter: 'drop-shadow(12px -1px 14px rgba(0, 0, 0, 0.3))' }
                }
              };
              
              const style = themeStyles[themeCode];
              
              return (
                <div 
                  key={themeCode} 
                  id={`home-theme-card-${themeCode}`} 
                  className="home-theme-card"
                  style={{
                    background: style.background,
                    outline: `1px ${style.outline} solid`
                  }}
                  onClick={() => handleThemeClick(themeCode)}
                >
                  <div id={`home-theme-card-${themeCode}-title`} className="home-theme-card-title">
                    {themeInfo.name}
                  </div>
                  <div id={`home-theme-card-${themeCode}-count`} className="home-theme-card-count">
                    <div id={`home-theme-card-${themeCode}-count-number`} className="home-theme-card-count-number">
                      {style.count}
                    </div>
                    <div id={`home-theme-card-${themeCode}-count-unit`} className="home-theme-card-count-unit">
                      건
                    </div>
                  </div>
                  <div 
                    id={`home-theme-card-${themeCode}-image`} 
                    className="home-theme-card-image"
                    style={{
                      backgroundImage: `url(${style.image})`,
                      ...style.imageStyle
                    }} 
                  />
                  {/* 정서적 자립 카드에만 있는 특별한 overlay */}
                  {themeCode === 'emo' && (
                    <div 
                      id={`home-theme-card-${themeCode}-overlay`} 
                      style={{
                        width: '65px',
                        height: '65px',
                        left: '166px',
                        top: '24px',
                        position: 'absolute',
                        background: 'radial-gradient(ellipse 50% 50% at 50% 50%, white 0%, rgba(255, 255, 255, 0) 42%)',
                        borderRadius: '9999px'
                      }} 
                    />
                  )}
                </div>
              );
            })}

          </div>
        </div>

        {/* Data Type Section */}
        <div id="home-data-type-section" className="home-section">
          <div className="home-section-header">
            <div id="home-data-type-title" className="home-section-title">
              데이터 유형별
            </div>
            <div 
              id="home-data-type-view-all-btn" 
              className="home-section-view-all"
              onClick={handleViewAllDataTypes}
            >
              <div id="home-data-type-view-all-btn-text" className="home-section-view-all-text">
                전체보기
              </div>
              <div id="home-data-type-view-all-btn-icon" className="icon-container">
                <div className="icon-container-inner" />
                <div 
                  className="icon-container-image"
                  style={{ backgroundImage: 'url(/right_arrow.svg)' }}
                />
              </div>
            </div>
          </div>
          <div className="home-data-type-grid">
            {DATA_TYPE_CONSTANTS.ALL_CODES.map((dataTypeCode: DataTypeCode, index: number) => {
              const dataTypeInfo = DATA_TYPE_CONSTANTS.DATA_TYPES[dataTypeCode];
              const counts: { [key in DataTypeCode]: number } = { basic: 2790, poi: 312, emp: 56 };
              
              return (
                <div 
                  key={dataTypeCode} 
                  id={`home-data-type-card-${dataTypeCode}`} 
                  className="home-data-type-card"
                  onClick={() => handleDataTypeClick(dataTypeCode)}
                >
                  <div id={`home-data-type-card-${dataTypeCode}-content`} className="home-data-type-card-content">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                      <div id={`home-data-type-card-${dataTypeCode}-title`} className="home-data-type-card-title">
                        {dataTypeInfo.name}
                      </div>
                      <div id={`home-data-type-card-${dataTypeCode}-count`} className="card-stats">
                        <div id={`home-data-type-card-${dataTypeCode}-count-stat-item-1`} className="stat-item">
                          <div id={`home-data-type-card-${dataTypeCode}-count-number`} className="stat-number">
                            {counts[dataTypeCode].toLocaleString()}
                          </div>
                        </div>
                        <div id={`home-data-type-card-${dataTypeCode}-count-stat-item-2`} className="stat-item">
                          <div id={`home-data-type-card-${dataTypeCode}-count-unit`} className="stat-unit">
                            건
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id={`home-data-type-card-${dataTypeCode}-icon`} className="home-data-type-card-icon">
                    <div 
                      id={`home-data-type-card-${dataTypeCode}-icon-image`} 
                      className="home-data-type-card-icon-image"
                      style={{ backgroundImage: 'url(/right_up.svg)' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Self Check Section */}
        <div id="home-self-check-section" className="home-self-check-section">
          <div id="home-self-check-container" className="home-self-check-container">
            <div id="home-self-check-title" className="home-self-check-title">
              자립 수준 자가 진단
            </div>
            <div id="home-self-check-description" className="home-self-check-description">
              간단한 자가 진단으로 자립 수준을 확인하고, 맞춤
              정보를 바로 만나보세요.
            </div>
            <Link to="/self-check/start">
              <div id="home-self-check-btn" className="home-self-check-btn">
                <div id="home-self-check-btn-text" className="home-self-check-btn-text">
                  자가 진단 바로가기
                </div>
              </div>
            </Link>
            <div 
              id="home-self-check-image" 
              className="home-self-check-image"
              style={{ backgroundImage: 'url(/contract.png)' }}
            />
          </div>
        </div>

        {/* Services Section */}
        <div id="home-services-section" className="home-services-section">
          <div className="home-services-header">
            <div id="home-services-title" className="home-services-title">
              자립 지원 서비스
            </div>
          </div>
          <div className="home-services-grid">
            {[
              {
                title: '보행 약자 맵',
                description: '경사도, 계단, 엘리베이터 등 보행 환경\n정보를 표시해 안전한 길찾기를 돕는 지도\n서비스'
              },
              {
                title: '장애인 구인구직',
                description: '장애인 맞춤형 일자리 정보를 제공하고\n기업과\n구직자를 연결하는 취업 지원\n플랫폼'
              },
              {
                title: '무장애 관광 지도',
                description: '휠체어 접근 가능 시설과 편의시설 정보를\n담아\n누구나 즐길 수 있는 여행지를\n안내하는 지도 서비스'
              }
            ].map((service, index) => (
              <div 
                key={index} 
                id={`home-service-card-${index + 1}`} 
                className="home-service-card"
                onClick={() => handleServiceClick(service.title)}
              >
                <div id={`home-service-card-${index + 1}-content`} className="home-service-card-content">
                  <div id={`home-service-card-${index + 1}-image`} className="home-service-card-image">
                    <img 
                      src="/image-line.svg" 
                      alt="이미지 플레이스홀더"
                      className="home-service-card-image-placeholder"
                    />
                  </div>
                </div>
                <div id={`home-service-card-${index + 1}-text`} className="home-service-card-text">
                  <div id={`home-service-card-${index + 1}-title-container`} className="home-service-card-title-container">
                    <div id={`home-service-card-${index + 1}-title`} className="home-service-card-title">
                      {service.title}
                    </div>
                  </div>
                  <div id={`home-service-card-${index + 1}-description`} className="home-service-card-description">
                    {service.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalContent.title}
        description={modalContent.description}
        primaryButtonText="확인"
        onPrimaryClick={() => setIsModalOpen(false)}
      />
    </Layout>
  );
}