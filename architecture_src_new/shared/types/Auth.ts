// Типы для аутентификации и авторизации

import { User } from './user';
import { UserRole, ClientPermission, DriverPermission, AdminPermission } from './permissions';

// Базовые типы для аутентификации
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
}

// Внутренний тип для сервисов (с паролем)
export interface UserWithPassword extends User {
  password: string;
}

// Запросы аутентификации
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
  deviceInfo?: {
    deviceId: string;
    deviceType: 'mobile' | 'web' | 'tablet';
    appVersion: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  marketingConsent?: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
  captchaToken?: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
  deviceId?: string;
}

export interface LogoutRequest {
  refreshToken: string;
  deviceId?: string;
  logoutAllDevices?: boolean;
}

export interface VerifyEmailRequest {
  token: string;
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  preferences?: {
    language?: string;
    notifications?: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
    };
  };
}

// Ответы аутентификации
export interface LoginResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
  permissions: (ClientPermission | DriverPermission | AdminPermission)[];
  features: string[];
  sessionId: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  userId?: string;
  verificationRequired?: boolean;
  emailSent?: boolean;
  nextSteps?: string[];
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  resetTokenSent?: boolean;
  emailSent?: boolean;
  nextSteps?: string[];
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  passwordChanged?: boolean;
  loginRequired?: boolean;
}

export interface RefreshTokenResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  expiresIn: number;
  user?: User;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
  devicesLoggedOut?: number;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  emailVerified?: boolean;
  loginRequired?: boolean;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  passwordChanged?: boolean;
  reLoginRequired?: boolean;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  user?: User;
  updatedFields?: string[];
}

// Сессии и устройства
export interface UserSession {
  id: string;
  userId: string;
  deviceId: string;
  deviceType: 'mobile' | 'web' | 'tablet';
  appVersion: string;
  ipAddress: string;
  userAgent: string;
  location?: {
    country: string;
    city: string;
    timezone: string;
  };
  isActive: boolean;
  lastActivity: string;
  createdAt: string;
  expiresAt: string;
}

export interface DeviceInfo {
  id: string;
  name: string;
  type: 'mobile' | 'web' | 'tablet';
  platform: string;
  appVersion: string;
  lastUsed: string;
  isCurrent: boolean;
  location?: string;
}

// Безопасность
export interface SecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorMethod: 'sms' | 'email' | 'authenticator';
  loginNotifications: boolean;
  suspiciousActivityAlerts: boolean;
  passwordChangeRequired: boolean;
  lastPasswordChange: string;
  failedLoginAttempts: number;
  accountLocked: boolean;
  lockExpiresAt?: string;
}

export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
  isVerified: boolean;
}

// Ошибки аутентификации
export interface AuthError {
  code: string;
  message: string;
  field?: string;
  details?: string;
  retryable: boolean;
  actionRequired?: string;
}

// Утилиты для аутентификации
export const isTokenExpired = (expiresAt: string): boolean => {
  return new Date(expiresAt) < new Date();
};

export const getTokenExpiryTime = (expiresIn: number): Date => {
  return new Date(Date.now() + expiresIn * 1000);
};

export const shouldRefreshToken = (expiresAt: string, thresholdMinutes: number = 5): boolean => {
  const expiryTime = new Date(expiresAt);
  const thresholdTime = new Date(Date.now() + thresholdMinutes * 60 * 1000);
  return expiryTime <= thresholdTime;
};

export const getSessionDuration = (createdAt: string, expiresAt: string): number => {
  const created = new Date(createdAt);
  const expires = new Date(expiresAt);
  return Math.floor((expires.getTime() - created.getTime()) / 1000);
};
