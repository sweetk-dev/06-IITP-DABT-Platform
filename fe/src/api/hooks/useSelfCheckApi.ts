// 자가진단 API 훅들
import { useState, useEffect } from 'react';
import { selfCheckService } from '../services';
import { ApiState } from '../types';
import { 
  SelfCheckRecommendationsQuery,
  SelfCheckPoliciesQuery,
  SelfCheckProvidersQuery,
  SelfCheckFacilitiesQuery,
  SELF_CHECK_RECOMMENDATIONS_DEFAULTS,
  SELF_CHECK_POLICIES_DEFAULTS,
  SELF_CHECK_PROVIDERS_DEFAULTS,
  SELF_CHECK_FACILITIES_DEFAULTS
} from '@iitp-dabt-platform/common';

// ============================================================================
// 자가진단 API 훅들
// ============================================================================

/**
 * 추천 정책 리스트 조회 훅
 */
export function useRecommendations(params: SelfCheckRecommendationsQuery = {}, immediate: boolean = true) {
  const [state, setState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  });
  const [hasExecuted, setHasExecuted] = useState(false);

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
      setHasExecuted(true);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }));
      setHasExecuted(true);
    }
  };

  useEffect(() => {
    if (immediate && !hasExecuted) {
      execute();
    }
  }, [immediate, hasExecuted]);

  return { ...state, execute, refetch: execute };
}

/**
 * 자립 지원 정책 리스트 조회 훅
 */
export function usePolicies(params: SelfCheckPoliciesQuery = {}, immediate: boolean = true) {
  const [state, setState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  });
  const [hasExecuted, setHasExecuted] = useState(false);

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
      setHasExecuted(true);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }));
      setHasExecuted(true);
    }
  };

  useEffect(() => {
    if (immediate && !hasExecuted) {
      execute();
    }
  }, [immediate, hasExecuted]);

  return { ...state, execute, refetch: execute };
}

/**
 * 자립 지원 기관 리스트 조회 훅
 */
export function useProviders(params: SelfCheckProvidersQuery = {}, immediate: boolean = true) {
  const [state, setState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  });
  const [hasExecuted, setHasExecuted] = useState(false);

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
      setHasExecuted(true);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }));
      setHasExecuted(true);
    }
  };

  useEffect(() => {
    if (immediate && !hasExecuted) {
      execute();
    }
  }, [immediate, hasExecuted]);

  return { ...state, execute, refetch: execute };
}

/**
 * 자립 지원 시설 리스트 조회 훅
 */
export function useFacilities(params: SelfCheckFacilitiesQuery = {}, immediate: boolean = true) {
  const [state, setState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  });
  const [hasExecuted, setHasExecuted] = useState(false);

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
      setHasExecuted(true);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }));
      setHasExecuted(true);
    }
  };

  useEffect(() => {
    if (immediate && !hasExecuted) {
      execute();
    }
  }, [immediate, hasExecuted]);

  return { ...state, execute, refetch: execute };
}