// 새로운 API 구조 사용 예시
import React from 'react';
import { 
  useLatestData, 
  useThemeCounts, 
  useTypeCounts, 
  useDataSearch,
  useRecommendations,
  usePolicies
} from '../api/hooks';
import { dataService, selfCheckService } from '../api/services';

export function ApiUsageExample() {
  // ============================================================================
  // 1. 훅을 사용한 API 호출 (권장)
  // ============================================================================
  
  // 최신 데이터 리스트 조회
  const { data: latestData, loading: latestLoading, error: latestError } = useLatestData({ limit: 6 });
  
  // 자립테마 데이터 건수 조회
  const { data: themeCounts, loading: themeLoading } = useThemeCounts();
  
  // 데이터 유형별 데이터 건수 조회
  const { data: typeCounts, loading: typeLoading } = useTypeCounts();
  
  // 데이터 검색
  const { data: searchResults, loading: searchLoading, execute: search } = useDataSearch({
    q: '장애인',
    themes: 'phy,emo',
    page: 1,
    pageSize: 20
  });

  // 추천 정책 조회
  const { data: recommendations, loading: recLoading } = useRecommendations({
    gender: 'male',
    disLevel: 'mild',
    ageCond: 'adult',
    themes: 'phy,emo',
    limit: 3
  });

  // ============================================================================
  // 2. 서비스를 사용한 직접 API 호출
  // ============================================================================
  
  const handleDirectApiCall = async () => {
    try {
      // 데이터 서비스 사용 (새로운 구조)
      const latestData = await dataService.getLatestData({ limit: 10 });
      console.log('Latest data:', latestData);
      
      const themeCounts = await dataService.getThemeCounts();
      console.log('Theme counts:', themeCounts);
      
      // 자가진단 서비스 사용 (새로운 구조)
      const policies = await selfCheckService.getPolicies({
        themes: 'phy,emo',
        page: 1,
        pageSize: 10
      });
      console.log('Policies:', policies);
      
    } catch (error) {
      // 에러는 자동으로 ErrorAlert로 표시됨
      console.error('API call failed:', error);
    }
  };

  // ============================================================================
  // 3. 조건부 API 호출
  // ============================================================================
  
  const handleConditionalSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    try {
      const results = await dataService.searchData({
        q: searchTerm,
        page: 1,
        pageSize: 10
      });
      console.log('Search results:', results);
    } catch (error) {
      // 에러는 자동으로 ErrorAlert로 표시됨
      console.error('Search failed:', error);
    }
  };

  // ============================================================================
  // 4. 에러 처리 (자동으로 ErrorAlert 표시)
  // ============================================================================
  
  if (latestError) {
    // 에러는 이미 ErrorAlert로 표시되므로 여기서는 로그만 출력
    console.log('Latest data error:', latestError);
  }

  // ============================================================================
  // 5. 데이터 렌더링
  // ============================================================================
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>새로운 API 구조 사용 예시</h2>
      
      {/* 최신 데이터 표시 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>최신 데이터</h3>
        {latestLoading ? (
          <div>로딩 중...</div>
        ) : (
          <ul>
            {latestData?.map((item: any, index: number) => (
              <li key={index}>
                {item.title} - {item.src_org_name}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* 테마 건수 표시 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>테마별 데이터 건수</h3>
        {themeLoading ? (
          <div>로딩 중...</div>
        ) : (
          <div>
            <p>신체적 자립: {themeCounts?.phy}건</p>
            <p>정서적 자립: {themeCounts?.emo}건</p>
            <p>경제적 자립: {themeCounts?.econ}건</p>
            <p>사회적 자립: {themeCounts?.soc}건</p>
          </div>
        )}
      </div>
      
      {/* 데이터 유형 건수 표시 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>데이터 유형별 건수</h3>
        {typeLoading ? (
          <div>로딩 중...</div>
        ) : (
          <div>
            <p>기초 데이터: {typeCounts?.basic}건</p>
            <p>이동권 데이터: {typeCounts?.poi}건</p>
            <p>일자리 데이터: {typeCounts?.emp}건</p>
          </div>
        )}
      </div>
      
      {/* 검색 결과 표시 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>검색 결과</h3>
        {searchLoading ? (
          <div>검색 중...</div>
        ) : (
          <ul>
            {searchResults?.items?.map((item: any, index: number) => (
              <li key={index}>
                {item.title} - {item.data_type}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* 추천 정책 표시 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>추천 정책</h3>
        {recLoading ? (
          <div>로딩 중...</div>
        ) : (
          <ul>
            {recommendations?.map((policy: any, index: number) => (
              <li key={index}>
                {policy.policy_name} - {policy.category}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* 버튼들 */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={handleDirectApiCall}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0090ff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          직접 API 호출
        </button>
        <button 
          onClick={() => handleConditionalSearch('장애인')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          '장애인' 검색
        </button>
        <button 
          onClick={() => search()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          검색 새로고침
        </button>
      </div>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
        <h4>새로운 API 구조의 장점:</h4>
        <ul>
          <li>✅ <strong>타입 안전성</strong>: 컴파일 타임에 API 호출 오류 방지</li>
          <li>✅ <strong>자동 에러 처리</strong>: API 에러가 자동으로 ErrorAlert로 표시</li>
          <li>✅ <strong>일관된 구조</strong>: 모든 API가 동일한 패턴으로 처리</li>
          <li>✅ <strong>재사용성</strong>: 훅과 서비스를 통해 코드 재사용</li>
          <li>✅ <strong>유지보수성</strong>: API 관련 로직이 한 곳에 집중</li>
        </ul>
      </div>
    </div>
  );
}
