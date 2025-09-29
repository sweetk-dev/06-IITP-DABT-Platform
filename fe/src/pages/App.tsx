import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Spinner } from '../components/ui/Spinner';
import { ErrorAlert } from '../components/ui/ErrorAlert';
import { useRouteChange } from '../hooks/useRouteChange';
import { useErrorHandler } from '../hooks/useErrorHandler';

// Lazy load pages for better performance - 중앙 집중식 관리
const LAZY_COMPONENTS = {
  Home: lazy(() => import('./Home').then(m => ({ default: m.Home }))),
  DataList: lazy(() => import('./DataList').then(m => ({ default: m.DataList }))),
  DataSearch: lazy(() => import('./DataSearch').then(m => ({ default: m.DataSearch }))),
  DataDetail: lazy(() => import('./DataDetail').then(m => ({ default: m.DataDetail }))),
  Info: lazy(() => import('./Info').then(m => ({ default: m.Info }))),
  SelfCheckStart: lazy(() => import('./self-check/SelfCheckStart').then(m => ({ default: m.SelfCheckStart }))),
  SelfCheckIdentity: lazy(() => import('./self-check/SelfCheckIdentity').then(m => ({ default: m.SelfCheckIdentity }))),
  SelfCheckQuestions: lazy(() => import('./self-check/SelfCheckQuestions').then(m => ({ default: m.SelfCheckQuestions }))),
  SelfCheckResult: lazy(() => import('./self-check/SelfCheckResult').then(m => ({ default: m.SelfCheckResult }))),
  SelfCheckMore: lazy(() => import('./self-check/SelfCheckMore').then(m => ({ default: m.SelfCheckMore })))
} as const;

// 라우트 경로 상수 정의
export const ROUTE_PATHS = {
  HOME: '/',
  DATA_LIST: '/data-list',
  DATA_SEARCH: '/data-search',
  DATA_DETAIL: '/data/:id',
  INFO: '/info',
  SELF_CHECK_START: '/self-check/start',
  SELF_CHECK_IDENTITY: '/self-check/identity',
  SELF_CHECK_QUESTIONS: '/self-check/questions',
  SELF_CHECK_RESULT: '/self-check/result',
  SELF_CHECK_MORE: '/self-check/more'
} as const;

// 중앙 집중식 라우트 관리
export interface RouteConfig {
  path: string;
  label: string;
  component: keyof typeof LAZY_COMPONENTS; // 컴포넌트 이름 (상수 키)
  parent?: keyof typeof ROUTE_PATHS; // 실제 페이지 이동 경로의 부모 (상수 키)
  breadcrumbParent?: keyof typeof ROUTE_PATHS; // 브레드크럼용 부모 경로 (상수 키)
  resetDataOnEnter?: boolean; // 페이지 진입 시 데이터 리셋 여부
  resetDataOnLeave?: boolean; // 페이지 이탈 시 데이터 리셋 여부
  resetConditions?: (keyof typeof ROUTE_PATHS)[]; // 데이터 리셋 조건 (특정 경로에서만)
}

