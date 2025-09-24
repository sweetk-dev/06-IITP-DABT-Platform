import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MobileNavigationProps {
  id?: string;
}

export function MobileNavigation({ id }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const menuItems = [
    { label: '홈', href: '/', isActive: location.pathname === '/' },
    { label: '데이터', href: '/data', isActive: location.pathname.startsWith('/data') },
    { label: '정보', href: '/info', isActive: location.pathname === '/info' },
    { label: '자가진단', href: '/self-check/start', isActive: location.pathname.startsWith('/self-check') },
  ];

  return (
    <>
      <button 
        id={id}
        className="mobile-menu-btn"
        onClick={toggleMenu}
        aria-label="메뉴 열기"
      >
        ☰
      </button>
      
      <div className={`mobile-menu ${isOpen ? 'active' : ''}`} onClick={closeMenu}>
        <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
          <button 
            className="mobile-menu-close"
            onClick={closeMenu}
            aria-label="메뉴 닫기"
          >
            ✕
          </button>
          
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className="mobile-menu-link"
              style={{
                color: item.isActive ? 'var(--color-primary)' : 'var(--color-text-primary)',
                fontWeight: item.isActive ? 600 : 400
              }}
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
