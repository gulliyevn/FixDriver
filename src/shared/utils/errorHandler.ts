import { AppError, ExtendedError, ErrorHandlerService } from '../constants/errors';
import { mapUserFriendlyMessage, mapRecommendedAction } from './errorMapper';
import { AuthErrorCode, NetworkErrorCode, ValidationErrorCode } from '../constants/errors';

export class ErrorHandler implements ErrorHandlerService {

  /**
   * Create AppError object
   */
  createError(
    code: string,
    message: string,
    details?: string,
    retryable: boolean = false,
    action?: string
  ): AppError {
    return {
      code,
      message,
      details,
      retryable,
      action,
    };
  }

  /**
   * Handle API error
   */
  handleAPIError(error: unknown): AppError {
    // Если это уже наша ошибка
    if (ErrorHandler.isAppError(error)) {
      return error;
    }

    const extendedError = error as ExtendedError;

    // Обработка HTTP ошибок
    if (extendedError.status) {
      switch (extendedError.status) {
        case 400:
          return this.createError(
            NetworkErrorCode.BAD_REQUEST,
            'Bad request',
            extendedError.message,
            false
          );
        case 401:
          return this.createError(
            AuthErrorCode.TOKEN_INVALID,
            'Re-authentication required',
            extendedError.message,
            true,
            'relogin'
          );
        case 403:
          return this.createError(
            NetworkErrorCode.FORBIDDEN,
            'Access forbidden',
            extendedError.message,
            false
          );
        case 404:
          return this.createError(
            NetworkErrorCode.NOT_FOUND,
            'Resource not found',
            extendedError.message,
            false
          );
        case 429:
          return this.createError(
            NetworkErrorCode.RATE_LIMITED,
            'Too many requests',
            'Please try again later',
            true,
            'wait'
          );
        case 500:
          return this.createError(
            NetworkErrorCode.SERVER_ERROR,
            'Server error',
            'Please try again later',
            true,
            'retry'
          );
        default:
          return this.createError(
            'UNKNOWN_ERROR',
            'Unknown error',
            extendedError.message,
            true
          );
      }
    }

    // Обработка сетевых ошибок
    if (extendedError.message) {
      if (extendedError.message.includes('Network request failed')) {
        return this.createError(
          NetworkErrorCode.NO_INTERNET,
          'No internet connection',
          'Check your connection and try again',
          true,
          'retry'
        );
      }
      if (extendedError.message.includes('timeout')) {
        return this.createError(
          NetworkErrorCode.TIMEOUT,
          'Request timed out',
          'Please try again later',
          true,
          'retry'
        );
      }
    }

    // Общая ошибка
    return this.createError('UNKNOWN_ERROR', 'Unexpected error', extendedError.message || 'Unknown error', true);
  }

  /**
   * Handle authentication error
   */
  handleAuthError(error: unknown): AppError {
    if (ErrorHandler.isAppError(error)) {
      return error;
    }

    const extendedError = error as ExtendedError;
    const message = extendedError.message || '';

    // Обработка специфичных ошибок аутентификации
    if (message.includes('Invalid credentials') || message.includes('Wrong password')) {
      return this.createError(AuthErrorCode.INVALID_CREDENTIALS, 'Invalid email or password', 'Check entered data', false, 'check');
    }

    if (message.includes('User not found')) {
      return this.createError(AuthErrorCode.USER_NOT_FOUND, 'User not found', 'You might not be registered', false, 'register');
    }

    if (message.includes('Account locked')) {
      return this.createError(AuthErrorCode.ACCOUNT_LOCKED, 'Account locked', 'Contact support', false, 'contact_support');
    }

    if (message.includes('Too many attempts')) {
      return this.createError(AuthErrorCode.TOO_MANY_ATTEMPTS, 'Too many login attempts', 'Try later or reset password', true, 'reset_password');
    }

    if (message.includes('Email already exists')) {
      return this.createError(AuthErrorCode.EMAIL_ALREADY_EXISTS, 'Email already exists', 'Login or reset password', false, 'login');
    }

    if (message.includes('Phone already exists')) {
      return this.createError(AuthErrorCode.PHONE_ALREADY_EXISTS, 'Phone already exists', 'Login or reset password', false, 'login');
    }

    // Общая ошибка аутентификации
    return this.createError('AUTH_ERROR', 'Authentication error', message, true);
  }

