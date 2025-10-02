import AsyncStorage from '@react-native-async-storage/async-storage';

import APIClient from './APIClient';
import { ADDRESS_CATEGORY_CONFIG } from '../shared/constants/addressCategories';

export interface Address {
  id: string;
  title: string;
  address: string;
  category?: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddressResponse {
  success: boolean;
  data?: Address | Address[];
  message?: string;
  error?: string;
}

export interface CreateAddressRequest {
  title: string;
  address: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
  category?: string;
}

export interface UpdateAddressRequest {
  title?: string;
  address?: string;
  isDefault?: boolean;
  latitude?: number;
  longitude?: number;
  category?: string;
}

export interface GeocodeResponse {
  success: boolean;
  data?: {
    latitude: number;
    longitude: number;
    address: string;
    formattedAddress: string;
  };
  error?: string;
}

export interface AddressCategory {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

const DEV_ADDRESS_CATEGORIES: AddressCategory[] = ADDRESS_CATEGORY_CONFIG.map(({ id, translationKey, icon }) => ({
  id,
  name: translationKey,
  icon,
}));

const DEV_ADDRESS_HISTORY_KEY = 'address_history';

class AddressService {
  /**
   * Получает все адреса пользователя
   */
  async getAddresses(userId: string): Promise<Address[]> {
    try {
      const response = await APIClient.get<Address[]>(`/addresses/user/${userId}`);
      return response.success && response.data ? response.data : [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Получает адрес по ID
   */
  async getAddress(addressId: string): Promise<Address | null> {
    try {
      const response = await APIClient.get<Address>(`/addresses/${addressId}`);
      return response.success && response.data ? response.data : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Создает новый адрес
   */
  async createAddress(userId: string, addressData: CreateAddressRequest): Promise<Address | null> {
    try {
      const response = await APIClient.post<Address>('/addresses', {
        ...addressData,
        userId
      });
      return response.success && response.data ? response.data : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Обновляет адрес
   */
  async updateAddress(addressId: string, updates: UpdateAddressRequest): Promise<Address | null> {
    try {
      const response = await APIClient.put<Address>(`/addresses/${addressId}`, updates);
      return response.success && response.data ? response.data : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Удаляет адрес
   */
  async deleteAddress(addressId: string): Promise<boolean> {
    try {
      const response = await APIClient.delete<{ success: boolean }>(`/addresses/${addressId}`);
      return response.success && response.data?.success || false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Устанавливает адрес по умолчанию
   */
  async setDefaultAddress(userId: string, addressId: string): Promise<boolean> {
    try {
      const response = await APIClient.post<{ success: boolean }>(`/addresses/user/${userId}/default`, { addressId });
      return response.success && response.data?.success || false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Получает адрес по умолчанию
   */
  async getDefaultAddress(userId: string): Promise<Address | null> {
    try {
      const response = await APIClient.get<Address>(`/addresses/user/${userId}/default`);
      return response.success && response.data ? response.data : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Геокодирование адреса (получение координат)
   */
  async geocodeAddress(address: string): Promise<GeocodeResponse> {
    try {
      const response = await APIClient.post<GeocodeResponse['data']>('/addresses/geocode', { address });
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data
        };
      }
      
      return {
        success: false,
        error: response.error || 'Ошибка при геокодировании адреса'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка при геокодировании адреса'
      };
    }
  }

  /**
   * Обратное геокодирование (получение адреса по координатам)
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<GeocodeResponse> {
    try {
      const response = await APIClient.post<GeocodeResponse['data']>('/addresses/reverse-geocode', { latitude, longitude });
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data
        };
      }
      
      return {
        success: false,
        error: response.error || 'Ошибка при обратном геокодировании'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка при обратном геокодировании'
      };
    }
  }

  /**
   * Поиск адресов
   */
  async searchAddresses(userId: string, query: string): Promise<Address[]> {
    try {
      const response = await APIClient.get<Address[]>(`/addresses/user/${userId}/search`, { q: query });
      return response.success && response.data ? response.data : [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Получает категории адресов
   */
  async fetchAddressCategories(): Promise<AddressCategory[]> {
    if (__DEV__) {
      return DEV_ADDRESS_CATEGORIES;
    }

    try {
      const response = await APIClient.get<AddressCategory[]>('/addresses/categories');
      return response.success && response.data ? response.data : [];
    } catch (error) {
      return [];
    }
  }

  async verifyAddress(address: string): Promise<boolean> {
    if (!address.trim()) {
      return false;
    }

    if (__DEV__) {
      return address.trim().length > 5;
    }

    try {
      const response = await APIClient.post<{ success: boolean }>('/addresses/verify', { address });
      return response.success && response.data?.success === true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Получает популярные адреса
   */
  async getPopularAddresses(userId: string): Promise<Address[]> {
    try {
      const response = await APIClient.get<Address[]>(`/addresses/user/${userId}/popular`);
      return response.success && response.data ? response.data : [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Получает историю адресов
   */
  async getAddressHistory(userId: string): Promise<Address[]> {
    if (__DEV__) {
      try {
        const history = await AsyncStorage.getItem(`${DEV_ADDRESS_HISTORY_KEY}_${userId}`);
        return history ? JSON.parse(history) : [];
      } catch (error) {
        return [];
      }
    }

    try {
      const response = await APIClient.get<Address[]>(`/addresses/user/${userId}/history`);
      return response.success && response.data ? response.data : [];
    } catch (error) {
      return [];
    }
  }

  async saveAddressToHistory(userId: string, address: Address): Promise<void> {
    if (!__DEV__) {
      return;
    }

    try {
      const storageKey = `${DEV_ADDRESS_HISTORY_KEY}_${userId}`;
      const history = await AsyncStorage.getItem(storageKey);
      const parsed: Address[] = history ? JSON.parse(history) : [];
      const updated = [address, ...parsed.filter(item => item.id !== address.id)].slice(0, 10);
      await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (error) {
    }
  }
}

export default AddressService;