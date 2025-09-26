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

// getBreadcrumbItems는 App.tsx에서 import하여 사용