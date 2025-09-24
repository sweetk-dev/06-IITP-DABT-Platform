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
    <form 
      id={`${idPrefix}-search-form`}
      onSubmit={handleSearchSubmit}
      style={{
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
    >
      <input
        id={`${idPrefix}-search-input`}
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="검색어를 입력하세요"
        style={{
          flex: 1,
          border: 'none',
          background: 'transparent',
          color: 'rgba(0, 0, 0, 0.8)',
          fontSize: '18px',
          fontFamily: 'Pretendard',
          fontWeight: 400,
          outline: 'none',
          marginRight: '12px'
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
          padding: 0
        }}
      >
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
      </button>
    </form>
  );
}
