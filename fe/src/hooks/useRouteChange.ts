import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { handleRouteChange } from '../pages/App';

let previousPath = '';

export function useRouteChange() {
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    // 이전 경로와 현재 경로가 다를 때만 처리
    if (previousPath && previousPath !== currentPath) {
      handleRouteChange(previousPath, currentPath);
    }
    
    // 현재 경로를 이전 경로로 저장
    previousPath = currentPath;
  }, [currentPath]);
}
