import { User, UserRole } from '../types/user';
import JWTService from './JWTService';
import { createAuthMockUser, findAuthUserByCredentials } from '../mocks/auth';

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
}

export class AuthService {
  /**
   * Вход в систему
   */
  static async login(email: string, password: string, authMethod?: string): Promise<AuthResponse> {
    try {
      // В реальном приложении здесь будет API запрос
      if (__DEV__) {
        // Mock для разработки
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Определяем роль на основе email
        let role = UserRole.CLIENT;
        if (email.includes('driver')) {
          role = UserRole.DRIVER;
        }
        
        // Используем централизованные мок-данные
        const mockUser = createAuthMockUser({
          email,
          role
        });

        // Генерируем JWT токены
        const tokens = JWTService.generateTokens({
          userId: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
          phone: mockUser.phone,
        });

        console.log(`🧪 Мок вход ${authMethod ? `через ${authMethod}` : 'с email'}:`, {
          email,
          method: authMethod || 'email',
          role: mockUser.role
        });

        return {
          success: true,
          user: mockUser,
          tokens
        };
      } else {
        // Реальный API запрос
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error('Login failed');
        }

        const data = await response.json();
        return {
          success: true,
          user: data.user,
          tokens: data.tokens
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed'
      };
    }
  }

  /**
   * Регистрация пользователя
   */
  static async register(userData: Partial<User>, password: string): Promise<AuthResponse> {
    try {
      // В реальном приложении здесь будет API запрос
      if (__DEV__) {
        // Mock для разработки
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newUser = createAuthMockUser({
          ...userData,
          email: userData.email || 'user@example.com',
          role: userData.role || UserRole.CLIENT
        });

        // Генерируем JWT токены
        const tokens = JWTService.generateTokens({
          userId: newUser.id,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
        });

        return {
          success: true,
          user: newUser,
          tokens
        };
      } else {
        // Реальный API запрос
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...userData, password }),
        });

        if (!response.ok) {
          throw new Error('Registration failed');
        }

        const data = await response.json();
        return {
          success: true,
          user: data.user,
          tokens: data.tokens
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed'
      };
    }
  }

  /**
   * Выход из системы
   */
  static async logout(): Promise<AuthResponse> {
    try {
      // Очищаем токены
      await JWTService.clearTokens();
      
      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Logout failed'
      };
    }
  }

  /**
   * Обновление токена
   */
  static async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshed = await JWTService.getRefreshToken();
      
      if (refreshed) {
        return {
          success: true,
          message: 'Token refreshed successfully'
        };
      } else {
        return {
          success: false,
          message: 'Token refresh failed'
        };
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Token refresh failed'
      };
    }
  }
}
