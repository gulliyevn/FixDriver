/**
 * Generate namespaced AsyncStorage key per user (if provided)
 */
export const getUserStorageKey = (baseKey: string, userId?: string): string => {
  if (userId) {
    return `${baseKey}_${userId}`;
  }
  // Fallback to base key for non-authenticated contexts
  return baseKey;
};

/**
 * Base storage keys for different data domains
 */
export const STORAGE_KEYS = {
  // Profile
  USER_PROFILE: 'user_profile',
  
  // Balance
  CLIENT_BALANCE: 'client_balance',
  CLIENT_TRANSACTIONS: 'client_transactions', 
  CLIENT_CASHBACK: 'client_cashback',
  DRIVER_BALANCE: 'driver_balance',
  DRIVER_TRANSACTIONS: 'driver_transactions',
  DRIVER_EARNINGS: 'driver_earnings',
  
  // Packages and subscriptions
  USER_SUBSCRIPTION: 'user_subscription',
  USER_PACKAGE: 'user_package',
  
  // Cards
  USER_CARDS: 'cards',
  
  // Settings
  NOTIFICATION_SETTINGS: 'notification_settings',
  THEME: 'theme',
  LANGUAGE: 'language',
  
  // Avatars
  USER_AVATAR: 'user_avatar',
  DRIVER_AVATAR: 'driver_avatar',
  
  // Addresses
  USER_ADDRESSES: 'user_addresses',
  
  // Verification
  VERIFICATION_EMAIL: 'verification_email',
  VERIFICATION_PHONE: 'verification_phone',
  
  // OTP
  OTP_PREFIX: 'otp_',
  
  // Cache
  LOCATION_CACHE: 'location_cache',

  // Schedule
  SCHEDULE_FLEXIBLE: 'flexibleSchedule',
  SCHEDULE_CUSTOMIZED: 'customizedSchedule',
} as const;

/**
 * Resolve storage key for a given user (optional)
 */
export const getUserKey = (key: keyof typeof STORAGE_KEYS, userId?: string): string => {
  return getUserStorageKey(STORAGE_KEYS[key], userId);
};
