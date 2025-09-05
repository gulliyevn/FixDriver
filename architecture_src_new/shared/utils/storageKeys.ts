/**
 * 💾 STORAGE KEYS UTILITY
 * Clean, compact AsyncStorage management - gRPC ready!
 */

import { useAuth } from '../../core/context/AuthContext';

/**
 * 🔑 Generates user-isolated AsyncStorage key
 */
export const getUserStorageKey = (baseKey: string, userId?: string): string => {
  return userId ? `${baseKey}_${userId}` : baseKey;
};

/**
 * 🪝 Hook for user-isolated storage keys
 */
export const useUserStorageKey = (baseKey: string): string => {
  const { user } = useAuth();
  return getUserStorageKey(baseKey, user?.id);
};

/**
 * 📦 Base storage keys for different data types
 */
export const STORAGE_KEYS = {
  // 🔐 Authentication
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  CURRENT_USER: 'current_user',
  
  // 👤 Profile
  USER_PROFILE: 'user_profile',
  
  // 💰 Balance & Transactions
  CLIENT_BALANCE: 'client_balance',
  CLIENT_TRANSACTIONS: 'client_transactions', 
  CLIENT_CASHBACK: 'client_cashback',
  DRIVER_BALANCE: 'driver_balance',
  DRIVER_TRANSACTIONS: 'driver_transactions',
  DRIVER_EARNINGS: 'driver_earnings',
  USER_BALANCE: 'user_balance',
  
  // 📦 Subscriptions & Packages
  USER_SUBSCRIPTION: 'user_subscription',
  USER_PACKAGE: 'user_package',
  
  // 💳 Cards
  USER_CARDS: 'cards',
  
  // 📋 Orders
  ORDERS_CACHE: 'orders_cache',
  USER_ORDERS: 'user_orders',
  OFFLINE_ORDERS: 'offline_orders',
  
  // 💳 Payments
  PAYMENTS_CACHE: 'payments_cache',
  
  // ⚙️ Settings
  NOTIFICATION_SETTINGS: 'notification_settings',
  THEME: 'theme',
  LANGUAGE: 'language',
  APP_SETTINGS: 'app_settings',
  
  // 🖼️ Avatars
  USER_AVATAR: 'user_avatar',
  DRIVER_AVATAR: 'driver_avatar',
  
  // 📍 Addresses
  USER_ADDRESSES: 'user_addresses',
  
  // ✅ Verification
  VERIFICATION_EMAIL: 'verification_email',
  VERIFICATION_PHONE: 'verification_phone',
  
  // 🔐 OTP
  OTP_PREFIX: 'otp_',
  
  // 🗺️ Cache
  LOCATION_CACHE: 'location_cache',
  USERS_CACHE: 'users_cache',
  
  // 🚗 Driver specific
  DRIVER_LICENSE: 'driver_license',
  DRIVER_VEHICLE: 'driver_vehicle',
  DRIVER_DOCUMENTS: 'driver_documents',
  
  // 📱 App state
  APP_STATE: 'app_state',
  LAST_SESSION: 'last_session',
  PREFERENCES: 'preferences',
  
  // 🔄 Sync
  PENDING_SYNC: 'pending_sync'
} as const;

/**
 * 🔐 Gets user-specific key for storage
 */
export const getUserKey = (key: keyof typeof STORAGE_KEYS, userId?: string): string => {
  return getUserStorageKey(STORAGE_KEYS[key], userId);
};

/**
 * 🧹 Cleans up user-specific storage
 */
export const clearUserStorage = async (userId: string): Promise<void> => {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    
    // Get all keys
    const keys = await AsyncStorage.getAllKeys();
    
    // Filter user-specific keys
    const userKeys = keys.filter(key => key.includes(`_${userId}`));
    
    // Remove user data
    if (userKeys.length > 0) {
      await AsyncStorage.multiRemove(userKeys);
      console.log(`🧹 Cleared ${userKeys.length} storage keys for user ${userId}`);
    }
  } catch (error) {
    console.error('Error clearing user storage:', error);
  }
};

/**
 * 📊 Gets storage usage statistics
 */
export const getStorageStats = async (): Promise<{ totalKeys: number; userKeys: number }> => {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    const keys = await AsyncStorage.getAllKeys();
    
    const userKeys = keys.filter(key => key.includes('_'));
    
    return {
      totalKeys: keys.length,
      userKeys: userKeys.length
    };
  } catch (error) {
    console.error('Error getting storage stats:', error);
    return { totalKeys: 0, userKeys: 0 };
  }
};

/**
 * 🔄 Migrates storage keys (for app updates)
 */
export const migrateStorageKeys = async (oldPrefix: string, newPrefix: string): Promise<void> => {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    const keys = await AsyncStorage.getAllKeys();
    
    const oldKeys = keys.filter(key => key.startsWith(oldPrefix));
    
    for (const oldKey of oldKeys) {
      const newKey = oldKey.replace(oldPrefix, newPrefix);
      const value = await AsyncStorage.getItem(oldKey);
      
      if (value) {
        await AsyncStorage.setItem(newKey, value);
        await AsyncStorage.removeItem(oldKey);
        console.log(`🔄 Migrated: ${oldKey} → ${newKey}`);
      }
    }
  } catch (error) {
    console.error('Error migrating storage keys:', error);
  }
};
