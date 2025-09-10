/**
 * Mock Constants
 * Centralized constants for all mock services
 */

// User avatars
export const MOCK_AVATARS = {
  CLIENT_1: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  DRIVER_1: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  DRIVER_2: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  DRIVER_3: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
};

// Baku locations
export const MOCK_LOCATIONS = {
  BAKU_CENTER: { latitude: 40.3777, longitude: 49.8920 },
  BAKU_NORTH: { latitude: 40.3953, longitude: 49.8512 },
  BAKU_EAST: { latitude: 40.4093, longitude: 49.8671 },
  BAKU_SOUTH: { latitude: 40.3601, longitude: 49.8350 },
};

// Status colors
export const MOCK_COLORS = {
  SUCCESS: '#4caf50',
  WARNING: '#ff9800',
  ERROR: '#f44336',
  INFO: '#2196f3',
  PRIMARY: '#003366',
  SECONDARY: '#666666',
};

// Order statuses
export const MOCK_ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Notification types
export const MOCK_NOTIFICATION_TYPES = {
  ORDER: 'order',
  PAYMENT: 'payment',
  SYSTEM: 'system',
  PROMO: 'promo',
};

// Payment types
export const MOCK_PAYMENT_TYPES = {
  CARD: 'card',
  CASH: 'cash',
  BALANCE: 'balance',
};

// Currencies
export const MOCK_CURRENCIES = {
  AFc: 'AFc',
  USD: 'USD',
  EUR: 'EUR',
};

// Languages
export const MOCK_LANGUAGES = {
  RU: 'ru',
  EN: 'en',
  AZ: 'az',
};

// User roles
export const MOCK_USER_ROLES = {
  CLIENT: 'client',
  DRIVER: 'driver',
  ADMIN: 'admin',
};

// Driver statuses
export const MOCK_DRIVER_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BUSY: 'busy',
  OFFLINE: 'offline',
};

// Car types
export const MOCK_CAR_TYPES = {
  SEDAN: 'sedan',
  SUV: 'suv',
  VAN: 'van',
  LUXURY: 'luxury',
};

// Car brands
export const MOCK_CAR_BRANDS = {
  TOYOTA: 'Toyota',
  HONDA: 'Honda',
  FORD: 'Ford',
  BMW: 'BMW',
  MERCEDES: 'Mercedes',
  AUDI: 'Audi',
};

// Car models
export const MOCK_CAR_MODELS = {
  CAMRY: 'Camry',
  CIVIC: 'Civic',
  FOCUS: 'Focus',
  X5: 'X5',
  C_CLASS: 'C-Class',
  A4: 'A4',
};

// Car colors
export const MOCK_CAR_COLORS = {
  WHITE: 'White',
  BLACK: 'Black',
  SILVER: 'Silver',
  RED: 'Red',
  BLUE: 'Blue',
  GRAY: 'Gray',
};

// Card types
export const MOCK_CARD_TYPES = {
  VISA: 'visa',
  MASTERCARD: 'mastercard',
  AMEX: 'amex',
};

// Card statuses
export const MOCK_CARD_STATUSES = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  BLOCKED: 'blocked',
};

// Debt types
export const MOCK_DEBT_TYPES = {
  RIDE: 'ride',
  SUBSCRIPTION: 'subscription',
  PENALTY: 'penalty',
};

// Debt statuses
export const MOCK_DEBT_STATUSES = {
  ACTIVE: 'active',
  PAID: 'paid',
  OVERDUE: 'overdue',
};

// Address types
export const MOCK_ADDRESS_TYPES = {
  HOME: 'home',
  WORK: 'work',
  OTHER: 'other',
};

// Address statuses
export const MOCK_ADDRESS_STATUSES = {
  DEFAULT: 'default',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};