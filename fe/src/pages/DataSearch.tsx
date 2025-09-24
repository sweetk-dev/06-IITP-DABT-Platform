import { useSearchParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Sidebar } from '../components/ui/Sidebar';
import { FilterSection } from '../components/ui/FilterSection';
import { FilterOption } from '../components/ui/FilterOption';

import '../styles/data-pages.css';

export function DataSearch() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchTerm = searchParams.get('q') || '';

  // 검색어 강조 함수
  const highlightSearchTerm = (text: string, term: string) => {
    if (!term) return text;
    
    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} style={{ color: '#0090ff', fontWeight: 600 }}>
          {part}
        </span>
      ) : part
    );
  };

  // 자립 테마 클릭 핸들러
  const handleThemeClick = (theme: string) => {
    navigate(`/data-list?theme=${theme}`);
  };

  // 데이터 유형 클릭 핸들러
  const handleTypeClick = (type: string) => {
    navigate(`/data-list?type=${type}`);
  };

  return (
    <Layout idPrefix="data-search">
      <div id="data-search-container" className="data-list-container">
        {/* Sidebar - 공통 컴포넌트 사용 */}
        <Sidebar idPrefix="data-search" title="필터">
          <FilterSection idPrefix="data-search-theme" title="자립 테마별">
            <FilterOption
              id="data-search-theme-phy"
              name="신체적 자립"
              isActive={false}
              onClick={() => handleThemeClick('phy')}
            />
            <FilterOption
              id="data-search-theme-emo"
              name="정서적 자립"
              isActive={false}
              onClick={() => handleThemeClick('emo')}
            />
            <FilterOption
              id="data-search-theme-econ"
              name="경제적 자립"
              isActive={false}
              onClick={() => handleThemeClick('econ')}
            />
            <FilterOption
              id="data-search-theme-soc"
              name="사회적 자립"
              isActive={false}
              onClick={() => handleThemeClick('soc')}
            />
          </FilterSection>
          
          <FilterSection idPrefix="data-search-type" title="데이터 유형별">
            <FilterOption
              id="data-search-type-basic"
              name="기초 데이터"
              isActive={false}
              onClick={() => handleTypeClick('basic')}
            />
            <FilterOption
              id="data-search-type-poi"
              name="이동권 데이터"
              isActive={false}
              onClick={() => handleTypeClick('poi')}
            />
            <FilterOption
              id="data-search-type-emp"
              name="고용 데이터"
              isActive={false}
              onClick={() => handleTypeClick('emp')}
            />
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
                  데이터명에 '<span style={{ color: '#0090ff', fontWeight: 600 }}>{searchTerm}</span>' 키워드를 포함하는 데이터 검색 결과입니다.
                </>
              ) : (
                '모든 데이터를 확인할 수 있습니다.'
              )}
            </div>
            <div id="data-search-data-count" className="data-count">
              총 <span id="data-search-count-number" className="count-number">4</span>건
            </div>
          </div>

          {/* Data Table */}
          <div id="data-search-table" className="data-table">
            <div id="data-search-table-header" className="data-table-header">
              <div id="data-search-table-column-title" className="table-column-title">데이터명</div>
              <div id="data-search-table-column-tags" className="table-column-tags">태그</div>
            </div>

            <div id="data-search-table-body" className="data-table-body">
              <div id="data-search-row-1" className="data-row">
                <div id="data-search-row-1-info" className="data-info">
                  <div id="data-search-row-1-title" className="data-title">
                    {highlightSearchTerm('장애인 의료 이용 현황', searchTerm)}
                  </div>
                  <div id="data-search-row-1-meta" className="data-meta">
                    <div id="data-search-row-1-meta-format" className="meta-item">
                      <span id="data-search-row-1-meta-format-label" className="meta-label">제공 포맷</span>
                      <span id="data-search-row-1-meta-format-value" className="meta-value">csv</span>
                    </div>
                    <div id="data-search-row-1-meta-separator-1" className="meta-separator"></div>
                    <div id="data-search-row-1-meta-org" className="meta-item">
                      <span id="data-search-row-1-meta-org-label" className="meta-label">제공 기관</span>
                      <span id="data-search-row-1-meta-org-value" className="meta-value">한국장애인고용공단</span>
                    </div>
                    <div id="data-search-row-1-meta-separator-2" className="meta-separator"></div>
                    <div id="data-search-row-1-meta-date" className="meta-item">
                      <span id="data-search-row-1-meta-date-label" className="meta-label">최종 수정일</span>
                      <span id="data-search-row-1-meta-date-value" className="meta-value">2025.05.12</span>
                    </div>
                  </div>
                </div>
                <div id="data-search-row-1-tags" className="data-tags">
                  <span id="data-search-row-1-tag-1" className="tag">일상지원</span>
                  <span id="data-search-row-1-tag-2" className="tag">방문돌봄</span>
                  <span id="data-search-row-1-tag-3" className="tag">장애인</span>
                </div>
              </div>

              <div id="data-search-row-2" className="data-row">
                <div id="data-search-row-2-info" className="data-info">
                  <div id="data-search-row-2-title" className="data-title">
                    {highlightSearchTerm('공공기관 장애인 고용 현황', searchTerm)}
                  </div>
                  <div id="data-search-row-2-meta" className="data-meta">
                    <div id="data-search-row-2-meta-format" className="meta-item">
                      <span id="data-search-row-2-meta-format-label" className="meta-label">제공 포맷</span>
                      <span id="data-search-row-2-meta-format-value" className="meta-value">xlsx</span>
                    </div>
                    <div id="data-search-row-2-meta-separator-1" className="meta-separator"></div>
                    <div id="data-search-row-2-meta-org" className="meta-item">
                      <span id="data-search-row-2-meta-org-label" className="meta-label">제공 기관</span>
                      <span id="data-search-row-2-meta-org-value" className="meta-value">고용노동부</span>
                    </div>
                    <div id="data-search-row-2-meta-separator-2" className="meta-separator"></div>
                    <div id="data-search-row-2-meta-date" className="meta-item">
                      <span id="data-search-row-2-meta-date-label" className="meta-label">최종 수정일</span>
                      <span id="data-search-row-2-meta-date-value" className="meta-value">2025.04.28</span>
                    </div>
                  </div>
                </div>
                <div id="data-search-row-2-tags" className="data-tags">
                  <span id="data-search-row-2-tag-1" className="tag">고용</span>
                  <span id="data-search-row-2-tag-2" className="tag">공공기관</span>
                </div>
              </div>

              <div id="data-search-row-3" className="data-row">
                <div id="data-search-row-3-info" className="data-info">
                  <div id="data-search-row-3-title" className="data-title">
                    {highlightSearchTerm('민간기업 장애인 고용 현황', searchTerm)}
                  </div>
                  <div id="data-search-row-3-meta" className="data-meta">
                    <div id="data-search-row-3-meta-format" className="meta-item">
                      <span id="data-search-row-3-meta-format-label" className="meta-label">제공 포맷</span>
                      <span id="data-search-row-3-meta-format-value" className="meta-value">json</span>
                    </div>
                    <div id="data-search-row-3-meta-separator-1" className="meta-separator"></div>
                    <div id="data-search-row-3-meta-org" className="meta-item">
                      <span id="data-search-row-3-meta-org-label" className="meta-label">제공 기관</span>
                      <span id="data-search-row-3-meta-org-value" className="meta-value">한국장애인고용공단</span>
                    </div>
                    <div id="data-search-row-3-meta-separator-2" className="meta-separator"></div>
                    <div id="data-search-row-3-meta-date" className="meta-item">
                      <span id="data-search-row-3-meta-date-label" className="meta-label">최종 수정일</span>
                      <span id="data-search-row-3-meta-date-value" className="meta-value">2025.04.15</span>
                    </div>
                  </div>
                </div>
                <div id="data-search-row-3-tags" className="data-tags">
                  <span id="data-search-row-3-tag-1" className="tag">고용</span>
                  <span id="data-search-row-3-tag-2" className="tag">민간기업</span>
                </div>
              </div>

              <div id="data-search-row-4" className="data-row">
                <div id="data-search-row-4-info" className="data-info">
                  <div id="data-search-row-4-title" className="data-title">
                    {highlightSearchTerm('장애유형 및 산업 장애인 근로자 고용현황', searchTerm)}
                  </div>
                  <div id="data-search-row-4-meta" className="data-meta">
                    <div id="data-search-row-4-meta-format" className="meta-item">
                      <span id="data-search-row-4-meta-format-label" className="meta-label">제공 포맷</span>
                      <span id="data-search-row-4-meta-format-value" className="meta-value">csv</span>
                    </div>
                    <div id="data-search-row-4-meta-separator-1" className="meta-separator"></div>
                    <div id="data-search-row-4-meta-org" className="meta-item">
                      <span id="data-search-row-4-meta-org-label" className="meta-label">제공 기관</span>
                      <span id="data-search-row-4-meta-org-value" className="meta-value">통계청</span>
                    </div>
                    <div id="data-search-row-4-meta-separator-2" className="meta-separator"></div>
                    <div id="data-search-row-4-meta-date" className="meta-item">
                      <span id="data-search-row-4-meta-date-label" className="meta-label">최종 수정일</span>
                      <span id="data-search-row-4-meta-date-value" className="meta-value">2025.03.30</span>
                    </div>
                  </div>
                </div>
                <div id="data-search-row-4-tags" className="data-tags">
                  <span id="data-search-row-4-tag-1" className="tag">고용</span>
                  <span id="data-search-row-4-tag-2" className="tag">통계</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}