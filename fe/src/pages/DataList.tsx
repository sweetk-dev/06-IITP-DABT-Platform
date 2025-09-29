import { Link, useSearchParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Sidebar } from '../components/ui/Sidebar';
import { FilterSection } from '../components/ui/FilterSection';
import { FilterOption } from '../components/ui/FilterOption';
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
          <div id="data-list-table" className="data-table">
            <div id="data-list-table-header" className="data-table-header">
              <div id="data-list-table-column-title" className="table-column-title">데이터명</div>
              <div id="data-list-table-column-tags" className="table-column-tags">태그</div>
            </div>

            <div id="data-list-table-body" className="data-table-body">
              {currentDataState.loading ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>로딩 중...</div>
              ) : currentDataState.error ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-danger)' }}>
                  데이터를 불러오는 중 오류가 발생했습니다.
                </div>
              ) : currentDataState.data && currentDataState.data.length > 0 ? (
                currentDataState.data.map((item: any, index: number) => (
                  <div key={item.id || index} id={`data-list-row-${index + 1}`} className="data-row">
                    <div id={`data-list-row-${index + 1}-info`} className="data-info">
                      <div id={`data-list-row-${index + 1}-title`} className="data-title">
                        {item.title || item.data_name || '데이터 제목'}
                      </div>
                      <div id={`data-list-row-${index + 1}-meta`} className="data-meta">
                        <div id={`data-list-row-${index + 1}-meta-format`} className="meta-item">
                          <span id={`data-list-row-${index + 1}-meta-format-label`} className="meta-label">제공 포맷</span>
                          <span id={`data-list-row-${index + 1}-meta-format-value`} className="meta-value">
                            {item.format || 'csv'}
                          </span>
                        </div>
                        <div id={`data-list-row-${index + 1}-meta-separator-1`} className="meta-separator"></div>
                        <div id={`data-list-row-${index + 1}-meta-org`} className="meta-item">
                          <span id={`data-list-row-${index + 1}-meta-org-label`} className="meta-label">제공 기관</span>
                          <span id={`data-list-row-${index + 1}-meta-org-value`} className="meta-value">
                            {item.src_org_name || '제공 기관'}
                          </span>
                        </div>
                        <div id={`data-list-row-${index + 1}-meta-separator-2`} className="meta-separator"></div>
                        <div id={`data-list-row-${index + 1}-meta-date`} className="meta-item">
                          <span id={`data-list-row-${index + 1}-meta-date-label`} className="meta-label">등록일</span>
                          <span id={`data-list-row-${index + 1}-meta-date-value`} className="meta-value">
                            {item.sys_data_reg_dt || '2023.01.07'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div id={`data-list-row-${index + 1}-tags`} className="data-tags">
                      {item.tags && item.tags.length > 0 ? (
                        item.tags.map((tag: string, tagIndex: number) => (
                          <div key={tagIndex} id={`data-list-row-${index + 1}-tag-${tagIndex + 1}`} className="tag">
                            {tag}
                          </div>
                        ))
                      ) : (
                        <>
                          <div id={`data-list-row-${index + 1}-tag-1`} className="tag">일상지원</div>
                          <div id={`data-list-row-${index + 1}-tag-2`} className="tag">방문돌봄</div>
                          <div id={`data-list-row-${index + 1}-tag-3`} className="tag">장애인</div>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '40px', textAlign: 'center' }}>데이터가 없습니다.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}