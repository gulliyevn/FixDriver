/**
 * 📦 SERVICE CONSTANTS
 * 
 * Service-specific constants (moved from adaptive constants)
 * Core adaptive constants are now in ./adaptiveConstants/ folder
 */

// Avatar constants
export const AVATAR_CONSTANTS = {
  // Storage keys
  STORAGE_KEYS: {
    AVATAR: 'driver_avatar',
    MOCK_DATA: 'avatar_mock_data',
  },
  
  // Image picker settings
  IMAGE_PICKER: {
    ASPECT_RATIO: [1, 1] as [number, number],
    QUALITY: 0.8,
    DEFAULT_TYPE: 'image/jpeg',
  },
  
  // Default values
  DEFAULTS: {
    SIZE: 0, // Will be filled during upload
  },
  
  // Error messages
  ERRORS: {
    CAMERA_PERMISSION_DENIED: 'Camera permission denied',
    GALLERY_PERMISSION_DENIED: 'Gallery permission denied',
  }
} as const;

// Profile constants
export const PROFILE_CONSTANTS = {
  // Mock settings
  MOCK: {
    DELAY: 1000,
    CURRENT_PASSWORD: 'current123',
    MIN_PASSWORD_LENGTH: 8,
  },
  
  // Error messages
  ERRORS: {
    CURRENT_PASSWORD_INCORRECT: 'Current password is incorrect',
    NEW_PASSWORD_SAME: 'New password must be different from current password',
    PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long',
    NO_AUTH_TOKEN: 'No authentication token',
    CHANGE_PASSWORD_FAILED: 'Failed to change password',
    DELETE_ACCOUNT_FAILED: 'Failed to delete account',
    UNKNOWN_ERROR: 'Unknown error',
  },
  
  // Success messages
  SUCCESS: {
    PASSWORD_CHANGED: 'Password changed successfully',
    ACCOUNT_DELETED: 'Account deleted successfully',
  },
} as const;

// Vehicle constants
export const VEHICLE_CONSTANTS = {
  // Error messages
  ERRORS: {
    LOAD_VEHICLES_FAILED: 'Failed to load vehicles',
    LOAD_VEHICLE_FAILED: 'Failed to load vehicle',
    CREATE_VEHICLE_FAILED: 'Failed to create vehicle',
    UPDATE_VEHICLE_FAILED: 'Failed to update vehicle',
    DELETE_VEHICLE_FAILED: 'Failed to delete vehicle',
    CHANGE_STATUS_FAILED: 'Failed to change vehicle status',
    UPLOAD_PHOTO_FAILED: 'Failed to upload passport photo',
  },
  
  // API endpoints
  ENDPOINTS: {
    VEHICLES: '/driver/vehicles',
    VEHICLE_BY_ID: (id: string) => `/driver/vehicles/${id}`,
    TOGGLE_STATUS: (id: string) => `/driver/vehicles/${id}/toggle`,
    PASSPORT_PHOTO: (id: string) => `/driver/vehicles/${id}/passport-photo`,
  },
  
  // Form data keys
  FORM_DATA: {
    PASSPORT_PHOTO: 'passportPhoto',
  },
  
  // Headers
  HEADERS: {
    MULTIPART_FORM_DATA: 'multipart/form-data',
  },
} as const;

