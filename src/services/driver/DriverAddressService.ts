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

class DriverAddressService {
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

  /**
   * Верифицировать адрес
   */
  async verifyAddress(address: string): Promise<boolean> {
    try {
      // Проверяем минимальную длину
      if (address.length < 8) {
        return false;
      }

      // Проверяем наличие цифр (номер дома/квартиры)
      const hasNumbers = /\d/.test(address);
      if (!hasNumbers) {
        return false;
      }

      // Проверяем наличие ключевых слов адреса
      const addressKeywords = [
        'улица', 'ул', 'проспект', 'пр', 'переулок', 'пер', 'шоссе', 'ш', 'набережная', 'наб',
        'street', 'st', 'avenue', 'ave', 'road', 'rd', 'boulevard', 'blvd', 'lane', 'ln',
        'straße', 'str', 'allee', 'weg', 'platz', 'platz',
        'calle', 'avenida', 'carrera', 'carr',
        'rue', 'avenue', 'boulevard', 'place',
        'via', 'corso', 'piazza', 'viale',
        'sokak', 'cadde', 'mahalle', 'bulvar'
      ];
      
      const hasAddressKeyword = addressKeywords.some(keyword => 
        address.toLowerCase().includes(keyword.toLowerCase())
      );
      
      // Проверяем наличие запятых или других разделителей
      const hasSeparators = /[,;]/.test(address);
      
      // Должен быть хотя бы один из признаков хорошего адреса
      if (!hasAddressKeyword && !hasSeparators) {
        return false;
      }

      // Проверяем, что есть буквы (не только цифры)
      const hasLetters = /[а-яёa-z]/i.test(address);
      if (!hasLetters) {
        return false;
      }

      // Сначала пробуем наш API
      const coordinates = await this.geocodeAddress(address);
      if (coordinates) {
        return true;
      }

      // Если наш API не сработал, пробуем OpenStreetMap Nominatim с более строгими параметрами
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&accept-language=ru&addressdetails=1&extratags=1`
        );
        const data = await response.json();
        
        if (data && data.length > 0 && data[0].display_name) {
          const result = data[0];
          
          // Проверяем, что это действительно адрес, а не город/страна
          const type = result.type;
          if (type !== 'house' && type !== 'street' && type !== 'address') {
            return false;
          }
          
          // Проверяем наличие компонентов адреса
          const addressDetails = result.address;
          if (!addressDetails) {
            return false;
          }
          
          // Должны быть улица и номер дома
          const hasStreet = addressDetails.road || addressDetails.street || addressDetails.house_number;
          const hasHouseNumber = addressDetails.house_number || /\d+/.test(result.display_name);
          
          if (!hasStreet || !hasHouseNumber) {
            return false;
          }
          
          // Проверяем, что найденный адрес похож на введенный
          const foundAddress = result.display_name.toLowerCase();
          const inputAddress = address.toLowerCase();
          
          // Должно быть хотя бы 40% совпадения слов ИЛИ точное совпадение улицы с номером
          const inputWords = inputAddress.split(/\s+/).filter(word => word.length > 2);
          const foundWords = foundAddress.split(/\s+/).filter(word => word.length > 2);
          
          const matchingWords = inputWords.filter(word => 
            foundWords.some(foundWord => foundWord.includes(word) || word.includes(foundWord))
          );
          
          const similarity = matchingWords.length / Math.max(inputWords.length, foundWords.length);
          
          // Проверяем совпадение ключевых частей (улица, номер)
          const hasStreetMatch = inputWords.some(word => 
            foundWords.some(foundWord => 
              foundWord.toLowerCase().includes(word.toLowerCase()) && word.length > 3
            )
          );
          
          const hasNumberMatch = /\d+/.test(inputAddress) && /\d+/.test(foundAddress);
          
          // Должно быть либо хорошее совпадение слов, либо точное совпадение улицы с номером
          return similarity >= 0.4 || (hasStreetMatch && hasNumberMatch);
        }
      } catch (osmError) {
        // Игнорируем ошибку и пробуем следующий сервис
      }

      // Пробуем Google Geocoding API (если есть ключ)
      try {
        const googleResponse = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=YOUR_GOOGLE_API_KEY`
        );
        const googleData = await googleResponse.json();
        
        if (googleData.results && googleData.results.length > 0) {
          // Проверяем тип результата
          const result = googleData.results[0];
          const isAddress = result.types.includes('street_address') || 
                           result.types.includes('route') ||
                           result.types.includes('premise');
          
          return isAddress;
        }
      } catch (googleError) {
        // Игнорируем ошибку
      }

      // Пробуем Yandex Geocoding API (если есть ключ)
      try {
        const yandexResponse = await fetch(
          `https://geocode-maps.yandex.ru/1.x/?apikey=YOUR_YANDEX_API_KEY&format=json&geocode=${encodeURIComponent(address)}&lang=ru_RU`
        );
        const yandexData = await yandexResponse.json();
        
        if (yandexData.response?.GeoObjectCollection?.featureMember?.length > 0) {
          const geoObject = yandexData.response.GeoObjectCollection.featureMember[0].GeoObject;
          const kind = geoObject.metaDataProperty?.GeocoderMetaData?.kind;
          
          // Проверяем, что это действительно адрес
          return kind === 'house' || kind === 'street';
        }
      } catch (yandexError) {
        // Игнорируем ошибку
      }

      return false;
    } catch (error) {
      return false;
    }
  }
}

export const driverAddressService = new DriverAddressService(); 