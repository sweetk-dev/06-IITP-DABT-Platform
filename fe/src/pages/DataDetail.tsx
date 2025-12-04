import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from './App';
import { Layout } from '../components/layout/Layout';
import { Modal } from '../components/ui/Modal';
import { Tag } from '../components/ui/Tag';
import { Button } from '../components/ui/Button';
import { useDataDetail, useDataPreview } from '../api/hooks';
import { DATA_TYPE_CONSTANTS, THEME_CONSTANTS, type DataTypeCode, type ThemeCode, parseKeywords, formatDate } from '@iitp-dabt-platform/common';

export function DataDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isOpenApiModalOpen, setIsOpenApiModalOpen] = useState(false);

  // ============================================================================
  // API 데이터 조회 (common 패키지의 모든 타입 활용)
  // ============================================================================
  
  // 데이터 상세 정보 조회
  const dataDetailState = useDataDetail(id ? parseInt(id) : 0);
  
  // 데이터 미리보기 조회
  const dataPreviewState = useDataPreview(id ? parseInt(id) : 0);

  const detailData = dataDetailState.data;

  // 키워드를 배열로 변환 (common 패키지의 parseKeywords 사용)
  const keywords = parseKeywords(detailData?.data_keywords);

  // 커스텀 브레드크럼 생성 (데이터 유형 기반)
  const customBreadcrumbItems = [
    { label: '홈', href: ROUTE_PATHS.HOME },
    { label: '데이터 목록', href: ROUTE_PATHS.DATA_LIST },
    // 데이터 유형(data_type)을 우선적으로 표시
    ...(detailData?.data_type ? [
      { 
        label: DATA_TYPE_CONSTANTS.DATA_TYPES[detailData.data_type as DataTypeCode]?.name || detailData.data_type,
        href: `${ROUTE_PATHS.DATA_LIST}?type=${detailData.data_type}`
      }
    ] : []),
    { 
      label: detailData?.title || '데이터 상세', 
      active: true 
    }
  ];

  const handleBackClick = () => {
    navigate(ROUTE_PATHS.DATA_LIST);
  };

  const handleChartClick = () => {
    setIsChartModalOpen(true);
  };

  const handleChartConfirm = () => {
    const visualToolUrl = import.meta.env.VITE_VISUAL_TOOL || '#';
    window.open(visualToolUrl, '_blank');
    setIsChartModalOpen(false);
  };

  const handleDownloadClick = () => {
    setIsDownloadModalOpen(true);
  };

  const handleOpenApiClick = () => {
    setIsOpenApiModalOpen(true);
  };

  const handleOpenApiConfirm = () => {
    const openApiCenterUrl = import.meta.env.VITE_OPEN_API_CENTER_URL || '#';
    window.open(openApiCenterUrl, '_blank');
    setIsOpenApiModalOpen(false);
  };

  return (
    <Layout idPrefix="data-detail" customBreadcrumbItems={customBreadcrumbItems}>
      {/* Data Detail Header */}
      <div id="data-detail-header" className="data-detail-header" style={{
        marginBottom: '32px'
      }}>
        <h1 id="data-detail-title" className="data-title-large" style={{ 
          fontSize: '32px', 
          fontWeight: 700, 
          marginBottom: '12px',
          color: 'black'
        }}>
          {dataDetailState.loading ? '로딩 중...' : 
           dataDetailState.error ? '데이터를 불러올 수 없습니다' :
           detailData?.title || '데이터 제목'}
        </h1>
        
        <p id="data-detail-description" className="data-description" style={{
          fontSize: '20px',
          color: 'black',
          lineHeight: '30px',
          fontWeight: 400,
          marginBottom: '0'
        }}>
          {detailData?.data_desc || '데이터 설명이 없습니다.'}
        </p>
      </div>

      {/* Data Info Table */}
      <div id="data-info-table" className="data-info-table" style={{
        borderTop: '1.5px solid #252525',
        marginBottom: '64px'
      }}>
        {/* 데이터 유형 */}
        <div className="info-row" style={{
          display: 'flex',
          borderBottom: '1px solid #ECECEC',
          minHeight: '56px'
        }}>
          <div className="info-label" style={{
            width: '200px',
            padding: '16px 20px',
            background: '#f8f9fa',
            fontWeight: 600,
            fontSize: '14px',
            color: 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'center',
            borderRight: '1px solid #ECECEC'
          }}>
            데이터 유형
          </div>
          <div className="info-value" style={{
            flex: 1,
            padding: '16px 20px',
            fontSize: '14px',
            color: 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'center'
          }}>
            {detailData?.data_type 
              ? DATA_TYPE_CONSTANTS.DATA_TYPES[detailData.data_type as DataTypeCode].name 
              : '-'}
          </div>
        </div>

        {/* 키워드 */}
        <div className="info-row" style={{
          display: 'flex',
          borderBottom: '1px solid #ECECEC',
          minHeight: '56px'
        }}>
          <div className="info-label" style={{
            width: '200px',
            padding: '16px 20px',
            background: '#f8f9fa',
            fontWeight: 600,
            fontSize: '14px',
            color: 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'center',
            borderRight: '1px solid #ECECEC'
          }}>
            키워드
          </div>
          <div className="info-value" style={{
            flex: 1,
            padding: '16px 20px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            {keywords.length > 0 ? (
              keywords.map((keyword: string, index: number) => (
                <Tag key={index} variant="primary" size="s">
                  {keyword}
                </Tag>
              ))
            ) : (
              <span style={{ color: 'var(--color-text-secondary)' }}>-</span>
            )}
          </div>
        </div>

        {/* 제공 포맷 */}
        <div className="info-row" style={{
          display: 'flex',
          borderBottom: '1px solid #ECECEC',
          minHeight: '56px'
        }}>
          <div className="info-label" style={{
            width: '200px',
            padding: '16px 20px',
            background: '#f8f9fa',
            fontWeight: 600,
            fontSize: '14px',
            color: 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'center',
            borderRight: '1px solid #ECECEC'
          }}>
            제공 포맷
          </div>
          <div className="info-value" style={{
            flex: 1,
            padding: '16px 20px',
            fontSize: '14px',
            color: 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'center'
          }}>
            {detailData?.data_format || '-'}
          </div>
        </div>

        {/* 제공 기관 */}
        <div className="info-row" style={{
          display: 'flex',
          borderBottom: '1px solid #ECECEC',
          minHeight: '56px'
        }}>
          <div className="info-label" style={{
            width: '200px',
            padding: '16px 20px',
            background: '#f8f9fa',
            fontWeight: 600,
            fontSize: '14px',
            color: 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'center',
            borderRight: '1px solid #ECECEC'
          }}>
            제공 기관
          </div>
          <div className="info-value" style={{
            flex: 1,
            padding: '16px 20px',
            fontSize: '14px',
            color: 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'center'
          }}>
            {detailData?.src_org_name || '-'}
          </div>
        </div>

        {/* 최종 수정일 */}
        <div className="info-row" style={{
          display: 'flex',
          borderBottom: '1px solid #ECECEC',
          minHeight: '56px'
        }}>
          <div className="info-label" style={{
            width: '200px',
            padding: '16px 20px',
            background: '#f8f9fa',
            fontWeight: 600,
            fontSize: '14px',
            color: 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'center',
            borderRight: '1px solid #ECECEC'
          }}>
            최종 수정일
          </div>
          <div className="info-value" style={{
            flex: 1,
            padding: '16px 20px',
            fontSize: '14px',
            color: 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'center'
          }}>
            {formatDate(detailData?.src_latest_chn_dt)}
          </div>
        </div>

        {/* 데이터 등록일 */}
        <div className="info-row" style={{
          display: 'flex',
          minHeight: '56px'
        }}>
          <div className="info-label" style={{
            width: '200px',
            padding: '16px 20px',
            background: '#f8f9fa',
            fontWeight: 600,
            fontSize: '14px',
            color: 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'center',
            borderRight: '1px solid #ECECEC'
          }}>
            데이터 등록일
          </div>
          <div className="info-value" style={{
            flex: 1,
            padding: '16px 20px',
            fontSize: '14px',
            color: 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'center'
          }}>
            {formatDate(detailData?.sys_data_reg_dt)}
          </div>
        </div>

        {/* 이용 허락 범위 - 마지막 행이므로 하단 보더 없음 */}
        <div className="info-row" style={{
          display: 'flex',
          border: 'none',
          borderRight: '0',
          borderBottom: '0',
          minHeight: '56px'
        }}>
          <div className="info-label" style={{
            width: '200px',
            padding: '16px 20px',
            background: '#f8f9fa',
            fontWeight: 600,
            fontSize: '14px',
            color: 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'center',
            borderRight: '1px solid #ECECEC'
          }}>
            이용 허락 범위
          </div>
          <div className="info-value" style={{
            flex: 1,
            padding: '16px 20px',
            fontSize: '14px',
            color: 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'center'
          }}>
            {detailData?.data_usage_scope || '-'}
          </div>
        </div>
      </div>

      {/* Data View Section */}
      <div id="data-view-section" className="data-view-section" style={{
        marginBottom: '32px'
      }}>
        <div className="data-view-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '24px',
          borderBottom: '1px solid #ECECEC',
          marginBottom: '24px'
        }}>
          <h2 className="section-title" style={{
            fontSize: '28px',
            fontWeight: 600,
            color: 'black',
            margin: 0
          }}>
            데이터 보기
          </h2>
          <div className="action-buttons" style={{
            display: 'flex',
            gap: '12px'
          }}>
            <Button 
              variant="secondary" 
              size="m"
              onClick={handleChartClick}
            >
              차트보기
            </Button>
            <Button 
              variant="primary" 
              size="m"
              onClick={handleDownloadClick}
            >
              다운로드
            </Button>
          </div>
        </div>

        {/* Data Preview Table */}
        {dataPreviewState.loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            데이터를 불러오는 중...
          </div>
        ) : dataPreviewState.error ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-danger)' }}>
            데이터 미리보기를 불러올 수 없습니다.
          </div>
        ) : dataPreviewState.data && Array.isArray(dataPreviewState.data) && dataPreviewState.data.length > 0 ? (() => {
          // 컬럼 순서 정의
          const columnOrder = ['prdDe', 'c1ObjNm', 'c1Nm', 'c2ObjNm', 'c2Nm', 'c3ObjNm', 'c3Nm', 'itmNm', 'data', 'unitNm', 'lstChnDe'];
          
          // 컬럼명 한글 매핑
          const columnLabels: Record<string, string> = {
            'prdDe': '년도',
            'c1ObjNm': '분류1',
            'c1Nm': '분류1 항목',
            'c2ObjNm': '분류2',
            'c2Nm': '분류2 항목',
            'c3ObjNm': '분류3',
            'c3Nm': '분류3 항목',
            'itmNm': '데이터 항목',
            'data': '데이터',
            'unitNm': '단위',
            'lstChnDe': '최종 수정일'
          };
          
          // 실제 데이터에 존재하는 컬럼만 필터링하고 순서대로 정렬
          const availableColumns = columnOrder.filter(key => 
            dataPreviewState.data[0] && key in dataPreviewState.data[0]
          );
          
          return (
            <div style={{
              borderTop: '1.5px solid #252525',
              overflow: 'auto'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                backgroundColor: 'white'
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#f8f9fa',
                    borderBottom: '2px solid #dee2e6'
                  }}>
                    {availableColumns.map((key, index) => (
                      <th key={index} style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#333',
                        borderBottom: '1px solid #dee2e6',
                        whiteSpace: 'nowrap'
                      }}>
                        {columnLabels[key] || key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataPreviewState.data.map((row: any, rowIndex: number) => (
                    <tr key={rowIndex} style={{
                      borderBottom: '1px solid #dee2e6',
                      backgroundColor: rowIndex % 2 === 0 ? 'white' : '#f8f9fa'
                    }}>
                      {availableColumns.map((key, colIndex) => (
                        <td key={colIndex} style={{
                          padding: '12px 16px',
                          color: '#555',
                          whiteSpace: 'nowrap'
                        }}>
                          {row[key] !== null && row[key] !== undefined ? String(row[key]) : '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })() : (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            미리보기 데이터가 없습니다.
          </div>
        )}
      </div>

      {/* Open API 센터 버튼 */}
      <div id="open-api-section" className="open-api-section" style={{
        marginTop: '32px',
        marginBottom: '64px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <button
          className="btn-open-api-center"
          onClick={handleOpenApiClick}
          style={{
            background: 'white',
            color: 'black',
            outline: '1px solid #dadada',
            outlineOffset: '-1px',
            border: 'none',
            padding: '14px 24px',
            borderRadius: '16px',
            fontSize: '20px',
            fontFamily: 'Pretendard',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            minWidth: '200px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f8f9fa';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
          }}
        >
          Open API 센터
        </button>
      </div>

      {/* 차트보기 모달 */}
      <Modal
        isOpen={isChartModalOpen}
        onClose={() => setIsChartModalOpen(false)}
        title="시각화 도구로 이동"
        description="데이터 시각화 도구로 이동하시겠습니까?"
        primaryButtonText="이동"
        secondaryButtonText="취소"
        onPrimaryClick={handleChartConfirm}
        onSecondaryClick={() => setIsChartModalOpen(false)}
      />

      {/* 다운로드 준비중 모달 */}
      <Modal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        title="준비중인 기능입니다"
        description="데이터 다운로드 기능은 현재 준비 중입니다.\n빠른 시일 내에 서비스할 예정입니다."
        primaryButtonText="확인"
        onPrimaryClick={() => setIsDownloadModalOpen(false)}
      />

      {/* Open API 센터 모달 */}
      <Modal
        isOpen={isOpenApiModalOpen}
        onClose={() => setIsOpenApiModalOpen(false)}
        title="Open API 센터로 이동"
        description="Open API 센터로 이동이 필요합니다.<br/>이동하시겠습니까?"
        primaryButtonText="이동하기"
        secondaryButtonText="취소"
        onPrimaryClick={handleOpenApiConfirm}
        onSecondaryClick={() => setIsOpenApiModalOpen(false)}
        helpText="Open API 센터는 무엇인가요?"
        helpTextLink={import.meta.env.VITE_OPEN_API_CENTER_ABOUT_URL}
        allowHtml={true}
        autoHeight={true}
      />
    </Layout>
  );
}