// Address constants
export const ADDRESS_CONSTANTS = {
  // API endpoints
  ENDPOINTS: {
    ADDRESSES: '/addresses',
    ADDRESS_BY_ID: (id: string) => `/addresses/${id}`,
    DEFAULT_ADDRESS: '/addresses/default',
    SEARCH_ADDRESSES: (query: string) => `/addresses/search?q=${encodeURIComponent(query)}`,
    GEOCODE: (address: string) => `/geocode?address=${encodeURIComponent(address)}`,
    SET_DEFAULT: (id: string) => `/addresses/${id}/default`,
  },
  
  // API base URL
  API_BASE_URL: 'https://api.fixdrive.com/v1',
  
  // Auth token placeholder
  AUTH_TOKEN_PLACEHOLDER: 'your-auth-token-here',
  
  // Address validation
  VALIDATION: {
    MIN_LENGTH: 8,
    REQUIRED_KEYWORDS: [
      'улица', 'ул', 'проспект', 'пр', 'переулок', 'пер', 'шоссе', 'ш', 'набережная', 'наб',
      'street', 'st', 'avenue', 'ave', 'road', 'rd', 'boulevard', 'blvd', 'lane', 'ln',
      'straße', 'str', 'allee', 'weg', 'platz', 'platz',
      'calle', 'avenida', 'carrera', 'carr',
      'rue', 'avenue', 'boulevard', 'place',
      'via', 'corso', 'piazza', 'viale',
      'sokak', 'cadde', 'mahalle', 'bulvar'
    ],
    ADDRESS_KEYWORDS: [
      'улица', 'ул', 'проспект', 'пр', 'переулок', 'пер', 'шоссе', 'ш', 'набережная', 'наб',
      'street', 'st', 'avenue', 'ave', 'road', 'rd', 'boulevard', 'blvd', 'lane', 'ln',
      'straße', 'str', 'allee', 'weg', 'platz', 'platz',
      'calle', 'avenida', 'carrera', 'carr',
      'rue', 'avenue', 'boulevard', 'place',
      'via', 'corso', 'piazza', 'viale',
      'sokak', 'cadde', 'mahalle', 'bulvar'
    ],
    SIMILARITY_THRESHOLD: 0.4,
  },
  
  // External API keys placeholders
  EXTERNAL_APIS: {
    GOOGLE_API_KEY: 'YOUR_GOOGLE_API_KEY',
    YANDEX_API_KEY: 'YOUR_YANDEX_API_KEY',
    NOMINATIM_BASE_URL: 'https://nominatim.openstreetmap.org',
    GOOGLE_BASE_URL: 'https://maps.googleapis.com/maps/api/geocode/json',
    YANDEX_BASE_URL: 'https://geocode-maps.yandex.ru/1.x',
  },
} as const;

// API Client constants
export const API_CLIENT_CONSTANTS = {
  // Retry settings
  RETRY_ATTEMPTS: 3,
  
  // Request timeout
  REQUEST_TIMEOUT: 30000,
  
  // Headers
  HEADERS: {
    CONTENT_TYPE_JSON: 'application/json',
    AUTHORIZATION: 'Authorization',
    BEARER_PREFIX: 'Bearer ',
  },
  
  // HTTP methods
  METHODS: {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH',
  },
} as const;

// Auth constants
export const AUTH_CONSTANTS = {
  // Mock settings
  MOCK: {
    DELAY: 1000,
    DEFAULT_ROLE: 'CLIENT',
    DRIVER_EMAIL_PATTERN: 'driver',
  },
  
  // Error messages
  ERRORS: {
    LOGIN_FAILED: 'Login failed',
    REGISTRATION_FAILED: 'Registration failed',
    LOGOUT_FAILED: 'Logout failed',
    TOKEN_REFRESH_FAILED: 'Token refresh failed',
    INVALID_CREDENTIALS: 'Invalid credentials',
    USER_NOT_FOUND: 'User not found',
  },
  
  // Success messages
  SUCCESS: {
    LOGGED_OUT: 'Logged out successfully',
    LOGIN_SUCCESS: 'Login successful',
    REGISTRATION_SUCCESS: 'Registration successful',
  },
} as const;

// Billing constants
export const BILLING_CONSTANTS = {
  // Pricing constants (AFc)
  PRICE_PER_SECOND_AFC: 0.01, // 0.01 AFc per second
  WAITING_FREE_SECONDS: 5 * 60, // first 5 minutes are free in waiting
  
  // Storage keys
  STORAGE_KEYS: {
    LIVE: '@billing_live_state',
    RECORDS: '@billing_records',
  },
} as const;

// JWT constants
export const JWT_CONSTANTS = {
  // Storage keys
  STORAGE_KEYS: {
    TOKENS: '@jwt_tokens',
  },
  
  // Token types
  TOKEN_TYPES: {
    ACCESS: 'access',
    REFRESH: 'refresh',
  },
  
  // JWT configuration
  JWT: {
    SECRET: 'your-jwt-secret-key-here',
    EXPIRES_IN: 3600, // 1 hour
    REFRESH_EXPIRES_IN: 7 * 24 * 3600, // 7 days
  },
  
  // Error messages
  ERRORS: {
    TOKEN_GENERATION_FAILED: 'Token generation failed',
    TOKEN_VERIFICATION_FAILED: 'Token verification failed',
    TOKEN_REFRESH_FAILED: 'Token refresh failed',
    TOKEN_STORAGE_FAILED: 'Token storage failed',
    TOKEN_CLEAR_FAILED: 'Token clear failed',
  },
} as const;

