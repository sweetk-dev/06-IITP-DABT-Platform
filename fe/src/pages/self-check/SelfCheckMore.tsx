import { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Sidebar } from '../../components/ui/Sidebar';
import { FilterSection } from '../../components/ui/FilterSection';
import { FilterOption } from '../../components/ui/FilterOption';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableCell, 
  TableColumn,
  DataTitle,
  DataMeta,
  MetaItem,
  DataTags,
  Tag
} from '../../components/ui/Table';
import { 
  SELF_CHECK_MORE_CONSTANTS, 
  type SelfCheckMoreMenuType,
  getSelfCheckMoreMenuName 
} from '@iitp-dabt-platform/common';
import { getSelfCheckMoreApiEndpoint } from '../../config/api';
import '../../styles/data-pages.css';

export function SelfCheckMore() {
  const [selectedMenu, setSelectedMenu] = useState<SelfCheckMoreMenuType>('policies'); // 기본값: 자립 지원 정책

  // 메뉴 데이터 정의 - common 패키지의 상수 사용
  const menuItems = SELF_CHECK_MORE_CONSTANTS.ALL_CODES.map((code: SelfCheckMoreMenuType) => ({
    id: code,
    name: getSelfCheckMoreMenuName(code)
  }));

  // TODO: API 연동으로 실제 데이터 가져오기
  // const policies = await getSelfCheckPolicies();
  // const providers = await getSelfCheckProviders(); 
  // const facilities = await getSelfCheckFacilities();

  // 임시 데이터 (API 연동 시 제거)
  const mockData = {
    policies: [
      {
        id: '1',
        title: '장애인연금',
        category: '생활 안정 지원',
        organization: '보건복지부',
        description: '장애로 인한 생활의 어려움을 해소하기 위한 기초생활보장제도',
        link: 'https://example.com/policy/1'
      },
      {
        id: '2', 
        title: '장애수당',
        category: '생활 안정 지원',
        organization: '보건복지부',
        description: '장애인에게 지급되는 월정액 수당',
        link: 'https://example.com/policy/2'
      },
      {
        id: '3',
        title: '장애인 자립생활 지원',
        category: '자립생활 지원',
        organization: '보건복지부',
        description: '장애인의 자립생활을 위한 종합적인 지원 서비스',
        link: 'https://example.com/policy/3'
      }
    ],
    providers: [
      {
        id: '1',
        title: '장애인자립생활지원센터',
        organization: '보건복지부',
        address: '서울특별시 중구 세종대로 110',
        phone: '02-1234-5678',
        description: '장애인의 자립생활을 위한 종합적인 지원 서비스'
      },
      {
        id: '2',
        title: '한국장애인고용공단',
        organization: '고용노동부',
        address: '서울특별시 영등포구 여의대로 92',
        phone: '02-2345-6789',
        description: '장애인 고용촉진 및 직업재활 지원'
      }
    ],
    facilities: [
      {
        id: '1',
        title: '무장애 화장실',
        location: '서울시청',
        address: '서울특별시 중구 세종대로 110',
        hours: '24시간 이용가능',
        description: '휠체어 이용자를 위한 무장애 화장실'
      },
      {
        id: '2',
        title: '장애인 전용 주차장',
        location: '강남구청',
        address: '서울특별시 강남구 테헤란로 521',
        hours: '평일 09:00-18:00',
        description: '장애인 전용 주차공간 제공'
      }
    ]
  };

  const currentData = mockData[selectedMenu as keyof typeof mockData];

  // 메뉴 클릭 핸들러
  const handleMenuClick = (menuType: SelfCheckMoreMenuType) => {
    setSelectedMenu(menuType);
    // TODO: 해당 메뉴의 API 호출
    // const apiEndpoint = getSelfCheckMoreApiEndpoint(menuType);
    // fetchData(apiEndpoint);
  };

  // 카드 클릭 핸들러
  const handleCardClick = (item: any) => {
    if (item.link) {
      // 링크가 있으면 새창으로 열기
      window.open(item.link, '_blank', 'noopener,noreferrer');
    } else {
      // 링크가 없으면 상세 정보 표시
      alert(`${item.title} 상세 정보는 준비 중입니다.`);
    }
  };

  // 메뉴별 제목과 설명 가져오기
  const getTitle = () => {
    return getSelfCheckMoreMenuName(selectedMenu);
  };

  const getDescription = () => {
    return SELF_CHECK_MORE_CONSTANTS.MENU_TYPES[selectedMenu].description;
  };

  const getCount = () => {
    // TODO: API에서 실제 건수 가져오기
    return currentData.length;
  };

  return (
    <Layout idPrefix="self-check-more">
      <div id="self-check-more-container" className="data-list-container">
        {/* Sidebar */}
        <Sidebar idPrefix="self-check-more" title="필터">
          <FilterSection idPrefix="self-check-more-menu" title="자립 지원 정보">
            {menuItems.map((menu: { id: SelfCheckMoreMenuType; name: string }) => (
              <FilterOption
                key={menu.id}
                id={`self-check-more-menu-${menu.id}`}
                name={menu.name}
                isActive={selectedMenu === menu.id}
                onClick={() => handleMenuClick(menu.id)}
              />
            ))}
          </FilterSection>
        </Sidebar>

        {/* Main Content */}
        <div id="self-check-more-main-content" className="main-content">
          <div id="self-check-more-page-header" className="page-header">
            <div id="self-check-more-page-title" className="page-title-large">{getTitle()}</div>
            <div id="self-check-more-page-description" className="page-description">
              {getDescription()}
            </div>
            <div id="self-check-more-data-count" className="data-count">
              총 <span id="self-check-more-count-number" className="count-number">{getCount()}</span> 건
            </div>
          </div>

          {/* Content List Table */}
          <Table id="self-check-more-table">
            <TableHeader id="self-check-more-table-header">
              <TableColumn id="self-check-more-table-column-title" variant="title">
                {selectedMenu === 'policies' ? '정책명' : selectedMenu === 'providers' ? '기관명' : '시설명'}
              </TableColumn>
              <TableColumn id="self-check-more-table-column-tags" variant="tags">태그</TableColumn>
            </TableHeader>

            <TableBody id="self-check-more-table-body">
              {currentData.map((item: any, index: number) => (
                <TableRow 
                  key={item.id} 
                  id={`self-check-more-row-${index + 1}`} 
                  onClick={() => handleCardClick(item)}
                >
                  <TableCell variant="info" id={`self-check-more-row-${index + 1}-info`}>
                    <DataTitle id={`self-check-more-row-${index + 1}-title`}>
                      {item.title}
                    </DataTitle>
                    <DataMeta id={`self-check-more-row-${index + 1}-meta`}>
                      {item.category && (
                        <MetaItem
                          label="카테고리"
                          value={item.category}
                          labelId={`self-check-more-row-${index + 1}-meta-category-label`}
                          valueId={`self-check-more-row-${index + 1}-meta-category-value`}
                          separatorId={`self-check-more-row-${index + 1}-meta-separator-1`}
                        />
                      )}
                      {item.organization && (
                        <MetaItem
                          label="제공 기관"
                          value={item.organization}
                          labelId={`self-check-more-row-${index + 1}-meta-org-label`}
                          valueId={`self-check-more-row-${index + 1}-meta-org-value`}
                          separatorId={`self-check-more-row-${index + 1}-meta-separator-2`}
                        />
                      )}
                      {item.location && (
                        <MetaItem
                          label="위치"
                          value={item.location}
                          labelId={`self-check-more-row-${index + 1}-meta-location-label`}
                          valueId={`self-check-more-row-${index + 1}-meta-location-value`}
                          separatorId={`self-check-more-row-${index + 1}-meta-separator-3`}
                        />
                      )}
                      <MetaItem
                        label="등록일"
                        value="2025.01.15"
                        labelId={`self-check-more-row-${index + 1}-meta-date-label`}
                        valueId={`self-check-more-row-${index + 1}-meta-date-value`}
                      />
                    </DataMeta>
                  </TableCell>
                  <TableCell variant="tags" id={`self-check-more-row-${index + 1}-tags`}>
                    {item.category && (
                      <Tag id={`self-check-more-row-${index + 1}-tag-category`}>{item.category}</Tag>
                    )}
                    {item.organization && (
                      <Tag id={`self-check-more-row-${index + 1}-tag-org`}>{item.organization}</Tag>
                    )}
                    {item.location && (
                      <Tag id={`self-check-more-row-${index + 1}-tag-location`}>{item.location}</Tag>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}