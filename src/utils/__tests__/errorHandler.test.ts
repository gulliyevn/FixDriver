import { ErrorHandler } from '../errorHandler';

describe('ErrorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createAppError', () => {
    it('creates app error from error object with code and message', () => {
      const error = {
        code: 'NETWORK_ERROR',
        message: 'Network connection failed',
      };

      const result = ErrorHandler.createAppError(error);

      expect(result).toEqual({
        code: 'NETWORK_ERROR',
        message: 'Network connection failed',
      });
    });

    it('creates app error from error object with status', () => {
      const error = {
        status: 404,
        message: 'Not found',
      };

      const result = ErrorHandler.createAppError(error);

      expect(result).toEqual({
        code: 'NOT_FOUND',
        message: 'Not found',
      });
    });

    it('creates app error from error object with status 401', () => {
      const error = {
        status: 401,
        message: 'Unauthorized',
      };

      const result = ErrorHandler.createAppError(error);

      expect(result).toEqual({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized',
      });
    });

    it('creates app error from error object with status 403', () => {
      const error = {
        status: 403,
        message: 'Forbidden',
      };

      const result = ErrorHandler.createAppError(error);

      expect(result).toEqual({
        code: 'FORBIDDEN',
        message: 'Forbidden',
      });
    });

    it('creates app error from error object with status 500', () => {
      const error = {
        status: 500,
        message: 'Internal server error',
      };

      const result = ErrorHandler.createAppError(error);

      expect(result).toEqual({
        code: 'SERVER_ERROR',
        message: 'Internal server error',
      });
    });

    it('creates app error from string error', () => {
      const error = 'Something went wrong';

      const result = ErrorHandler.createAppError(error);

      expect(result).toEqual({
        code: 'GENERAL_ERROR',
        message: 'Something went wrong',
      });
    });

    it('creates app error from unknown error', () => {
      const error = null;

      const result = ErrorHandler.createAppError(error);

      expect(result).toEqual({
        code: 'UNKNOWN_ERROR',
        message: 'Произошла неизвестная ошибка',
      });
    });
  });

  describe('getUserFriendlyMessage', () => {
    it('returns message for known error code', () => {
      const error = { code: 'AUTH_001', message: 'Invalid credentials' };
      const result = ErrorHandler.getUserFriendlyMessage(error);

      expect(result).toBe('Неверный email или пароль');
    });

    it('returns default message for unknown error code', () => {
      const error = { code: 'UNKNOWN_CODE', message: 'Unknown error' };
      const result = ErrorHandler.getUserFriendlyMessage(error);

      expect(result).toBe('Unknown error');
    });
  });

  describe('getRecommendedAction', () => {
    it('returns action for known error code', () => {
      const error = { code: 'AUTH_001', message: 'Invalid credentials', action: 'Check credentials' };
      const result = ErrorHandler.getRecommendedAction(error);

      expect(result).toBe('Check credentials');
    });

    it('returns default action for unknown error code', () => {
      const error = { code: 'UNKNOWN_CODE', message: 'Unknown error' };
      const result = ErrorHandler.getRecommendedAction(error);

      expect(result).toBe(null);
    });
  });

  describe('isRetryable', () => {
    it('returns true for retryable error codes', () => {
      const error1 = { code: 'NETWORK_001', message: 'Network timeout', retryable: true };
      const error2 = { code: 'NETWORK_002', message: 'Connection failed', retryable: true };
      const error3 = { code: 'NETWORK_003', message: 'Server unavailable', retryable: true };
      
      expect(ErrorHandler.isRetryable(error1)).toBe(true);
      expect(ErrorHandler.isRetryable(error2)).toBe(true);
      expect(ErrorHandler.isRetryable(error3)).toBe(true);
    });

    it('returns false for non-retryable error codes', () => {
      const error1 = { code: 'AUTH_001', message: 'Invalid credentials', retryable: false };
      const error2 = { code: 'VALIDATION_001', message: 'Invalid input', retryable: false };
      
      expect(ErrorHandler.isRetryable(error1)).toBe(false);
      expect(ErrorHandler.isRetryable(error2)).toBe(false);
    });
  });

  describe('logError', () => {
    it('logs error with correct format', () => {
      const consoleSpy = jest.spyOn(console, 'group').mockImplementation();
      const error = { code: 'TEST_ERROR', message: 'Test error' };

      ErrorHandler.logError(error, 'TestComponent');

      expect(consoleSpy).toHaveBeenCalledWith('🚨 Error: TEST_ERROR (TestComponent)');

      consoleSpy.mockRestore();
    });

    it('logs error without component name', () => {
      const consoleSpy = jest.spyOn(console, 'group').mockImplementation();
      const error = { code: 'TEST_ERROR', message: 'Test error' };

      ErrorHandler.logError(error);

      expect(consoleSpy).toHaveBeenCalledWith('🚨 Error: TEST_ERROR');

      consoleSpy.mockRestore();
    });
  });

  describe('handleAPIError', () => {
    it('handles network error', () => {
      const error = {
        code: 'NETWORK_001',
        message: 'Network timeout',
      };

      const result = ErrorHandler.handleAPIError(error);

      expect(result).toEqual({
        code: 'NETWORK_001',
        message: 'Network timeout',
      });
    });

    it('handles authentication error', () => {
      const error = {
        code: 'AUTH_001',
        message: 'Invalid credentials',
      };

      const result = ErrorHandler.handleAPIError(error);

      expect(result).toEqual({
        code: 'AUTH_001',
        message: 'Invalid credentials',
      });
    });
  });
}); 