// Card constants
export const CARD_CONSTANTS = {
  // Storage keys
  STORAGE_KEYS: {
    USER_CARDS: '@user_cards',
  },
  
  // Error messages
  ERRORS: {
    GET_CARDS_FAILED: 'Failed to get cards',
    SAVE_CARDS_FAILED: 'Failed to save cards',
    ADD_CARD_FAILED: 'Failed to add card',
    DELETE_CARD_FAILED: 'Failed to delete card',
    SET_DEFAULT_FAILED: 'Failed to set default card',
    SYNC_FAILED: 'Failed to sync cards',
  },
} as const;

// Chat constants
export const CHAT_CONSTANTS = {
  // Message types
  MESSAGE_TYPES: {
    TEXT: 'text',
    IMAGE: 'image',
    FILE: 'file',
    LOCATION: 'location',
  },
  
  // Error messages
  ERRORS: {
    GET_CHATS_FAILED: 'Failed to get chats',
    GET_MESSAGES_FAILED: 'Failed to get messages',
    SEND_MESSAGE_FAILED: 'Failed to send message',
    DELETE_CHAT_FAILED: 'Failed to delete chat',
    CLEAR_CHAT_FAILED: 'Failed to clear chat',
    SYNC_FAILED: 'Failed to sync chat data',
  },
} as const;

// Share constants
export const SHARE_CONSTANTS = {
  // Domains
  DOMAINS: {
    FIXDRIVE: 'https://fixdrive.app',
    GOOGLE_MAPS: 'https://www.google.com/maps',
  },
  
  // Messages
  MESSAGES: {
    ROUTE: 'Route',
    SHARE_ROUTE: 'Share route',
  },
  
  // Error messages
  ERRORS: {
    SHARE_FAILED: 'Failed to share route',
    SYNC_FAILED: 'Failed to sync share data',
  },
} as const;

// Distance calculation constants
export const DISTANCE_CONSTANTS = {
  // APIs
  APIS: {
    OSRM: 'https://router.project-osrm.org/route/v1/driving',
  },
  
  // Calculation parameters
  CALCULATION: {
    EARTH_RADIUS_METERS: 6371000,
    ROAD_DISTANCE_MULTIPLIER: 1.3,
    AVERAGE_SPEED_KMH: 25,
    TRAFFIC_VARIATION_MIN: 0.9,
    TRAFFIC_VARIATION_MAX: 1.3,
  },
  
  // Error messages
  ERRORS: {
    CALCULATION_FAILED: 'Failed to calculate distance',
    SYNC_FAILED: 'Failed to sync distance data',
  },
} as const;

// Driver constants
export const DRIVER_CONSTANTS = {
  // Validation
  VALIDATION: {
    REQUIRED_FIELDS: ['email', 'password', 'license_number', 'license_expiry_date', 'vehicle_number'],
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MIN_VEHICLE_YEAR: 1900,
    MAX_VEHICLE_YEAR_OFFSET: 1,
  },
  
  // Mock delay
  MOCK_DELAY: 1500,
  
  // Error messages
  ERRORS: {
    REGISTRATION_FAILED: 'Registration error',
    PROFILE_GET_FAILED: 'Error getting profile',
    PROFILE_UPDATE_FAILED: 'Error updating profile',
    DOCUMENTS_UPDATE_FAILED: 'Error updating documents',
    STATS_GET_FAILED: 'Error getting statistics',
    LOCATION_UPDATE_FAILED: 'Error updating location',
    DRIVERS_GET_FAILED: 'Error getting drivers list',
    STATUS_CHANGE_FAILED: 'Error changing status',
    SYNC_FAILED: 'Failed to sync driver data',
  },
} as const;

// Driver statistics constants
export const DRIVER_STATS_CONSTANTS = {
  // API configuration
  API: {
    BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.fixdrive.com',
    TIMEOUT: 10000,
  },
  
  // Endpoints
  ENDPOINTS: {
    EARNINGS_CHART: '/api/driver/earnings/chart',
    SAVE_DAY_STATS: '/api/driver/stats/day',
    GET_DAY_STATS: '/api/driver/stats/day',
    GET_PERIOD_STATS: '/api/driver/stats/period',
    GET_LAST_N_DAYS: '/api/driver/stats/last-n-days',
  },
  
  // Error messages
  ERRORS: {
    CHART_DATA_FAILED: 'Failed to get chart data',
    SAVE_STATS_FAILED: 'Failed to save statistics',
    GET_DAY_STATS_FAILED: 'Failed to get day statistics',
    GET_PERIOD_STATS_FAILED: 'Failed to get period statistics',
    GET_LAST_DAYS_FAILED: 'Failed to get last days statistics',
    SYNC_FAILED: 'Failed to sync statistics',
  },
} as const;

