import { useState, useCallback, useEffect } from 'react';

interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

export const useErrorBoundary = () => {
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
    errorInfo: null,
  });

  const handleError = useCallback((error: Error, errorInfo?: any) => {
    console.error('[ErrorBoundary] Ошибка:', error, errorInfo);
    
    setErrorState({
      hasError: true,
      error,
      errorInfo,
    });

    // Отправляем ошибку в систему мониторинга (если есть)
    if (__DEV__) {
      console.group('Error Details');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Stack:', error.stack);
      console.groupEnd();
    }
  }, []);

  const resetError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  }, []);

  // Автоматический сброс ошибки при изменении зависимостей
  const resetErrorOnDependencyChange = useCallback((dependencies: any[]) => {
    // Этот callback не должен содержать useEffect
    // useEffect должен вызываться на верхнем уровне компонента
    if (errorState.hasError) {
      resetError();
    }
  }, [errorState.hasError, resetError]);

  return {
    errorState,
    handleError,
    resetError,
    resetErrorOnDependencyChange,
  };
};
