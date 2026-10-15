import { ReactNode, useRef } from 'react';
import { useLocation, useParams, Link, useSearchParams } from 'react-router-dom';
import { ROUTE_PATHS } from '../../pages/App';
import { Breadcrumb } from '../ui/Breadcrumb';
import { getBreadcrumbItems } from '../../pages/App';
import { HeaderSearch } from '../ui/HeaderSearch';
import { useDocumentTitle, SITE_NAME } from '../../hooks/useDocumentTitle';

interface LayoutProps {
  idPrefix?: string;
  children: ReactNode;
  showBreadcrumb?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  customBreadcrumbItems?: Array<{label: string, href?: string, active?: boolean}>; // 커스텀 브레드크럼
  /**
   * 브라우저 탭 제목(document.title)에 쓸 화면 제목.
   * 생략하면 브레드크럼 마지막 항목(라우트 라벨)을 사용한다. 홈은 사이트 이름만 표시.
   */
  pageTitle?: string;
  /**
   * true 면 본문 최대 폭을 1200px 대신 1840px 로 넓힌다 (자가진단 패널 화면용).
   * 기존 자가진단 패널은 position:absolute + width:1840px 로 본문 밖으로 튀어나와 가로 스크롤을 만들었는데,
   * 이제는 본문 컨테이너 자체를 넓혀 문서 흐름 안에 둔다.
   */
  wide?: boolean;
}

/**
 * 헤더 주요 메뉴 — nav 랜드마크.
 * 기존에는 홈 외에 주요 화면으로 가는 메뉴가 없어(로고·검색만 존재) 키보드/스크린리더 사용자가
 * 자가진단·사이트 소개로 가려면 홈으로 돌아가 카드들을 찾아야 했다.
 * matchPrefix: 현재 경로가 이 값으로 시작하면 aria-current="page" 로 표시한다.
 */
const HEADER_NAV_ITEMS: Array<{ label: string; to: string; matchPrefix: string[] }> = [
  { label: '데이터 목록', to: ROUTE_PATHS.DATA_LIST, matchPrefix: ['/data-list', '/data-search', '/data/'] },
  { label: '자립 수준 자가진단', to: ROUTE_PATHS.SELF_CHECK_START, matchPrefix: ['/self-check'] },
  { label: '사이트 소개', to: ROUTE_PATHS.INFO, matchPrefix: ['/info'] },
];

/**
 * 모든 화면의 공통 골격.
 *
 * [2026-10 반응형·접근성 개편]
 *  - 고정 폭(width:1200px) 컨테이너 → `.site-container`(max-width 1200px + 좌우 여백, layout.css)
 *    로 바꿔 360px~1920px 어디서도 가로 스크롤이 생기지 않게 함.
 *  - 시맨틱 랜드마크: <header> / <nav>(헤더 메뉴, 브레드크럼) / <main id="main-content"> / <footer>.
 *    기존에는 전부 <div> 라 스크린리더의 랜드마크 이동 기능을 쓸 수 없었다.
 *  - "본문 바로가기" 건너뛰기 링크 추가 (KWCAG 6.4.1). Tab 첫 번째 위치.
 *  - 화면별 문서 제목(document.title) 설정 (useDocumentTitle).
 *  - 푸터 저작권 연도를 하드코딩(2025) 대신 현재 연도로 계산.
 *  - 기존 id(`${idPrefix}-header` 등)는 다른 코드·테스트가 참조할 수 있어 그대로 유지.
 */
export function Layout({
  idPrefix = 'layout',
  children,
  showBreadcrumb = true,
  showHeader = true,
  showFooter = true,
  customBreadcrumbItems,
  pageTitle,
  wide = false
}: LayoutProps) {
  const location = useLocation();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const mainRef = useRef<HTMLElement>(null);

  // path params와 query params 병합
  const allParams = {
    ...params,
    ...Object.fromEntries(searchParams.entries())
  } as Record<string, string>;

  // 홈 페이지는 브레드크럼 숨김, showBreadcrumb prop도 고려
  const isHome = location.pathname === ROUTE_PATHS.HOME;
  const shouldShowBreadcrumb = showBreadcrumb && !isHome;
  const routeItems = customBreadcrumbItems || getBreadcrumbItems(location.pathname, allParams);
  const breadcrumbItems = shouldShowBreadcrumb ? routeItems : [];

  // 문서 제목: 명시값 > 브레드크럼 마지막 항목(라우트 라벨) > 사이트 이름(홈)
  const defaultTitle = isHome ? SITE_NAME : routeItems[routeItems.length - 1]?.label;
  useDocumentTitle(pageTitle || defaultTitle);

  // 저작권 연도: 빌드 시점이 아니라 화면을 보는 시점의 연도
  const currentYear = new Date().getFullYear();

  /**
   * 건너뛰기 링크 클릭 처리.
   * 기본 동작(#main-content 해시 이동)은 BrowserRouter 주소에 해시를 남기고, 일부 브라우저에서는
   * 스크롤만 되고 초점은 이동하지 않는다. 그래서 main 에 직접 초점을 준다(main 은 tabIndex=-1).
   */
  const handleSkipLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    mainRef.current?.focus();
    mainRef.current?.scrollIntoView();
  };

  const isNavActive = (prefixes: string[]) =>
    prefixes.some((prefix) => location.pathname === prefix || location.pathname.startsWith(prefix));

  return (
    <div id={`${idPrefix}-root`} className="site-root">
      {/* 본문 바로가기 — Tab 을 처음 누르면 나타남 */}
      <a href="#main-content" className="skip-link" onClick={handleSkipLink}>
        본문 바로가기
      </a>

      {/* Header - 모든 페이지 공통 */}
      {showHeader && (
        <header id={`${idPrefix}-header`} className="site-header">
          <div className={`site-container site-header-inner`}>
            <Link
              to={ROUTE_PATHS.HOME}
              id={`${idPrefix}-header-title`}
              className="site-logo"
            >
              {SITE_NAME}
            </Link>

            <nav className="site-nav" aria-label="주요 메뉴">
              <ul className="site-nav-list">
                {HEADER_NAV_ITEMS.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="site-nav-link"
                      aria-current={isNavActive(item.matchPrefix) ? 'page' : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <HeaderSearch idPrefix={idPrefix} />
          </div>
        </header>
      )}

      {/* Main Content — 건너뛰기 링크의 목적지 */}
      <main
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
        className={`site-main site-container ${wide ? 'site-container--wide' : ''} ${shouldShowBreadcrumb ? '' : 'site-main--no-breadcrumb'}`}
      >
        {/* Breadcrumb - 조건부 표시 */}
        {shouldShowBreadcrumb && (
          <Breadcrumb
            id={`${idPrefix}-breadcrumb`}
            items={breadcrumbItems}
          />
        )}

        <div id={`${idPrefix}-main-content`}>
          {children}
        </div>
      </main>

      {/* Footer - 모든 페이지 공통 */}
      {showFooter && (
        <footer id={`${idPrefix}-footer`} className="site-footer">
          <p id={`${idPrefix}-footer-copyright`}>
            © {currentYear} DABT. All rights reserved.
          </p>
          <p id={`${idPrefix}-footer-description`}>
            장애인 자립 지원 빅데이터 플랫폼
          </p>
        </footer>
      )}
    </div>
  );
}