// FixDrive order constants
export const FIXDRIVE_ORDER_CONSTANTS = {
  STORAGE_KEYS: {
    ORDER_DATA: 'fixdrive_order_data',
    SESSION_DATA: 'fixdrive_session_data',
    CONTAINER_TIMES: 'fixdrive_container_times'
  },
  SESSION_TIMEOUT: 5 * 60 * 1000, // 5 minutes in milliseconds
  VALIDATION: {
    REQUIRED_FIELDS: ['familyMemberId', 'packageType', 'addresses'],
    ADDRESS_TYPES: ['from', 'to', 'stop'],
    ORDER_STATUSES: ['draft', 'confirmed', 'completed', 'cancelled']
  }
} as const;

// Map service constants
export const MAP_CONSTANTS = {
  STORAGE_KEYS: {
    LOCATION_CACHE: 'cached_location'
  },
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  DEFAULT_REGIONS: {
    'AZ': { lat: 40.3777, lng: 49.8920, name: 'Baku, Azerbaijan' },
    'RU': { lat: 55.7558, lng: 37.6176, name: 'Moscow, Russia' },
    'TR': { lat: 39.9334, lng: 32.8597, name: 'Ankara, Turkey' },
    'US': { lat: 40.7128, lng: -74.0060, name: 'New York, USA' },
    'DE': { lat: 52.5200, lng: 13.4050, name: 'Berlin, Germany' },
    'FR': { lat: 48.8566, lng: 2.3522, name: 'Paris, France' },
    'ES': { lat: 40.4168, lng: -3.7038, name: 'Madrid, Spain' },
    'AR': { lat: 36.7525, lng: 3.0420, name: 'Algiers, Algeria' },
  },
  LOCATION_INTERVALS: {
    TIME: 10000, // 10 seconds
    DISTANCE: 50, // 50 meters
  },
  WATCH_INTERVALS: {
    TIME: 15000, // 15 seconds
    DISTANCE: 100, // 100 meters
  },
  RETRY: {
    MAX_RETRIES: 3,
    DELAY: 1000, // 1 second
  },
  MOCK: {
    DELAY: 1000,
    ROUTE_DELAY: 500,
    DRIVER_COUNT: 3,
  }
} as const;

// Notification service constants
export const NOTIFICATION_CONSTANTS = {
  VALID_TYPES: ['trip', 'payment', 'driver', 'system', 'order'],
  DEFAULT_LOCALE: 'en-US',
  LOCALE_MAP: {
    'ru': 'ru-RU',
    'en': 'en-US',
    'az': 'az-AZ',
    'de': 'de-DE',
    'es': 'es-ES',
    'fr': 'fr-FR',
    'tr': 'tr-TR',
    'ar': 'ar-SA'
  },
  TIME_FORMATS: {
    JUST_NOW: 'Just now',
    MINUTES_AGO: 'min ago',
    HOURS_AGO: 'h ago',
    YESTERDAY: 'Yesterday'
  },
  PRIORITY_MAP: {
    'system': 1,
    'payment': 2,
    'trip': 3,
    'driver': 4,
    'order': 5
  },
  DEFAULT_PRIORITY: 5,
  MOCK: {
    INTERVAL: 30000, // 30 seconds
    PROBABILITY_THRESHOLD: 0.7 // 30% chance
  }
} as const;

// Order service constants
export const ORDER_CONSTANTS = {
  STORAGE_KEYS: {
    ORDER_DATA: 'fixwave_order_data'
  },
  TRACKING: {
    START_POSITION: {
      latitude: 40.414300000000004,
      longitude: 49.8721,
    },
    TOTAL_STEPS: 12,
    INTERVAL: 2000, // 2 seconds
  },
  MOCK: {
    DELAY: 500,
    STATUS_UPDATE_DELAY: 1000,
  },
  VALIDATION: {
    REQUIRED_FIELDS: ['familyMemberId', 'packageType', 'addresses'],
    ADDRESS_TYPES: ['from', 'to', 'stop'],
    ORDER_STATUSES: ['draft', 'confirmed', 'completed', 'cancelled']
  }
} as const;
