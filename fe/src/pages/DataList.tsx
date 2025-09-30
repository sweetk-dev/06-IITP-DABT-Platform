import { Link, useSearchParams } from 'react-router-dom';
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
import { THEME_CONSTANTS, DATA_TYPE_CONSTANTS, getThemeName, getDataTypeName, type ThemeCode, type DataTypeCode, DATA_THEME_ITEMS_DEFAULTS, DATA_TYPE_ITEMS_DEFAULTS } from '@iitp-dabt-platform/common';
import { useThemeItems, useTypeItems, useThemeCounts, useTypeCounts } from '../api/hooks';
import '../styles/data-pages.css';

export function DataList() {
  const [searchParams] = useSearchParams();
  const theme = searchParams.get('theme');
  const type = searchParams.get('type');
  
  // 필터 상태 결정
  const activeFilter = theme ? 'theme' : type ? 'type' : 'theme';
  const activeValue = theme || type || 'phy';

  // ============================================================================
  // API 데이터 조회 (common 패키지의 모든 타입 활용)
  // ============================================================================
  
  // 테마별 데이터 조회
  const themeItemsState = useThemeItems(activeValue, { 
    page: DATA_THEME_ITEMS_DEFAULTS.PAGE, 
    pageSize: DATA_THEME_ITEMS_DEFAULTS.PAGE_SIZE 
  });
  
  // 데이터 유형별 데이터 조회
  const typeItemsState = useTypeItems(activeValue, { 
    page: DATA_TYPE_ITEMS_DEFAULTS.PAGE, 
    pageSize: DATA_TYPE_ITEMS_DEFAULTS.PAGE_SIZE 
  });
  
  // 테마별 건수 조회
  const themeCountsState = useThemeCounts();
  
  // 데이터 유형별 건수 조회
  const typeCountsState = useTypeCounts();

  const getTitle = () => {
    if (activeFilter === 'theme') {
      return getThemeName(activeValue as ThemeCode) || '신체적 자립';
    } else {
      return getDataTypeName(activeValue as DataTypeCode) || '기초 데이터';
    }
  };

  const getDescription = () => {
    if (activeFilter === 'theme') {
      const themeInfo = THEME_CONSTANTS.THEMES[activeValue as ThemeCode];
      return themeInfo?.description || THEME_CONSTANTS.THEMES.phy.description;
    } else {
      const dataTypeInfo = DATA_TYPE_CONSTANTS.DATA_TYPES[activeValue as DataTypeCode];
      return dataTypeInfo?.description || DATA_TYPE_CONSTANTS.DATA_TYPES.basic.description;
    }
  };

  const getCount = () => {
    if (activeFilter === 'theme') {
      return themeCountsState.data?.[activeValue as keyof typeof themeCountsState.data]?.toLocaleString() || '0';
    } else {
      return typeCountsState.data?.[activeValue as keyof typeof typeCountsState.data]?.toLocaleString() || '0';
    }
  };

  // 현재 데이터 상태 결정
  const currentDataState = activeFilter === 'theme' ? themeItemsState : typeItemsState;

  return (
    <Layout idPrefix="data-list">
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
                  isActive={activeValue === themeCode && activeFilter === 'theme'}
                  onClick={() => window.location.href = `/data-list?theme=${themeCode}`}
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
                  isActive={activeValue === dataTypeCode && activeFilter === 'type'}
                  onClick={() => window.location.href = `/data-list?type=${dataTypeCode}`}
                />
              );
            })}
          </FilterSection>
        </Sidebar>

        {/* Main Content */}
        <div id="data-list-main-content" className="main-content">
          <div id="data-list-page-header" className="page-header">
            <div id="data-list-page-title" className="page-title-large">{getTitle()}</div>
            <div id="data-list-page-description" className="page-description">
              {getDescription()}
            </div>
            <div id="data-list-data-count" className="data-count">
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
              data={currentDataState.data || []}
              loading={currentDataState.loading}
              error={currentDataState.error}
              emptyMessage="데이터가 없습니다."
              renderRow={(item: any, index: number) => (
                <TableRow key={item.id || index} id={`data-list-row-${index + 1}`}>
                  <TableCell variant="info" id={`data-list-row-${index + 1}-info`}>
                    <DataTitle id={`data-list-row-${index + 1}-title`}>
                      {item.title || item.data_name || '데이터 제목'}
                    </DataTitle>
                    <DataMeta id={`data-list-row-${index + 1}-meta`}>
                      <MetaItem
                        label="제공 포맷"
                        value={item.format || 'csv'}
                        labelId={`data-list-row-${index + 1}-meta-format-label`}
                        valueId={`data-list-row-${index + 1}-meta-format-value`}
                        separatorId={`data-list-row-${index + 1}-meta-separator-1`}
                      />
                      <MetaItem
                        label="제공 기관"
                        value={item.src_org_name || '제공 기관'}
                        labelId={`data-list-row-${index + 1}-meta-org-label`}
                        valueId={`data-list-row-${index + 1}-meta-org-value`}
                        separatorId={`data-list-row-${index + 1}-meta-separator-2`}
                      />
                      <MetaItem
                        label="등록일"
                        value={item.sys_data_reg_dt || '2023.01.07'}
                        labelId={`data-list-row-${index + 1}-meta-date-label`}
                        valueId={`data-list-row-${index + 1}-meta-date-value`}
                      />
                    </DataMeta>
                  </TableCell>
                  <TableCell variant="tags" id={`data-list-row-${index + 1}-tags`}>
                    <DataTags>
                      {item.tags && item.tags.length > 0 ? (
                        item.tags.map((tag: string, tagIndex: number) => (
                          <Tag key={tagIndex} id={`data-list-row-${index + 1}-tag-${tagIndex + 1}`}>
                            {tag}
                          </Tag>
                        ))
                      ) : (
                        <>
                          <Tag id={`data-list-row-${index + 1}-tag-1`}>일상지원</Tag>
                          <Tag id={`data-list-row-${index + 1}-tag-2`}>방문돌봄</Tag>
                          <Tag id={`data-list-row-${index + 1}-tag-3`}>장애인</Tag>
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