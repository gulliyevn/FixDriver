import { 
  AppError, 
  ExtendedError, 
  AuthErrorCode, 
  NetworkErrorCode, 
  ValidationErrorCode,
  ErrorMessages,
  ErrorHandlerService 
} from '../types/errors';

  /**
   * Error handler service implementation
   * Provides comprehensive error handling for the application
   */
  export class ErrorHandler implements ErrorHandlerService {
    // Authentication error codes
    private static readonly AUTH_ERRORS = AuthErrorCode;
  
    // Network error codes
    private static readonly NETWORK_ERRORS = NetworkErrorCode;
  
    // Validation error codes
    private static readonly VALIDATION_ERRORS = ValidationErrorCode;

  /**
   * Creates application error object
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
   * Handles API errors
   */
  handleAPIError(error: unknown): AppError {
    // If it's already our error
    if (this.isAppError(error)) {
      return error;
    }

    const extendedError = error as ExtendedError;

    // Handle HTTP errors
    if (extendedError.status) {
      switch (extendedError.status) {
        case 400:
          return this.createError(
            NetworkErrorCode.BAD_REQUEST,
            'Invalid request',
            extendedError.message,
            false
          );
        case 401:
          return this.createError(
            AuthErrorCode.TOKEN_INVALID,
            'Re-authorization required',
            extendedError.message,
            true,
            'Try logging in again'
          );
        case 403:
          return this.createError(
            NetworkErrorCode.FORBIDDEN,
            'Access denied',
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
            'Try again later',
            true,
            'Wait a bit'
          );
        case 500:
          return this.createError(
            NetworkErrorCode.SERVER_ERROR,
            'Server error',
            'Try again later',
            true,
            'Retry'
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

    // Handle network errors
    if (extendedError.message) {
      if (extendedError.message.includes('Network request failed')) {
        return this.createError(
          NetworkErrorCode.NO_INTERNET,
          'No internet connection',
          'Check your connection and try again',
          true,
          'Retry'
        );
      }
      if (extendedError.message.includes('timeout')) {
        return this.createError(
          NetworkErrorCode.TIMEOUT,
          'Request timeout',
          'Try again later',
          true,
          'Retry'
        );
      }
    }

    // General error
    return this.createError(
      'UNKNOWN_ERROR',
      'An error occurred',
      extendedError.message || 'Unknown error',
      true
    );
  }

  /**
   * Handles authentication errors
   */
  handleAuthError(error: unknown): AppError {
    if (this.isAppError(error)) {
      return error;
    }

    const extendedError = error as ExtendedError;
    const message = extendedError.message || '';

    // Handle specific authentication errors
    if (message.includes('Invalid credentials') || message.includes('Wrong password')) {
      return this.createError(
        AuthErrorCode.INVALID_CREDENTIALS,
        'Invalid email or password',
        'Check the entered data',
        false,
        'Check data'
      );
    }

    if (message.includes('User not found')) {
      return this.createError(
        AuthErrorCode.USER_NOT_FOUND,
        'User not found',
        'You may not be registered yet',
        false,
        'Register'
      );
    }

    if (message.includes('Account locked')) {
      return this.createError(
        AuthErrorCode.ACCOUNT_LOCKED,
        'Account locked',
        'Contact support',
        false,
        'Contact support'
      );
    }

    if (message.includes('Too many attempts')) {
      return this.createError(
        AuthErrorCode.TOO_MANY_ATTEMPTS,
        'Too many login attempts',
        'Try again later or reset password',
        true,
        'Reset password'
      );
    }

    if (message.includes('Email already exists')) {
      return this.createError(
        AuthErrorCode.EMAIL_ALREADY_EXISTS,
        'Email already in use',
        'Try logging in or reset password',
        false,
        'Login'
      );
    }

    if (message.includes('Phone already exists')) {
      return this.createError(
        AuthErrorCode.PHONE_ALREADY_EXISTS,
        'Phone number already in use',
        'Try logging in or reset password',
        false,
        'Login'
      );
    }

    // General authentication error
    return this.createError(
      'AUTH_ERROR',
      'Authentication error',
      message,
      true
    );
  }

  /**
   * Handles validation errors
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

    return this.createError(
      fieldMap[field] || ValidationErrorCode.MISSING_FIELDS,
      `Error in field "${field}"`,
      error,
      false
    );
  }

  /**
   * Gets user-friendly message for error
   */
  getUserFriendlyMessage(error: AppError): string {
    const messages: ErrorMessages = {
      // Authentication
      [AuthErrorCode.INVALID_CREDENTIALS]: 'Invalid email or password',
      [AuthErrorCode.USER_NOT_FOUND]: 'User not found',
      [AuthErrorCode.ACCOUNT_LOCKED]: 'Account locked',
      [AuthErrorCode.TOO_MANY_ATTEMPTS]: 'Too many login attempts',
      [AuthErrorCode.TOKEN_EXPIRED]: 'Session expired',
      [AuthErrorCode.TOKEN_INVALID]: 'Re-authorization required',
      [AuthErrorCode.EMAIL_NOT_VERIFIED]: 'Email not verified',
      [AuthErrorCode.PHONE_NOT_VERIFIED]: 'Phone not verified',
      [AuthErrorCode.WEAK_PASSWORD]: 'Password too weak',
      [AuthErrorCode.EMAIL_ALREADY_EXISTS]: 'Email already in use',
      [AuthErrorCode.PHONE_ALREADY_EXISTS]: 'Phone number already in use',

      // Network
      [NetworkErrorCode.NO_INTERNET]: 'No internet connection',
      [NetworkErrorCode.TIMEOUT]: 'Request timeout',
      [NetworkErrorCode.SERVER_ERROR]: 'Server error',
      [NetworkErrorCode.BAD_REQUEST]: 'Invalid request',
      [NetworkErrorCode.UNAUTHORIZED]: 'Authorization required',
      [NetworkErrorCode.FORBIDDEN]: 'Access denied',
      [NetworkErrorCode.NOT_FOUND]: 'Resource not found',
      [NetworkErrorCode.RATE_LIMITED]: 'Too many requests',

      // Validation
      [ValidationErrorCode.INVALID_EMAIL]: 'Invalid email',
      [ValidationErrorCode.INVALID_PHONE]: 'Invalid phone number',
      [ValidationErrorCode.INVALID_PASSWORD]: 'Invalid password',
      [ValidationErrorCode.INVALID_NAME]: 'Invalid name',
      [ValidationErrorCode.INVALID_LICENSE]: 'Invalid license number',
      [ValidationErrorCode.INVALID_VEHICLE]: 'Invalid vehicle number',
      [ValidationErrorCode.INVALID_OTP]: 'Invalid confirmation code',
      [ValidationErrorCode.MISSING_FIELDS]: 'Fill in all required fields',
    };

    return messages[error.code] || error.message;
  }

  /**
   * Checks if operation can be retried
   */
  isRetryable(error: AppError): boolean {
    return error.retryable === true;
  }

  /**
   * Gets recommended action for error
   */
  getRecommendedAction(error: AppError): string | null {
    return error.action || null;
  }

  /**
   * Logs error for debugging
   */
  logError(error: AppError, context?: string): void {
    if (__DEV__) {
      console.group(`🚨 Error: ${error.code}${context ? ` (${context})` : ''}`);
      console.error('Message:', error.message);
      console.error('Details:', error.details);
      console.error('Retryable:', error.retryable);
      console.error('Action:', error.action);
      console.groupEnd();
    }
  }

  /**
   * Creates application error from unknown error
   */
  createAppError(error: unknown): AppError {
    // Check if error is object with code and message
    if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
      const errorObj = error as { code: string; message: string };
      return {
        code: errorObj.code,
        message: errorObj.message,
      };
    }

    // Check if error is object with status
    if (error && typeof error === 'object' && 'status' in error) {
      const errorObj = error as { status: number; message?: string };
      switch (errorObj.status) {
        case 400:
          return {
            code: 'VALIDATION_ERROR',
            message: errorObj.message || 'Invalid data',
          };
        case 401:
          return {
            code: 'UNAUTHORIZED',
            message: errorObj.message || 'Authorization required',
          };
        case 403:
          return {
            code: 'FORBIDDEN',
            message: errorObj.message || 'Access denied',
          };
        case 404:
          return {
            code: 'NOT_FOUND',
            message: errorObj.message || 'Resource not found',
          };
        case 500:
          return {
            code: 'SERVER_ERROR',
            message: errorObj.message || 'Server error',
          };
        default:
          return {
            code: 'UNKNOWN_ERROR',
            message: errorObj.message || 'Unknown error',
          };
      }
    }

    // Check if error is object with message
    if (error && typeof error === 'object' && 'message' in error) {
      const errorObj = error as { message: string };
      if (errorObj.message.includes('Network request failed')) {
        return {
          code: 'NETWORK_ERROR',
          message: 'Network error. Check your internet connection.',
        };
      }
      if (errorObj.message.includes('timeout')) {
        return {
          code: 'TIMEOUT_ERROR',
          message: 'Request timeout exceeded.',
        };
      }
    }

    // Handle string errors
    if (typeof error === 'string') {
      return {
        code: 'GENERAL_ERROR',
        message: error,
      };
    }

    // Handle objects with message
    if (error && typeof error === 'object' && 'message' in error) {
      const errorObj = error as { message: string };
      return {
        code: 'GENERAL_ERROR',
        message: errorObj.message || 'Unknown error',
      };
    }

    // Handle objects with code and message
    if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
      const errorObj = error as { code: string; message: string };
      return {
        code: errorObj.code,
        message: errorObj.message || '',
      };
    }

    // Fallback for unknown errors
    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
    };
  }

  /**
   * Checks if error is AppError
   */
  private isAppError(error: unknown): error is AppError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      'message' in error
    );
  }
}

// Default instance for backward compatibility
export const errorHandler = new ErrorHandler();

// Legacy static method exports for smooth migration
export const createError = (code: string, message: string, details?: string, retryable?: boolean, action?: string) =>
  errorHandler.createError(code, message, details, retryable, action);
export const handleAPIError = (error: unknown) => errorHandler.handleAPIError(error);
export const handleAuthError = (error: unknown) => errorHandler.handleAuthError(error);
export const handleValidationError = (field: string, error: string) => errorHandler.handleValidationError(field, error);
export const getUserFriendlyMessage = (error: AppError) => errorHandler.getUserFriendlyMessage(error);
export const isRetryable = (error: AppError) => errorHandler.isRetryable(error);
export const getRecommendedAction = (error: AppError) => errorHandler.getRecommendedAction(error);
export const logError = (error: AppError, context?: string) => errorHandler.logError(error, context);
export const createAppError = (error: unknown) => errorHandler.createAppError(error);

// Export default for backward compatibility
export default ErrorHandler;

// Export mock service for testing and gRPC preparation
export { MockServices } from '../mocks';
