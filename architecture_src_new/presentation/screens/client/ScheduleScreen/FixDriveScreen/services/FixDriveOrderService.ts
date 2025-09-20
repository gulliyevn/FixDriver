import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order, CreateOrderData } from '../../../../../../shared/types';

export interface FixDriveOrderData {
  id: string;
  familyMemberId: string;
  familyMemberName: string;
  packageType: string;
  addresses: Array<{
    id: string;
    type: 'from' | 'to' | 'stop';
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  }>;
  createdAt: number;
  status: 'draft' | 'confirmed' | 'completed' | 'cancelled';
}

export interface SessionData {
  currentPage: string;
  addressData?: any;
  timeScheduleData?: any;
  lastUpdate?: number;
}

export interface ContainerData {
  containerId: string;
  containerType: string;
  containerIndex: number;
  address: string;
  fromCoordinate?: { latitude: number; longitude: number };
  toCoordinate?: { latitude: number; longitude: number };
  time: string;
  isActive: boolean;
  isCalculated: boolean;
}

class FixDriveOrderService {
  private storageKey = 'fixdrive_order_data';
  private sessionKey = 'fixdrive_session_data';
  private containerTimesKey = 'fixdrive_container_times';

  // Сохранение данных заказа
  async saveOrderData(orderData: Omit<FixDriveOrderData, 'id' | 'createdAt' | 'status'>): Promise<FixDriveOrderData> {
    try {
      const order: FixDriveOrderData = {
        ...orderData,
        id: `order_${Date.now()}`,
        createdAt: Date.now(),
        status: 'draft',
      };

      await AsyncStorage.setItem(this.storageKey, JSON.stringify(order));
      return order;
    } catch (error) {
      console.error('Error saving order data:', error);
      throw new Error('Не удалось сохранить данные заказа');
    }
  }

  // Загрузка данных заказа
  async loadOrderData(): Promise<FixDriveOrderData | null> {
    try {
      const data = await AsyncStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading order data:', error);
      return null;
    }
  }

  // Обновление данных заказа
  async updateOrderData(updates: Partial<FixDriveOrderData>): Promise<FixDriveOrderData | null> {
    try {
      const currentData = await this.loadOrderData();
      if (!currentData) {
        throw new Error('Нет сохраненных данных заказа');
      }

      const updatedData: FixDriveOrderData = {
        ...currentData,
        ...updates,
      };

      await AsyncStorage.setItem(this.storageKey, JSON.stringify(updatedData));
      return updatedData;
    } catch (error) {
      console.error('Error updating order data:', error);
      throw new Error('Не удалось обновить данные заказа');
    }
  }

  // Сохранение данных сессии (для навигации между страницами)
  async saveSessionData(sessionData: SessionData): Promise<void> {
    try {
      const sessionDataWithTimestamp = {
        ...sessionData,
        lastUpdate: Date.now(),
      };
      await AsyncStorage.setItem(this.sessionKey, JSON.stringify(sessionDataWithTimestamp));
    } catch (error) {
      console.error('Error saving session data:', error);
      throw new Error('Не удалось сохранить данные сессии');
    }
  }

  // Загрузка данных сессии
  async loadSessionData(): Promise<SessionData | null> {
    try {
      const data = await AsyncStorage.getItem(this.sessionKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading session data:', error);
      return null;
    }
  }

  // Сохранение данных контейнеров по отдельности
  async saveContainerTimes(containerData: ContainerData[]): Promise<void> {
    try {
      const containerTimesWithTimestamp = {
        containers: containerData,
        lastUpdate: Date.now(),
      };
      await AsyncStorage.setItem(this.containerTimesKey, JSON.stringify(containerTimesWithTimestamp));
      console.log('Container times saved:', containerData);
    } catch (error) {
      console.error('Error saving container times:', error);
      throw new Error('Не удалось сохранить данные контейнеров');
    }
  }

  // Очистка данных заказа
  async clearOrderData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Error clearing order data:', error);
      throw new Error('Не удалось очистить данные заказа');
    }
  }

  // Очистка данных сессии
  async clearSessionData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.sessionKey);
    } catch (error) {
      console.error('Error clearing session data:', error);
      throw new Error('Не удалось очистить данные сессии');
    }
  }

  // Очистка всех данных
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([this.storageKey, this.sessionKey, this.containerTimesKey]);
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw new Error('Не удалось очистить все данные');
    }
  }

  // Получение времени последнего обновления сессии
  async getSessionLastUpdate(): Promise<number | null> {
    try {
      const sessionData = await this.loadSessionData();
      return sessionData?.lastUpdate || null;
    } catch (error) {
      console.error('Error getting session last update:', error);
      return null;
    }
  }

  // Проверка и очистка устаревшей сессии
  async checkAndClearExpiredSession(): Promise<void> {
    try {
      const lastUpdate = await this.getSessionLastUpdate();
      if (lastUpdate) {
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000; // 5 минут в миллисекундах
        
        if (now - lastUpdate > fiveMinutes) {
          console.log('Session expired, clearing...');
          await this.clearSessionData();
        }
      }
    } catch (error) {
      console.error('Error checking expired session:', error);
    }
  }

  // Проверка валидности данных заказа
  validateOrderData(data: {
    familyMemberId: string;
    packageType: string;
    addresses: Array<{
      type: string;
      address: string;
      coordinates?: any;
      coordinate?: any; // Добавляем поддержку обоих форматов
    }>;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Проверка участника семьи
    if (!data.familyMemberId) {
      errors.push('Не выбран участник семьи');
    }

    // Проверка пакета
    if (!data.packageType) {
      errors.push('Не выбран пакет');
    }

    // Проверка адресов
    if (!data.addresses || data.addresses.length === 0) {
      errors.push('Не указаны адреса');
    } else {
      const fromAddress = data.addresses.find(addr => addr.type === 'from');
      const toAddress = data.addresses.find(addr => addr.type === 'to');

      if (!fromAddress || !fromAddress.address) {
        errors.push('Не указан адрес отправления');
      }

      if (!toAddress || !toAddress.address) {
        errors.push('Не указан адрес назначения');
      }

      // Проверка координат для основных адресов (проверяем оба формата)
      if (fromAddress && !fromAddress.coordinates && !fromAddress.coordinate) {
        errors.push('Не удалось определить координаты адреса отправления');
      }

      if (toAddress && !toAddress.coordinates && !toAddress.coordinate) {
        errors.push('Не удалось определить координаты адреса назначения');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Преобразование в gRPC формат
  convertToGrpcOrder(fixDriveData: FixDriveOrderData): CreateOrderData {
    const fromAddress = fixDriveData.addresses.find(addr => addr.type === 'from');
    const toAddress = fixDriveData.addresses.find(addr => addr.type === 'to');
    
    return {
      clientId: fixDriveData.familyMemberId,
      from: {
        id: fromAddress?.id || 'from_address',
        address: fromAddress?.address || '',
        latitude: fromAddress?.coordinates?.latitude || 0,
        longitude: fromAddress?.coordinates?.longitude || 0,
        type: 'from' as const,
      },
      to: {
        id: toAddress?.id || 'to_address',
        address: toAddress?.address || '',
        latitude: toAddress?.coordinates?.latitude || 0,
        longitude: toAddress?.coordinates?.longitude || 0,
        type: 'to' as const,
      },
      scheduledAt: new Date(fixDriveData.createdAt).toISOString(),
    };
  }
}

export const fixdriveOrderService = new FixDriveOrderService();
