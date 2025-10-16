// 데이터 API 훅들
import { useState, useEffect } from 'react';
import { dataService } from '../services';
import { ApiState } from '../types';
import { 
  DataLatestQuery, 
  DataSearchQuery,
  DataThemeItemsQuery,
  DataTypeItemsQuery,
  DATA_LATEST_DEFAULTS,
  DATA_SEARCH_DEFAULTS,
  DATA_THEME_ITEMS_DEFAULTS,
  DATA_TYPE_ITEMS_DEFAULTS
} from '@iitp-dabt-platform/common';

// ============================================================================
// 데이터 API 훅들
// ============================================================================

/**
 * 최신 데이터 리스트 조회 훅
 */
export function useLatestData(params: DataLatestQuery = {}, immediate: boolean = true) {
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
        limit: DATA_LATEST_DEFAULTS.LIMIT,
        ...params
      };
      const data = await dataService.getLatestData(queryParams);
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
 * 자립테마 데이터 건수 조회 훅
 */
export function useThemeCounts(immediate: boolean = true) {
  const [state, setState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  });
  const [hasExecuted, setHasExecuted] = useState(false);

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await dataService.getThemeCounts();
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
 * 데이터 유형별 데이터 건수 조회 훅
 */
export function useTypeCounts(immediate: boolean = true) {
  const [state, setState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  });
  const [hasExecuted, setHasExecuted] = useState(false);

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await dataService.getTypeCounts();
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
 * 데이터 검색 훅
 */
export function useDataSearch(params: DataSearchQuery, immediate: boolean = true) {
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
        page: DATA_SEARCH_DEFAULTS.PAGE,
        pageSize: DATA_SEARCH_DEFAULTS.PAGE_SIZE,
        sort: DATA_SEARCH_DEFAULTS.SORT,
        ...params
      };
      const data = await dataService.searchData(queryParams);
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
 * 자립 테마 리스트 조회 훅
 */
export function useThemes(immediate: boolean = true) {
  const [state, setState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  });
  const [hasExecuted, setHasExecuted] = useState(false);

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await dataService.getThemes();
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
 * 데이터 유형 리스트 조회 훅
 */
export function useTypes(immediate: boolean = true) {
  const [state, setState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  });
  const [hasExecuted, setHasExecuted] = useState(false);

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await dataService.getTypes();
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
 * 자립 테마별 리스트 조회 훅
 * theme이 없으면 모든 테마의 데이터를 조회
 */
export function useThemeItems(theme?: string | null | undefined, params: DataThemeItemsQuery = {}, immediate: boolean = true) {
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
        page: DATA_THEME_ITEMS_DEFAULTS.PAGE,
        pageSize: DATA_THEME_ITEMS_DEFAULTS.PAGE_SIZE,
        sort: DATA_THEME_ITEMS_DEFAULTS.SORT,
        ...params
      };
      
      // theme이 없으면 전체 테마 아이템 조회
      const data = theme 
        ? await dataService.getThemeItems(theme, queryParams)
        : await dataService.getAllThemeItems(queryParams);
      
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
    // theme이 undefined가 아닐 때 리셋 (파라미터 변경 시 재실행 가능하게)
    if (theme !== undefined) {
      setHasExecuted(false);
    }
  }, [theme]);

  useEffect(() => {
    if (immediate && !hasExecuted && theme !== undefined) {
      execute();
    }
  }, [immediate, theme, hasExecuted]);

  return { ...state, execute, refetch: execute };
}

/**
 * 데이터 유형별 리스트 조회 훅
 * type이 없으면 모든 유형의 데이터를 조회
 */
export function useTypeItems(type?: string | null | undefined, params: DataTypeItemsQuery = {}, immediate: boolean = true) {
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
        page: DATA_TYPE_ITEMS_DEFAULTS.PAGE,
        pageSize: DATA_TYPE_ITEMS_DEFAULTS.PAGE_SIZE,
        sort: DATA_TYPE_ITEMS_DEFAULTS.SORT,
        ...params
      };
      
      // type이 없으면 전체 유형 아이템 조회
      const data = type
        ? await dataService.getTypeItems(type, queryParams)
        : await dataService.getAllTypeItems(queryParams);
      
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
    // type이 undefined가 아닐 때 리셋 (파라미터 변경 시 재실행 가능하게)
    if (type !== undefined) {
      setHasExecuted(false);
    }
  }, [type]);

  useEffect(() => {
    if (immediate && !hasExecuted && type !== undefined) {
      execute();
    }
  }, [immediate, type, hasExecuted]);

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
  const [hasExecuted, setHasExecuted] = useState(false);

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await dataService.getDataDetail(id);
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
    if (immediate && id && !hasExecuted) {
      execute();
    }
  }, [immediate, id, hasExecuted]);

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
  const [hasExecuted, setHasExecuted] = useState(false);

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // 환경 변수에서 limit 가져오기
      const previewLimit = Number(import.meta.env.VITE_API_DATA_PREVIEW_LIMIT);
      const query = previewLimit > 0 ? { limit: previewLimit } : {};
      
      const data = await dataService.getDataPreview(id, query);
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
    if (immediate && id && !hasExecuted) {
      execute();
    }
  }, [immediate, id, hasExecuted]);

  return { ...state, execute, refetch: execute };
}