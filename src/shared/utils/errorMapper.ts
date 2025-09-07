import { AppError } from '../constants/errors';
import { AuthErrorCode, NetworkErrorCode, ValidationErrorCode } from '../constants/errors';

/**
 * Map error codes to user-friendly English messages.
 * Keep this file focused on display text and simple mappings only.
 */
export function mapUserFriendlyMessage(error: AppError): string {
  const messages: Record<string, string> = {
    // Auth
    [AuthErrorCode.INVALID_CREDENTIALS]: 'Invalid email or password',
    [AuthErrorCode.USER_NOT_FOUND]: 'User not found',
    [AuthErrorCode.ACCOUNT_LOCKED]: 'Account locked',
    [AuthErrorCode.TOO_MANY_ATTEMPTS]: 'Too many login attempts',
    [AuthErrorCode.TOKEN_EXPIRED]: 'Session expired',
    [AuthErrorCode.TOKEN_INVALID]: 'Re-authentication required',
    [AuthErrorCode.EMAIL_NOT_VERIFIED]: 'Email not verified',
    [AuthErrorCode.PHONE_NOT_VERIFIED]: 'Phone not verified',
    [AuthErrorCode.WEAK_PASSWORD]: 'Weak password',
    [AuthErrorCode.EMAIL_ALREADY_EXISTS]: 'Email already exists',
    [AuthErrorCode.PHONE_ALREADY_EXISTS]: 'Phone already exists',

    // Network
    [NetworkErrorCode.NO_INTERNET]: 'No internet connection',
    [NetworkErrorCode.TIMEOUT]: 'Request timed out',
    [NetworkErrorCode.SERVER_ERROR]: 'Server error',
    [NetworkErrorCode.BAD_REQUEST]: 'Bad request',
    [NetworkErrorCode.UNAUTHORIZED]: 'Unauthorized',
    [NetworkErrorCode.FORBIDDEN]: 'Access forbidden',
    [NetworkErrorCode.NOT_FOUND]: 'Resource not found',
    [NetworkErrorCode.RATE_LIMITED]: 'Too many requests',

    // Validation
    [ValidationErrorCode.INVALID_EMAIL]: 'Invalid email',
    [ValidationErrorCode.INVALID_PHONE]: 'Invalid phone number',
    [ValidationErrorCode.INVALID_PASSWORD]: 'Invalid password',
    [ValidationErrorCode.INVALID_NAME]: 'Invalid name',
    [ValidationErrorCode.INVALID_LICENSE]: 'Invalid license number',
    [ValidationErrorCode.INVALID_VEHICLE]: 'Invalid vehicle number',
    [ValidationErrorCode.INVALID_OTP]: 'Invalid verification code',
    [ValidationErrorCode.MISSING_FIELDS]: 'Fill in all required fields',
  };

  return messages[error.code] || error.message;
}

/**
 * Pass-through recommended action mapping.
 * In future can be expanded to smarter suggestions based on code.
 */
export function mapRecommendedAction(error: AppError): string | null {
  return error.action || null;
}


