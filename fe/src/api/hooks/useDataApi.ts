// 데이터 API 훅들
import { useState, useEffect } from 'react';
import { dataService } from '../services';
import { 
  DataLatestReq, 
  DataSearchReq,
  DataThemeItemsReq,
  DataTypeItemsReq
} from '../../../../packages/common/src/types';

// ============================================================================
// API 호출 상태 타입
// ============================================================================

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ============================================================================
// 데이터 API 훅들
// ============================================================================

/**
 * 최신 데이터 리스트 조회 훅
 */
export function useLatestData(params: DataLatestReq = {}, immediate: boolean = true) {
  const [state, setState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await dataService.getLatestData(params);
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
 * 자립테마 데이터 건수 조회 훅
 */
export function useThemeCounts(immediate: boolean = true) {
  const [state, setState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await dataService.getThemeCounts();
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
 * 데이터 유형별 데이터 건수 조회 훅
 */
export function useTypeCounts(immediate: boolean = true) {
  const [state, setState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await dataService.getTypeCounts();
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
 * 데이터 검색 훅
 */
export function useDataSearch(params: DataSearchReq, immediate: boolean = true) {
  const [state, setState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await dataService.searchData(params);
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
 * 자립 테마 리스트 조회 훅
 */
export function useThemes(immediate: boolean = true) {
  const [state, setState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await dataService.getThemes();
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
 * 데이터 유형 리스트 조회 훅
 */
export function useTypes(immediate: boolean = true) {
  const [state, setState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await dataService.getTypes();
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
 * 자립 테마별 리스트 조회 훅
 */
export function useThemeItems(theme: string, params: DataThemeItemsReq = {}, immediate: boolean = true) {
  const [state, setState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await dataService.getThemeItems(theme, params);
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
  }, [immediate, theme]);

  return { ...state, execute, refetch: execute };
}

/**
 * 데이터 유형별 리스트 조회 훅
 */
export function useTypeItems(type: string, params: DataTypeItemsReq = {}, immediate: boolean = true) {
  const [state, setState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await dataService.getTypeItems(type, params);
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
  }, [immediate, type]);

  return { ...state, execute, refetch: execute };
}

/**
 * 데이터 상세 정보 조회 훅
 */
export function useDataDetail(id: number, immediate: boolean = true) {
  const [state, setState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await dataService.getDataDetail(id);
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
    if (immediate && id) {
      execute();
    }
  }, [immediate, id]);

  return { ...state, execute, refetch: execute };
}

/**
 * 데이터 미리보기 조회 훅
 */
export function useDataPreview(id: number, immediate: boolean = true) {
  const [state, setState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await dataService.getDataPreview(id);
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
    if (immediate && id) {
      execute();
    }
  }, [immediate, id]);

  return { ...state, execute, refetch: execute };
}
