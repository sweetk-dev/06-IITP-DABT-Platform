import { Link } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Sidebar } from '../../components/ui/Sidebar';
import { FilterSection } from '../../components/ui/FilterSection';
import { FilterOption } from '../../components/ui/FilterOption';
import { Icon } from '../../components/ui/Icon';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Tag } from '../../components/ui/Tag';
import { SELF_REL_TYPE_CONSTANTS, type SelfRelTypeCode } from '../../../../packages/common/src/types';

export function SelfCheckMore() {
  return (
    <Layout idPrefix="self-check-more">
      {/* Header Section - Figma Design */}
      <section id="self-check-more-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <img src="/question.svg" alt="자가진단 아이콘" style={{ width: '32px', height: '32px' }} />
          <h1 id="self-check-more-title" style={{
            fontSize: '32px',
            fontWeight: 700,
            lineHeight: '38px',
            margin: 0,
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-family-primary)'
          }}>
            자가진단 결과 더보기
          </h1>
        </div>
        <p id="self-check-more-desc" style={{
          fontSize: '16px',
          fontFamily: 'var(--font-family-primary)',
          color: 'var(--color-text-secondary)',
          marginBottom: '32px'
        }}>
          자립 수준별 맞춤 정보 및 서비스
        </p>
      </section>

      {/* Main Content - Figma Design */}
      <section id="self-check-more-content" style={{ 
        display: 'grid', 
        gridTemplateColumns: '280px 1fr', 
        gap: '40px', 
        marginTop: '32px' 
      }}>
        {/* Sidebar Filters - 공통 컴포넌트 사용 */}
        <Sidebar idPrefix="self-check-more" title="필터">
          {/* Independence Level Filter */}
          <FilterSection idPrefix="self-check-more-levels" title="자립 수준">
            {[
              { name: '초급', count: 45, icon: <Icon name="star-line" size="s" color="var(--color-primary)" /> },
              { name: '중급', count: 78, icon: <Icon name="star-fill" size="s" color="var(--color-primary)" /> },
              { name: '고급', count: 32, icon: <Icon name="star-fill" size="s" color="var(--color-primary)" /> }
            ].map((level, idx) => (
              <FilterOption
                key={level.name}
                id={`self-check-more-filter-level-${idx+1}`}
                name={level.name}
                count={level.count}
                icon={level.icon}
              />
            ))}
          </FilterSection>

          {/* Self Rel Type Filter */}
          <FilterSection idPrefix="self-check-more-types" title="자립 유형">
            {SELF_REL_TYPE_CONSTANTS.ALL_CODES.filter(code => code !== 'basic').map((typeCode) => {
              const typeInfo = SELF_REL_TYPE_CONSTANTS.SELF_REL_TYPES[typeCode];
              const counts = { phys: 45, emo: 32, econ: 28, soc: 21 };
              return (
                <FilterOption
                  key={typeCode}
                  id={`self-check-more-filter-type-${typeCode}`}
                  name={typeInfo.name}
                  count={counts[typeCode]}
                />
              );
            })}
          </FilterSection>

          {/* Service Type Filter */}
          <FilterSection idPrefix="self-check-more-services" title="서비스 유형" marginBottom={false}>
            {[
              { name: '정보 제공', count: 89, icon: <Icon name="information-line" size="s" color="var(--color-primary)" /> },
              { name: '교육 프로그램', count: 56, icon: <Icon name="book-open-line" size="s" color="var(--color-primary)" /> },
              { name: '상담 서비스', count: 23, icon: <Icon name="customer-service-line" size="s" color="var(--color-primary)" /> }
            ].map((service, idx) => (
              <FilterOption
                key={service.name}
                id={`self-check-more-filter-service-${idx+1}`}
                name={service.name}
                count={service.count}
                icon={service.icon}
              />
            ))}
          </FilterSection>
        </Sidebar>

        {/* Main Content Area */}
        <div id="self-check-more-main">
          {/* Search Bar */}
          <div id="self-check-more-search" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '24px',
            gap: '12px'
          }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Icon 
                name="search-line" 
                size="m" 
                style={{ 
                  position: 'absolute', 
                  left: '16px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-secondary)'
                }} 
              />
              <input 
                id="self-check-more-search-input" 
                placeholder="서비스명으로 검색" 
                style={{ 
                  width: '100%',
                  padding: '12px 16px 12px 48px', 
                  borderRadius: '12px', 
                  border: '1px solid var(--color-border-secondary)',
                  fontSize: '16px',
                  background: 'var(--color-bg-primary)',
                  color: 'var(--color-text-primary)'
                }} 
              />
            </div>
            <Button id="self-check-more-search-btn" variant="primary" size="m">
              검색
            </Button>
          </div>

          {/* Service List */}
          <div id="self-check-more-cards" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { 
                id: '1', 
                title: '장애인 자립생활 지원센터', 
                tags: ['초급', '정보제공'],
                organization: '보건복지부',
                date: '2025.01.15',
                description: '장애인의 자립생활을 위한 종합적인 지원 서비스 안내'
              },
              { 
                id: '2', 
                title: '직업재활훈련 프로그램', 
                tags: ['중급', '교육프로그램'],
                organization: '한국장애인고용공단',
                date: '2025.01.14',
                description: '장애인의 직업적 자립을 위한 맞춤형 훈련 프로그램'
              },
              { 
                id: '3', 
                title: '심리상담 서비스', 
                tags: ['고급', '상담서비스'],
                organization: '한국장애인개발원',
                date: '2025.01.13',
                description: '장애인의 정서적 자립을 위한 전문 심리상담 서비스'
              },
              { 
                id: '4', 
                title: '자립준비금 지원', 
                tags: ['초급', '정보제공'],
                organization: '보건복지부',
                date: '2025.01.12',
                description: '장애인의 자립생활을 위한 경제적 지원 제도 안내'
              }
            ].map((item) => (
              <Link key={item.id} to={`/self-check/service/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card 
                  id={`self-check-more-item-${item.id}`}
                  variant="elevated"
                  padding="l"
                  hover={true}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        fontSize: '18px', 
                        fontWeight: 600, 
                        marginBottom: '8px',
                        color: 'var(--color-text-primary)'
                      }}>
                        {item.title}
                      </h3>
                      <p style={{ 
                        fontSize: '14px', 
                        color: 'var(--color-text-secondary)',
                        marginBottom: '12px',
                        lineHeight: '1.4'
                      }}>
                        {item.description}
                      </p>
                    </div>
                    <Icon name="arrow-right-s-line" size="m" color="var(--color-text-secondary)" />
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {item.tags.map((tag, idx) => (
                        <Tag key={idx} variant="primary" size="s">{tag}</Tag>
                      ))}
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: 'var(--color-text-secondary)',
                      textAlign: 'right'
                    }}>
                      <div>{item.organization}</div>
                      <div>최종수정: {item.date}</div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}