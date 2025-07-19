import { Address } from '../mocks/residenceMock';

// TODO: Заменить на реальный базовый URL API
const API_BASE_URL = 'https://api.fixdrive.com/v1';

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
}

export interface UpdateAddressRequest {
  title?: string;
  address?: string;
  isDefault?: boolean;
  latitude?: number;
  longitude?: number;
}

class AddressService {
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    try {
      // TODO: Добавить токен авторизации
      const token = await this.getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      
      throw error;
    }
  }

  private async getAuthToken(): Promise<string> {
    // TODO: Реализовать получение токена из хранилища
    return 'your-auth-token-here';
  }

  /**
   * Получить все адреса пользователя
   */
  async getAddresses(): Promise<Address[]> {
    try {
      const response = await this.makeRequest<AddressResponse>('/addresses');
      
      if (response.success && Array.isArray(response.data)) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch addresses');
    } catch (error) {
      
      throw error;
    }
  }

  /**
   * Создать новый адрес
   */
  async createAddress(addressData: CreateAddressRequest): Promise<Address> {
    try {
      const response = await this.makeRequest<AddressResponse>('/addresses', {
        method: 'POST',
        body: JSON.stringify(addressData),
      });
      
      if (response.success && response.data && !Array.isArray(response.data)) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to create address');
    } catch (error) {
      
      throw error;
    }
  }

  /**
   * Обновить существующий адрес
   */
  async updateAddress(id: string, updates: UpdateAddressRequest): Promise<Address> {
    try {
      const response = await this.makeRequest<AddressResponse>(`/addresses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      
      if (response.success && response.data && !Array.isArray(response.data)) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to update address');
    } catch (error) {
      
      throw error;
    }
  }

  /**
   * Удалить адрес
   */
  async deleteAddress(id: string): Promise<boolean> {
    try {
      const response = await this.makeRequest<AddressResponse>(`/addresses/${id}`, {
        method: 'DELETE',
      });
      
      return response.success;
    } catch (error) {
      
      throw error;
    }
  }

  /**
   * Установить адрес по умолчанию
   */
  async setDefaultAddress(id: string): Promise<boolean> {
    try {
      const response = await this.makeRequest<AddressResponse>(`/addresses/${id}/default`, {
        method: 'PATCH',
      });
      
      return response.success;
    } catch (error) {
      
      throw error;
    }
  }

  /**
   * Получить адрес по умолчанию
   */
  async getDefaultAddress(): Promise<Address | null> {
    try {
      const response = await this.makeRequest<AddressResponse>('/addresses/default');
      
      if (response.success && response.data && !Array.isArray(response.data)) {
        return response.data;
      }
      
      return null;
    } catch (error) {
      
      return null;
    }
  }

  /**
   * Поиск адресов по геолокации
   */
  async searchAddresses(query: string): Promise<Address[]> {
    try {
      const response = await this.makeRequest<AddressResponse>(`/addresses/search?q=${encodeURIComponent(query)}`);
      
      if (response.success && Array.isArray(response.data)) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      
      return [];
    }
  }

  /**
   * Получить координаты по адресу (геокодирование)
   */
  async geocodeAddress(address: string): Promise<{ latitude: number; longitude: number } | null> {
    try {
      const response = await this.makeRequest<{
        success: boolean;
        data?: { latitude: number; longitude: number };
        message?: string;
      }>(`/geocode?address=${encodeURIComponent(address)}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return null;
    } catch (error) {
      
      return null;
    }
  }
}

export const addressService = new AddressService(); 