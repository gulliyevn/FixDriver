import { AuthResponse, LoginCredentials, RegisterData, User } from '../../../../shared/types';

export interface IAuthService {
  /**
   * Вход в систему
   */
  login(email: string, password: string): Promise<AuthResponse>;

  /**
   * Регистрация нового пользователя
   */
  register(userData: RegisterData): Promise<AuthResponse>;

  /**
   * Выход из системы
   */
  logout(): Promise<void>;

  /**
   * Обновление токена
   */
  refreshToken(): Promise<AuthResponse>;

  /**
   * Проверка валидности токена
   */
  validateToken(token: string): Promise<boolean>;

  /**
   * Получение текущего пользователя
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Смена роли пользователя
   */
  switchRole(role: 'client' | 'driver' | 'admin'): Promise<User>;

  /**
   * Создание профиля для роли
   */
  createProfile(role: 'client' | 'driver' | 'admin', profileData: any): Promise<User>;

  /**
   * Send password reset OTP to email
   */
  sendPasswordReset(email: string): Promise<{ success: boolean; requestId: string }>;

  /**
   * Verify OTP for password reset
   */
  verifyPasswordResetOtp(requestId: string, otp: string): Promise<{ success: boolean; token: string }>;

  /**
   * Finalize password reset using server-issued reset token
   */
  resetPassword(token: string, newPassword: string): Promise<{ success: boolean }>;
}
