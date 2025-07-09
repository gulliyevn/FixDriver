export const ENV = {
  // API Configuration
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.fixdrive.com',
  API_TIMEOUT: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '30000'),
  
  // Google Maps
  GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  
  // MapTiler
  MAPTILER_API_KEY: process.env.EXPO_PUBLIC_MAPTILER_API_KEY || '',
  
  // Stripe
  STRIPE_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  
  // Social Auth
  GOOGLE_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
  FACEBOOK_APP_ID: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || '',
  
  // App Configuration
  APP_NAME: 'FixDrive',
  APP_VERSION: '1.0.0',
  
  // Feature Flags
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_LOCATION_TRACKING: true,
  ENABLE_SOCIAL_AUTH: true,
  
  // Development
  IS_DEVELOPMENT: process.env.EXPO_PUBLIC_IS_DEVELOPMENT === 'true' || __DEV__,
  ENABLE_LOGGING: __DEV__,
  
  // Security
  JWT_SECRET: process.env.EXPO_PUBLIC_JWT_SECRET || 'dev-jwt-secret-change-in-production',
  
  // Support
  SUPPORT_EMAIL: 'support@fixdrive.com',
  SUPPORT_PHONE: '+7 (999) 123-45-67',
  
  // Business Logic
  MAX_BOOKING_DAYS_AHEAD: 30,
  MIN_BOOKING_TIME_AHEAD: 30, // minutes
  CANCELLATION_FEE_PERCENT: 10,
  DRIVER_COMMISSION_PERCENT: 20,
};

export const getApiUrl = (endpoint: string) => `${ENV.API_BASE_URL}${endpoint}`;

// Проверка обязательных переменных окружения
export const validateEnvironment = () => {
  const requiredVars = [
    'EXPO_PUBLIC_API_BASE_URL',
    'EXPO_PUBLIC_JWT_SECRET',
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0 && !__DEV__) {
    console.warn('⚠️ Missing required environment variables:', missingVars);
  }
  
  return missingVars.length === 0;
};

export const isProduction = () => !ENV.IS_DEVELOPMENT;

export const logError = (error: unknown, context?: string) => {
  if (ENV.ENABLE_LOGGING) {
    console.error(`[${context || 'APP'}] Error:`, error);
  }
  // TODO: Add error reporting service (Sentry, etc.)
};

export const logInfo = (message: string, data?: unknown) => {
  if (ENV.ENABLE_LOGGING) {
    console.log(`[APP] ${message}`, data || '');
  }
}; 