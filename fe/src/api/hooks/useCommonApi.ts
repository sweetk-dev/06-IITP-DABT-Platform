// 공통 API 훅들
import { useState, useEffect } from 'react';
import { commonService } from '../services';

// ============================================================================
// API 호출 상태 타입
// ============================================================================

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ============================================================================
// 공통 API 훅들
// ============================================================================

/**
 * 헬스 체크 훅
 */
export function useHealth(immediate: boolean = true) {
  const [state, setState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await commonService.getHealth();
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
 * 버전 정보 조회 훅
 */
export function useVersion(immediate: boolean = true) {
  const [state, setState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await commonService.getVersion();
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
