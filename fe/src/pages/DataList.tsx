import { Link, useSearchParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Sidebar } from '../components/ui/Sidebar';
import { FilterSection } from '../components/ui/FilterSection';
import { FilterOption } from '../components/ui/FilterOption';
import { THEME_CONSTANTS, DATA_TYPE_CONSTANTS, getThemeName, getDataTypeName, type ThemeCode, type DataTypeCode } from '../../../packages/common/src/types';
import '../styles/data-pages.css';

export function DataList() {
  const [searchParams] = useSearchParams();
  const theme = searchParams.get('theme');
  const type = searchParams.get('type');
  
  // 필터 상태 결정
  const activeFilter = theme ? 'theme' : type ? 'type' : 'theme';
  const activeValue = theme || type || 'phy';

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
      const counts = { phy: '181', emo: '142', econ: '98', soc: '75' };
      return counts[activeValue as keyof typeof counts] || '181';
    } else {
      const counts = { basic: '2790', poi: '312', emp: '56' };
      return counts[activeValue as keyof typeof counts] || '2790';
    }
  };

  return (
    <Layout idPrefix="data-list">
      <div id="data-list-container" className="data-list-container">
        {/* Sidebar */}
        <Sidebar idPrefix="data-list" title="필터">
          <FilterSection idPrefix="data-list-theme" title="자립 테마별">
            {THEME_CONSTANTS.ALL_CODES.map((themeCode) => {
              const themeInfo = THEME_CONSTANTS.THEMES[themeCode];
              const counts = { phy: 181, emo: 142, econ: 98, soc: 75 };
              return (
                <FilterOption
                  key={themeCode}
                  id={`data-list-theme-${themeCode}`}
                  name={themeInfo.name}
                  count={counts[themeCode]}
                  isActive={activeValue === themeCode && activeFilter === 'theme'}
                  onClick={() => window.location.href = `/data-list?theme=${themeCode}`}
                />
              );
            })}
          </FilterSection>

          <FilterSection idPrefix="data-list-type" title="데이터 유형별">
            {DATA_TYPE_CONSTANTS.ALL_CODES.map((dataTypeCode) => {
              const dataTypeInfo = DATA_TYPE_CONSTANTS.DATA_TYPES[dataTypeCode];
              const counts = { basic: 2790, poi: 312, emp: 56 };
              return (
                <FilterOption
                  key={dataTypeCode}
                  id={`data-list-type-${dataTypeCode}`}
                  name={dataTypeInfo.name}
                  count={counts[dataTypeCode]}
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
              <div id="data-list-row-1" className="data-row">
                <div id="data-list-row-1-info" className="data-info">
                  <div id="data-list-row-1-title" className="data-title">
                    일상생활 도와주는 사람 1순위
                  </div>
                  <div id="data-list-row-1-meta" className="data-meta">
                    <div id="data-list-row-1-meta-format" className="meta-item">
                      <span id="data-list-row-1-meta-format-label" className="meta-label">제공 포맷</span>
                      <span id="data-list-row-1-meta-format-value" className="meta-value">csv</span>
                    </div>
                    <div id="data-list-row-1-meta-separator-1" className="meta-separator"></div>
                    <div id="data-list-row-1-meta-org" className="meta-item">
                      <span id="data-list-row-1-meta-org-label" className="meta-label">제공 기관</span>
                      <span id="data-list-row-1-meta-org-value" className="meta-value">한국장애인고용공단</span>
                    </div>
                    <div id="data-list-row-1-meta-separator-2" className="meta-separator"></div>
                    <div id="data-list-row-1-meta-date" className="meta-item">
                      <span id="data-list-row-1-meta-date-label" className="meta-label">등록일</span>
                      <span id="data-list-row-1-meta-date-value" className="meta-value">2023.01.07</span>
                    </div>
                  </div>
                </div>
                <div id="data-list-row-1-tags" className="data-tags">
                  <div id="data-list-row-1-tag-1" className="tag">일상지원</div>
                  <div id="data-list-row-1-tag-2" className="tag">방문돌봄</div>
                  <div id="data-list-row-1-tag-3" className="tag">장애인</div>
                </div>
              </div>

              <div id="data-list-row-2" className="data-row">
                <div id="data-list-row-2-info" className="data-info">
                  <div id="data-list-row-2-title" className="data-title">
                    장애인 일상생활 지원 서비스 이용 현황
                  </div>
                  <div id="data-list-row-2-meta" className="data-meta">
                    <div id="data-list-row-2-meta-format" className="meta-item">
                      <span id="data-list-row-2-meta-format-label" className="meta-label">제공 포맷</span>
                      <span id="data-list-row-2-meta-format-value" className="meta-value">xlsx</span>
                    </div>
                    <div id="data-list-row-2-meta-separator-1" className="meta-separator"></div>
                    <div id="data-list-row-2-meta-org" className="meta-item">
                      <span id="data-list-row-2-meta-org-label" className="meta-label">제공 기관</span>
                      <span id="data-list-row-2-meta-org-value" className="meta-value">보건복지부</span>
                    </div>
                    <div id="data-list-row-2-meta-separator-2" className="meta-separator"></div>
                    <div id="data-list-row-2-meta-date" className="meta-item">
                      <span id="data-list-row-2-meta-date-label" className="meta-label">등록일</span>
                      <span id="data-list-row-2-meta-date-value" className="meta-value">2023.02.15</span>
                    </div>
                  </div>
                </div>
                <div id="data-list-row-2-tags" className="data-tags">
                  <div id="data-list-row-2-tag-1" className="tag">생활체육</div>
                  <div id="data-list-row-2-tag-2" className="tag">운동</div>
                  <div id="data-list-row-2-tag-3" className="tag">건강</div>
                </div>
              </div>

              <div id="data-list-row-3" className="data-row">
                <div id="data-list-row-3-info" className="data-info">
                  <div id="data-list-row-3-title" className="data-title">
                    장애인 보조기구 사용 현황
                  </div>
                  <div id="data-list-row-3-meta" className="data-meta">
                    <div id="data-list-row-3-meta-format" className="meta-item">
                      <span id="data-list-row-3-meta-format-label" className="meta-label">제공 포맷</span>
                      <span id="data-list-row-3-meta-format-value" className="meta-value">json</span>
                    </div>
                    <div id="data-list-row-3-meta-separator-1" className="meta-separator"></div>
                    <div id="data-list-row-3-meta-org" className="meta-item">
                      <span id="data-list-row-3-meta-org-label" className="meta-label">제공 기관</span>
                      <span id="data-list-row-3-meta-org-value" className="meta-value">한국보조기기개발원</span>
                    </div>
                    <div id="data-list-row-3-meta-separator-2" className="meta-separator"></div>
                    <div id="data-list-row-3-meta-date" className="meta-item">
                      <span id="data-list-row-3-meta-date-label" className="meta-label">등록일</span>
                      <span id="data-list-row-3-meta-date-value" className="meta-value">2023.03.22</span>
                    </div>
                  </div>
                </div>
                <div id="data-list-row-3-tags" className="data-tags">
                  <div id="data-list-row-3-tag-1" className="tag">보조기구</div>
                  <div id="data-list-row-3-tag-2" className="tag">재활</div>
                  <div id="data-list-row-3-tag-3" className="tag">지원</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}