// App entry point - exports all components from new architecture

// Core Contexts
export { default as AuthContext, AuthProvider, useAuth } from './core/context/AuthContext';
export { ThemeProvider, useTheme } from './core/context/ThemeContext';
export { default as BalanceContext, BalanceProvider, useBalance } from './core/context/BalanceContext';
export { default as LanguageContext, LanguageProvider, useLanguage } from './core/context/LanguageContext';
export { default as ProfileContext, ProfileProvider, useProfile } from './core/context/ProfileContext';
export { LevelProgressProvider, useLevelProgress } from './core/context/LevelProgressContext';

// Navigation
export { default as MainNavigator } from './presentation/navigation/MainNavigator';
export { default as ClientNavigator } from './presentation/navigation/ClientNavigator';
export { default as DriverNavigator } from './presentation/navigation/DriverNavigator';
export { default as AuthNavigator } from './presentation/navigation/AuthNavigator';
export { default as TabBar } from './presentation/navigation/TabBar';

// Screens
export { default as MapScreen } from './presentation/screens/common/MapScreen';
export { default as OrdersScreen } from './presentation/screens/common/OrdersScreen';

// Repositories
export { AuthRepository } from './data/repositories/AuthRepository';
export { UserRepository } from './data/repositories/UserRepository';
export { OrderRepository } from './data/repositories/OrderRepository';
export { PaymentRepository } from './data/repositories/PaymentRepository';

// Services
export { storageService } from './data/datasources/local/AsyncStorageService';
export { STORAGE_KEYS } from './shared/utils/storageKeys';

// Types
export * from './shared/types';

// Mocks
export { default as MockServices } from './shared/mocks/MockServices';
export { default as MockData } from './shared/mocks/MockData';
