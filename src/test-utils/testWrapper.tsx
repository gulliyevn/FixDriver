import React from "react";
import { render, RenderOptions } from "@testing-library/react-native";

// Импортируем только те провайдеры, которые точно существуют
let LanguageProvider: React.ComponentType<React.PropsWithChildren>;
let ThemeProvider: React.ComponentType<React.PropsWithChildren>;
let AuthProvider: React.ComponentType<any>;
let BalanceProvider: React.ComponentType<React.PropsWithChildren>;
let PackageProvider: React.ComponentType<React.PropsWithChildren>;
let LevelProgressProvider: React.ComponentType<React.PropsWithChildren>;
let ProfileProvider: React.ComponentType<React.PropsWithChildren>;

try {
  LanguageProvider = require("../context/LanguageContext").LanguageProvider;
} catch (e) {
  LanguageProvider = ({ children }: React.PropsWithChildren<Record<string, unknown>>) => children;
}

try {
  ThemeProvider = require("../context/ThemeContext").ThemeProvider;
} catch (e) {
  ThemeProvider = ({ children }: React.PropsWithChildren<Record<string, unknown>>) => children;
}

try {
  AuthProvider = require("../context/AuthContext").AuthProvider;
} catch (e) {
  AuthProvider = ({ children }: React.PropsWithChildren<Record<string, unknown>>) => children;
}

try {
  BalanceProvider = require("../context/BalanceContext").BalanceProvider;
} catch (e) {
  BalanceProvider = ({ children }: React.PropsWithChildren<Record<string, unknown>>) => children;
}

try {
  PackageProvider = require("../context/PackageContext").PackageProvider;
} catch (e) {
  PackageProvider = ({ children }: React.PropsWithChildren<Record<string, unknown>>) => children;
}

try {
  LevelProgressProvider =
    require("../context/LevelProgressContext").LevelProgressProvider;
} catch (e) {
  LevelProgressProvider = ({ children }: React.PropsWithChildren<Record<string, unknown>>) => children;
}

try {
  ProfileProvider = require("../context/ProfileContext").ProfileProvider;
} catch (e) {
  ProfileProvider = ({ children }: React.PropsWithChildren<Record<string, unknown>>) => children;
}

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

// Обертка для тестов с всеми провайдерами
const AllProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider
          value={{
            user: mockUser,
            isLoading: false,
            login: jest.fn(),
            logout: jest.fn(),
            register: jest.fn(),
            refreshAuth: jest.fn(),
          }}
        >
          <BalanceProvider>
            <PackageProvider>
              <LevelProgressProvider>
                <ProfileProvider>{children}</ProfileProvider>
              </LevelProgressProvider>
            </PackageProvider>
          </BalanceProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
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
