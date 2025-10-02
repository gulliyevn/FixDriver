import JWTService, { TokenResponse } from './JWTService';
import { User, UserRole } from '../types/user';
import { ENV_CONFIG, ConfigUtils } from '../config/environment';
import APIClient from './APIClient';

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
  [key: string]: unknown;
}

interface GoRegisterRequest {
  email: string;
  password: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  [key: string]: unknown;
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
    tokenType: 'Bearer' as const,
  };
};

export class AuthService {
  /**
   * Вход в систему
   */
  static async login(email: string, password: string, authMethod?: string): Promise<AuthResponse> {
    try {
      const requestBody: GoLoginRequest = {
        email,
        password,
      };

      const response = await APIClient.post<GoTokenResponse>('/auth/client/login', requestBody);
      
      if (!response.success || !response.data) {
        console.error(response.error || 'Login failed'); return;
      }
      
      // Преобразуем данные в формат фронтенда
      const user = transformGoUserToFrontend(response.data.user_info);
      const tokens = transformGoTokensToFrontend(response.data);

      return {
        success: true,
        user,
        tokens,
      };
    } catch (error) {
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
      const requestBody: GoRegisterRequest = {
        email: userData.email,
        password,
        phone_number: userData.phone,
        first_name: userData.name,
        last_name: userData.surname,
      };

      const response = await APIClient.post<GoTokenResponse>('/auth/client/register', requestBody);
      
      if (!response.success || !response.data) {
        console.error(response.error || 'Registration failed'); return;
      }
      
      // Преобразуем данные в формат фронтенда
      const user = transformGoUserToFrontend(response.data.user_info);
      const tokens = transformGoTokensToFrontend(response.data);

      return {
        success: true,
        user,
        tokens,
      };
    } catch (error) {
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
        try {
          await APIClient.post('/auth/client/logout', { refresh_token: refreshToken });
        } catch (error) {
        }
      }

      // Очищаем токены локально
      await JWTService.clearTokens();
      
      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error) {
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

      const response = await APIClient.post<GoTokenResponse>('/auth/client/refresh', { refresh_token: refreshToken });
      
      if (!response.success || !response.data) {
        console.error(response.error || 'Token refresh failed'); return;
      }
      
      // Преобразуем данные в формат фронтенда
      const user = transformGoUserToFrontend(response.data.user_info);
      const tokens = transformGoTokensToFrontend(response.data);

      return {
        success: true,
        message: 'Token refreshed successfully',
        user,
        tokens,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Token refresh failed',
      };
    }
  }

}
