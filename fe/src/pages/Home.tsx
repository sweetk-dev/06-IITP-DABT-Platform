import { Link } from 'react-router-dom';
import { getDataListPath, getDataDetailPath, ROUTE_PATHS } from './App';
import { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Modal } from '../components/ui/Modal';
import { THEME_CONSTANTS, DATA_TYPE_CONSTANTS, formatCount, type ThemeCode, type DataTypeCode, type DataLatestItem, type DataThemeCountsRes, type DataTypeCountsRes, DATA_LATEST_DEFAULTS } from '@iitp-dabt-platform/common';
import { useLatestData, useThemeCounts, useTypeCounts } from '../api/hooks';
import { publicAsset } from '../utils/publicAsset';
import { SITE_NAME } from '../hooks/useDocumentTitle';

/**
 * 홈 화면.
 *
 * [2026-10 반응형·접근성 개편 요약]
 *  - 클릭 가능한 div(onClick) → 실제 <Link>/<a>/<button> 으로 교체
 *    (최신 데이터 항목, 자립 테마 카드, 데이터 유형 카드, 전체보기, 자립 지원 서비스 카드)
 *    → Tab 으로 도달, Enter 로 실행, 스크린리더가 "링크/버튼"으로 읽음 (KWCAG 6.1.1 키보드 사용 보장)
 *  - 제목 구조: 화면에 보이지 않는 h1(사이트 이름) + 각 구역 제목 h2
 *  - 고정 폭(1200px, 288px, 389px, 384px 등)은 components.css 에서 그리드/최대 폭 방식으로 변경
 *  - 장식 이미지는 alt="" (스크린리더가 "이미지 플레이스홀더" 같은 무의미한 문구를 읽지 않게)
 */
