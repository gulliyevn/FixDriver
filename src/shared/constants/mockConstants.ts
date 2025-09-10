/**
 * Mock service constants
 * Centralized constants for mock services to make them easy to replace with real APIs
 */

// Mock authentication
export const MOCK_PASSWORD = 'password123';
export const MOCK_TOKEN_PREFIX = 'mock_token_';

// Mock delays (simulate network latency)
export const MOCK_DELAYS = {
  FAST: 100,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Mock error messages
export const MOCK_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_NOT_FOUND: 'User not found',
  NETWORK_ERROR: 'Network error',
  VALIDATION_ERROR: 'Validation error',
} as const;

// Mock success messages
export const MOCK_SUCCESS = {
  LOGIN: 'Login successful',
  REGISTER: 'Registration successful',
  LOGOUT: 'Logout successful',
} as const;

// Mock data prefixes
export const MOCK_PREFIXES = {
  USER: 'user_',
  ORDER: 'order_',
  DRIVER: 'driver_',
  VEHICLE: 'vehicle_',
} as const;
