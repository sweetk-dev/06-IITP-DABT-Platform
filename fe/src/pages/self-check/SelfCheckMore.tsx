import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Sidebar } from '../../components/ui/Sidebar';
import { FilterSection } from '../../components/ui/FilterSection';
import { FilterOption } from '../../components/ui/FilterOption';
import { Modal } from '../../components/ui/Modal';
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
} from '../../components/ui/Table';
import { 
  SELF_CHECK_MORE_CONSTANTS, 
  type SelfCheckMoreMenuType,
  getSelfCheckMoreMenuName,
  formatCount,
  SELF_CHECK_POLICIES_DEFAULTS,
  SELF_CHECK_PROVIDERS_DEFAULTS,
  SELF_CHECK_FACILITIES_DEFAULTS,
  SELF_RLTY_TYPE_CONSTANTS,
  GENDER_CONSTANTS,
  AGE_COND_CONSTANTS,
  DIS_LEVEL_CONSTANTS
} from '@iitp-dabt-platform/common';
import { useRecommendations, usePolicies, useProviders, useFacilities } from '../../api/hooks';
import '../../styles/data-pages.css';

export function SelfCheckMore() {
  const [searchParams] = useSearchParams();
  
  // URL parameter에서 메뉴와 자가진단 결과 가져오기
  const menuParam = searchParams.get('menu') as SelfCheckMoreMenuType | null;
  const themesParam = searchParams.get('themes') || '';
  
  const [selectedMenu, setSelectedMenu] = useState<SelfCheckMoreMenuType>(
    menuParam || SELF_CHECK_MORE_CONSTANTS.MENU_TYPES.policies.code // URL parameter 또는 기본값
  );

  // Modal 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    description: ''
  });

  // ============================================================================
  // API 데이터 조회 (immediate=false로 설정, 필요시에만 호출)
  // ============================================================================
  
  // 자가진단 관련 API 호출 - immediate=false로 설정
  const recommendationsState = useRecommendations({ themes: themesParam }, false);
  const policiesState = usePolicies({ 
    themes: themesParam, 
    page: SELF_CHECK_POLICIES_DEFAULTS.PAGE, 
    pageSize: SELF_CHECK_POLICIES_DEFAULTS.PAGE_SIZE 
  }, false);
  const providersState = useProviders({ 
    page: SELF_CHECK_PROVIDERS_DEFAULTS.PAGE, 
    pageSize: SELF_CHECK_PROVIDERS_DEFAULTS.PAGE_SIZE 
  }, false);
  const facilitiesState = useFacilities({ 
    page: SELF_CHECK_FACILITIES_DEFAULTS.PAGE, 
    pageSize: SELF_CHECK_FACILITIES_DEFAULTS.PAGE_SIZE 
  }, false);

  // selectedMenu 변경시 해당 API만 호출
  useEffect(() => {
    switch (selectedMenu) {
      case 'policies':
        policiesState.execute();
        break;
      case 'providers':
        providersState.execute();
        break;
      case 'facilities':
        facilitiesState.execute();
        break;
    }
  }, [selectedMenu]);

  // 메뉴 데이터 정의 - common 패키지의 상수 사용
  const menuItems = SELF_CHECK_MORE_CONSTANTS.ALL_CODES.map((code: SelfCheckMoreMenuType) => ({
    id: code,
    name: getSelfCheckMoreMenuName(code)
  }));

  // 현재 선택된 메뉴에 따른 API 데이터 상태 결정
  const getCurrentApiState = () => {
    switch (selectedMenu) {
      case 'policies':
        return policiesState;
      case 'providers':
        return providersState;
      case 'facilities':
        return facilitiesState;
      default:
        return recommendationsState;
    }
  };

  const currentApiState = getCurrentApiState();
  // API 응답 형식이 다름: recommendations는 배열, 나머지는 PaginationRes
  const currentData = Array.isArray(currentApiState.data) 
    ? currentApiState.data 
    : (currentApiState.data?.items || []);

  // 메뉴 클릭 핸들러
  const handleMenuClick = (menuType: SelfCheckMoreMenuType) => {
    setSelectedMenu(menuType);
  };

  // 카드 클릭 핸들러
  const handleCardClick = (item: any) => {
    if (item.link) {
      // 링크가 있으면 새창으로 열기
      window.open(item.link, '_blank', 'noopener,noreferrer');
    } else {
      // 링크가 없으면 상세 정보 표시 (Modal)
      const itemTitle = item.title || item.policy_name || item.provider_name || item.device || '정보';
      setModalContent({
        title: '준비 중입니다',
        description: `${itemTitle}의 상세 정보는 준비 중입니다.\n곧 서비스 예정입니다.`
      });
      setIsModalOpen(true);
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
    if (currentApiState.loading) return '...';
    
    // API 응답 형식이 다름: recommendations는 배열, 나머지는 PaginationRes
    if (Array.isArray(currentApiState.data)) {
      return formatCount(currentApiState.data.length);
    }
    return formatCount(currentApiState.data?.total);
  };

  // ============================================================================
  // 유형별 메타 정보 렌더링 함수들
  // ============================================================================

  // Policy 메타 정보 렌더링
  const renderPolicyMeta = (item: any, index: number) => (
    <DataMeta id={`self-check-more-row-${index + 1}-meta`}>
      {item.region && (
        <MetaItem
          label="지역"
          value={item.region}
          labelId={`self-check-more-row-${index + 1}-meta-region-label`}
          valueId={`self-check-more-row-${index + 1}-meta-region-value`}
          separatorId={`self-check-more-row-${index + 1}-meta-separator-1`}
        />
      )}
      {item.dis_level && (
        <MetaItem
          label="장애정도"
          value={item.dis_level.split(',').map((level: string) => 
            DIS_LEVEL_CONSTANTS.DIS_LEVEL[level.trim() as keyof typeof DIS_LEVEL_CONSTANTS.DIS_LEVEL]?.name || level.trim()
          ).join(', ')}
          labelId={`self-check-more-row-${index + 1}-meta-dis-level-label`}
          valueId={`self-check-more-row-${index + 1}-meta-dis-level-value`}
          separatorId={`self-check-more-row-${index + 1}-meta-separator-2`}
        />
      )}
      {item.gender && (
        <MetaItem
          label="성별"
          value={item.gender.split(',').map((g: string) => 
            GENDER_CONSTANTS.GENDER[g.trim() as keyof typeof GENDER_CONSTANTS.GENDER]?.name || g.trim()
          ).join(', ')}
          labelId={`self-check-more-row-${index + 1}-meta-gender-label`}
          valueId={`self-check-more-row-${index + 1}-meta-gender-value`}
          separatorId={`self-check-more-row-${index + 1}-meta-separator-3`}
        />
      )}
      {item.age_cond && (
        <MetaItem
          label="연령조건"
          value={item.age_cond.split(',').map((age: string) => 
            AGE_COND_CONSTANTS.AGE_COND[age.trim() as keyof typeof AGE_COND_CONSTANTS.AGE_COND]?.name || age.trim()
          ).join(', ')}
          labelId={`self-check-more-row-${index + 1}-meta-age-cond-label`}
          valueId={`self-check-more-row-${index + 1}-meta-age-cond-value`}
          separatorId={`self-check-more-row-${index + 1}-meta-separator-4`}
        />
      )}
    </DataMeta>
  );

  // Provider 메타 정보 렌더링
  const renderProviderMeta = (item: any, index: number) => (
    <DataMeta id={`self-check-more-row-${index + 1}-meta`}>
      {item.phone && (
        <MetaItem
          label="전화번호"
          value={item.phone}
          labelId={`self-check-more-row-${index + 1}-meta-phone-label`}
          valueId={`self-check-more-row-${index + 1}-meta-phone-value`}
          separatorId={`self-check-more-row-${index + 1}-meta-separator-1`}
        />
      )}
      {item.address && (
        <MetaItem
          label="주소"
          value={item.address}
          labelId={`self-check-more-row-${index + 1}-meta-address-label`}
          valueId={`self-check-more-row-${index + 1}-meta-address-value`}
          separatorId={`self-check-more-row-${index + 1}-meta-separator-2`}
        />
      )}
    </DataMeta>
  );

  // Facility 메타 정보 렌더링
  const renderFacilityMeta = (item: any, index: number) => {
    // 설치정보 조합: install_area + install_site + (install_spot)
    let installInfo = '';
    if (item.install_area) {
      installInfo += item.install_area;
    }
    if (item.install_site) {
      installInfo += (installInfo ? ' ' : '') + item.install_site;
    }
    if (item.install_spot) {
      installInfo += (installInfo ? ' ' : '') + '(' + item.install_spot + ')';
    }

    return (
      <DataMeta id={`self-check-more-row-${index + 1}-meta`}>
        {installInfo && (
          <MetaItem
            label="설치정보"
            value={installInfo}
            labelId={`self-check-more-row-${index + 1}-meta-install-label`}
            valueId={`self-check-more-row-${index + 1}-meta-install-value`}
            separatorId={`self-check-more-row-${index + 1}-meta-separator-1`}
          />
        )}
        {item.opening_hours && (
          <MetaItem
            label="운영시간"
            value={item.opening_hours}
            labelId={`self-check-more-row-${index + 1}-meta-hours-label`}
            valueId={`self-check-more-row-${index + 1}-meta-hours-value`}
            separatorId={`self-check-more-row-${index + 1}-meta-separator-2`}
          />
        )}
        {item.address && (
          <MetaItem
            label="주소"
            value={item.address}
            labelId={`self-check-more-row-${index + 1}-meta-address-label`}
            valueId={`self-check-more-row-${index + 1}-meta-address-value`}
            separatorId={`self-check-more-row-${index + 1}-meta-separator-3`}
          />
        )}
      </DataMeta>
    );
  };

  // ============================================================================
  // 유형별 태그 렌더링 함수들
  // ============================================================================

  // Policy 태그 렌더링
  const renderPolicyTags = (item: any, index: number) => (
    <>
      {item.self_rlty_type && (
        <Tag id={`self-check-more-row-${index + 1}-tag-self-rlty-type`}>
          {SELF_RLTY_TYPE_CONSTANTS.SELF_REL_TYPES[item.self_rlty_type as keyof typeof SELF_RLTY_TYPE_CONSTANTS.SELF_REL_TYPES]?.shortName || item.self_rlty_type}
        </Tag>
      )}
      {item.category && (
        <Tag id={`self-check-more-row-${index + 1}-tag-category`}>{item.category}</Tag>
      )}
    </>
  );

  // Provider 태그 렌더링
  const renderProviderTags = (item: any, index: number) => (
    <>
      {item.service_name && (
        <Tag id={`self-check-more-row-${index + 1}-tag-service-name`}>
          {item.service_name}
        </Tag>
      )}
    </>
  );

  // Facility 태그 렌더링 (현재 정의 없음)
  const renderFacilityTags = (item: any, index: number) => (
    <></>
  );

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
  
            <TableBodyWithState
              id="self-check-more-table-body"
              data={currentData}
              loading={currentApiState.loading}
              error={currentApiState.error}
              emptyMessage="데이터가 없습니다."
              loadingMessage="로딩 중..."
              errorMessage="데이터를 불러오는 중 오류가 발생했습니다."
              renderRow={(item: any, index: number) => (
                <TableRow 
                  key={item.id || index} 
                  id={`self-check-more-row-${index + 1}`}
                >
                  <TableCell variant="info" id={`self-check-more-row-${index + 1}-info`}>
                    <DataTitle id={`self-check-more-row-${index + 1}-title`}>
                      {item.title || item.policy_name || item.provider_name || item.device || '제목'}
                    </DataTitle>
                    {/* 유형별 메타 정보 렌더링 */}
                    {selectedMenu === 'policies' && renderPolicyMeta(item, index)}
                    {selectedMenu === 'providers' && renderProviderMeta(item, index)}
                    {selectedMenu === 'facilities' && renderFacilityMeta(item, index)}
                  </TableCell>
                  <TableCell variant="tags" id={`self-check-more-row-${index + 1}-tags`}>
                    {/* 유형별 태그 렌더링 */}
                    {selectedMenu === 'policies' && renderPolicyTags(item, index)}
                    {selectedMenu === 'providers' && renderProviderTags(item, index)}
                    {selectedMenu === 'facilities' && renderFacilityTags(item, index)}
                  </TableCell>
                </TableRow>
              )}
            />
          </Table>
        </div>
      </div>

      {/* Modal - 상세 정보 준비 중 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalContent.title}
        description={modalContent.description}
        primaryButtonText="확인"
      />
    </Layout>
  );
}