// App entry point - exports all components from new architecture

// Core Contexts
export { default as AuthContext, AuthProvider, useAuth } from './core/context/AuthContext';
export { ThemeProvider, useTheme } from './core/context/ThemeContext';
export { default as BalanceContext } from './core/context/BalanceContext';
export { default as LanguageContext } from './core/context/LanguageContext';
export { default as ProfileContext } from './core/context/ProfileContext';

// Navigation
export { default as MainNavigator } from './presentation/navigation/MainNavigator';
export { default as ClientNavigator } from './presentation/navigation/ClientNavigator';
export { default as DriverNavigator } from './presentation/navigation/DriverNavigator';
export { default as AuthNavigator } from './presentation/navigation/AuthNavigator';
export { default as TabBar } from './presentation/navigation/TabBar';

// Screens
export { default as MapScreen } from './presentation/screens/common/MapScreen';

// Repositories
export { AuthRepository } from './data/repositories/AuthRepository';
export { UserRepository } from './data/repositories/UserRepository';
export { OrderRepository } from './data/repositories/OrderRepository';
export { PaymentRepository } from './data/repositories/PaymentRepository';

// Services
export { storageService, STORAGE_KEYS } from './data/datasources/local/AsyncStorageService';

// Types
export * from './shared/types';

// Mocks
export { default as MockServices } from './shared/mocks/MockServices';
export { default as MockData } from './shared/mocks/MockData';
