import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '../types/user';
import JWTService, { JWTPayload } from '../services/JWTService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User>, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
  getAuthHeader: () => Promise<{ Authorization: string } | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  /**
   * Инициализация аутентификации при запуске приложения
   */
  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      
      // Проверяем наличие валидного токена
      const hasToken = await JWTService.hasValidToken();
      
      if (hasToken) {
        // Получаем данные пользователя из токена
        const tokenUser = await JWTService.getCurrentUser();
        
        if (tokenUser) {
          // Загружаем полные данные пользователя из AsyncStorage
          const userData = await AsyncStorage.getItem('user');
          if (userData) {
            const fullUser = JSON.parse(userData);
            setUser(fullUser);
          } else {
            // Если данных пользователя нет, но токен валиден - пытаемся восстановить
            console.warn('User data not found, but token is valid. Attempting to restore...');
            // Не выходим автоматически, даем пользователю остаться в приложении
          }
        } else {
          // Токен невалиден - пытаемся обновить
          console.warn('Token invalid, attempting to refresh...');
          const refreshed = await refreshAuth();
          if (!refreshed) {
            // Если обновление не удалось, НЕ выходим автоматически
            console.warn('Token refresh failed, but keeping user in app');
          }
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      // Не выходим автоматически при ошибках инициализации
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Вход в систему
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // В реальном приложении здесь будет API запрос
      if (__DEV__) {
        // Mock для разработки
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockUser: User = {
          id: '1',
          email,
          name: 'Иван',
          surname: 'Иванов',
          address: 'Москва, ул. Примерная, 1',
          role: UserRole.CLIENT,
          phone: '+1234567890',
          avatar: null,
          rating: 4.5,
          createdAt: new Date().toISOString(),
        };

        // Генерируем JWT токены
        const tokens = JWTService.generateTokens({
          userId: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
          phone: mockUser.phone,
        });

        // Сохраняем токены и данные пользователя
        await Promise.all([
          JWTService.saveTokens(tokens),
          AsyncStorage.setItem('user', JSON.stringify(mockUser)),
        ]);

        setUser(mockUser);
        return true;
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
        
        // Сохраняем токены и данные пользователя
        await Promise.all([
          JWTService.saveTokens(data.tokens),
          AsyncStorage.setItem('user', JSON.stringify(data.user)),
        ]);

        setUser(data.user);
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Регистрация пользователя
   */
  const register = async (userData: Partial<User>, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // В реальном приложении здесь будет API запрос
      if (__DEV__) {
        // Mock для разработки
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newUser: User = {
          id: Date.now().toString(),
          email: userData.email!,
          name: userData.name!,
          surname: userData.surname || '',
          address: userData.address || '',
          role: userData.role || UserRole.CLIENT,
          phone: userData.phone || '',
          avatar: null,
          rating: 0,
          createdAt: new Date().toISOString(),
        };

        // Генерируем JWT токены
        const tokens = JWTService.generateTokens({
          userId: newUser.id,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
        });

        // Сохраняем токены и данные пользователя
        await Promise.all([
          JWTService.saveTokens(tokens),
          AsyncStorage.setItem('user', JSON.stringify(newUser)),
        ]);

        setUser(newUser);
        return true;
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
        
        // Сохраняем токены и данные пользователя
        await Promise.all([
          JWTService.saveTokens(data.tokens),
          AsyncStorage.setItem('user', JSON.stringify(data.user)),
        ]);

        setUser(data.user);
        return true;
      }
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Выход из системы
   */
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // В реальном приложении отправляем запрос на сервер для инвалидации токена
      if (!__DEV__) {
        try {
          const authHeader = await JWTService.getAuthHeader();
          if (authHeader) {
            await fetch('/api/auth/logout', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...authHeader,
              },
            });
          }
        } catch (error) {
          console.error('Logout API error:', error);
        }
      }

      // Очищаем все данные
      await Promise.all([
        JWTService.clearTokens(),
        AsyncStorage.removeItem('user'),
      ]);

      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Обновление аутентификации
   */
  const refreshAuth = async (): Promise<boolean> => {
    if (isRefreshing) {
      return false;
    }

    try {
      setIsRefreshing(true);
      
      const newToken = await JWTService.refreshAccessToken();
      if (newToken) {
        // Проверяем, что пользователь все еще существует
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUser(user);
          return true;
        }
      }
      
      // Если обновление не удалось - НЕ выходим автоматически
      console.warn('Token refresh failed, but keeping user in app');
      return false;
    } catch (error) {
      console.error('Auth refresh error:', error);
      // Не выходим автоматически при ошибках обновления
      return false;
    } finally {
      setIsRefreshing(false);
    }
  };

  /**
   * Получение заголовка авторизации для API запросов
   */
  const getAuthHeader = async (): Promise<{ Authorization: string } | null> => {
    return await JWTService.getAuthHeader();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading: isLoading || isRefreshing,
    login,
    register,
    logout,
    refreshAuth,
    getAuthHeader,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
