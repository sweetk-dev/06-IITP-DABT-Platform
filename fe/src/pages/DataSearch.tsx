import { useSearchParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import '../styles/data-pages.css';

export function DataSearch() {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('q') || '';

  return (
    <Layout idPrefix="data-search">
      {/* Search Results Header */}
      <div id="data-search-header" className="search-results-header">
        <div id="data-search-icon-title" className="search-icon-title">
          <div id="data-search-icon-large" className="search-icon-large"></div>
          <h1 id="data-search-title" className="search-title">검색 결과</h1>
        </div>
        
        {searchTerm && (
          <div id="data-search-term" className="search-term">
            "{searchTerm}"에 대한 검색 결과입니다.
          </div>
        )}

        {/* Search Results List */}
        <div id="data-search-results-container" className="search-results-container">
          <div id="data-search-table" className="data-table">
            <div id="data-search-table-header" className="data-table-header">
              <div id="data-search-table-column-title" className="table-column-title">데이터명</div>
              <div id="data-search-table-column-tags" className="table-column-tags">태그</div>
            </div>

            <div id="data-search-table-body" className="data-table-body">
              <div id="data-search-row-1" className="data-row">
                <div id="data-search-row-1-info" className="data-info">
                  <div id="data-search-row-1-title" className="data-title">
                    일상생활 도와주는 사람 1순위
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
                      <span id="data-search-row-1-meta-date-label" className="meta-label">등록일</span>
                      <span id="data-search-row-1-meta-date-value" className="meta-value">2023.01.07</span>
                    </div>
                  </div>
                </div>
                <div id="data-search-row-1-tags" className="data-tags">
                  <div id="data-search-row-1-tag-1" className="tag">일상지원</div>
                  <div id="data-search-row-1-tag-2" className="tag">방문돌봄</div>
                  <div id="data-search-row-1-tag-3" className="tag">장애인</div>
                </div>
              </div>

              <div id="data-search-row-2" className="data-row">
                <div id="data-search-row-2-info" className="data-info">
                  <div id="data-search-row-2-title" className="data-title">
                    장애인 일상생활 지원 서비스 이용 현황
                  </div>
                  <div id="data-search-row-2-meta" className="data-meta">
                    <div id="data-search-row-2-meta-format" className="meta-item">
                      <span id="data-search-row-2-meta-format-label" className="meta-label">제공 포맷</span>
                      <span id="data-search-row-2-meta-format-value" className="meta-value">xlsx</span>
                    </div>
                    <div id="data-search-row-2-meta-separator-1" className="meta-separator"></div>
                    <div id="data-search-row-2-meta-org" className="meta-item">
                      <span id="data-search-row-2-meta-org-label" className="meta-label">제공 기관</span>
                      <span id="data-search-row-2-meta-org-value" className="meta-value">보건복지부</span>
                    </div>
                    <div id="data-search-row-2-meta-separator-2" className="meta-separator"></div>
                    <div id="data-search-row-2-meta-date" className="meta-item">
                      <span id="data-search-row-2-meta-date-label" className="meta-label">등록일</span>
                      <span id="data-search-row-2-meta-date-value" className="meta-value">2023.02.15</span>
                    </div>
                  </div>
                </div>
                <div id="data-search-row-2-tags" className="data-tags">
                  <div id="data-search-row-2-tag-1" className="tag">생활체육</div>
                  <div id="data-search-row-2-tag-2" className="tag">운동</div>
                  <div id="data-search-row-2-tag-3" className="tag">건강</div>
                </div>
              </div>

              <div id="data-search-row-3" className="data-row">
                <div id="data-search-row-3-info" className="data-info">
                  <div id="data-search-row-3-title" className="data-title">
                    장애인 보조기구 사용 현황
                  </div>
                  <div id="data-search-row-3-meta" className="data-meta">
                    <div id="data-search-row-3-meta-format" className="meta-item">
                      <span id="data-search-row-3-meta-format-label" className="meta-label">제공 포맷</span>
                      <span id="data-search-row-3-meta-format-value" className="meta-value">json</span>
                    </div>
                    <div id="data-search-row-3-meta-separator-1" className="meta-separator"></div>
                    <div id="data-search-row-3-meta-org" className="meta-item">
                      <span id="data-search-row-3-meta-org-label" className="meta-label">제공 기관</span>
                      <span id="data-search-row-3-meta-org-value" className="meta-value">한국보조기기개발원</span>
                    </div>
                    <div id="data-search-row-3-meta-separator-2" className="meta-separator"></div>
                    <div id="data-search-row-3-meta-date" className="meta-item">
                      <span id="data-search-row-3-meta-date-label" className="meta-label">등록일</span>
                      <span id="data-search-row-3-meta-date-value" className="meta-value">2023.03.22</span>
                    </div>
                  </div>
                </div>
                <div id="data-search-row-3-tags" className="data-tags">
                  <div id="data-search-row-3-tag-1" className="tag">보조기구</div>
                  <div id="data-search-row-3-tag-2" className="tag">재활</div>
                  <div id="data-search-row-3-tag-3" className="tag">지원</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}