// Environment configuration for FixDrive

export const ENV_CONFIG = {
  // API configuration
  API: {
    // Base URL for API
    BASE_URL: __DEV__ 
      ? 'http://31.97.76.106:8080'  // Development server
      : 'https://api.fixdrive.com', // Production URL
    
    // Request timeout (30 seconds)
    TIMEOUT: 30000,
    
    // Default headers
    DEFAULT_HEADERS: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  },

  // JWT configuration
  JWT: {
    // Secret key (should match backend)
    SECRET: 'default-secret-change-me',
    
    // Token lifetime (should match backend)
    ACCESS_TOKEN_EXPIRY: 30 * 60, // 30 minutes
    REFRESH_TOKEN_EXPIRY: 30 * 24 * 60 * 60, // 30 days
  },

  // Twilio configuration for OTP
  TWILIO: {
    ACCOUNT_SID: process.env.EXPO_PUBLIC_TWILIO_ACCOUNT_SID || '',
    AUTH_TOKEN: process.env.EXPO_PUBLIC_TWILIO_AUTH_TOKEN || '',
    FROM_PHONE: process.env.EXPO_PUBLIC_TWILIO_FROM_PHONE || '',
  },

  // Redis configuration
  REDIS: {
    HOST: process.env.EXPO_PUBLIC_REDIS_HOST || '31.97.76.106',
    PORT: process.env.EXPO_PUBLIC_REDIS_PORT || '6379',
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
    EMAIL: process.env.EXPO_PUBLIC_SUPPORT_EMAIL || 'support@fixdrive.com',
    PHONE: process.env.EXPO_PUBLIC_SUPPORT_PHONE || '+994501234567',
  },

  // Maps
  MAP: {
    MAPTILER_API_KEY: process.env.EXPO_PUBLIC_MAPTILER_API_KEY || 'your-maptiler-key',
    GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || 'your-google-maps-key',
    DEFAULT_REGION: {
      latitude: 40.3777,
      longitude: 49.8920,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
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
    MOCK_DELAY: 1000, // Delay for mock API calls
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
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
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