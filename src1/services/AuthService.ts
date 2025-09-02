import { createAuthMockUser, findAuthUserByCredentials } from '../mocks/auth';
import JWTService, { TokenResponse } from './JWTService';
import { User, UserRole } from '../types/user';
import { ENV_CONFIG, ConfigUtils } from '../config/environment';

export interface AuthResponse {
  success: boolean;
  user?: User;
  tokens?: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
  };
  message?: string;
}

// Интерфейсы для совместимости с Go API
interface GoUserInfo {
  id: number;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  status: string;
}

interface GoTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  expires_at: string;
  user_info: GoUserInfo;
}

interface GoLoginRequest {
  email: string;
  password: string;
}

interface GoRegisterRequest {
  email: string;
  password: string;
  phone_number: string;
  first_name: string;
  last_name: string;
}

// Преобразование Go API ответа в формат фронтенда
const transformGoUserToFrontend = (goUser: GoUserInfo): User => {
  return {
    id: goUser.id.toString(),
    email: goUser.email,
    name: goUser.first_name,
    surname: goUser.last_name,
    phone: goUser.phone_number,
    role: UserRole.CLIENT, // По умолчанию клиент, для водителей нужно отдельное API
    avatar: null,
    rating: 0,
    createdAt: new Date().toISOString(),
    address: '',
  };
};

const transformGoTokensToFrontend = (goTokens: GoTokenResponse): TokenResponse => {
  return {
    accessToken: goTokens.access_token,
    refreshToken: goTokens.refresh_token,
    expiresIn: goTokens.expires_in,
    tokenType: 'Bearer',
  };
};

export class AuthService {
  /**
   * Вход в систему
   */
  static async login(email: string, password: string, authMethod?: string): Promise<AuthResponse> {
    try {
      // В dev режиме всегда используем моки для тестирования
      if (__DEV__) {
  
        return this.mockLogin(email, password);
      }

      // Проверяем доступность сервера
      const isServerAvailable = await ConfigUtils.checkServerHealth();
      
      if (!isServerAvailable) {
        console.warn('Server unavailable, falling back to mock data');
        return this.mockLogin(email, password);
      }

      const requestBody: GoLoginRequest = {
        email,
        password,
      };

      const response = await fetch(ConfigUtils.getApiUrl('/auth/client/login'), {
        method: 'POST',
        headers: ENV_CONFIG.API.DEFAULT_HEADERS,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data: GoTokenResponse = await response.json();
      
      // Преобразуем данные в формат фронтенда
      const user = transformGoUserToFrontend(data.user_info);
      const tokens = transformGoTokensToFrontend(data);

      return {
        success: true,
        user,
        tokens,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed',
      };
    }
  }

  /**
   * Регистрация пользователя
   */
  static async register(userData: {
    name: string;
    surname: string;
    email: string;
    phone: string;
    country: string;
    role: UserRole;
    children?: Array<{ name: string; age: number; relationship: string }>;
  }, password: string): Promise<AuthResponse> {
    try {
      // Проверяем доступность сервера
      const isServerAvailable = await ConfigUtils.checkServerHealth();
      
      if (!isServerAvailable) {
        console.warn('Server unavailable, falling back to mock data');
        return this.mockRegister(userData, password);
      }

      const requestBody: GoRegisterRequest = {
        email: userData.email,
        password,
        phone_number: userData.phone,
        first_name: userData.name,
        last_name: userData.surname,
      };

      const response = await fetch(ConfigUtils.getApiUrl('/auth/client/register'), {
        method: 'POST',
        headers: ENV_CONFIG.API.DEFAULT_HEADERS,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data: GoTokenResponse = await response.json();
      
      // Преобразуем данные в формат фронтенда
      const user = transformGoUserToFrontend(data.user_info);
      const tokens = transformGoTokensToFrontend(data);

      return {
        success: true,
        user,
        tokens,
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed',
      };
    }
  }

  /**
   * Выход из системы
   */
  static async logout(): Promise<AuthResponse> {
    try {
      // Получаем refresh token
      const refreshToken = await JWTService.getRefreshToken();
      
      if (refreshToken) {
        // Проверяем доступность сервера
        const isServerAvailable = await ConfigUtils.checkServerHealth();
        
        if (isServerAvailable) {
          const response = await fetch(ConfigUtils.getApiUrl('/auth/client/logout'), {
            method: 'POST',
            headers: ENV_CONFIG.API.DEFAULT_HEADERS,
            body: JSON.stringify({ refresh_token: refreshToken }),
          });

          if (!response.ok) {
            console.warn('Server logout failed, but continuing with local cleanup');
          }
        }
      }

      // Очищаем токены локально
      await JWTService.clearTokens();
      
      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Logout failed',
      };
    }
  }

  /**
   * Обновление токена
   */
  static async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = await JWTService.getRefreshToken();
      
      if (!refreshToken) {
        return {
          success: false,
          message: 'No refresh token available',
        };
      }

      // Проверяем доступность сервера
      const isServerAvailable = await ConfigUtils.checkServerHealth();
      
      if (!isServerAvailable) {
        console.warn('Server unavailable, using local token refresh');
        return this.mockRefreshToken();
      }

      const response = await fetch(ConfigUtils.getApiUrl('/auth/client/refresh'), {
        method: 'POST',
        headers: ENV_CONFIG.API.DEFAULT_HEADERS,
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data: GoTokenResponse = await response.json();
      
      // Преобразуем данные в формат фронтенда
      const user = transformGoUserToFrontend(data.user_info);
      const tokens = transformGoTokensToFrontend(data);

      return {
        success: true,
        message: 'Token refreshed successfully',
        user,
        tokens,
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Token refresh failed',
      };
    }
  }

  // Fallback методы для моков
  private static async mockLogin(email: string, password: string): Promise<AuthResponse> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      

      
      // Сначала пытаемся найти пользователя в готовых моках
      
      const existingUser = findAuthUserByCredentials(email, password);
      
      if (existingUser) {

        const tokens = await JWTService.forceRefreshTokens({
          userId: existingUser.id,
          email: existingUser.email,
          role: existingUser.role,
          phone: existingUser.phone,
        });


        return {
          success: true,
          user: existingUser,
          tokens,
        };
      }
      
      
      // Если пользователь не найден, создаем нового
      let role = UserRole.CLIENT;
      if (email.includes('driver')) {
        role = UserRole.DRIVER;
      }
      
      
      const mockUser = createAuthMockUser({ email, role });
      
      const tokens = await JWTService.forceRefreshTokens({
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        phone: mockUser.phone,
      });
      

      return {
        success: true,
        user: mockUser,
        tokens,
      };
    } catch (error) {
      console.error('❌ Mock login error:', error);
      return {
        success: false,
        message: 'Mock login failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
      };
    }
  }

  private static async mockRegister(userData: any, password: string): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = createAuthMockUser({
      email: userData.email,
      role: userData.role,
      name: userData.name,
      surname: userData.surname,
      phone: userData.phone,
    });

    const tokens = await JWTService.forceRefreshTokens({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
    });

    return {
      success: true,
      user: newUser,
      tokens,
    };
  }

  private static async mockRefreshToken(): Promise<AuthResponse> {
    const currentUser = await JWTService.getCurrentUser();
    
    if (currentUser) {
      const tokens = await JWTService.forceRefreshTokens({
        userId: currentUser.userId,
        email: currentUser.email,
        role: currentUser.role,
        phone: currentUser.phone,
      });
      
      return {
        success: true,
        message: 'Token refreshed successfully',
        tokens,
      };
    } else {
      return {
        success: false,
        message: 'No current user found',
      };
    }
  }
}
