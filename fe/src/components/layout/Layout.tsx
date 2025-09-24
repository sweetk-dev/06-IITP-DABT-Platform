import { ReactNode } from 'react';
import { useLocation, useParams, Link, useNavigate } from 'react-router-dom';
import { Breadcrumb, getBreadcrumbItems } from '../ui/Breadcrumb';
import { MobileNavigation } from '../ui/MobileNavigation';

interface LayoutProps {
  idPrefix?: string;
  children: ReactNode;
  showBreadcrumb?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function Layout({ 
  idPrefix = 'layout', 
  children, 
  showBreadcrumb = true,
  showHeader = true,
  showFooter = true 
}: LayoutProps) {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  
  // 홈 페이지는 브레드크럼 숨김
  const shouldShowBreadcrumb = location.pathname !== '/';
  const breadcrumbItems = shouldShowBreadcrumb ? getBreadcrumbItems(location.pathname, params) : [];

  const handleSearchClick = () => {
    // 검색 박스 클릭 시 포커스만 주고 이동하지 않음
    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchInput = e.currentTarget.querySelector('input[type="text"]') as HTMLInputElement;
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
      navigate(`/data-search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div id={`${idPrefix}-root`} style={{
      width: '100%',
      minHeight: '100vh',
      position: 'relative',
      background: 'white',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div id={`${idPrefix}-container`} style={{
        margin: '0 auto',
        width: '1200px',
        position: 'relative',
        flex: 1,
        paddingBottom: '94px'
      }}>
        {/* Header - 모든 페이지 공통 */}
        {showHeader && (
          <>
            <div id={`${idPrefix}-header`} style={{
              width: '100%',
              position: 'relative',
              height: '118px'
            }}>
              <div id={`${idPrefix}-header-title`} style={{
                color: 'black',
                fontSize: '30px',
                fontFamily: 'Pretendard',
                fontWeight: 700,
                wordWrap: 'break-word',
                marginTop: '44px',
                display: 'inline-block'
              }}>
                장애인 자립 지원 허브
              </div>

              <div id={`${idPrefix}-search-box`} style={{
                width: '485px',
                paddingLeft: '24px',
                paddingRight: '24px',
                paddingTop: '16px',
                paddingBottom: '16px',
                background: '#f3f5f8',
                borderRadius: '16px',
                outline: '1px #f1f3f7 solid',
                outlineOffset: '-1px',
                justifyContent: 'space-between',
                alignItems: 'center',
                display: 'inline-flex',
                float: 'right',
                marginTop: '34px',
                cursor: 'pointer'
              }}
              onClick={handleSearchClick}
              >
                <div id={`${idPrefix}-search-placeholder`} style={{
                  color: 'rgba(0, 0, 0, 0.5)',
                  fontSize: '18px',
                  fontFamily: 'Pretendard',
                  fontWeight: 400,
                  wordWrap: 'break-word'
                }}>
                  검색어를 입력하세요
                </div>
                <div id={`${idPrefix}-search-icon-container`} style={{
                  width: '24px',
                  height: '24px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div id={`${idPrefix}-search-icon`} style={{
                    width: '20.31px',
                    height: '20.31px',
                    left: '2px',
                    top: '2px',
                    position: 'absolute',
                    backgroundImage: 'url(/search_ico.svg)',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                  }} />
                </div>
              </div>
            </div>

            {/* Divider Line */}
            <div id={`${idPrefix}-divider`} style={{
              width: '100%',
              height: '0px',
              position: 'absolute',
              top: '118px',
              left: 0,
              outline: '1px rgba(0, 0, 0, 0.1) solid',
              outlineOffset: '-0.5px'
            }} />
          </>
        )}

        {/* Breadcrumb - 조건부 표시 */}
        {shouldShowBreadcrumb && (
          <div style={{
            marginTop: '28px',
            marginBottom: '28px'
          }}>
            <Breadcrumb 
              id={`${idPrefix}-breadcrumb`} 
              items={breadcrumbItems} 
            />
          </div>
        )}

        {/* Main Content */}
        <div id={`${idPrefix}-main-content`} style={{
          width: '100%',
          position: 'relative',
          marginTop: showBreadcrumb ? '0' : '28px'
        }}>
          {children}
        </div>
      </div>

      {/* Footer - 모든 페이지 공통 */}
      {showFooter && (
        <div id={`${idPrefix}-footer`} style={{
          width: '100%',
          height: '120px',
          background: '#282828',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '6px',
          display: 'inline-flex'
        }}>
          <div id={`${idPrefix}-footer-copyright`} style={{
            alignSelf: 'stretch',
            textAlign: 'center',
            color: 'white',
            fontSize: '20px',
            fontFamily: 'Pretendard',
            fontWeight: 400,
            wordWrap: 'break-word'
          }}>
            © 2025 IITP DABT. All rights reserved.
          </div>
          <div id={`${idPrefix}-footer-description`} style={{
            alignSelf: 'stretch',
            textAlign: 'center',
            color: 'white',
            fontSize: '20px',
            fontFamily: 'Pretendard',
            fontWeight: 400,
            wordWrap: 'break-word'
          }}>
            장애인 자립 지원 빅데이터 플랫폼
          </div>
        </div>
      )}
    </div>
  );
}