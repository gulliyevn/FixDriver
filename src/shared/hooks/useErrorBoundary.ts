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
    console.error('[ErrorBoundary] Error:', error, errorInfo);
    
    setErrorState({
      hasError: true,
      error,
      errorInfo,
    });

    // Send error to monitoring system (if available)
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

  // Automatic error reset on dependency change
  const resetErrorOnDependencyChange = useCallback((dependencies: any[]) => {
    useEffect(() => {
      if (errorState.hasError) {
        resetError();
      }
    }, dependencies);
  }, [errorState.hasError, resetError]);

  return {
    errorState,
    handleError,
    resetError,
    resetErrorOnDependencyChange,
  };
};
