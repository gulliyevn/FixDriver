import React, { createContext } from "react";
import { render, RenderOptions } from "@testing-library/react-native";

// Создаем мок-контексты для тестов
const MockLanguageContext = createContext({
  language: "en",
  setLanguage: jest.fn(),
  isLoading: false,
  error: null,
  t: (key: string) => key,
});

const MockThemeContext = createContext({
  isDark: false,
  toggleTheme: jest.fn(),
  colors: {
    primary: "#007AFF",
    background: "#FFFFFF",
    surface: "#F2F2F7",
    text: "#000000",
    textSecondary: "#8E8E93",
    border: "#E5E5E5",
  },
});

const MockAuthContext = createContext({
  user: null as unknown,
  isLoading: false,
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
  refreshAuth: jest.fn(),
});

const MockBalanceContext = createContext({
  balance: null as unknown,
  addBalance: jest.fn(),
  subtractBalance: jest.fn(),
  isLoading: false,
  error: null,
});

const MockPackageContext = createContext({
  currentPackage: null,
  packages: [],
  loading: false,
  error: null,
  selectPackage: jest.fn(),
  cancelPackage: jest.fn(),
});

const MockLevelProgressContext = createContext({
  driverLevel: null as unknown,
  incrementProgress: jest.fn(),
  addEarnings: jest.fn(),
  isLoading: false,
  error: null,
});

const MockProfileContext = createContext({
  profile: null as unknown,
  updateProfile: jest.fn(),
  isLoading: false,
  error: null,
});

// Моки провайдеров для тестов (без асинхронных операций)

// Mock данные для тестов
const mockUser = {
  id: "test-user-id",
  name: "Test User",
  email: "test@example.com",
  role: "client" as const,
  phone: "+1234567890",
  birthDate: new Date("1990-01-01"),
  isVerified: true,
  avatar: null,
  preferences: {
    language: "en",
    notifications: true,
    theme: "light",
  },
};

const mockBalance = {
  balance: 1000,
  currency: "USD",
  transactions: [],
};

const mockPackage = {
  currentPackage: null,
  packages: [],
  loading: false,
  error: null,
};

const mockLevelProgress = {
  currentLevel: 1,
  currentXP: 0,
  nextLevelXP: 100,
  progress: 0,
};

const mockProfile = {
  profile: mockUser,
  loading: false,
  error: null,
};

// Моки провайдеров для тестов (без асинхронных операций)
const MockLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <MockLanguageContext.Provider
      value={{
        language: "en",
        setLanguage: jest.fn(),
        isLoading: false,
        error: null,
        t: (key: string) => key,
      }}
    >
      {children}
    </MockLanguageContext.Provider>
  );
};

const MockThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <MockThemeContext.Provider
      value={{
        isDark: false,
        toggleTheme: jest.fn(),
        colors: {
          primary: "#007AFF",
          background: "#FFFFFF",
          surface: "#F2F2F7",
          text: "#000000",
          textSecondary: "#8E8E93",
          border: "#E5E5E5",
        },
      }}
    >
      {children}
    </MockThemeContext.Provider>
  );
};

const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <MockAuthContext.Provider
      value={{
        user: mockUser,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        refreshAuth: jest.fn(),
      }}
    >
      {children}
    </MockAuthContext.Provider>
  );
};

const MockBalanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <MockBalanceContext.Provider
      value={{
        balance: mockBalance,
        addBalance: jest.fn(),
        subtractBalance: jest.fn(),
        isLoading: false,
        error: null,
      }}
    >
      {children}
    </MockBalanceContext.Provider>
  );
};

const MockPackageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <MockPackageContext.Provider
      value={{
        currentPackage: null,
        packages: [],
        loading: false,
        error: null,
        selectPackage: jest.fn(),
        cancelPackage: jest.fn(),
      }}
    >
      {children}
    </MockPackageContext.Provider>
  );
};

const MockLevelProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <MockLevelProgressContext.Provider
      value={{
        driverLevel: mockLevelProgress,
        incrementProgress: jest.fn(),
        addEarnings: jest.fn(),
        isLoading: false,
        error: null,
      }}
    >
      {children}
    </MockLevelProgressContext.Provider>
  );
};

const MockProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <MockProfileContext.Provider
      value={{
        profile: mockProfile,
        updateProfile: jest.fn(),
        isLoading: false,
        error: null,
      }}
    >
      {children}
    </MockProfileContext.Provider>
  );
};

// Обертка для тестов с моками провайдеров
const AllProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <MockLanguageProvider>
      <MockThemeProvider>
        <MockAuthProvider>
          <MockBalanceProvider>
            <MockPackageProvider>
              <MockLevelProgressProvider>
                <MockProfileProvider>{children}</MockProfileProvider>
              </MockLevelProgressProvider>
            </MockPackageProvider>
          </MockBalanceProvider>
        </MockAuthProvider>
      </MockThemeProvider>
    </MockLanguageProvider>
  );
};

// Кастомная функция render с провайдерами
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllProviders, ...options });

// Экспортируем все что нужно для тестов
export * from "@testing-library/react-native";
export { customRender as render };

// Утилиты для мокирования контекстов
export const mockContexts = {
  user: mockUser,
  balance: mockBalance,
  package: mockPackage,
  levelProgress: mockLevelProgress,
  profile: mockProfile,
};
