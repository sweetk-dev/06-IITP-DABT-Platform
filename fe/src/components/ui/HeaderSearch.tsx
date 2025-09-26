import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderSearchProps {
  idPrefix: string;
}

export function HeaderSearch({ idPrefix }: HeaderSearchProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/data-search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="search-input" style={{
      width: '485px',
      float: 'right',
      marginTop: '34px'
    }}>
      <form 
        id={`${idPrefix}-search-form`}
        onSubmit={handleSearchSubmit}
        style={{
          background: 'var(--figma-gray-50)',
          borderRadius: '16px',
          border: '1px solid var(--figma-gray-150)',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.2s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--figma-gray-300)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--figma-gray-150)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <input
          id={`${idPrefix}-search-input`}
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="검색어를 입력하세요"
          className="input"
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            color: 'var(--color-text-primary)',
            fontSize: '18px',
            fontFamily: 'var(--font-family-primary)',
            fontWeight: 400,
            outline: 'none',
            marginRight: '12px',
            padding: 0
          }}
        />
        <button
          id={`${idPrefix}-search-button`}
          type="submit"
          style={{
            width: '24px',
            height: '24px',
            position: 'relative',
            overflow: 'hidden',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div id={`${idPrefix}-search-icon`} style={{
            width: '20px',
            height: '20px',
            backgroundImage: 'url(/search_ico.svg)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }} />
        </button>
      </form>
    </div>
  );
}
