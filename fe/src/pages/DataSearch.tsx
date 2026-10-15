import { useSearchParams, useNavigate } from 'react-router-dom';
import { getDataListPath, getDataDetailPath } from './App';
import { Layout } from '../components/layout/Layout';
import { Sidebar } from '../components/ui/Sidebar';
import { FilterSection } from '../components/ui/FilterSection';
import { FilterOption } from '../components/ui/FilterOption';
import { Table, TableHeader, TableBodyWithState, TableColumn, DataItemRow } from '../components/ui/Table';
import { THEME_CONSTANTS, DATA_TYPE_CONSTANTS, formatCount, type ThemeCode, type DataTypeCode, DATA_SEARCH_DEFAULTS } from '@iitp-dabt-platform/common';
import { useDataSearch } from '../api/hooks';
import { escapeRegExp } from '../utils/format';

import '../styles/data-pages.css';

export function DataSearch() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchTerm = searchParams.get('q') || '';

  // ============================================================================
  // API 데이터 조회 (common 패키지의 모든 타입 활용)
  // ============================================================================
  
  // 데이터 검색
  const searchState = useDataSearch({
    q: searchTerm,
    page: DATA_SEARCH_DEFAULTS.PAGE,
    pageSize: DATA_SEARCH_DEFAULTS.PAGE_SIZE
  });

  // 검색어 강조 함수
  // [2026-10] 수정 사항
  //  - 검색어를 정규식 이스케이프 (기존: "(" 등 입력 시 RegExp 오류로 화면 오류)
  //  - 기존 regex.test() 는 g 플래그의 lastIndex 때문에 같은 단어가 번갈아 강조되지 않는 문제가 있어
  //    split 결과의 홀수 번째(캡처 그룹) 조각을 강조하는 방식으로 변경
  //  - 강조 글자색을 대비 4.5:1 이상 토큰으로(.search-highlight), <mark> 대신 span(배경색 디자인 유지)
  const highlightSearchTerm = (text: string, term: string) => {
    if (!term) return text;
    
    const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      index % 2 === 1 ? (
        <span key={index} className="search-highlight">
          {part}
        </span>
      ) : part
    );
  };

  // 자립 테마 클릭 핸들러
  const handleThemeClick = (theme: ThemeCode) => {
    navigate(getDataListPath({ theme }));
  };

  // 데이터 유형 클릭 핸들러
  const handleTypeClick = (type: DataTypeCode) => {
    navigate(getDataListPath({ type }));
  };

  const pageTitle = searchTerm ? `'${searchTerm}' 검색 결과` : '전체 데이터';

  return (
    <Layout idPrefix="data-search" pageTitle={pageTitle}>
      <div id="data-search-container" className="data-list-container">
        {/* Sidebar - 공통 컴포넌트 사용 */}
        <Sidebar idPrefix="data-search" title="필터">
          <FilterSection idPrefix="data-search-theme" title="자립 테마별">
            {THEME_CONSTANTS.ALL_CODES.map((themeCode) => {
              const themeInfo = THEME_CONSTANTS.THEMES[themeCode];
              return (
                <FilterOption
                  key={themeCode}
                  id={`data-search-theme-${themeCode}`}
                  name={themeInfo.name}
                  isActive={false}
                  onClick={() => handleThemeClick(themeCode)}
                />
              );
            })}
          </FilterSection>
          
          <FilterSection idPrefix="data-search-type" title="데이터 유형별">
            {DATA_TYPE_CONSTANTS.ALL_CODES.map((dataTypeCode) => {
              const dataTypeInfo = DATA_TYPE_CONSTANTS.DATA_TYPES[dataTypeCode];
              return (
                <FilterOption
                  key={dataTypeCode}
                  id={`data-search-type-${dataTypeCode}`}
                  name={dataTypeInfo.name}
                  isActive={false}
                  onClick={() => handleTypeClick(dataTypeCode)}
                />
              );
            })}
          </FilterSection>
        </Sidebar>

        {/* Main Content */}
        {/* [2026-10] className 오타(data-list-main) 수정 → main-content (flex:1, min-width:0 이 적용되어야 좁은 화면에서 넘치지 않음) */}
        <div id="data-search-main-content" className="main-content">
          {/* Page Header */}
          <div id="data-search-page-header" className="page-header">
            <h1 id="data-search-page-title" className="page-title-large">
              {searchTerm ? '검색 결과' : '전체 데이터'}
            </h1>
            <div id="data-search-page-description" className="page-description">
              {searchTerm ? (
                <>
                  데이터명에 '<span className="search-highlight">{searchTerm}</span>' 키워드를 포함하는 데이터 검색 결과입니다.
                </>
              ) : (
                '모든 데이터를 확인할 수 있습니다.'
              )}
            </div>
            <div id="data-search-data-count" className="data-count" role="status">
              총 <span id="data-search-count-number" className="count-number">
                {searchState.loading ? '...' : formatCount(searchState.data?.total)}
              </span>건
            </div>
          </div>

          {/* Data Table */}
          <Table id="data-search-table">
            <TableHeader id="data-search-table-header">
              <TableColumn id="data-search-table-column-title" variant="title">데이터명</TableColumn>
              <TableColumn id="data-search-table-column-tags" variant="tags">태그</TableColumn>
            </TableHeader>

            <TableBodyWithState
              id="data-search-table-body"
              data={searchState.data?.items || []}
              loading={searchState.loading}
              error={searchState.error}
              emptyMessage={searchTerm ? `'${searchTerm}'에 대한 검색 결과가 없습니다.` : '데이터가 없습니다.'}
              loadingMessage="로딩 중..."
              errorMessage="검색 중 오류가 발생했습니다."
              renderRow={(item: any, index: number) => (
                // [2026-10] 검색 화면도 목록과 동일하게 "최종 수정일"(src_latest_chn_dt) 표시
                //          — 기존에는 라벨만 "최종 수정일"이고 값은 등록일(sys_data_reg_dt)이었다
                <DataItemRow 
                  item={item}
                  index={index}
                  idPrefix="data-search"
                  onTitleRender={(title) => highlightSearchTerm(title, searchTerm)}
                  href={getDataDetailPath(String(item.id))}
                />
              )}
            />
          </Table>
        </div>
      </div>
    </Layout>
  );
}