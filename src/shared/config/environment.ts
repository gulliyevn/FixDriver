// Environment configuration for FixDrive

// Configuration constants
const CONFIG_CONSTANTS = {
  API: {
    DEV_BASE_URL: 'http://31.97.76.106:8080',
    PROD_BASE_URL: 'https://api.fixdrive.com',
    TIMEOUT: 30000,
  },
  JWT: {
    DEFAULT_SECRET: 'default-secret-change-me',
    ACCESS_TOKEN_EXPIRY_MINUTES: 30,
    REFRESH_TOKEN_EXPIRY_DAYS: 30,
  },
  REDIS: {
    DEFAULT_HOST: '31.97.76.106',
    DEFAULT_PORT: '6379',
  },
  SUPPORT: {
    DEFAULT_EMAIL: 'support@fixdrive.com',
    DEFAULT_PHONE: '+994501234567',
  },
  MAP: {
    DEFAULT_LATITUDE: 40.3777,
    DEFAULT_LONGITUDE: 49.8920,
    DEFAULT_LATITUDE_DELTA: 0.0922,
    DEFAULT_LONGITUDE_DELTA: 0.0421,
  },
  DEV: {
    MOCK_DELAY: 1000,
    HEALTH_CHECK_TIMEOUT: 5000,
  },
} as const;

export const ENV_CONFIG = {
  // API configuration
  API: {
    // Base URL for API
    BASE_URL: __DEV__ 
      ? CONFIG_CONSTANTS.API.DEV_BASE_URL  // Development server
      : CONFIG_CONSTANTS.API.PROD_BASE_URL, // Production URL
    
    // Request timeout (30 seconds)
    TIMEOUT: CONFIG_CONSTANTS.API.TIMEOUT,
    
    // Default headers
    DEFAULT_HEADERS: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  },

  // JWT configuration
  JWT: {
    // Secret key (should match backend)
    SECRET: CONFIG_CONSTANTS.JWT.DEFAULT_SECRET,
    
    // Token lifetime (should match backend)
    ACCESS_TOKEN_EXPIRY: CONFIG_CONSTANTS.JWT.ACCESS_TOKEN_EXPIRY_MINUTES * 60, // 30 minutes
    REFRESH_TOKEN_EXPIRY: CONFIG_CONSTANTS.JWT.REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60, // 30 days
  },

  // Twilio configuration for OTP
  TWILIO: {
    ACCOUNT_SID: process.env.EXPO_PUBLIC_TWILIO_ACCOUNT_SID || '',
    AUTH_TOKEN: process.env.EXPO_PUBLIC_TWILIO_AUTH_TOKEN || '',
    FROM_PHONE: process.env.EXPO_PUBLIC_TWILIO_FROM_PHONE || '',
  },

  // Redis configuration
  REDIS: {
    HOST: process.env.EXPO_PUBLIC_REDIS_HOST || CONFIG_CONSTANTS.REDIS.DEFAULT_HOST,
    PORT: process.env.EXPO_PUBLIC_REDIS_PORT || CONFIG_CONSTANTS.REDIS.DEFAULT_PORT,
    PASSWORD: process.env.EXPO_PUBLIC_REDIS_PASSWORD || '',
    DB: 0,
  },

  // Stripe configuration
  STRIPE: {
    PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_...',
    SECRET_KEY: process.env.EXPO_PUBLIC_STRIPE_SECRET_KEY || 'sk_test_...',
  },

  // Support
  SUPPORT: {
    EMAIL: process.env.EXPO_PUBLIC_SUPPORT_EMAIL || CONFIG_CONSTANTS.SUPPORT.DEFAULT_EMAIL,
    PHONE: process.env.EXPO_PUBLIC_SUPPORT_PHONE || CONFIG_CONSTANTS.SUPPORT.DEFAULT_PHONE,
  },

  // Maps
  MAP: {
    MAPTILER_API_KEY: process.env.EXPO_PUBLIC_MAPTILER_API_KEY || 'your-maptiler-key',
    GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || 'your-google-maps-key',
    DEFAULT_REGION: {
      latitude: CONFIG_CONSTANTS.MAP.DEFAULT_LATITUDE,
      longitude: CONFIG_CONSTANTS.MAP.DEFAULT_LONGITUDE,
      latitudeDelta: CONFIG_CONSTANTS.MAP.DEFAULT_LATITUDE_DELTA,
      longitudeDelta: CONFIG_CONSTANTS.MAP.DEFAULT_LONGITUDE_DELTA,
    },
  },

  // gRPC configuration
  GRPC: {
    // TODO: Add real gRPC endpoints
    MAP_SERVICE_URL: process.env.EXPO_PUBLIC_GRPC_MAP_SERVICE_URL || 'localhost:50051',
    DRIVER_SERVICE_URL: process.env.EXPO_PUBLIC_GRPC_DRIVER_SERVICE_URL || 'localhost:50052',
    USER_SERVICE_URL: process.env.EXPO_PUBLIC_GRPC_USER_SERVICE_URL || 'localhost:50053',
    TRIP_SERVICE_URL: process.env.EXPO_PUBLIC_GRPC_TRIP_SERVICE_URL || 'localhost:50054',
    PAYMENT_SERVICE_URL: process.env.EXPO_PUBLIC_GRPC_PAYMENT_SERVICE_URL || 'localhost:50055',
  },

  // Feature flags
  FEATURES: {
    ENABLE_GRPC: __DEV__ ? false : true, // Enable gRPC in production
    ENABLE_MOCK_DATA: __DEV__ ? true : false, // Enable mock data in development
    ENABLE_ANALYTICS: __DEV__ ? false : true, // Enable analytics in production
    ENABLE_CRASH_REPORTING: __DEV__ ? false : true, // Enable crash reporting in production
  },

  // Development settings
  DEV: {
    ENABLE_LOGGING: __DEV__,
    ENABLE_DEBUG_MENU: __DEV__,
    MOCK_DELAY: CONFIG_CONSTANTS.DEV.MOCK_DELAY, // Delay for mock API calls
  },
};

// Error logging utility
export const logError = (error: Error, context?: string) => {
  if (ENV_CONFIG.DEV.ENABLE_LOGGING) {
    console.error(`[${context || 'Error'}]:`, error.message);
    if (error.stack) {
      console.error(error.stack);
    }
  }
};

// Configuration utilities
export const ConfigUtils = {
  /**
   * Get full URL for API endpoint
   */
  getApiUrl(endpoint: string): string {
    return `${ENV_CONFIG.API.BASE_URL}${endpoint}`;
  },

  /**
   * Get headers for authenticated requests
   */
  async getAuthHeaders(): Promise<Record<string, string>> {
    // TODO: Get auth token from context
    return {
      ...ENV_CONFIG.API.DEFAULT_HEADERS,
    };
  },

  /**
   * Check if server is available
   */
  async checkServerHealth(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CONFIG_CONSTANTS.DEV.HEALTH_CHECK_TIMEOUT);
      
      const response = await fetch(this.getApiUrl('/health'), {
        method: 'GET',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.error('Server health check failed:', error);
      return false;
    }
  },

  /**
   * Get gRPC service URL
   */
  getGrpcUrl(service: keyof typeof ENV_CONFIG.GRPC): string {
    return ENV_CONFIG.GRPC[service];
  },

  /**
   * Check if feature is enabled
   */
  isFeatureEnabled(feature: keyof typeof ENV_CONFIG.FEATURES): boolean {
    return ENV_CONFIG.FEATURES[feature];
  },
};

// Export environment for easy access
export const environment = ENV_CONFIG;