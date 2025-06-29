import { Driver, Client, UserRole } from '../types/user';

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

export class AuthService {
  /**
   * Регистрация пользователя после OTP верификации
   */
  static async registerWithOTP(payload: VerifyOTPPayload): Promise<Driver | Client> {
    if (__DEV__) {
      // Мок для разработки
      return this.mockRegisterWithOTP(payload);
    }

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/register-with-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка регистрации');
      }

      const result = await response.json();
      return result.user;
    } catch (error) {
      console.error('API Registration error:', error);
      throw error;
    }
  }

  static async register(payload: RegisterPayload): Promise<Driver | Client> {
    if (__DEV__) {
      // Мок для разработки
      return new Promise((resolve) => {
        setTimeout(() => {
          if (payload.role === 'driver') {
            resolve({ ...(payload as any), id: Date.now().toString() });
          } else {
            resolve({ ...(payload as any), id: Date.now().toString() });
          }
        }, 1000);
      });
    }

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка регистрации');
      }

      return await response.json();
    } catch (error) {
      console.error('API Registration error:', error);
      throw error;
    }
  }

  static async login(payload: LoginPayload): Promise<Driver | Client> {
    if (__DEV__) {
      // Мок для разработки - быстрая загрузка
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (payload.email && payload.password) {
            resolve({
              id: '1',
              name: 'Иван',
              surname: 'Иванов',
              email: 'ivan@example.com',
              address: 'Москва, ул. Примерная, 1',
              role: UserRole.CLIENT,
              phone: '+7 (999) 123-45-67',
              avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
              rating: 4.8,
              createdAt: '2024-01-01',
            } as Client);
          } else {
            reject(new Error('Неверные данные'));
          }
        }, 500); // Мок - быстро
      });
    }

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка входа');
      }

      return await response.json();
    } catch (error) {
      console.error('API Login error:', error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    if (__DEV__) {
      // Мок для разработки
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('🚪 Мок выход из системы');
          resolve();
        }, 300);
      });
    }

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getToken()}`,
        },
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
      });

      if (!response.ok) {
        throw new Error('Ошибка при выходе');
      }
    } catch (error) {
      console.error('API Logout error:', error);
      throw error;
    }
  }

  /**
   * Получить токен из хранилища
   */
  private static async getToken(): Promise<string | null> {
    // Реализация получения токена из AsyncStorage
    // return await AsyncStorage.getItem('authToken');
    return null;
  }

  /**
   * Мок регистрации для разработки
   */
  private static async mockRegisterWithOTP(payload: VerifyOTPPayload): Promise<Driver | Client> {
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

        if (payload.userData.role === 'driver') {
          resolve({
            ...baseUser,
            name: payload.userData.first_name || '',
            surname: payload.userData.last_name || '',
            role: UserRole.DRIVER,
            vehicle: {
              make: payload.userData.vehicle_brand || 'Toyota',
              model: payload.userData.vehicle_model || 'Camry',
              year: payload.userData.vehicle_year || 2020,
              color: 'White',
              licensePlate: payload.userData.vehicle_number || 'ABC123',
            },
            isAvailable: false,
            address: '',
            avatar: null,
          } as Driver);
        } else {
          resolve({
            ...baseUser,
            name: payload.userData.name || '',
            surname: '',
            role: UserRole.CLIENT,
            address: '',
            avatar: null,
          } as Client);
        }
      }, 800); // Имитация сетевой задержки
    });
  }

  /**
   * Проверка доступности API
   */
  static async checkAPIHealth(): Promise<boolean> {
    if (__DEV__) {
      console.log('🧪 Мок: API здоров');
      return true;
    }

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch (error) {
      console.error('API Health check failed:', error);
      return false;
    }
  }
}

export default AuthService;