export function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });
  
  // ============================================================================
  // API 데이터 조회 (common 패키지의 모든 타입 활용)
  // ============================================================================
  
  // 최신 데이터 조회
  const latestDataState = useLatestData({ limit: DATA_LATEST_DEFAULTS.LIMIT });
  
  // 테마별 데이터 건수 조회
  const themeCountsState = useThemeCounts();
  
  // 데이터 유형별 데이터 건수 조회
  const typeCountsState = useTypeCounts();

  // 자립 테마별 / 데이터 유형별 "전체보기" 이동 경로 (기존 navigate 핸들러 → Link to 로 변경)
  const viewAllThemesPath = `${ROUTE_PATHS.DATA_LIST}?category=theme`;
  const viewAllDataTypesPath = `${ROUTE_PATHS.DATA_LIST}?category=type`;

  // "장애인 구인구직" 외부 사이트 주소 (빌드 시 환경변수). 값이 없으면 기존처럼 준비중 모달로 처리
  const employmentUrl: string | undefined = import.meta.env.VITE_EMPLOYMENT_SITE_URL || undefined;

  // 준비 중인 서비스 카드(버튼) 클릭 → 준비중 모달 표시 (외부 링크 카드는 <a> 로 직접 이동하므로 여기 오지 않음)
  const handleServiceClick = (service: string) => {
    setModalContent({
      title: `${service}으로 이동`,
      description: '해당 서비스는 현재 준비 중입니다.\n빠른 시일 내에 서비스할 예정입니다.'
    });
    setIsModalOpen(true);
  };

  return (
    <Layout idPrefix="home">
      {/* 화면 제목(h1) — 디자인상 큰 제목이 없어 화면에는 숨기고 스크린리더에만 제공 */}
      <h1 className="sr-only">{SITE_NAME}</h1>

      {/* Body Area - Figma Design */}
      <div id="home-body-area" className="home-body-area">
        {/* About Section + Latest Data Section - 2열 구조 */}
        <div id="home-main-sections" className="home-main-sections">
          {/* About Section */}
          <section id="home-about-section" className="home-about-section" aria-labelledby="home-about-title">
            <h2 id="home-about-title" className="home-about-title">
              장애인의 자립에 관하여!
            </h2>

            <div id="home-about-description" className="home-about-description">
              장애인 자립 지원 허브와 장애인 자립<br />데이터에
              대해 소개합니다.
            </div>

            <Link 
              to={ROUTE_PATHS.INFO}
              id="home-about-detail-btn"
              className="home-about-link"
            >
              <span id="home-about-link-text" className="home-about-link-text">
                자세히 보기
              </span>
              <span className="sr-only">(사이트 소개)</span>
              <div id="home-about-link-icon-container" className="icon-container" aria-hidden="true">
                <div id="home-about-link-icon-inner" className="icon-container-inner" />
                <div 
                  id="home-about-link-icon-image"
                  className="icon-container-image"
                  style={{ backgroundImage: `url(${publicAsset('/right_arrow.svg')})` }}
                />
              </div>
            </Link>

            {/* 장식 일러스트 (글자 없음) — 배경 이미지라 스크린리더 대상 아님 */}
            <div 
              id="home-about-bg-image"
              className="home-about-bg-image"
              aria-hidden="true"
              style={{ background: `url(${publicAsset('/main_top.png')}) 50% / cover no-repeat` }}
            />
          </section>

          {/* Latest Data Section — 최근 갱신(최종 수정일) 순 6건. 각 항목은 상세 화면 링크 */}
          <section id="home-latest-data-section" className="home-latest-data-section" aria-labelledby="home-latest-data-title">
            <h2 id="home-latest-data-title" className="home-latest-data-title">
              최신 데이터
            </h2>
            {latestDataState.loading ? (
              <div className="home-latest-data-list" role="status" style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</div>
            ) : latestDataState.error ? (
              <div className="home-latest-data-list" role="alert" style={{ padding: '20px', textAlign: 'center', color: 'var(--color-danger)' }}>
                데이터를 불러오는 중 오류가 발생했습니다.
              </div>
            ) : latestDataState.data && latestDataState.data.length > 0 ? (
              <ul id="home-latest-data-list" className="home-latest-data-list">
                {latestDataState.data.map((item: DataLatestItem, index: number) => (
                  <li key={item.id} className="home-latest-data-li">
                    {/* 기존 div+onClick → Link: 키보드 Tab/Enter 로 이동 가능 */}
                    <Link
                      to={getDataDetailPath(String(item.id))}
                      id={`home-latest-data-item-${index + 1}`} 
                      className="home-latest-data-item card-link"
                    >
                      <span id={`home-latest-data-item-${index + 1}-content`} className="home-latest-data-item-content">
                        <span id={`home-latest-data-item-${index + 1}-category`} className="home-latest-data-category">
                          <span id={`home-latest-data-item-${index + 1}-category-text`} className="home-latest-data-category-text">
                            {DATA_TYPE_CONSTANTS.DATA_TYPES[item.data_type as DataTypeCode]?.shortName || item.data_type}
                          </span>
                        </span>
                        <span id={`home-latest-data-item-${index + 1}-title`} className="home-latest-data-title-text">
                          {item.title}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="home-latest-data-list" style={{ padding: '20px', textAlign: 'center' }}>데이터가 없습니다.</div>
            )}
          </section>
        </div>

        {/* Theme Section */}
        <section id="home-theme-section" className="home-section" aria-labelledby="home-theme-title">
          <div className="home-section-header">
            {/* 기존 고정 폭 633px 제거 — 좁은 화면에서 넘침 원인 */}
            <div id="home-theme-header-left" style={{ justifyContent: 'flex-start', alignItems: 'center', gap: '8px', display: 'flex', minWidth: 0 }}>
              <h2 id="home-theme-title" className="home-section-title">
                자립 테마별
              </h2>
              <div id="home-theme-title-icon-container" className="icon-container" aria-hidden="true">
                <div id="home-theme-title-icon-inner" className="icon-container-inner" />
                <div 
                  id="home-theme-title-icon-image"
                  className="icon-container-image"
                  style={{ backgroundImage: `url(${publicAsset('/question.svg')})` }}
                />
              </div>
            </div>
            {/* 기존 div+onClick → Link. 링크 문구가 "전체보기"뿐이라 숨김 텍스트로 대상 보충 */}
            <Link 
              to={viewAllThemesPath}
              id="home-theme-view-all-btn" 
              className="home-section-view-all card-link"
            >
              <span id="home-theme-view-all-btn-text" className="home-section-view-all-text">
                <span className="sr-only">자립 테마별 데이터 </span>전체보기
              </span>
              <div id="home-theme-view-all-btn-icon" className="icon-container" aria-hidden="true">
                <div className="icon-container-inner" />
                <div 
                  className="icon-container-image"
                  style={{ backgroundImage: `url(${publicAsset('/right_arrow.svg')})` }}
                />
              </div>
            </Link>
          </div>
          <ul className="home-theme-grid">
            {THEME_CONSTANTS.ALL_CODES.map((themeCode: ThemeCode) => {
              const themeInfo = THEME_CONSTANTS.THEMES[themeCode];
              
              // 각 테마별 스타일 설정 (피그마 디자인 보존)
              const themeStyles = {
                phys: {
                  background: '#ffeef2',
                  outline: '#ffdde5',
                  image: publicAsset('/medal2.png'),
                  imageStyle: { right: 0, bottom: '-20px', filter: 'drop-shadow(12px -1px 14px rgba(0, 0, 0, 0.3))' }
                },
                emo: {
                  background: '#fffdee',
                  outline: '#fff6b4',
                  image: publicAsset('/lightbulb.png'),
                  imageStyle: { right: 0, bottom: '-25px', transform: 'rotate(-8deg)', transformOrigin: 'top left', filter: 'drop-shadow(12px -1px 14px rgba(0, 0, 0, 0.3))' }
                },
                econ: {
                  background: '#eefff2',
                  outline: '#d9f5df',
                  image: publicAsset('/money.png'),
                  imageStyle: { right: 0, bottom: '-40px', transform: 'rotate(-19deg)', transformOrigin: 'top left', filter: 'drop-shadow(12px -1px 14px rgba(0, 0, 0, 0.3))' }
                },
                soc: {
                  background: '#eef8ff',
                  outline: '#d0ecff',
                  image: publicAsset('/chat.png'),
                  imageStyle: { right: 0, bottom: 0, filter: 'drop-shadow(12px -1px 14px rgba(0, 0, 0, 0.3))' }
                }
              };
              
              // 공통 유틸리티 함수 사용
              
              const style = themeStyles[themeCode];
              
              return (
                <li key={themeCode} className="home-grid-item">
                {/* 기존 div+onClick → Link (카드 전체가 하나의 링크). 테두리는 outline 대신 box-shadow 로 그려
                    키보드 초점 표시(outline)와 겹치지 않게 함 */}
                <Link 
                  to={getDataListPath({ theme: themeCode })}
                  id={`home-theme-card-${themeCode}`} 
                  className="home-theme-card card-link"
                  style={{
                    background: style.background,
                    boxShadow: `inset 0 0 0 1px ${style.outline}`
                  }}
                >
                  <span id={`home-theme-card-${themeCode}-title`} className="home-theme-card-title">
                    {themeInfo.name}
                  </span>
                  <span id={`home-theme-card-${themeCode}-count`} className="home-theme-card-count">
                    <span id={`home-theme-card-${themeCode}-count-number`} className="home-theme-card-count-number">
                      {themeCountsState.loading ? '...' : 
                       formatCount(themeCountsState.data?.[themeCode as keyof DataThemeCountsRes])}
                    </span>
                    <span id={`home-theme-card-${themeCode}-count-unit`} className="home-theme-card-count-unit">
                      건
                    </span>
                  </span>
                  <span 
                    id={`home-theme-card-${themeCode}-image`} 
                    className="home-theme-card-image"
                    aria-hidden="true"
                    style={{
                      backgroundImage: `url(${style.image})`,
                      ...style.imageStyle
                    }} 
                  />
                  {/* 정서적 자립 카드에만 있는 특별한 overlay */}
                  {themeCode === 'emo' && (
                    <span 
                      id={`home-theme-card-${themeCode}-overlay`} 
                      aria-hidden="true"
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
                </Link>
                </li>
              );
            })}

          </ul>
        </section>

        {/* Data Type Section */}
        <section id="home-data-type-section" className="home-section" aria-labelledby="home-data-type-title">
          <div className="home-section-header">
            <h2 id="home-data-type-title" className="home-section-title">
              데이터 유형별
            </h2>
            <Link 
              to={viewAllDataTypesPath}
              id="home-data-type-view-all-btn" 
              className="home-section-view-all card-link"
            >
              <span id="home-data-type-view-all-btn-text" className="home-section-view-all-text">
                <span className="sr-only">데이터 유형별 데이터 </span>전체보기
              </span>
              <div id="home-data-type-view-all-btn-icon" className="icon-container" aria-hidden="true">
                <div className="icon-container-inner" />
                <div 
                  className="icon-container-image"
                  style={{ backgroundImage: `url(${publicAsset('/right_arrow.svg')})` }}
                />
              </div>
            </Link>
          </div>
          <ul className="home-data-type-grid">
            {DATA_TYPE_CONSTANTS.ALL_CODES.map((dataTypeCode: DataTypeCode) => {
              const dataTypeInfo = DATA_TYPE_CONSTANTS.DATA_TYPES[dataTypeCode];
              
              // 공통 유틸리티 함수 사용
              
              return (
                <li key={dataTypeCode} className="home-grid-item">
                {/* 기존 div+onClick → Link (카드 전체가 하나의 링크) */}
                <Link 
                  to={getDataListPath({ type: dataTypeCode })}
                  id={`home-data-type-card-${dataTypeCode}`} 
                  className="home-data-type-card card-link"
                >
                  <span id={`home-data-type-card-${dataTypeCode}-content`} className="home-data-type-card-content">
                    <span style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                      <span id={`home-data-type-card-${dataTypeCode}-title`} className="home-data-type-card-title">
                        {dataTypeInfo.name}
                      </span>
                      <span id={`home-data-type-card-${dataTypeCode}-count`} className="card-stats">
                        <span id={`home-data-type-card-${dataTypeCode}-count-stat-item-1`} className="stat-item">
                        <span id={`home-data-type-card-${dataTypeCode}-count-number`} className="stat-number">
                          {typeCountsState.loading ? '...' : 
                           formatCount(typeCountsState.data?.[dataTypeCode as keyof DataTypeCountsRes])}
                        </span>
                        </span>
                        <span id={`home-data-type-card-${dataTypeCode}-count-stat-item-2`} className="stat-item">
                          <span id={`home-data-type-card-${dataTypeCode}-count-unit`} className="stat-unit">
                            건
                          </span>
                        </span>
                      </span>
                    </span>
                  </span>
                  <span id={`home-data-type-card-${dataTypeCode}-icon`} className="home-data-type-card-icon" aria-hidden="true">
                    <span 
                      id={`home-data-type-card-${dataTypeCode}-icon-image`} 
                      className="home-data-type-card-icon-image"
                      style={{ backgroundImage: `url(${publicAsset('/right_up.svg')})` }}
                    />
                  </span>
                </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Self Check Section */}
        <section id="home-self-check-section" className="home-self-check-section" aria-labelledby="home-self-check-title">
          <div id="home-self-check-container" className="home-self-check-container">
            <h2 id="home-self-check-title" className="home-self-check-title">
              자립 수준 자가 진단
            </h2>
            <div id="home-self-check-description" className="home-self-check-description">
              간단한 자가 진단으로 자립 수준을 확인하고, 맞춤
              정보를 바로 만나보세요.
            </div>
            {/* 링크 하나에 버튼 모양 스타일 (기존: Link 안에 div 중첩) */}
            <Link to={ROUTE_PATHS.SELF_CHECK_START} id="home-self-check-btn" className="home-self-check-btn card-link">
              <span id="home-self-check-btn-text" className="home-self-check-btn-text">
                자가 진단 바로가기
              </span>
            </Link>
            <div 
              id="home-self-check-image" 
              className="home-self-check-image"
              aria-hidden="true"
              style={{ backgroundImage: `url(${publicAsset('/contract.png')})` }}
            />
          </div>
        </section>

        {/* Services Section */}
        <section id="home-services-section" className="home-services-section" aria-labelledby="home-services-title">
          <div className="home-services-header">
            <h2 id="home-services-title" className="home-services-title">
              자립 지원 서비스
            </h2>
          </div>
          <ul className="home-services-grid">
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
            ].map((service, index) => {
              // 카드 내부 내용(이미지 자리 + 제목 + 설명) — 링크/버튼 어느 쪽이든 같은 모양
              const cardInner = (
                <>
                  <span id={`home-service-card-${index + 1}-content`} className="home-service-card-content">
                    <span id={`home-service-card-${index + 1}-image`} className="home-service-card-image">
                      {/* 이미지 자리 표시 아이콘 — 정보가 없는 장식이므로 alt="" */}
                      <img 
                        src={publicAsset('/image-line.svg')} 
                        alt=""
                        className="home-service-card-image-placeholder"
                      />
                    </span>
                  </span>
                  <span id={`home-service-card-${index + 1}-text`} className="home-service-card-text">
                    <span id={`home-service-card-${index + 1}-title-container`} className="home-service-card-title-container">
                      <span id={`home-service-card-${index + 1}-title`} className="home-service-card-title">
                        {service.title}
                      </span>
                    </span>
                    <span id={`home-service-card-${index + 1}-description`} className="home-service-card-description">
                      {service.description}
                    </span>
                  </span>
                </>
              );
              const isExternal = service.title === '장애인 구인구직' && !!employmentUrl;
              return (
                <li key={index} className="home-grid-item">
                  {isExternal ? (
                    // 외부 사이트: 실제 링크(새 창). 기존 window.open 은 팝업 차단·접근성 문제가 있었다
                    <a
                      href={employmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      id={`home-service-card-${index + 1}`}
                      className="home-service-card card-link"
                    >
                      {cardInner}
                      <span className="sr-only">(새 창)</span>
                    </a>
                  ) : (
                    // 준비 중 서비스: 안내 대화상자를 여는 버튼
                    <button
                      type="button"
                      id={`home-service-card-${index + 1}`}
                      className="home-service-card"
                      onClick={() => handleServiceClick(service.title)}
                    >
                      {cardInner}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
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