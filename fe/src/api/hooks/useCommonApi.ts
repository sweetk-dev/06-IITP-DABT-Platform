// 공통 API 훅들
import { useState, useEffect } from 'react';
import { commonService } from '../services';
import { ApiState } from '../types';

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
  const [hasExecuted, setHasExecuted] = useState(false);

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await commonService.getHealth();
      setState({ data, loading: false, error: null });
      setHasExecuted(true);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }));
      setHasExecuted(true); // 에러 발생 시에도 실행 완료로 표시
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
 * 버전 정보 조회 훅
 */
export function useVersion(immediate: boolean = true) {
  const [state, setState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  });
  const [hasExecuted, setHasExecuted] = useState(false);

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await commonService.getVersion();
      setState({ data, loading: false, error: null });
      setHasExecuted(true);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }));
      setHasExecuted(true); // 에러 발생 시에도 실행 완료로 표시
    }
  };

  useEffect(() => {
    if (immediate && !hasExecuted) {
      execute();
    }
  }, [immediate, hasExecuted]);

  return { ...state, execute, refetch: execute };
}
