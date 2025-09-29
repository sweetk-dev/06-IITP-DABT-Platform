// 에러 처리 훅
import { useState, useEffect } from 'react';
import { apiErrorHandler, ErrorAlertState } from '../api/errorHandler';

export function useErrorHandler() {
  const [error, setError] = useState<ErrorAlertState | null>(null);

  useEffect(() => {
    const unsubscribe = apiErrorHandler.subscribe((errorState) => {
      setError(errorState);
    });

    return unsubscribe;
  }, []);

  const clearError = () => {
    setError(null);
  };

  return {
    error,
    clearError
  };
}
