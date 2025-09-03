export interface AppError {
  code: string;
  message: string;
  details?: string;
  retryable?: boolean;
  action?: string;
}

export interface ExtendedError extends Error {
  code?: string;
  status?: number;
}

export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'AUTH_001',
  USER_NOT_FOUND = 'AUTH_002',
  ACCOUNT_LOCKED = 'AUTH_003',
  TOO_MANY_ATTEMPTS = 'AUTH_004',
  TOKEN_EXPIRED = 'AUTH_005',
  TOKEN_INVALID = 'AUTH_006',
  EMAIL_NOT_VERIFIED = 'AUTH_007',
  PHONE_NOT_VERIFIED = 'AUTH_008',
  WEAK_PASSWORD = 'AUTH_009',
  EMAIL_ALREADY_EXISTS = 'AUTH_010',
  PHONE_ALREADY_EXISTS = 'AUTH_011',
}

export enum NetworkErrorCode {
  NO_INTERNET = 'NET_001',
  TIMEOUT = 'NET_002',
  SERVER_ERROR = 'NET_003',
  BAD_REQUEST = 'NET_004',
  UNAUTHORIZED = 'NET_005',
  FORBIDDEN = 'NET_006',
  NOT_FOUND = 'NET_007',
  RATE_LIMITED = 'NET_008',
}

export enum ValidationErrorCode {
  INVALID_EMAIL = 'VAL_001',
  INVALID_PHONE = 'VAL_002',
  INVALID_PASSWORD = 'VAL_003',
  INVALID_NAME = 'VAL_004',
  INVALID_LICENSE = 'VAL_005',
  INVALID_VEHICLE = 'VAL_006',
  INVALID_OTP = 'VAL_007',
  MISSING_FIELDS = 'VAL_008',
}

export interface ErrorMessages {
  [key: string]: string;
}

export interface ErrorHandlerService {
  createError(code: string, message: string, details?: string, retryable?: boolean, action?: string): AppError;
  handleAPIError(error: unknown): AppError;
  handleAuthError(error: unknown): AppError;
  handleValidationError(field: string, error: string): AppError;
  getUserFriendlyMessage(error: AppError): string;
  isRetryable(error: AppError): boolean;
  getRecommendedAction(error: AppError): string | null;
  logError(error: AppError, context?: string): void;
  createAppError(error: unknown): AppError;
}