export const ROUTE_CONFIGS: RouteConfig[] = [
  {
    path: ROUTE_PATHS.HOME,
    label: '홈',
    component: 'Home'
  },
  {
    path: ROUTE_PATHS.DATA_LIST,
    label: '데이터 목록',
    component: 'DataList',
    parent: 'HOME', // 홈에서 데이터 목록으로
    breadcrumbParent: 'HOME'
  },
  {
    path: ROUTE_PATHS.DATA_SEARCH,
    label: '검색 결과',
    component: 'DataSearch',
    parent: 'HOME', // 홈에서 검색 결과로
    breadcrumbParent: 'HOME'
  },
  {
    path: ROUTE_PATHS.DATA_DETAIL,
    label: '데이터 상세',
    component: 'DataDetail',
    parent: 'DATA_LIST', // 실제 페이지 이동: 데이터 목록에서 상세로
    breadcrumbParent: 'DATA_LIST'
  },
  {
    path: ROUTE_PATHS.INFO,
    label: '사이트 소개',
    component: 'Info',
    parent: 'HOME', // 홈에서 사이트 소개로
    breadcrumbParent: 'HOME'
  },
  {
    path: ROUTE_PATHS.SELF_CHECK_START,
    label: '자립 수준 자가진단',
    component: 'SelfCheckStart',
    parent: 'INFO', // 실제 페이지 이동: 사이트 소개에서 자가진단으로
    breadcrumbParent: 'INFO',
    resetDataOnEnter: true // 자가진단 시작 시 모든 데이터 리셋
  },
  {
    path: ROUTE_PATHS.SELF_CHECK_IDENTITY,
    label: '본인 확인',
    component: 'SelfCheckIdentity',
    parent: 'SELF_CHECK_START', // 실제 페이지 이동: 자가진단 시작에서 본인 확인으로
    breadcrumbParent: 'SELF_CHECK_START'
  },
  {
    path: ROUTE_PATHS.SELF_CHECK_QUESTIONS,
    label: '질문',
    component: 'SelfCheckQuestions',
    parent: 'SELF_CHECK_IDENTITY', // 실제 페이지 이동: 본인 확인에서 질문으로
    breadcrumbParent: 'SELF_CHECK_START'
  },
  {
    path: ROUTE_PATHS.SELF_CHECK_RESULT,
    label: '결과',
    component: 'SelfCheckResult',
    parent: 'SELF_CHECK_QUESTIONS', // 실제 페이지 이동: 질문에서 결과로
    breadcrumbParent: 'SELF_CHECK_START'
  },
  {
    path: ROUTE_PATHS.SELF_CHECK_MORE,
    label: '더보기',
    component: 'SelfCheckMore',
    parent: 'SELF_CHECK_RESULT', // 실제 페이지 이동: 결과에서 더보기로
    breadcrumbParent: 'SELF_CHECK_RESULT',
    resetDataOnLeave: true, // 더보기 페이지에서 나갈 때 결과 데이터 리셋
    resetConditions: ['SELF_CHECK_START', 'HOME'] // 홈이나 자가진단 시작으로 갈 때만 리셋
  }
];

// 라우트 정보를 기반으로 브레드크럼 생성
export function getBreadcrumbItems(pathname: string, params?: Record<string, string>): Array<{label: string, href?: string, active?: boolean}> {
  // 라우트 찾기
  const findRoute = (path: string): RouteConfig | null => {
    // 정확한 매칭
    let route = ROUTE_CONFIGS.find(r => r.path === path);
    if (route) return route;
    
    // 동적 라우트 매칭 (예: /data/:id)
    route = ROUTE_CONFIGS.find(r => {
      if (r.path.includes(':')) {
        const routePattern = r.path.replace(/:[^/]+/g, '[^/]+');
        const regex = new RegExp(`^${routePattern}$`);
        return regex.test(path);
      }
      return false;
    });
    
    return route || null;
  };

  // 상수 키로 라우트 찾기
  const findRouteByKey = (key: keyof typeof ROUTE_PATHS): RouteConfig | null => {
    return ROUTE_CONFIGS.find(r => r.path === ROUTE_PATHS[key]) || null;
  };

  // 현재 라우트 찾기
  const currentRoute = findRoute(pathname);
  if (!currentRoute) {
    return [{ label: '홈', active: true }];
  }

  // 브레드크럼 경로 생성 (breadcrumbParent를 사용)
  const breadcrumbPath: RouteConfig[] = [];
  let current: RouteConfig | null = currentRoute;
  
  while (current) {
    breadcrumbPath.unshift(current);
    if (current.breadcrumbParent) {
      current = findRouteByKey(current.breadcrumbParent);
    } else {
      current = null;
    }
  }

  // 브레드크럼 아이템 생성
  return breadcrumbPath.map((route, index) => {
    const isLast = index === breadcrumbPath.length - 1;
    let href = route.path;
    
    // 동적 라우트 처리 (예: /data/:id)
    if (params && route.path.includes(':')) {
      Object.entries(params).forEach(([key, value]) => {
        href = href.replace(`:${key}`, value);
      });
    }
    
    return {
      label: route.label,
      href: isLast ? undefined : href,
      active: isLast
    };
  });
}

// 라우트 경로 가져오기
export function getRoutePath(path: string, params?: Record<string, string>): string {
  let routePath = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      routePath = routePath.replace(`:${key}`, value);
    });
  }
  return routePath;
}

// 페이지 이동을 위한 부모 경로 가져오기
export function getParentRoute(path: string): string | null {
  const route = ROUTE_CONFIGS.find(r => r.path === path);
  return route?.parent ? ROUTE_PATHS[route.parent] : null;
}

// 페이지 이동을 위한 자식 경로들 가져오기
export function getChildRoutes(path: string): RouteConfig[] {
  return ROUTE_CONFIGS.filter(route => route.parent && ROUTE_PATHS[route.parent] === path);
}

