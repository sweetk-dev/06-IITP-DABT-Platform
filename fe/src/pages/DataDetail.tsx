import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from './App';
import { Layout } from '../components/layout/Layout';
import { Modal } from '../components/ui/Modal';
import { Tag } from '../components/ui/Tag';
import { Button } from '../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableColumn } from '../components/ui/Table';
import { useDataDetail, useDataPreview } from '../api/hooks';
import { DATA_TYPE_CONSTANTS, THEME_CONSTANTS, type DataTypeCode, type ThemeCode, parseKeywords } from '@iitp-dabt-platform/common';

export function DataDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

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

  // 날짜 포맷 변환 (YYYY-MM-DD → YYYY.MM.DD)
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return dateString.replace(/-/g, '.');
  };

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
              ? DATA_TYPE_CONSTANTS.NAMES[detailData.data_type as DataTypeCode] 
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
        ) : dataPreviewState.data ? (
          <div className="data-table" style={{
            borderTop: '1.5px solid #252525',
            overflow: 'hidden'
          }}>
            <pre style={{
              margin: 0,
              padding: '20px',
              background: 'white',
              fontSize: '14px',
              lineHeight: 1.6,
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              color: 'black'
            }}>
              {JSON.stringify(dataPreviewState.data, null, 2)}
            </pre>
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            미리보기 데이터가 없습니다.
          </div>
        )}
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
    </Layout>
  );
}