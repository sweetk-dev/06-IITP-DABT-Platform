import { useSearchParams, useNavigate } from 'react-router-dom';
import { getDataDetailPath } from './App';
import { Layout } from '../components/layout/Layout';
import { Sidebar } from '../components/ui/Sidebar';
import { FilterSection } from '../components/ui/FilterSection';
import { FilterOption } from '../components/ui/FilterOption';
import { Table, TableHeader, TableBodyWithState, TableColumn, DataItemRow } from '../components/ui/Table';
import { THEME_CONSTANTS, DATA_TYPE_CONSTANTS, getThemeName, getDataTypeName, formatCount, type ThemeCode, type DataTypeCode, DATA_THEME_ITEMS_DEFAULTS, DATA_TYPE_ITEMS_DEFAULTS } from '@iitp-dabt-platform/common';
import { useThemeItems, useTypeItems } from '../api/hooks';
import '../styles/data-pages.css';

export function DataList() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const theme = searchParams.get('theme');
  const type = searchParams.get('type');
  const category = searchParams.get('category'); // 'theme' 또는 'type' 전체보기
  
  // 필터 상태 결정
  const hasFilter = Boolean(theme || type);
  const activeFilter = theme ? 'theme' : type ? 'type' : (category || 'theme');
  const activeValue = theme || type || null;

  // ============================================================================
  // API 데이터 조회 (common 패키지의 모든 타입 활용)
  // ============================================================================
  
  // 테마별 데이터 조회 (theme 없으면 전체)
  const themeItemsState = useThemeItems(
    activeFilter === 'theme' ? (theme || null) : undefined, 
    { 
      page: DATA_THEME_ITEMS_DEFAULTS.PAGE, 
      pageSize: DATA_THEME_ITEMS_DEFAULTS.PAGE_SIZE 
    }
  );
  
  // 데이터 유형별 데이터 조회 (type 없으면 전체)
  const typeItemsState = useTypeItems(
    activeFilter === 'type' ? (type || null) : undefined,
    { 
      page: DATA_TYPE_ITEMS_DEFAULTS.PAGE, 
      pageSize: DATA_TYPE_ITEMS_DEFAULTS.PAGE_SIZE 
    }
  );
  
  const getTitle = () => {
    if (!hasFilter && !category) {
      return '전체 데이터';
    }
    if (category === 'theme' && !theme) {
      return '자립 테마 데이터';
    }
    if (category === 'type' && !type) {
      return '데이터 유형별 데이터';
    }
    if (activeFilter === 'theme') {
      return getThemeName(activeValue as ThemeCode) || '신체적 자립';
    } else {
      return getDataTypeName(activeValue as DataTypeCode) || '기초 데이터';
    }
  };

  const getDescription = () => {
    if (!hasFilter && !category) {
      return '모든 자립 테마 및 데이터 유형의 데이터를 확인할 수 있습니다.';
    }
    if (category === 'theme' && !theme) {
      return '자립 테마 데이터를 확인할 수 있습니다.';
    }
    if (category === 'type' && !type) {
      return '데이터 유형별 데이터를 확인할 수 있습니다.';
    }
    if (activeFilter === 'theme') {
      const themeInfo = THEME_CONSTANTS.THEMES[activeValue as ThemeCode];
      return themeInfo?.description || THEME_CONSTANTS.THEMES.phys.description;
    } else {
      const dataTypeInfo = DATA_TYPE_CONSTANTS.DATA_TYPES[activeValue as DataTypeCode];
      return dataTypeInfo?.description || DATA_TYPE_CONSTANTS.DATA_TYPES.basic.description;
    }
  };

  const getCount = () => {
    // API 응답의 total 필드 사용 (BE가 PaginationRes 형식으로 반환)
    const currentState = activeFilter === 'theme' ? themeItemsState : typeItemsState;
    return formatCount(currentState.data?.total);
  };

  // 현재 데이터 상태 결정
  const currentDataState = activeFilter === 'theme' ? themeItemsState : typeItemsState;

  // [2026-10] 브라우저 탭 제목도 화면 제목과 같게 ("신체적 자립 | 장애인 자립 지원 허브")
  const pageTitle = getTitle();

  return (
    <Layout idPrefix="data-list" pageTitle={pageTitle}>
      <div id="data-list-container" className="data-list-container">
        {/* Sidebar */}
        <Sidebar idPrefix="data-list" title="필터">
          <FilterSection idPrefix="data-list-theme" title="자립 테마별">
            {THEME_CONSTANTS.ALL_CODES.map((themeCode) => {
              const themeInfo = THEME_CONSTANTS.THEMES[themeCode];
              return (
                <FilterOption
                  key={themeCode}
                  id={`data-list-theme-${themeCode}`}
                  name={themeInfo.name}
                  isActive={hasFilter && activeValue === themeCode && activeFilter === 'theme'}
                  onClick={() => navigate(`/data-list?theme=${themeCode}`)}
                />
              );
            })}
          </FilterSection>

          <FilterSection idPrefix="data-list-type" title="데이터 유형별">
            {DATA_TYPE_CONSTANTS.ALL_CODES.map((dataTypeCode) => {
              const dataTypeInfo = DATA_TYPE_CONSTANTS.DATA_TYPES[dataTypeCode];
              return (
                <FilterOption
                  key={dataTypeCode}
                  id={`data-list-type-${dataTypeCode}`}
                  name={dataTypeInfo.name}
                  isActive={hasFilter && activeValue === dataTypeCode && activeFilter === 'type'}
                  onClick={() => navigate(`/data-list?type=${dataTypeCode}`)}
                />
              );
            })}
          </FilterSection>
        </Sidebar>

        {/* Main Content */}
        <div id="data-list-main-content" className="main-content">
          <div id="data-list-page-header" className="page-header">
            {/* [2026-10 접근성] 화면 제목을 h1 으로 (기존 div — 화면에 h1 이 하나도 없었음) */}
            <h1 id="data-list-page-title" className="page-title-large">{pageTitle}</h1>
            <div id="data-list-page-description" className="page-description">
              {getDescription()}
            </div>
            {/* 필터를 바꾸면 건수가 바뀌므로 스크린리더에 변경을 알림(role="status") */}
            <div id="data-list-data-count" className="data-count" role="status">
              총 <span id="data-list-count-number" className="count-number">{getCount()}</span> 건
            </div>
          </div>

          {/* Data List Table */}
          <Table id="data-list-table">
            <TableHeader id="data-list-table-header">
              <TableColumn id="data-list-table-column-title" variant="title">데이터명</TableColumn>
              <TableColumn id="data-list-table-column-tags" variant="tags">태그</TableColumn>
            </TableHeader>

            <TableBodyWithState
              id="data-list-table-body"
              data={currentDataState.data?.items || []}
              loading={currentDataState.loading}
              error={currentDataState.error}
              emptyMessage="데이터가 없습니다."
              renderRow={(item: any, index: number) => (
                // [2026-10] 줄 클릭(onClick) → 제목 링크(href). 날짜는 목록·검색 모두 "최종 수정일"
                <DataItemRow 
                  item={item}
                  index={index}
                  idPrefix="data-list"
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