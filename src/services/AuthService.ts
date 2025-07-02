import { Driver, Client, UserRole } from '../types/user';
import APIClient, { APIResponse } from './APIClient';
import JWTService from './JWTService';

// Конфигурация API - будет заменена на реальные данные
const API_CONFIG = {
  BASE_URL: __DEV__ ? 'http://localhost:3000/api' : 'https://your-production-api.com/api',
  TIMEOUT: 10000, // 10 секунд
};

export type RegisterPayload =
  | (Omit<Driver, 'id'> & { password: string })
  | (Omit<Client, 'id'> & { password: string });

export type LoginPayload = {
  email: string;
  password: string;
};

export type VerifyOTPPayload = {
  phoneNumber: string;
  otpCode: string;
  userData: any;
};

export interface AuthResponse {
  user: Driver | Client;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: 'Bearer';
  };
}

export class AuthService {
  /**
   * Регистрация пользователя после OTP верификации
   */
  static async registerWithOTP(payload: VerifyOTPPayload): Promise<AuthResponse> {
    if (__DEV__) {
      // Мок для разработки
      return this.mockRegisterWithOTP(payload);
    }

    try {
      const response = await APIClient.post<AuthResponse>('/auth/register-with-otp', payload);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Registration failed');
      }

      // Сохраняем токены
      await JWTService.saveTokens(response.data.tokens);

      return response.data;
    } catch (error) {
      console.error('API Registration error:', error);
      throw error;
    }
  }

  /**
   * Регистрация пользователя
   */
  static async register(payload: RegisterPayload): Promise<AuthResponse> {
    if (__DEV__) {
      // Мок для разработки
      return this.mockRegister(payload);
    }

    try {
      const response = await APIClient.post<AuthResponse>('/auth/register', payload);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Registration failed');
      }

      // Сохраняем токены
      await JWTService.saveTokens(response.data.tokens);

      return response.data;
    } catch (error) {
      console.error('API Registration error:', error);
      throw error;
    }
  }

  /**
   * Вход в систему
   */
  static async login(payload: LoginPayload | { email: string; authMethod: string }): Promise<AuthResponse> {
    if (__DEV__) {
      // Мок для разработки
      return this.mockLogin(payload as LoginPayload);
    }

    try {
      const response = await APIClient.post<AuthResponse>('/auth/login', payload);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Login failed');
      }

      // Сохраняем токены
      await JWTService.saveTokens(response.data.tokens);

      return response.data;
    } catch (error) {
      console.error('API Login error:', error);
      throw error;
    }
  }

  /**
   * Выход из системы
   */
  static async logout(): Promise<void> {
    if (__DEV__) {
      // Мок для разработки
      console.log('🚪 Мок выход из системы');
      await JWTService.clearTokens();
      return;
    }

    try {
      await APIClient.post('/auth/logout');
    } catch (error) {
      console.error('API Logout error:', error);
    } finally {
      // Всегда очищаем токены локально
      await JWTService.clearTokens();
    }
  }

  /**
   * Обновление токена
   */
  static async refreshToken(): Promise<boolean> {
    try {
      const newToken = await JWTService.refreshAccessToken();
      return !!newToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  /**
   * Проверка валидности токена
   */
  static async validateToken(): Promise<boolean> {
    try {
      const response = await APIClient.get('/auth/validate');
      return response.success;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  /**
   * Изменение пароля
   */
  static async changePassword(payload: {
    currentPassword: string;
    newPassword: string;
  }): Promise<boolean> {
    try {
      const response = await APIClient.post('/auth/change-password', payload);
      return response.success;
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    }
  }

  /**
   * Сброс пароля
   */
  static async resetPassword(payload: {
    email: string;
  }): Promise<boolean> {
    try {
      const response = await APIClient.post('/auth/reset-password', payload);
      return response.success;
    } catch (error) {
      console.error('Reset password error:', error);
      return false;
    }
  }

  /**
   * Подтверждение сброса пароля
   */
  static async confirmResetPassword(payload: {
    token: string;
    newPassword: string;
  }): Promise<boolean> {
    try {
      const response = await APIClient.post('/auth/confirm-reset-password', payload);
      return response.success;
    } catch (error) {
      console.error('Confirm reset password error:', error);
      return false;
    }
  }

  /**
   * Мок регистрации для разработки
   */
  private static async mockRegisterWithOTP(payload: VerifyOTPPayload): Promise<AuthResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('🧪 Мок регистрация после OTP:', {
          phone: payload.phoneNumber,
          userData: payload.userData,
        });

        const baseUser = {
          id: `user_${Date.now()}`,
          email: payload.userData.email || '',
          phone: payload.phoneNumber,
          createdAt: new Date().toISOString(),
          rating: 0.0,
        };

        let user: Driver | Client;
        if (payload.userData.role === 'driver') {
          user = {
            ...baseUser,
            name: payload.userData.first_name || '',
            surname: payload.userData.last_name || '',
            address: payload.userData.address || '',
            role: UserRole.DRIVER,
            avatar: null,
            vehicle: {
              make: payload.userData.vehicle_brand || 'Toyota',
              model: payload.userData.vehicle_model || 'Camry',
              year: payload.userData.vehicle_year || 2020,
              color: payload.userData.carColor || 'White',
              licensePlate: payload.userData.carPlate || 'ABC123',
            },
            isAvailable: false,
            currentLocation: undefined,
          } as Driver;
        } else {
          user = {
            ...baseUser,
            name: payload.userData.name || '',
            surname: payload.userData.surname || '',
            address: payload.userData.address || '',
            role: UserRole.CLIENT,
            avatar: null,
          } as Client;
        }

        // Генерируем JWT токены
        const tokens = JWTService.generateTokens({
          userId: user.id,
          email: user.email,
          role: user.role,
          phone: user.phone,
        });

        resolve({
          user,
          tokens,
        });
      }, 1000);
    });
  }

  /**
   * Мок регистрации для разработки
   */
  private static async mockRegister(payload: RegisterPayload): Promise<AuthResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = {
          ...payload,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };

        // Генерируем JWT токены
        const tokens = JWTService.generateTokens({
          userId: user.id,
          email: user.email,
          role: user.role,
          phone: user.phone,
        });

        resolve({
          user: user as Driver | Client,
          tokens,
        });
      }, 1000);
    });
  }

  /**
   * Мок входа для разработки
   */
  private static async mockLogin(payload: LoginPayload | { email: string; authMethod: string }): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Проверяем тип payload
        const isSocialAuth = 'authMethod' in payload;
        
        if (payload.email && (isSocialAuth || payload.password)) {
          // Определяем имя пользователя в зависимости от метода аутентификации
          let userName = 'Иван';
          let userSurname = 'Иванов';
          let userAvatar = 'https://randomuser.me/api/portraits/men/1.jpg';
          
          if (isSocialAuth) {
            switch (payload.authMethod) {
              case 'google_auth':
                userName = 'Google';
                userSurname = 'User';
                userAvatar = 'https://via.placeholder.com/150';
                break;
              case 'facebook_auth':
                userName = 'Facebook';
                userSurname = 'User';
                userAvatar = 'https://via.placeholder.com/150';
                break;
              case 'apple_auth':
                userName = 'Apple';
                userSurname = 'User';
                userAvatar = null;
                break;
            }
          }
          
          const user: Client = {
            id: isSocialAuth ? `social_${Date.now()}` : '1',
            name: userName,
            surname: userSurname,
            email: payload.email,
            address: 'Москва, ул. Примерная, 1',
            role: UserRole.CLIENT,
            phone: '+7 (999) 123-45-67',
            avatar: userAvatar,
            rating: 4.8,
            createdAt: '2024-01-01',
          };

          // Генерируем JWT токены
          const tokens = JWTService.generateTokens({
            userId: user.id,
            email: user.email,
            role: user.role,
            phone: user.phone,
          });

          console.log(`🧪 Мок вход ${isSocialAuth ? `через ${payload.authMethod}` : 'с email'}:`, {
            email: payload.email,
            method: isSocialAuth ? payload.authMethod : 'email'
          });

          resolve({
            user,
            tokens,
          });
        } else {
          reject(new Error('Неверные данные'));
        }
      }, 500);
    });
  }

  /**
   * Проверка здоровья API
   */
  static async checkAPIHealth(): Promise<boolean> {
    try {
      return await APIClient.healthCheck();
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  }
}

export default AuthService;
