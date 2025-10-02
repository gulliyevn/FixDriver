import APIClient from '../APIClient';

export interface Address {
  id: string;
  driverId: string;
  title: string;
  address: string;
  category?: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
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

export class DriverAddressService {
  /**
   * Получает все адреса водителя
   */
  async getAddresses(driverId: string): Promise<Address[]> {
    try {
      const response = await APIClient.get<Address[]>(`/drivers/${driverId}/addresses`);
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
      const response = await APIClient.get<Address>(`/drivers/addresses/${addressId}`);
      return response.success && response.data ? response.data : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Создает новый адрес водителя
   */
  async createAddress(driverId: string, addressData: CreateAddressRequest): Promise<Address | null> {
    try {
      const response = await APIClient.post<Address>('/drivers/addresses', {
        ...addressData,
        driverId
      });
      return response.success && response.data ? response.data : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Обновляет адрес водителя
   */
  async updateAddress(addressId: string, updates: UpdateAddressRequest): Promise<Address | null> {
    try {
      const response = await APIClient.put<Address>(`/drivers/addresses/${addressId}`, updates);
      return response.success && response.data ? response.data : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Удаляет адрес водителя
   */
  async deleteAddress(addressId: string): Promise<boolean> {
    try {
      const response = await APIClient.delete<{ success: boolean }>(`/drivers/addresses/${addressId}`);
      return response.success && response.data?.success || false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Устанавливает адрес по умолчанию для водителя
   */
  async setDefaultAddress(driverId: string, addressId: string): Promise<boolean> {
    try {
      const response = await APIClient.post<{ success: boolean }>(`/drivers/${driverId}/addresses/default`, { addressId });
      return response.success && response.data?.success || false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Получает адрес по умолчанию водителя
   */
  async getDefaultAddress(driverId: string): Promise<Address | null> {
    try {
      const response = await APIClient.get<Address>(`/drivers/${driverId}/addresses/default`);
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
      const response = await APIClient.post<GeocodeResponse['data']>('/drivers/addresses/geocode', { address });
      
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
      const response = await APIClient.post<GeocodeResponse['data']>('/drivers/addresses/reverse-geocode', { latitude, longitude });
      
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
   * Поиск адресов водителя
   */
  async searchAddresses(driverId: string, query: string): Promise<Address[]> {
    try {
      const response = await APIClient.get<Address[]>(`/drivers/${driverId}/addresses/search`, { q: query });
      return response.success && response.data ? response.data : [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Получает категории адресов для водителей
   */
  async getAddressCategories(): Promise<Array<{ id: string; name: string; icon: string; color: string }>> {
    try {
      const response = await APIClient.get<Array<{ id: string; name: string; icon: string; color: string }>>('/drivers/addresses/categories');
      return response.success && response.data ? response.data : [];
    } catch (error) {
      return [];
    }
  }
}

export default DriverAddressService;