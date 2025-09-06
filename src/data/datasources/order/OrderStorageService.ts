import AsyncStorage from '@react-native-async-storage/async-storage';
import { OrderData } from './OrderTypes';
import { ORDER_CONSTANTS } from '../../../shared/constants/adaptiveConstants';

export class OrderStorageService {
  // Save order data
  async saveOrderData(orderData: Omit<OrderData, 'id' | 'createdAt'>): Promise<OrderData> {
    try {
      const order: OrderData = {
        ...orderData,
        id: `order_${Date.now()}`,
        createdAt: Date.now(),
      };

      await AsyncStorage.setItem(ORDER_CONSTANTS.STORAGE_KEYS.ORDER_DATA, JSON.stringify(order));
      return order;
    } catch (error) {
      console.error('Error saving order data:', error);
      throw new Error('Failed to save order data');
    }
  }

  // Load order data
  async loadOrderData(): Promise<OrderData | null> {
    try {
      const data = await AsyncStorage.getItem(ORDER_CONSTANTS.STORAGE_KEYS.ORDER_DATA);
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

      await AsyncStorage.setItem(ORDER_CONSTANTS.STORAGE_KEYS.ORDER_DATA, JSON.stringify(updatedData));
      return updatedData;
    } catch (error) {
      console.error('Error updating order data:', error);
      throw new Error('Failed to update order data');
    }
  }

  // Clear order data
  async clearOrderData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ORDER_CONSTANTS.STORAGE_KEYS.ORDER_DATA);
    } catch (error) {
      console.error('Error clearing order data:', error);
      throw new Error('Failed to clear order data');
    }
  }
}
