import { ReactNode } from 'react';
import { useLocation, useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTE_PATHS } from '../../pages/App';
import { Breadcrumb } from '../ui/Breadcrumb';
import { getBreadcrumbItems } from '../../pages/App';
import { MobileNavigation } from '../ui/MobileNavigation';
import { HeaderSearch } from '../ui/HeaderSearch';

interface LayoutProps {
  idPrefix?: string;
  children: ReactNode;
  showBreadcrumb?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  customBreadcrumbItems?: Array<{label: string, href?: string, active?: boolean}>; // 커스텀 브레드크럼
}

export function Layout({ 
  idPrefix = 'layout', 
  children, 
  showBreadcrumb = true,
  showHeader = true,
  showFooter = true,
  customBreadcrumbItems 
}: LayoutProps) {
  const location = useLocation();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // path params와 query params 병합
  const allParams = {
    ...params,
    ...Object.fromEntries(searchParams.entries())
  } as Record<string, string>;
  
  // 홈 페이지는 브레드크럼 숨김, showBreadcrumb prop도 고려
  const shouldShowBreadcrumb = showBreadcrumb && location.pathname !== '/';
  const breadcrumbItems = shouldShowBreadcrumb 
    ? (customBreadcrumbItems || getBreadcrumbItems(location.pathname, allParams))
    : [];


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
        width: '1200px', // Header 고정 너비
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
              <Link 
                to={ROUTE_PATHS.HOME}
                id={`${idPrefix}-header-title`} 
                style={{
                  color: 'black',
                  fontSize: '30px',
                  fontFamily: 'Pretendard',
                  fontWeight: 700,
                  wordWrap: 'break-word',
                  marginTop: '44px',
                  display: 'inline-block',
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}
              >
                장애인 자립 지원 허브
              </Link>

              <HeaderSearch idPrefix={idPrefix} />
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
          marginTop: shouldShowBreadcrumb ? '0' : '28px'
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