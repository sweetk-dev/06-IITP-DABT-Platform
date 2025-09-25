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
      <div id="home-body-area" style={{
        width: '100%',
        position: 'relative',
        display: 'inline-block'
      }}>
        {/* About Section + Latest Data Section - 2열 구조 */}
        <div id="home-main-sections" style={{
          width: '100%',
          display: 'flex',
          gap: '16px',
          marginTop: '60px'
        }}>
          {/* About Section */}
          <div id="home-about-section" style={{
            flex: '1',
            height: '380px',
            padding: '32px 40px',
            position: 'relative',
            background: '#d0ecff',
            borderRadius: '16px',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            display: 'flex'
          }}>
            <div id="home-about-title" style={{
              alignSelf: 'stretch',
              color: 'black',
              fontSize: '32px',
              fontFamily: 'Pretendard',
              fontWeight: 700,
              wordWrap: 'break-word'
            }}>
              장애인의 자립에 관하여
            </div>

            <div id="home-about-description" style={{
              alignSelf: 'stretch',
              color: 'black',
              fontSize: '20px',
              fontFamily: 'Pretendard',
              fontWeight: 400,
              lineHeight: '30px',
              wordWrap: 'break-word',
              padding: '16px 0'
            }}>
              장애인 자립 지원 허브와 장애인 자립<br />데이터에
              대해 소개합니다.
            </div>

            <Link 
              to="/info"
              id="home-about-detail-btn"
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '2px',
                display: 'inline-flex',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
            >
              <div style={{
                color: 'black',
                fontSize: '20px',
                fontFamily: 'Pretendard',
                fontWeight: 700,
                lineHeight: '26px',
                wordWrap: 'break-word'
              }}>
                자세히 보기
              </div>
              <div style={{
                width: '28px',
                height: '28px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  left: '0px',
                  top: '0px',
                  position: 'absolute'
                }} />
                <div style={{
                  width: '28px',
                  height: '28px',
                  backgroundImage: 'url(/right_arrow.svg)',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center'
                }} />
              </div>
            </Link>

            <div style={{
              width: '300px',
              height: '166px',
              flexShrink: 0,
              aspectRatio: '202/111',
              position: 'absolute',
              right: '20px',
              bottom: '20px',
              background: 'url(/main_top.png) 50% / cover no-repeat',
              zIndex: 1
            }} />
          </div>

          {/* Latest Data Section */}
          <div style={{
            flex: '1',
            height: '380px',
            padding: '28px',
            background: 'white',
            boxShadow: '0px 0px 100px rgba(0, 0, 0, 0.08)',
            borderRadius: '16px',
            outline: '1px #efefef solid',
            outlineOffset: '-1px',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            display: 'flex'
          }}>
            <div style={{
              color: 'black',
              fontSize: '24px',
              fontFamily: 'Pretendard',
              fontWeight: 600,
              wordWrap: 'break-word'
            }}>
              최신 데이터
            </div>
            <div style={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: '16px',
              display: 'flex',
              marginTop: '24px'
            }}>
              {[
                { category: '기초', title: '장애유형 및 산업별 장애인 근로자 고용현황' },
                { category: '이동권', title: '서울시 지하철역 엘리베이터 위치정보' },
                { category: '고용', title: '23패널 코드북 및 조사표' },
                { category: '기초', title: '운동 시 가장 도움이 되는 지원 사항' },
                { category: '기초', title: '장애인 생활체육 실행 유형' },
                { category: '고용', title: '한국장애인고용공단 신규고용장려금 지역별 지급 현황' }
              ].map((item, index) => (
                <div key={index} style={{
                  width: '100%',
                  height: '31px',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: '10px',
                  display: 'flex'
                }}>
                  <div style={{
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: '8px',
                    display: 'flex'
                  }}>
                    <div style={{
                      width: '62px',
                      paddingLeft: '8px',
                      paddingRight: '8px',
                      paddingTop: '5px',
                      paddingBottom: '5px',
                      background: 'rgba(0, 143.88, 255, 0.1)',
                      borderRadius: '8px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '10px',
                      display: 'flex'
                    }}>
                    <div style={{
                      color: '#0086ed',
                      fontSize: '15px',
                      fontFamily: 'Pretendard',
                      fontWeight: 700,
                      wordWrap: 'break-word'
                    }}>
                      {item.category}
                    </div>
                    </div>
                    <div style={{
                      color: 'black',
                      fontSize: '20px',
                      fontFamily: 'Pretendard',
                      fontWeight: 400,
                      wordWrap: 'break-word',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1
                    }}>
                      {item.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Theme Section */}
        <div id="home-theme-section" style={{
          width: '1200px',
          marginTop: '60px',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: '20px',
          display: 'inline-flex'
        }}>
          <div style={{
            alignSelf: 'stretch',
            justifyContent: 'space-between',
            alignItems: 'center',
            display: 'inline-flex'
          }}>
            <div style={{
              width: '633px',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '8px',
              display: 'flex'
            }}>
              <div id="home-theme-title" style={{
                color: 'black',
                fontSize: '28px',
                fontFamily: 'Pretendard',
                fontWeight: 600,
                wordWrap: 'break-word'
              }}>
                자립 테마별
              </div>
              <div style={{
                width: '28px',
                height: '28px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  left: '0px',
                  top: '0px',
                  position: 'absolute'
                }} />
                <div style={{
                  width: '28px',
                  height: '28px',
                  position: 'absolute',
                  backgroundImage: 'url(/question.svg)',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center'
                }} />
              </div>
            </div>
            <div id="home-theme-view-all-btn" style={{
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '2px',
              display: 'flex',
              cursor: 'pointer'
            }}
            onClick={handleViewAllThemes}
            >
              <div id="home-theme-view-all-btn-text" style={{
                color: 'black',
                fontSize: '20px',
                fontFamily: 'Pretendard',
                fontWeight: 600,
                lineHeight: '26px',
                wordWrap: 'break-word'
              }}>
                전체보기
              </div>
              <div id="home-theme-view-all-btn-icon" style={{
                width: '28px',
                height: '28px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  left: '0px',
                  top: '0px',
                  position: 'absolute'
                }} />
                <div style={{
                  width: '28px',
                  height: '28px',
                  backgroundImage: 'url(/right_arrow.svg)',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center'
                }} />
              </div>
            </div>
          </div>
          <div style={{
            alignSelf: 'stretch',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '16px',
            display: 'inline-flex',
            height: '160px'
          }}>
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
                <div key={themeCode} id={`home-theme-card-${themeCode}`} style={{
                  width: '288px',
                  height: '160px',
                  padding: '28px',
                  position: 'relative',
                  background: style.background,
                  overflow: 'hidden',
                  borderRadius: '16px',
                  outline: `1px ${style.outline} solid`,
                  outlineOffset: '-1px',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  display: 'inline-flex',
                  cursor: 'pointer'
                }}
                onClick={() => handleThemeClick(themeCode)}
                >
                  <div id={`home-theme-card-${themeCode}-title`} style={{
                    color: 'black',
                    fontSize: '24px',
                    fontFamily: 'Pretendard',
                    fontWeight: 500,
                    wordWrap: 'break-word'
                  }}>
                    {themeInfo.name}
                  </div>
                  <div id={`home-theme-card-${themeCode}-count`} style={{
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: '4px',
                    display: 'inline-flex'
                  }}>
                    <div id={`home-theme-card-${themeCode}-count-number`} style={{
                      color: '#0090ff',
                      fontSize: '32px',
                      fontFamily: 'Pretendard',
                      fontWeight: 700,
                      wordWrap: 'break-word'
                    }}>
                      {style.count}
                    </div>
                    <div id={`home-theme-card-${themeCode}-count-unit`} style={{
                      color: 'black',
                      fontSize: '24px',
                      fontFamily: 'Pretendard',
                      fontWeight: 500,
                      wordWrap: 'break-word'
                    }}>
                      건
                    </div>
                  </div>
                  <div id={`home-theme-card-${themeCode}-image`} style={{
                    width: '146px',
                    height: '146px',
                    position: 'absolute',
                    backgroundImage: `url(${style.image})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    ...style.imageStyle
                  }} />
                  {/* 정서적 자립 카드에만 있는 특별한 overlay */}
                  {themeCode === 'emo' && (
                    <div id={`home-theme-card-${themeCode}-overlay`} style={{
                      width: '65px',
                      height: '65px',
                      left: '166px',
                      top: '24px',
                      position: 'absolute',
                      background: 'radial-gradient(ellipse 50% 50% at 50% 50%, white 0%, rgba(255, 255, 255, 0) 42%)',
                      borderRadius: '9999px'
                    }} />
                  )}
                </div>
              );
            })}

          </div>
        </div>

        {/* Data Type Section */}
        <div id="home-data-type-section" style={{
          width: '1200px',
          marginTop: '60px',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: '20px',
          display: 'inline-flex'
        }}>
          <div style={{
            alignSelf: 'stretch',
            justifyContent: 'space-between',
            alignItems: 'center',
            display: 'inline-flex'
          }}>
            <div id="home-data-type-title" style={{
              color: 'black',
              fontSize: '28px',
              fontFamily: 'Pretendard',
              fontWeight: 600,
              wordWrap: 'break-word'
            }}>
              데이터 유형별
            </div>
            <div id="home-data-type-view-all-btn" style={{
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '2px',
              display: 'flex',
              cursor: 'pointer'
            }}
            onClick={handleViewAllDataTypes}
            >
              <div id="home-data-type-view-all-btn-text" style={{
                color: 'black',
                fontSize: '20px',
                fontFamily: 'Pretendard',
                fontWeight: 600,
                lineHeight: '26px',
                wordWrap: 'break-word'
              }}>
                전체보기
              </div>
              <div id="home-data-type-view-all-btn-icon" style={{
                width: '28px',
                height: '28px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  left: '0px',
                  top: '0px',
                  position: 'absolute'
                }} />
                <div style={{
                  width: '28px',
                  height: '28px',
                  backgroundImage: 'url(/right_arrow.svg)',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center'
                }} />
              </div>
            </div>
          </div>
          <div style={{
            alignSelf: 'stretch',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '16px',
            display: 'inline-flex',
            height: '160px'
          }}>
            {DATA_TYPE_CONSTANTS.ALL_CODES.map((dataTypeCode: DataTypeCode, index: number) => {
              const dataTypeInfo = DATA_TYPE_CONSTANTS.DATA_TYPES[dataTypeCode];
              const counts: { [key in DataTypeCode]: number } = { basic: 2790, poi: 312, emp: 56 };
              
              return (
                <div key={dataTypeCode} id={`home-data-type-card-${dataTypeCode}`} style={{
                  width: '389.33px',
                  height: '160px',
                  paddingTop: '28px',
                  paddingBottom: '28px',
                  paddingLeft: '40px',
                  paddingRight: '28px',
                  background: '#fafcfd',
                  overflow: 'hidden',
                  borderRadius: '16px',
                  outline: '1px #e3e3e3 solid',
                  outlineOffset: '-1px',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  display: 'flex',
                  cursor: 'pointer'
                }}
                onClick={() => handleDataTypeClick(dataTypeCode)}
                >
                  <div id={`home-data-type-card-${dataTypeCode}-content`} style={{
                    flex: '1',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    height: '100%',
                    display: 'flex'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                      <div id={`home-data-type-card-${dataTypeCode}-title`} style={{
                        color: 'black',
                        fontSize: '24px',
                        fontFamily: 'Pretendard',
                        fontWeight: 600,
                        wordWrap: 'break-word'
                      }}>
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
                  <div id={`home-data-type-card-${dataTypeCode}-icon`} style={{
                    width: '52px',
                    height: '52px',
                    background: 'white',
                    overflow: 'hidden',
                    borderRadius: '100px',
                    outline: '1px #d9d9d9 solid',
                    outlineOffset: '-1px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                    flexShrink: 0
                  }}>
                    <div id={`home-data-type-card-${dataTypeCode}-icon-image`} style={{
                      width: '32px',
                      height: '32px',
                      backgroundImage: 'url(/right_up.svg)',
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Self Check Section */}
        <div id="home-self-check-section" style={{
          width: '100vw',
          height: '289px',
          marginLeft: '50%',
          transform: 'translateX(-50%)',
          background: '#f0f8ff',
          marginTop: '60px'
        }}>
          <div id="home-self-check-container" style={{
            margin: '0 auto',
            width: '1200px',
            position: 'relative'
          }}>
            <div id="home-self-check-title" style={{
              paddingTop: '52px',
              color: 'black',
              fontSize: '28px',
              fontFamily: 'Pretendard',
              fontWeight: 600,
              wordWrap: 'break-word'
            }}>
              자립 수준 자가 진단
            </div>
            <div id="home-self-check-description" style={{
              color: 'black',
              fontSize: '20px',
              fontFamily: 'Pretendard',
              fontWeight: 400,
              lineHeight: '30px',
              wordWrap: 'break-word',
              marginTop: '12px'
            }}>
              간단한 자가 진단으로 자립 수준을 확인하고, 맞춤
              정보를 바로 만나보세요.
            </div>
            <Link to="/self-check/start">
              <div id="home-self-check-btn" style={{
                padding: '18px 28px',
                background: '#0090ff',
                borderRadius: '16px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                display: 'inline-flex',
                marginTop: '44px',
                cursor: 'pointer'
              }}>
                <div id="home-self-check-btn-text" style={{
                  textAlign: 'center',
                  color: 'white',
                  fontSize: '20px',
                  fontFamily: 'Pretendard',
                  fontWeight: 700,
                  wordWrap: 'break-word'
                }}>
                  자가 진단 바로가기
                </div>
              </div>
            </Link>
            <div id="home-self-check-image" style={{
              width: '191px',
              height: '191px',
              transform: 'rotate(15deg)',
              transformOrigin: 'top left',
              backgroundImage: 'url(/contract.png)',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              position: 'absolute',
              right: 0,
              bottom: 0,
              filter: 'drop-shadow(12px -1px 14px rgba(0, 0, 0, 0.3))'
            }} />
          </div>
        </div>

        {/* Services Section */}
        <div id="home-services-section" style={{
          width: '1200px',
          marginTop: '60px',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: '24px',
          display: 'inline-flex'
        }}>
          <div style={{
            alignSelf: 'stretch',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '20px',
            display: 'inline-flex'
          }}>
            <div id="home-services-title" style={{
              color: 'black',
              fontSize: '28px',
              fontFamily: 'Pretendard',
              fontWeight: 600,
              wordWrap: 'break-word'
            }}>
              자립 지원 서비스
            </div>
          </div>
          <div style={{
            alignSelf: 'stretch',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '24px',
            display: 'inline-flex'
          }}>
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
              <div key={index} id={`home-service-card-${index + 1}`} style={{
                flex: '1 1 0',
                background: 'white',
                boxShadow: '0px 4px 100px 8px rgba(0, 0, 0, 0.08)',
                overflow: 'hidden',
                borderRadius: '16px',
                outline: '1px #efefef solid',
                outlineOffset: '-1px',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                display: 'inline-flex',
                cursor: 'pointer'
              }}
              onClick={() => handleServiceClick(service.title)}
              >
                <div id={`home-service-card-${index + 1}-content`} style={{
                  position: 'relative',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  display: 'flex'
                }}>
                  <div id={`home-service-card-${index + 1}-image`} style={{
                    width: '384px',
                    height: '248px',
                    background: '#d9d9d9'
                  }} />
                  <div id={`home-service-card-${index + 1}-icon`} style={{
                    width: '24px',
                    height: '24px',
                    left: '180px',
                    top: '112px',
                    position: 'absolute',
                    overflow: 'hidden'
                  }}>
                    <div id={`home-service-card-${index + 1}-icon-image`} style={{
                      width: '20px',
                      height: '18.02px',
                      left: '2px',
                      top: '3px',
                      position: 'absolute',
                      background: '#03053d'
                    }} />
                  </div>
                </div>
                <div id={`home-service-card-${index + 1}-text`} style={{
                  alignSelf: 'stretch',
                  padding: '28px',
                  background: 'white',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  gap: '12px',
                  display: 'flex'
                }}>
                  <div id={`home-service-card-${index + 1}-title-container`} style={{
                    alignSelf: 'stretch',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    display: 'inline-flex'
                  }}>
                    <div id={`home-service-card-${index + 1}-title`} style={{
                      color: 'black',
                      fontSize: '24px',
                      fontFamily: 'Pretendard',
                      fontWeight: 600,
                      wordWrap: 'break-word'
                    }}>
                      {service.title}
                    </div>
                  </div>
                  <div id={`home-service-card-${index + 1}-description`} style={{
                    alignSelf: 'stretch',
                    color: 'black',
                    fontSize: '16px',
                    fontFamily: 'Pretendard',
                    fontWeight: 400,
                    lineHeight: '24px',
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-line'
                  }}>
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