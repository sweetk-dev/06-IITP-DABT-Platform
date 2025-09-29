// 자가진단 API 훅들
import { useState, useEffect } from 'react';
import { selfCheckService } from '../services';
import { 
  SelfCheckRecommendationsReq,
  SelfCheckPoliciesReq,
  SelfCheckProvidersReq,
  SelfCheckFacilitiesReq,
  SELF_CHECK_RECOMMENDATIONS_DEFAULTS,
  SELF_CHECK_POLICIES_DEFAULTS,
  SELF_CHECK_PROVIDERS_DEFAULTS,
  SELF_CHECK_FACILITIES_DEFAULTS
} from '@iitp-dabt-platform/common';

// ============================================================================
// API 호출 상태 타입
// ============================================================================

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ============================================================================
// 자가진단 API 훅들
// ============================================================================

/**
 * 추천 정책 리스트 조회 훅
 */
export function useRecommendations(params: SelfCheckRecommendationsReq = {}, immediate: boolean = true) {
  const [state, setState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // 기본값 적용
      const queryParams = {
        limit: SELF_CHECK_RECOMMENDATIONS_DEFAULTS.LIMIT,
        ...params
      };
      const data = await selfCheckService.getRecommendations(queryParams);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }));
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate]);

  return { ...state, execute, refetch: execute };
}

/**
 * 자립 지원 정책 리스트 조회 훅
 */
export function usePolicies(params: SelfCheckPoliciesReq = {}, immediate: boolean = true) {
  const [state, setState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // 기본값 적용
      const queryParams = {
        page: SELF_CHECK_POLICIES_DEFAULTS.PAGE,
        pageSize: SELF_CHECK_POLICIES_DEFAULTS.PAGE_SIZE,
        ...params
      };
      const data = await selfCheckService.getPolicies(queryParams);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }));
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate]);

  return { ...state, execute, refetch: execute };
}

/**
 * 자립 지원 기관 리스트 조회 훅
 */
export function useProviders(params: SelfCheckProvidersReq = {}, immediate: boolean = true) {
  const [state, setState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // 기본값 적용
      const queryParams = {
        page: SELF_CHECK_PROVIDERS_DEFAULTS.PAGE,
        pageSize: SELF_CHECK_PROVIDERS_DEFAULTS.PAGE_SIZE,
        ...params
      };
      const data = await selfCheckService.getProviders(queryParams);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }));
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate]);

  return { ...state, execute, refetch: execute };
}

/**
 * 자립 지원 시설 리스트 조회 훅
 */
export function useFacilities(params: SelfCheckFacilitiesReq = {}, immediate: boolean = true) {
  const [state, setState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // 기본값 적용
      const queryParams = {
        page: SELF_CHECK_FACILITIES_DEFAULTS.PAGE,
        pageSize: SELF_CHECK_FACILITIES_DEFAULTS.PAGE_SIZE,
        ...params
      };
      const data = await selfCheckService.getFacilities(queryParams);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }));
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate]);

  return { ...state, execute, refetch: execute };
}
