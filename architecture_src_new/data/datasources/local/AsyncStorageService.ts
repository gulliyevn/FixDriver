import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const STORAGE_KEYS = {
  // Authentication
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  CURRENT_USER: 'current_user',
  
  // User data
  USERS_CACHE: 'users_cache',
  USER_PROFILE: 'user_profile',
  
  // Orders
  ORDERS_CACHE: 'orders_cache',
  USER_ORDERS: 'user_orders',
  
  // Payments
  PAYMENTS_CACHE: 'payments_cache',
  USER_BALANCE: 'user_balance',
  
  // Settings
  APP_SETTINGS: 'app_settings',
  LANGUAGE: 'language',
  THEME: 'theme',
  
  // Offline data
  OFFLINE_ORDERS: 'offline_orders',
  PENDING_SYNC: 'pending_sync',
} as const;

export interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface StorageService {
  // Basic operations
  setItem<T>(key: string, value: T): Promise<void>;
  getItem<T>(key: string): Promise<T | null>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
  
  // Cache operations
  setCacheItem<T>(key: string, data: T, ttl?: number): Promise<void>;
  getCacheItem<T>(key: string): Promise<T | null>;
  isCacheValid(key: string): Promise<boolean>;
  
  // Batch operations
  setMultiple(items: Record<string, any>): Promise<void>;
  getMultiple(keys: string[]): Promise<Record<string, any>>;
}

export class AsyncStorageService implements StorageService {
  private defaultTTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  // Basic operations
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      throw new Error(`Failed to set item ${key}`);
    }
  }

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      throw new Error(`Failed to remove item ${key}`);
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw new Error('Failed to clear storage');
    }
  }

  // Cache operations with TTL
  async setCacheItem<T>(key: string, data: T, ttl: number = this.defaultTTL): Promise<void> {
    try {
      const timestamp = Date.now();
      const expiresAt = timestamp + ttl;
      
      const cacheItem: CacheItem<T> = {
        data,
        timestamp,
        expiresAt,
      };
      
      await this.setItem(key, cacheItem);
    } catch (error) {
      console.error(`Error setting cache item ${key}:`, error);
      throw new Error(`Failed to set cache item ${key}`);
    }
  }

  async getCacheItem<T>(key: string): Promise<T | null> {
    try {
      const cacheItem = await this.getItem<CacheItem<T>>(key);
      
      if (!cacheItem) {
        return null;
      }
      
      // Check if cache is expired
      if (Date.now() > cacheItem.expiresAt) {
        await this.removeItem(key);
        return null;
      }
      
      return cacheItem.data;
    } catch (error) {
      console.error(`Error getting cache item ${key}:`, error);
      return null;
    }
  }

  async isCacheValid(key: string): Promise<boolean> {
    try {
      const cacheItem = await this.getItem<CacheItem<any>>(key);
      
      if (!cacheItem) {
        return false;
      }
      
      return Date.now() <= cacheItem.expiresAt;
    } catch (error) {
      return false;
    }
  }

  // Batch operations
  async setMultiple(items: Record<string, any>): Promise<void> {
    try {
      const promises = Object.entries(items).map(([key, value]) => 
        this.setItem(key, value)
      );
      await Promise.all(promises);
    } catch (error) {
      console.error('Error setting multiple items:', error);
      throw new Error('Failed to set multiple items');
    }
  }

  async getMultiple(keys: string[]): Promise<Record<string, any>> {
    try {
      const promises = keys.map(key => this.getItem(key));
      const values = await Promise.all(promises);
      
      const result: Record<string, any> = {};
      keys.forEach((key, index) => {
        result[key] = values[index];
      });
      
      return result;
    } catch (error) {
      console.error('Error getting multiple items:', error);
      throw new Error('Failed to get multiple items');
    }
  }

  // Utility methods
  async getStorageSize(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const data = await AsyncStorage.multiGet(keys);
      
      let totalSize = 0;
      data.forEach(([key, value]) => {
        totalSize += (key?.length || 0) + (value?.length || 0);
      });
      
      return totalSize;
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return 0;
    }
  }

  async cleanupExpiredCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.includes('_cache'));
      
      for (const key of cacheKeys) {
        const isValid = await this.isCacheValid(key);
        if (!isValid) {
          await this.removeItem(key);
        }
      }
    } catch (error) {
      console.error('Error cleaning up expired cache:', error);
    }
  }
}

// Singleton instance
export const storageService = new AsyncStorageService();
