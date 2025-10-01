import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '../types/user';
import JWTService from '../services/JWTService';
import { AuthService } from '../services/AuthService';
import DevRegistrationService from '../services/DevRegistrationService';

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
      
      const result = await AuthService.refreshToken();
      if (result.success && result.user && result.tokens) {
        // Сохраняем новые токены и обновляем пользователя
        await Promise.all([
          JWTService.saveTokens(result.tokens),
          AsyncStorage.setItem('user', JSON.stringify(result.user)),
        ]);
        
        setUser(result.user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Refresh auth error:', error);
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
      
      // ⚠️ DEV ONLY: Проверяем DEV-режим логина
      if (__DEV__) {
        const isDevLogin = await AsyncStorage.getItem('dev_mode_login');
        const savedUser = await AsyncStorage.getItem('user');
        
        if (isDevLogin === 'true' && savedUser) {
          const user = JSON.parse(savedUser);
          setUser(user);
          console.log('[DEV] 🔄 Restored DEV session:', user.email);
          setIsLoading(false);
          return; // Выходим, не проверяем токены
        }
      }
      
      // PROD: Проверяем наличие валидного токена
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
      console.error('[AuthContext] Init error:', error);
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
      
      // ⚠️ DEV ONLY: Проверяем локальных пользователей
      if (__DEV__) {
        console.log('[DEV] 🔍 Checking local users for:', email);
        
        const devUsers = await DevRegistrationService.getAllDevUsers();
        console.log(`[DEV] 📦 Found ${devUsers.length} total users in storage`);
        
        if (devUsers.length > 0) {
          console.log('[DEV] 👥 Users:', devUsers.map(u => `${u.email} (${u.role})`).join(', '));
          
          // Детальный вывод всех пользователей
          devUsers.forEach((u, index) => {
            console.log(`\n[DEV] User ${index + 1}:`);
            console.log(`  Email: "${u.email}"`);
            console.log(`  Email length: ${u.email.length}`);
            console.log(`  Password: "${u.password}"`);
            console.log(`  Password length: ${u.password.length}`);
            console.log(`  Role: ${u.role}`);
          });
          
          console.log(`\n[DEV] Looking for:`);
          console.log(`  Email: "${email}"`);
          console.log(`  Email length: ${email.length}`);
          console.log(`  Password: "${password}"`);
          console.log(`  Password length: ${password.length}`);
        }
        
        // Показываем сохраненные пароли для отладки
        const userWithEmail = devUsers.find(u => u.email === email);
        if (userWithEmail) {
          console.log(`\n[DEV] 📧 Found user with email: ${email}`);
          console.log(`[DEV] 🔒 Saved password: "${userWithEmail.password}"`);
          console.log(`[DEV] 🔑 Entered password: "${password}"`);
          console.log(`[DEV] ⚖️ Match: ${userWithEmail.password === password}`);
        } else {
          console.log(`\n[DEV] ❌ No user found with email: "${email}"`);
        }
        
        const devUser = devUsers.find(u => u.email === email && u.password === password);
        
        if (devUser) {
          console.log('[DEV] ✅ Found local user:', devUser.id);
          
          // Создаем объект User из DevRegisteredUser
          const user: User = {
            id: devUser.id,
            email: devUser.email,
            name: devUser.firstName || devUser.name || '',
            surname: devUser.lastName || devUser.surname || '',
            role: devUser.role,
            phone: devUser.phone,
            avatar: null,
            rating: 5,
            address: '',
            createdAt: devUser.registeredAt,
            birthDate: devUser.birthDate,
          };
          
          // Сохраняем пользователя
          await AsyncStorage.setItem('user', JSON.stringify(user));
          await AsyncStorage.setItem('dev_mode_login', 'true');
          
          // Сохраняем профиль для ProfileContext
          await AsyncStorage.setItem(`@profile_${user.id}`, JSON.stringify(user));
          
          setUser(user);
          
          console.log('[DEV] 🎉 Local login successful!');
          console.log('[DEV] 💾 Profile saved for:', user.id);
          return true;
        } else {
          console.log('[DEV] ❌ User not found in local storage');
          console.log(`[DEV] 🔑 Looking for: email="${email}", password="${password}"`);
        }
      }
      
      // PROD: Используем AuthService для входа
      const result = await AuthService.login(email, password, authMethod);
      
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
      const result = await AuthService.register(userData, password);
      
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
      
      // Отправляем запрос на сервер для инвалидации токена (только если не DEV)
      const isDevLogin = await AsyncStorage.getItem('dev_mode_login');
      if (isDevLogin !== 'true') {
        await AuthService.logout();
      }

      // Очищаем все данные
      await Promise.all([
        JWTService.clearTokens(),
        AsyncStorage.removeItem('user'),
        AsyncStorage.removeItem('dev_mode_login'), // Очищаем DEV флаг
      ]);

      setUser(null);
      console.log('[AuthContext] ✅ Logged out');
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
