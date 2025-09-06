import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '../types/user';
import JWTService from '../services/JWTService';
import { createAuthMockUser } from '../mocks/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, authMethod?: string) => Promise<boolean>;
  register: (userData: Partial<User>, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
  getAuthHeader: () => Promise<{ Authorization: string } | null>;
  changeRole: (role: UserRole) => void;
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

  /**
   * Обновление аутентификации
   */
  const refreshAuth = useCallback(async (): Promise<boolean> => {
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
      
      return false;
    } catch (error) {
      
      // Не выходим автоматически при ошибках обновления
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  /**
   * Инициализация аутентификации при запуске приложения
   */
  const initializeAuth = useCallback(async () => {
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
    
            // Не выходим автоматически, даем пользователю остаться в приложении
          }
        } else {
          // Токен невалиден - пытаемся обновить
  
          const refreshed = await refreshAuth();
          if (!refreshed) {
            // Если обновление не удалось, НЕ выходим автоматически
    
          }
        }
      }
    } catch (error) {
      
      // Не выходим автоматически при ошибках инициализации
    } finally {
      setIsLoading(false);
    }
  }, [refreshAuth]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  /**
   * Вход в систему
   */
  const login = async (email: string, password: string, authMethod?: 'google' | 'facebook' | 'apple'): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Используем AuthService для входа
      const authService = await import('../../data/datasources/auth/AuthService');
      const result = await authService.AuthService.login(email, password, authMethod);
      
      if (result.success && result.user && result.tokens) {
        // Сохраняем токены и данные пользователя
        await Promise.all([
          JWTService.saveTokens(result.tokens),
          AsyncStorage.setItem('user', JSON.stringify(result.user)),
        ]);

        setUser(result.user);
        return true;
      } else {
        console.error('Login failed:', result.message);
        return false;
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
  const register = async (userData: {
    name: string;
    surname: string;
    email: string;
    phone: string;
    country: string;
    role: UserRole;
    children?: Array<{ name: string; age: number; relationship: string }>;
  }, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Используем AuthService для регистрации
      const authService = await import('../../data/datasources/auth/AuthService');
      const result = await authService.AuthService.register(userData, password);
      
      if (result.success && result.user && result.tokens) {
        // Сохраняем токены и данные пользователя
        await Promise.all([
          JWTService.saveTokens(result.tokens),
          AsyncStorage.setItem('user', JSON.stringify(result.user)),
        ]);

        setUser(result.user);
        return true;
      } else {
        console.error('Registration failed:', result.message);
        return false;
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
  const logout = useCallback(async () => {
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
          console.warn('Logout API error:', error);
        }
      }

      // Очищаем все данные
      await Promise.all([
        JWTService.clearTokens(),
        AsyncStorage.removeItem('user'),
      ]);

      setUser(null);
    } catch (error) {
      console.warn('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Получение заголовка авторизации для API запросов
   */
  const getAuthHeader = async (): Promise<{ Authorization: string } | null> => {
    return await JWTService.getAuthHeader();
  };

  /**
   * Изменение роли пользователя
   */
  const changeRole = useCallback((role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      // Сохраняем обновленного пользователя в AsyncStorage
      AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }, [user]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading: isLoading || isRefreshing,
    login,
    register,
    logout,
    refreshAuth,
    getAuthHeader,
    changeRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