// 페이지 이동을 위한 이전/다음 경로 가져오기
export function getNavigationRoutes(path: string): { previous: string | null; next: string | null } {
  const currentIndex = ROUTE_CONFIGS.findIndex(route => route.path === path);
  if (currentIndex === -1) return { previous: null, next: null };
  
  const previous = currentIndex > 0 ? ROUTE_CONFIGS[currentIndex - 1].path : null;
  const next = currentIndex < ROUTE_CONFIGS.length - 1 ? ROUTE_CONFIGS[currentIndex + 1].path : null;
  
  return { previous, next };
}

// 특정 라우트 키로 경로 가져오기 (동적 라우트 파라미터 포함)
export function getRoutePathByKey(key: keyof typeof ROUTE_PATHS, params?: Record<string, string>): string {
  return getRoutePath(ROUTE_PATHS[key], params);
}

// 검색 결과 페이지 경로 생성
export function getDataSearchPath(options?: {
  q?: string;
  type?: 'theme' | 'data_type';
  category?: string;
  theme?: string;
}): string {
  const params = new URLSearchParams();
  if (options?.q) params.set('q', options.q);
  if (options?.type) params.set('type', options.type);
  if (options?.category) params.set('category', options.category);
  if (options?.theme) params.set('theme', options.theme);
  
  const queryString = params.toString();
  return queryString ? `${ROUTE_PATHS.DATA_SEARCH}?${queryString}` : ROUTE_PATHS.DATA_SEARCH;
}

// 데이터 목록 페이지 경로 생성
export function getDataListPath(options?: {
  theme?: string;
  type?: string;
}): string {
  const params = new URLSearchParams();
  if (options?.theme) params.set('theme', options.theme);
  if (options?.type) params.set('type', options.type);
  
  const queryString = params.toString();
  return queryString ? `${ROUTE_PATHS.DATA_LIST}?${queryString}` : ROUTE_PATHS.DATA_LIST;
}

// 데이터 상세 페이지 경로 생성
export function getDataDetailPath(id: string): string {
  return getRoutePathByKey('DATA_DETAIL', { id });
}

// 데이터 리셋 조건 확인
export function shouldResetData(fromPath: string, toPath: string): boolean {
  const fromRoute = ROUTE_CONFIGS.find(route => route.path === fromPath);
  const toRoute = ROUTE_CONFIGS.find(route => route.path === toPath);
  
  if (!fromRoute || !toRoute) return false;
  
  // 1. 진입 시 리셋
  if (toRoute.resetDataOnEnter) return true;
  
  // 2. 이탈 시 리셋 (조건 확인)
  if (fromRoute.resetDataOnLeave) {
    if (fromRoute.resetConditions) {
      return fromRoute.resetConditions.some(condition => ROUTE_PATHS[condition] === toPath);
    }
    return true;
  }
  
  return false;
}

// SelfCheck 데이터 리셋
export function resetSelfCheckData(): void {
  console.log('🔄 SelfCheck 데이터 리셋 실행');
  localStorage.removeItem('selfCheckUserInfo');
  localStorage.removeItem('selfCheckResponses');
  localStorage.removeItem('selfCheckResults');
  console.log('✅ SelfCheck 데이터 리셋 완료');
}

// 라우트 변경 시 데이터 리셋 처리
export function handleRouteChange(fromPath: string, toPath: string): void {
  console.log(`🔄 라우트 변경: ${fromPath} → ${toPath}`);
  
  if (shouldResetData(fromPath, toPath)) {
    console.log('✅ 데이터 리셋 조건 만족 - 리셋 실행');
    resetSelfCheckData();
  } else {
    console.log('❌ 데이터 리셋 조건 불만족 - 리셋 건너뜀');
  }
}

// Loading fallback component
function PageLoader() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '50vh' 
    }}>
      <Spinner />
    </div>
  );
}

export function App() {
  // 라우트 변경 감지 및 데이터 리셋 처리
  useRouteChange();
  
  // 에러 처리
  const { error, clearError } = useErrorHandler();

  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {ROUTE_CONFIGS.map((route) => {
            const Component = LAZY_COMPONENTS[route.component];
            return (
              <Route 
                key={route.path} 
                path={route.path} 
                element={<Component />} 
              />
            );
          })}
        </Routes>
      </Suspense>
      
      {/* 전역 에러 알림 */}
      <ErrorAlert error={error} onClose={clearError} />
    </>
  );
}


