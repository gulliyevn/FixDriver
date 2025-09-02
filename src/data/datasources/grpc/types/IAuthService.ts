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
}
