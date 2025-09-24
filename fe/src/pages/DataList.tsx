import { Link, useSearchParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Sidebar } from '../components/ui/Sidebar';
import { FilterSection } from '../components/ui/FilterSection';
import { FilterOption } from '../components/ui/FilterOption';
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
      const themeNames = { phy: '신체적 자립', emo: '정서적 자립', econ: '경제적 자립', soc: '사회적 자립' };
      return themeNames[activeValue as keyof typeof themeNames] || '신체적 자립';
    } else {
      const typeNames = { basic: '기초 데이터', poi: '이동권 데이터', emp: '고용 데이터' };
      return typeNames[activeValue as keyof typeof typeNames] || '기초 데이터';
    }
  };

  const getDescription = () => {
    if (activeFilter === 'theme') {
      const descriptions = {
        phy: '이동 능력, 일상생활 동작, 건강 상태 등\n신체기능과 관련된 데이터',
        emo: '정서적 안정, 심리적 건강, 사회적 관계 등\n정서적 자립과 관련된 데이터',
        econ: '경제적 독립, 취업, 소득 등\n경제적 자립과 관련된 데이터',
        soc: '사회적 참여, 커뮤니케이션, 관계 형성 등\n사회적 자립과 관련된 데이터'
      };
      return descriptions[activeValue as keyof typeof descriptions] || descriptions.phy;
    } else {
      const descriptions = {
        basic: '장애인과 관련된 기본 통계 및 기초 자료',
        poi: '교통·보행 등 장애인 이동 및 접근성과 관련된 자료',
        emp: '고용 현황, 취업 지원, 직업 활동과 관련된 자료'
      };
      return descriptions[activeValue as keyof typeof descriptions] || descriptions.basic;
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
            <FilterOption
              id="data-list-theme-phy"
              name="신체적 자립"
              count={181}
              isActive={activeValue === 'phy' && activeFilter === 'theme'}
              onClick={() => window.location.href = '/data-list?theme=phy'}
            />
            <FilterOption
              id="data-list-theme-emo"
              name="정서적 자립"
              count={142}
              isActive={activeValue === 'emo' && activeFilter === 'theme'}
              onClick={() => window.location.href = '/data-list?theme=emo'}
            />
            <FilterOption
              id="data-list-theme-econ"
              name="경제적 자립"
              count={98}
              isActive={activeValue === 'econ' && activeFilter === 'theme'}
              onClick={() => window.location.href = '/data-list?theme=econ'}
            />
            <FilterOption
              id="data-list-theme-soc"
              name="사회적 자립"
              count={75}
              isActive={activeValue === 'soc' && activeFilter === 'theme'}
              onClick={() => window.location.href = '/data-list?theme=soc'}
            />
          </FilterSection>

          <FilterSection idPrefix="data-list-type" title="데이터 유형별">
            <FilterOption
              id="data-list-type-basic"
              name="기초 데이터"
              count={2790}
              isActive={activeValue === 'basic' && activeFilter === 'type'}
              onClick={() => window.location.href = '/data-list?type=basic'}
            />
            <FilterOption
              id="data-list-type-poi"
              name="이동권 데이터"
              count={312}
              isActive={activeValue === 'poi' && activeFilter === 'type'}
              onClick={() => window.location.href = '/data-list?type=poi'}
            />
            <FilterOption
              id="data-list-type-emp"
              name="고용 데이터"
              count={56}
              isActive={activeValue === 'emp' && activeFilter === 'type'}
              onClick={() => window.location.href = '/data-list?type=emp'}
            />
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