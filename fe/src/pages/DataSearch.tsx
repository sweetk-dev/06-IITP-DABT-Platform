import { useSearchParams, useNavigate } from 'react-router-dom';
import { getDataListPath } from './App';
import { Layout } from '../components/layout/Layout';
import { Sidebar } from '../components/ui/Sidebar';
import { FilterSection } from '../components/ui/FilterSection';
import { FilterOption } from '../components/ui/FilterOption';
import { 
  Table, 
  TableHeader, 
  TableBodyWithState,
  TableRow, 
  TableCell, 
  TableColumn,
  DataTitle,
  DataMeta,
  MetaItem,
  DataTags,
  Tag
} from '../components/ui/Table';
import { THEME_CONSTANTS, DATA_TYPE_CONSTANTS, type ThemeCode, type DataTypeCode, DATA_SEARCH_DEFAULTS } from '@iitp-dabt-platform/common';
import { useDataSearch } from '../api/hooks';

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
  const highlightSearchTerm = (text: string, term: string) => {
    if (!term) return text;
    
    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
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

  return (
    <Layout idPrefix="data-search">
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
        <div id="data-search-main-content" className="data-list-main">
          {/* Page Header */}
          <div id="data-search-page-header" className="page-header">
            <div id="data-search-page-title" className="page-title-large">
              {searchTerm ? '검색 결과' : '전체 데이터'}
            </div>
            <div id="data-search-page-description" className="page-description">
              {searchTerm ? (
                <>
                  데이터명에 '<span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{searchTerm}</span>' 키워드를 포함하는 데이터 검색 결과입니다.
                </>
              ) : (
                '모든 데이터를 확인할 수 있습니다.'
              )}
            </div>
            <div id="data-search-data-count" className="data-count">
              총 <span id="data-search-count-number" className="count-number">
                {searchState.loading ? '...' : 
                 searchState.data?.totalCount?.toLocaleString() || '0'}
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
                <TableRow key={item.id || index} id={`data-search-row-${index + 1}`}>
                  <TableCell variant="info" id={`data-search-row-${index + 1}-info`}>
                    <DataTitle id={`data-search-row-${index + 1}-title`}>
                      {highlightSearchTerm(item.title || item.data_name || '데이터 제목', searchTerm)}
                    </DataTitle>
                    <DataMeta id={`data-search-row-${index + 1}-meta`}>
                      <MetaItem
                        label="제공 포맷"
                        value={item.format || 'csv'}
                        labelId={`data-search-row-${index + 1}-meta-format-label`}
                        valueId={`data-search-row-${index + 1}-meta-format-value`}
                        separatorId={`data-search-row-${index + 1}-meta-separator-1`}
                      />
                      <MetaItem
                        label="제공 기관"
                        value={item.src_org_name || '제공 기관'}
                        labelId={`data-search-row-${index + 1}-meta-org-label`}
                        valueId={`data-search-row-${index + 1}-meta-org-value`}
                        separatorId={`data-search-row-${index + 1}-meta-separator-2`}
                      />
                      <MetaItem
                        label="최종 수정일"
                        value={item.sys_data_reg_dt || '2025.05.12'}
                        labelId={`data-search-row-${index + 1}-meta-date-label`}
                        valueId={`data-search-row-${index + 1}-meta-date-value`}
                      />
                    </DataMeta>
                  </TableCell>
                  <TableCell variant="tags" id={`data-search-row-${index + 1}-tags`}>
                    <DataTags>
                      {item.tags && item.tags.length > 0 ? (
                        item.tags.map((tag: string, tagIndex: number) => (
                          <Tag key={tagIndex} id={`data-search-row-${index + 1}-tag-${tagIndex + 1}`}>
                            {tag}
                          </Tag>
                        ))
                      ) : (
                        <>
                          <Tag id={`data-search-row-${index + 1}-tag-1`}>일상지원</Tag>
                          <Tag id={`data-search-row-${index + 1}-tag-2`}>방문돌봄</Tag>
                          <Tag id={`data-search-row-${index + 1}-tag-3`}>장애인</Tag>
                        </>
                      )}
                    </DataTags>
                  </TableCell>
                </TableRow>
              )}
            />
          </Table>
        </div>
      </div>
    </Layout>
  );
}