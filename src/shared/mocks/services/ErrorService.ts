/**
 * ❌ ERROR SERVICE
 * 
 * Mock error service for development and testing.
 * Easy to replace with gRPC implementation.
 */

// Types for ErrorService
enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS'
}

enum NetworkErrorCode {
  NO_INTERNET = 'NO_INTERNET'
}

enum ValidationErrorCode {
  INVALID_EMAIL = 'INVALID_EMAIL'
}

export default class ErrorService {
  /**
   * Get authentication error code
   */
  async getAuthErrorCode(): Promise<AuthErrorCode> {
    return AuthErrorCode.INVALID_CREDENTIALS;
  }

  /**
   * Get network error code
   */
  async getNetworkErrorCode(): Promise<NetworkErrorCode> {
    return NetworkErrorCode.NO_INTERNET;
  }

  /**
   * Get validation error code
   */
  async getValidationErrorCode(): Promise<ValidationErrorCode> {
    return ValidationErrorCode.INVALID_EMAIL;
  }

  /**
   * Handle error
   */
  async handleError(error: any): Promise<void> {
    console.log('❌ Mock error handled:', error);
  }
}