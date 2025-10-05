import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, UserRole } from "../types/user";
import JWTService from "../services/JWTService";
import { AuthService } from "../services/AuthService";
import DevRegistrationService from "../services/DevRegistrationService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    authMethod?: string,
  ) => Promise<boolean>;
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
    console.error("useAuth must be used within an AuthProvider");
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: async () => false,
      register: async () => false,
      logout: () => {},
      refreshAuth: async () => {},
      getAuthHeader: () => ({}),
      changeRole: () => {},
    };
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
          JWTService.saveTokens({
            ...result.tokens,
            tokenType: "Bearer" as const,
          }),
          AsyncStorage.setItem("user", JSON.stringify(result.user)),
        ]);

        setUser(result.user);
        return true;
      }

      return false;
    } catch (error) {
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
        const isDevLogin = await AsyncStorage.getItem("dev_mode_login");
        const savedUser = await AsyncStorage.getItem("user");

        if (isDevLogin === "true" && savedUser) {
          const user = JSON.parse(savedUser);
          setUser(user);
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
          const userData = await AsyncStorage.getItem("user");
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
      console.warn('Failed to initialize auth context:', error);
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
  const login = async (
    email: string,
    password: string,
    authMethod?: "google" | "facebook" | "apple",
  ): Promise<boolean> => {
    try {
      setIsLoading(true);

      // ⚠️ DEV ONLY: Проверяем локальных пользователей
      if (__DEV__) {
        const devUsers = await DevRegistrationService.getAllDevUsers();

        if (devUsers.length > 0) {
          // Детальный вывод всех пользователей
          devUsers.forEach(() => {});
        }

        // Показываем сохраненные пароли для отладки
        const userWithEmail = devUsers.find((u) => u.email === email);
        if (userWithEmail) {
          console.log('Found user with email:', userWithEmail.email);
        } else {
          console.log('No user found with email:', email);
        }

        const devUser = devUsers.find(
          (u) => u.email === email && u.password === password,
        );

        if (devUser) {
          // Создаем объект User из DevRegisteredUser
          const user: User = {
            id: devUser.id,
            email: devUser.email,
            name: devUser.firstName || "",
            surname: devUser.lastName || "",
            role: devUser.role as UserRole,
            phone: devUser.phone,
            avatar: null,
            rating: 5,
            address: "",
            createdAt: devUser.registeredAt,
            birthDate: undefined,
          };

          // Сохраняем пользователя
          await AsyncStorage.setItem("user", JSON.stringify(user));
          await AsyncStorage.setItem("dev_mode_login", "true");

          // Сохраняем профиль для ProfileContext
          await AsyncStorage.setItem(
            `@profile_${user.id}`,
            JSON.stringify(user),
          );

          setUser(user);

          return true;
        } else {
          console.log('Authentication failed for user:', email);
        }
      }

      // PROD: Используем AuthService для входа
      const result = await AuthService.login(email, password, authMethod);

      if (result.success && result.user && result.tokens) {
        // Сохраняем токены и данные пользователя
        await Promise.all([
          JWTService.saveTokens({
            ...result.tokens,
            tokenType: "Bearer" as const,
          }),
          AsyncStorage.setItem("user", JSON.stringify(result.user)),
        ]);

        setUser(result.user);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Регистрация пользователя
   */
  const register = async (
    userData: {
      name: string;
      surname: string;
      email: string;
      phone: string;
      country: string;
      role: UserRole;
      children?: Array<{ name: string; age: number; relationship: string }>;
    },
    password: string,
  ): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Используем AuthService для регистрации
      const result = await AuthService.register(userData, password);

      if (result.success && result.user && result.tokens) {
        // Сохраняем токены и данные пользователя
        await Promise.all([
          JWTService.saveTokens({
            ...result.tokens,
            tokenType: "Bearer" as const,
          }),
          AsyncStorage.setItem("user", JSON.stringify(result.user)),
        ]);

        setUser(result.user);
        return true;
      } else {
        return false;
      }
    } catch (error) {
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
      const isDevLogin = await AsyncStorage.getItem("dev_mode_login");
      if (isDevLogin !== "true") {
        await AuthService.logout();
      }

      // Очищаем все данные
      await Promise.all([
        JWTService.clearTokens(),
        AsyncStorage.removeItem("user"),
        AsyncStorage.removeItem("dev_mode_login"), // Очищаем DEV флаг
      ]);

      setUser(null);
    } catch (error) {
      console.warn('Failed to logout:', error);
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
  const changeRole = useCallback(
    (role: UserRole) => {
      if (user) {
        const updatedUser = { ...user, role };
        setUser(updatedUser);
        // Сохраняем обновленного пользователя в AsyncStorage
        AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      }
    },
    [user],
  );

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
