import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  id?: string;
  items: BreadcrumbItem[];
}

export function Breadcrumb({ id, items }: BreadcrumbProps) {
  const location = useLocation();

  return (
    <nav id={id} className="breadcrumb" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '28px',
      marginBottom: '28px',
      opacity: 0.5,
      cursor: 'pointer',
      transition: 'opacity 0.2s ease'
    }}>
      {items.map((item, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {item.href && !item.active ? (
            <Link 
              to={item.href}
              className="breadcrumb-item"
              style={{
                color: 'var(--color-text-primary)',
                fontSize: '16px',
                fontWeight: 500,
                lineHeight: '20.8px',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-text-primary)';
              }}
            >
              {item.label}
            </Link>
          ) : (
            <span 
              className={`breadcrumb-item ${item.active ? 'active' : ''}`}
              style={{
                color: item.active ? 'var(--color-primary)' : 'var(--color-text-primary)',
                fontSize: '16px',
                fontWeight: item.active ? 700 : 500,
                lineHeight: '20.8px'
              }}
            >
              {item.label}
            </span>
          )}
          
          {index < items.length - 1 && (
            <div 
              className="breadcrumb-separator"
              style={{
                width: '24px',
                height: '24px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <span style={{
                position: 'absolute',
                left: '8.22px',
                top: '-1.3px',
                fontSize: '16px',
                color: 'var(--color-text-secondary)'
              }}>
                ›
              </span>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}

// 페이지별 브레드크럼 데이터 생성 함수
export function getBreadcrumbItems(pathname: string, params?: Record<string, string>): BreadcrumbItem[] {
  const pathSegments = pathname.split('/').filter(Boolean);
  
  switch (pathname) {
    case '/':
      return [{ label: '홈', active: true }];
      
    case '/data':
    case '/data-list':
      return [
        { label: '홈', href: '/' },
        { label: '데이터 목록', active: true }
      ];
      
    case '/data-search':
      return [
        { label: '홈', href: '/' },
        { label: '검색 결과', active: true }
      ];
      
    case '/data/' + (params?.id || ''):
      return [
        { label: '홈', href: '/' },
        { label: '데이터 목록', href: '/data' },
        { label: '데이터 상세', active: true }
      ];
      
    case '/info':
      return [
        { label: '홈', href: '/' },
        { label: '정보', active: true }
      ];
      
    case '/self-check/start':
      return [
        { label: '홈', href: '/' },
        { label: '자가진단', active: true }
      ];
      
    case '/self-check/questions':
      return [
        { label: '홈', href: '/' },
        { label: '자가진단', href: '/self-check/start' },
        { label: '질문', active: true }
      ];
      
    case '/self-check/result':
      return [
        { label: '홈', href: '/' },
        { label: '자가진단', href: '/self-check/start' },
        { label: '결과', active: true }
      ];
      
    case '/self-check/more':
      return [
        { label: '홈', href: '/' },
        { label: '자가진단', href: '/self-check/start' },
        { label: '더보기', active: true }
      ];
      
    default:
      return [{ label: '홈', active: true }];
  }
}