  /**
   * Handle validation error
   */
  handleValidationError(field: string, error: string): AppError {
    const fieldMap: { [key: string]: string } = {
      email: ValidationErrorCode.INVALID_EMAIL,
      phone: ValidationErrorCode.INVALID_PHONE,
      password: ValidationErrorCode.INVALID_PASSWORD,
      name: ValidationErrorCode.INVALID_NAME,
      license_number: ValidationErrorCode.INVALID_LICENSE,
      vehicle_number: ValidationErrorCode.INVALID_VEHICLE,
      otp: ValidationErrorCode.INVALID_OTP,
    };

    return this.createError(fieldMap[field] || ValidationErrorCode.MISSING_FIELDS, `Invalid field "${field}"`, error, false);
  }

  /**
   * Get user-friendly message
   */
  getUserFriendlyMessage(error: AppError): string {
    return mapUserFriendlyMessage(error);
  }

  /**
   * Check if operation is retryable
   */
  isRetryable(error: AppError): boolean {
    return error.retryable === true;
  }

  /**
   * Get recommended action for error
   */
  getRecommendedAction(error: AppError): string | null {
    return mapRecommendedAction(error);
  }

  /**
   * Log error for debugging
   */
  logError(error: AppError, context?: string): void {
    if (__DEV__) {
      console.group(`Error: ${error.code}${context ? ` (${context})` : ''}`);
      console.error('Message:', error.message);
      console.error('Details:', error.details);
      console.error('Retryable:', error.retryable);
      console.error('Action:', error.action);
      console.groupEnd();
    }
  }

  createAppError(error: unknown): AppError {
    // Проверяем, является ли ошибка объектом с кодом и сообщением
    if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
      const errorObj = error as { code: string; message: string };
      return {
        code: errorObj.code,
        message: errorObj.message,
      };
    }

    // Проверяем, является ли ошибка объектом со статусом
    if (error && typeof error === 'object' && 'status' in error) {
      const errorObj = error as { status: number; message?: string };
      switch (errorObj.status) {
        case 400:
          return { code: 'VALIDATION_ERROR', message: errorObj.message || 'Invalid data' };
        case 401:
          return { code: 'UNAUTHORIZED', message: errorObj.message || 'Unauthorized' };
        case 403:
          return { code: 'FORBIDDEN', message: errorObj.message || 'Access forbidden' };
        case 404:
          return { code: 'NOT_FOUND', message: errorObj.message || 'Resource not found' };
        case 500:
          return { code: 'SERVER_ERROR', message: errorObj.message || 'Server error' };
        default:
          return { code: 'UNKNOWN_ERROR', message: errorObj.message || 'Unknown error' };
      }
    }

    // Проверяем, является ли ошибка строкой или объектом с сообщением
    if (error && typeof error === 'object' && 'message' in error) {
      const errorObj = error as { message: string };
      if (errorObj.message.includes('Network request failed')) {
        return { code: 'NETWORK_ERROR', message: 'Network error. Check internet connection.' };
      }
      if (errorObj.message.includes('timeout')) {
        return { code: 'TIMEOUT_ERROR', message: 'Request timed out.' };
      }
    }

    // Обрабатываем строковые ошибки
    if (typeof error === 'string') {
      return { code: 'GENERAL_ERROR', message: error };
    }

    // Обрабатываем объекты с сообщением
    if (error && typeof error === 'object' && 'message' in error) {
      const errorObj = error as { message: string };
      return { code: 'GENERAL_ERROR', message: errorObj.message || 'Unknown error' };
    }

    // Обрабатываем объекты с кодом и сообщением
    if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
      const errorObj = error as { code: string; message: string };
      return { code: errorObj.code, message: errorObj.message || '' };
    }

    // Fallback для неизвестных ошибок
    return { code: 'UNKNOWN_ERROR', message: 'Unknown error' };
  }

  /**
   * Проверяет, является ли ошибка AppError
   */
  private static isAppError(error: unknown): error is AppError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      'message' in error
    );
  }
}

export default ErrorHandler; 