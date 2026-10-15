import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDataSearchPath } from '../../pages/App';
import { publicAsset } from '../../utils/publicAsset';

interface HeaderSearchProps {
  idPrefix: string;
}

/**
 * 헤더 검색창.
 *
 * [2026-10 반응형·접근성 개편]
 *  - 접근성: 검색 버튼에 이름이 없어(아이콘만) axe "button-name"(critical) 위반이 모든 화면에서 났다.
 *    → 버튼 aria-label="검색", 입력칸에는 <label>(화면에는 숨김) 연결, role="search" 지정.
 *  - 반응형: 기존 고정 폭 485px + float:right 라 360px 화면에서 검색창이 화면 밖에 있었다.
 *    → 768px 이하에서는 돋보기 아이콘 버튼("검색 열기")만 보이고, 누르면 로고 아래 전체 폭으로 펼쳐진다.
 *      (aria-expanded 로 펼침 상태 전달, 펼치면 입력칸으로 초점 이동, Esc 로 닫기)
 *  - 스타일은 inline style 대신 layout.css 의 .header-search* 클래스로 이동.
 */
export function HeaderSearch({ idPrefix }: HeaderSearchProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  // 좁은 화면에서 검색 입력칸 펼침 여부 (넓은 화면에서는 CSS 가 항상 보여 주므로 영향 없음)
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const formId = `${idPrefix}-search-form`;
  const inputId = `${idPrefix}-search-input`;

  // 펼친 직후 입력칸으로 초점 이동 (키보드 사용자가 다시 Tab 을 찾지 않도록)
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(getDataSearchPath({ q: searchTerm.trim() }));
      setIsOpen(false);
    } else {
      // 빈 검색어로 제출하면 입력칸으로 초점을 되돌려 입력을 유도
      inputRef.current?.focus();
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 펼친 상태에서 Esc 를 누르면 접고, 초점을 펼침 버튼으로 돌려준다
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      setIsOpen(false);
      // 버튼이 다시 렌더된 뒤 초점 이동
      requestAnimationFrame(() => toggleRef.current?.focus());
    }
  };

  return (
    <div className={`header-search ${isOpen ? 'is-open' : ''}`} onKeyDown={handleKeyDown}>
      {/* 좁은 화면 전용: 검색 펼침 버튼 */}
      <button
        ref={toggleRef}
        type="button"
        className="header-search-toggle"
        aria-label="검색 열기"
        aria-expanded={isOpen}
        aria-controls={formId}
        onClick={() => setIsOpen(true)}
      >
        <img className="header-search-icon" src={publicAsset('/search_ico.svg')} alt="" />
      </button>

      <form
        id={formId}
        role="search"
        aria-label="데이터 검색"
        className="header-search-form"
        onSubmit={handleSearchSubmit}
      >
        {/* 화면에는 숨기고 스크린리더에는 읽히는 라벨 (placeholder 는 라벨을 대신하지 못함) */}
        <label htmlFor={inputId} className="sr-only">데이터명 검색어</label>
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="검색어를 입력하세요"
          className="header-search-input"
          autoComplete="off"
          enterKeyHint="search"
        />
        <button
          id={`${idPrefix}-search-button`}
          type="submit"
          className="header-search-submit"
          aria-label="검색"
        >
          {/* 아이콘은 장식: 버튼 이름은 aria-label 로 제공 */}
          <img
            id={`${idPrefix}-search-icon`}
            className="header-search-icon"
            src={publicAsset('/search_ico.svg')}
            alt=""
          />
        </button>
      </form>
    </div>
  );
}
