// ===== КОНСТАНТЫ ДЛЯ ВСЕХ МОКОВ =====

// Аватары пользователей
export const MOCK_AVATARS = {
  CLIENT_1: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  DRIVER_1: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  DRIVER_2: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  DRIVER_3: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
};

// Локации в Баку
export const MOCK_LOCATIONS = {
  BAKU_CENTER: { latitude: 40.3777, longitude: 49.8920 },
  BAKU_NORTH: { latitude: 40.3953, longitude: 49.8512 },
  BAKU_EAST: { latitude: 40.4093, longitude: 49.8671 },
  BAKU_SOUTH: { latitude: 40.3601, longitude: 49.8350 },
};

// Цвета для статусов
export const MOCK_COLORS = {
  SUCCESS: '#4caf50',
  WARNING: '#ff9800',
  ERROR: '#f44336',
  INFO: '#2196f3',
  PRIMARY: '#003366',
  SECONDARY: '#666666',
};

// Статусы заказов
export const MOCK_ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Типы уведомлений
export const MOCK_NOTIFICATION_TYPES = {
  ORDER: 'order',
  PAYMENT: 'payment',
  SYSTEM: 'system',
  PROMO: 'promo',
};

// Типы платежей
export const MOCK_PAYMENT_TYPES = {
  CARD: 'card',
  CASH: 'cash',
  BALANCE: 'balance',
};

// Валюты
export const MOCK_CURRENCIES = {
  AFc: 'AFc',
  USD: 'USD',
  EUR: 'EUR',
};

// Языки
export const MOCK_LANGUAGES = {
  RU: 'ru',
  EN: 'en',
  AZ: 'az',
};

// Роли пользователей
export const MOCK_USER_ROLES = {
  CLIENT: 'client',
  DRIVER: 'driver',
  ADMIN: 'admin',
};

// Статусы водителей
export const MOCK_DRIVER_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BUSY: 'busy',
  OFFLINE: 'offline',
};

// Типы автомобилей
export const MOCK_CAR_TYPES = {
  SEDAN: 'sedan',
  SUV: 'suv',
  VAN: 'van',
  LUXURY: 'luxury',
};

// Марки автомобилей
export const MOCK_CAR_BRANDS = {
  TOYOTA: 'Toyota',
  HONDA: 'Honda',
  FORD: 'Ford',
  BMW: 'BMW',
  MERCEDES: 'Mercedes',
  AUDI: 'Audi',
};

// Модели автомобилей
export const MOCK_CAR_MODELS = {
  CAMRY: 'Camry',
  CIVIC: 'Civic',
  FOCUS: 'Focus',
  X5: 'X5',
  C_CLASS: 'C-Class',
  A4: 'A4',
};

// Цвета автомобилей
export const MOCK_CAR_COLORS = {
  WHITE: 'Белый',
  BLACK: 'Черный',
  SILVER: 'Серебристый',
  RED: 'Красный',
  BLUE: 'Синий',
  GRAY: 'Серый',
};

// Типы карт
export const MOCK_CARD_TYPES = {
  VISA: 'visa',
  MASTERCARD: 'mastercard',
  AMEX: 'amex',
};

// Статусы карт
export const MOCK_CARD_STATUSES = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  BLOCKED: 'blocked',
};

// Типы долгов
export const MOCK_DEBT_TYPES = {
  RIDE: 'ride',
  SUBSCRIPTION: 'subscription',
  PENALTY: 'penalty',
};

// Статусы долгов
export const MOCK_DEBT_STATUSES = {
  ACTIVE: 'active',
  PAID: 'paid',
  OVERDUE: 'overdue',
};

// Типы адресов
export const MOCK_ADDRESS_TYPES = {
  HOME: 'home',
  WORK: 'work',
  OTHER: 'other',
};

// Статусы адресов
export const MOCK_ADDRESS_STATUSES = {
  DEFAULT: 'default',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
}; 