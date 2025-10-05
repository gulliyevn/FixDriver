import { useState, useCallback } from "react";

interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorInfo: unknown;
}

export const useErrorBoundary = () => {
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
    errorInfo: null,
  });

  const handleError = useCallback((error: Error, errorInfo?: unknown) => {
    setErrorState({
      hasError: true,
      error,
      errorInfo,
    });

    // Отправляем ошибку в систему мониторинга (если есть)
    if (__DEV__) {
      console.group("Error Details");
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
  const resetErrorOnDependencyChange = useCallback(
    () => {
      // Этот callback не должен содержать useEffect
      // useEffect должен вызываться на верхнем уровне компонента
      if (errorState.hasError) {
        resetError();
      }
    },
    [errorState.hasError, resetError],
  );

  return {
    errorState,
    handleError,
    resetError,
    resetErrorOnDependencyChange,
  };
};
