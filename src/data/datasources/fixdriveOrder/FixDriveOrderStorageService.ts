import AsyncStorage from '@react-native-async-storage/async-storage';
import { OrderData, SessionData, ContainerData } from './FixDriveOrderTypes';
import { FIXDRIVE_ORDER_CONSTANTS } from '../../../shared/constants/adaptiveConstants';

export class FixDriveOrderStorageService {
  // Save order data
  async saveOrderData(orderData: Omit<OrderData, 'id' | 'createdAt' | 'status'>): Promise<OrderData> {
    try {
      const order: OrderData = {
        ...orderData,
        id: `order_${Date.now()}`,
        createdAt: Date.now(),
        status: 'draft',
      };

      await AsyncStorage.setItem(FIXDRIVE_ORDER_CONSTANTS.STORAGE_KEYS.ORDER_DATA, JSON.stringify(order));
      return order;
    } catch (error) {
      console.error('Error saving order data:', error);
      throw new Error('Failed to save order data');
    }
  }

  // Load order data
  async loadOrderData(): Promise<OrderData | null> {
    try {
      const data = await AsyncStorage.getItem(FIXDRIVE_ORDER_CONSTANTS.STORAGE_KEYS.ORDER_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading order data:', error);
      return null;
    }
  }

  // Update order data
  async updateOrderData(updates: Partial<OrderData>): Promise<OrderData | null> {
    try {
      const currentData = await this.loadOrderData();
      if (!currentData) {
        throw new Error('No saved order data');
      }

      const updatedData: OrderData = {
        ...currentData,
        ...updates,
      };

      await AsyncStorage.setItem(FIXDRIVE_ORDER_CONSTANTS.STORAGE_KEYS.ORDER_DATA, JSON.stringify(updatedData));
      return updatedData;
    } catch (error) {
      console.error('Error updating order data:', error);
      throw new Error('Failed to update order data');
    }
  }

  // Save session data (for navigation between pages)
  async saveSessionData(sessionData: SessionData): Promise<void> {
    try {
      const sessionDataWithTimestamp = {
        ...sessionData,
        lastUpdate: Date.now(),
      };
      await AsyncStorage.setItem(FIXDRIVE_ORDER_CONSTANTS.STORAGE_KEYS.SESSION_DATA, JSON.stringify(sessionDataWithTimestamp));
    } catch (error) {
      console.error('Error saving session data:', error);
      throw new Error('Failed to save session data');
    }
  }

  // Save container times data separately
  async saveContainerTimes(containerData: ContainerData[]): Promise<void> {
    try {
      const containerTimesWithTimestamp = {
        containers: containerData,
        lastUpdate: Date.now(),
      };
      await AsyncStorage.setItem(FIXDRIVE_ORDER_CONSTANTS.STORAGE_KEYS.CONTAINER_TIMES, JSON.stringify(containerTimesWithTimestamp));
      console.log('Container times saved:', containerData);
    } catch (error) {
      console.error('Error saving container times:', error);
      throw new Error('Failed to save container data');
    }
  }

  // Load session data
  async loadSessionData(): Promise<SessionData | null> {
    try {
      const data = await AsyncStorage.getItem(FIXDRIVE_ORDER_CONSTANTS.STORAGE_KEYS.SESSION_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading session data:', error);
      return null;
    }
  }

  // Clear order data
  async clearOrderData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(FIXDRIVE_ORDER_CONSTANTS.STORAGE_KEYS.ORDER_DATA);
    } catch (error) {
      console.error('Error clearing order data:', error);
      throw new Error('Failed to clear order data');
    }
  }

  // Clear session data
  async clearSessionData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(FIXDRIVE_ORDER_CONSTANTS.STORAGE_KEYS.SESSION_DATA);
    } catch (error) {
      console.error('Error clearing session data:', error);
      throw new Error('Failed to clear session data');
    }
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        FIXDRIVE_ORDER_CONSTANTS.STORAGE_KEYS.ORDER_DATA,
        FIXDRIVE_ORDER_CONSTANTS.STORAGE_KEYS.SESSION_DATA,
        FIXDRIVE_ORDER_CONSTANTS.STORAGE_KEYS.CONTAINER_TIMES
      ]);
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw new Error('Failed to clear all data');
    }
  }

  // Get session last update time
  async getSessionLastUpdate(): Promise<number | null> {
    try {
      const sessionData = await this.loadSessionData();
      return sessionData?.lastUpdate || null;
    } catch (error) {
      console.error('Error getting session last update:', error);
      return null;
    }
  }

  // Check and clear expired session
  async checkAndClearExpiredSession(): Promise<void> {
    try {
      const lastUpdate = await this.getSessionLastUpdate();
      if (lastUpdate) {
        const now = Date.now();
        const sessionTimeout = FIXDRIVE_ORDER_CONSTANTS.SESSION_TIMEOUT;
        
        if (now - lastUpdate > sessionTimeout) {
          console.log('Session expired, clearing...');
          await this.clearSessionData();
        }
      }
    } catch (error) {
      console.error('Error checking expired session:', error);
    }
  }
}
