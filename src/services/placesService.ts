import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface PlaceDetails {
  place_id: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  name: string;
}

export interface AddressHistory {
  id: string;
  address: string;
  placeId: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  timestamp: number;
  useCount: number;
}

class PlacesService {
  private baseUrl = 'https://nominatim.openstreetmap.org';
  private maxHistoryItems = 5;

  constructor() {}

  // Получение предсказаний адресов через OpenStreetMap Nominatim
  async getPlacePredictions(input: string, country?: string): Promise<PlacePrediction[]> {
    if (!input.trim() || input.length < 2) {
      return [];
    }

    try {
      const params = new URLSearchParams({
        q: input.trim(),
        format: 'json',
        limit: '10',
        addressdetails: '1',
        'accept-language': 'ru,az,en',
      });

      const response = await fetch(
        `${this.baseUrl}/search?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Преобразуем ответ OpenStreetMap в формат Google Places
      return data.map((item: any, index: number) => ({
        place_id: item.place_id.toString(),
        description: item.display_name,
        structured_formatting: {
          main_text: item.address?.road || item.address?.house_number || item.name || '',
          secondary_text: item.address?.city || item.address?.town || item.address?.state || '',
        },
      }));
    } catch (error) {
      console.error('Error fetching place predictions:', error);
      return [];
    }
  }

  // Получение деталей места по place_id
  async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    try {
      const params = new URLSearchParams({
        place_id: placeId,
        format: 'json',
        addressdetails: '1',
        'accept-language': 'ru,az,en',
      });

      const response = await fetch(
        `${this.baseUrl}/lookup?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        return null;
      }

      const item = data[0];

      return {
        place_id: item.place_id.toString(),
        formatted_address: item.display_name,
        geometry: {
          location: {
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
          },
        },
        name: item.name || item.display_name,
      };
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  }

  // Сохранение адреса в историю
  async saveToHistory(storageKey: string, address: string, placeId: string, coordinates: { latitude: number; longitude: number }) {
    try {
      const history = await this.getHistory(storageKey);
      
      // Проверяем, есть ли уже такой адрес
      const existingIndex = history.findIndex(item => item.placeId === placeId);
      
      if (existingIndex !== -1) {
        // Обновляем существующий
        history[existingIndex].useCount += 1;
        history[existingIndex].timestamp = Date.now();
      } else {
        // Добавляем новый
        const newItem: AddressHistory = {
          id: Date.now().toString(),
          address,
          placeId,
          coordinates,
          timestamp: Date.now(),
          useCount: 1,
        };
        
        history.unshift(newItem);
        
        // Ограничиваем количество элементов
        if (history.length > this.maxHistoryItems) {
          history.splice(this.maxHistoryItems);
        }
      }
      
      await AsyncStorage.setItem(storageKey, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  }

  // Получение истории адресов
  async getHistory(storageKey: string): Promise<AddressHistory[]> {
    if (!__DEV__) {
      return [];
    }

    try {
      const history = await AsyncStorage.getItem(storageKey);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error getting history:', error);
      return [];
    }
  }

  // Очистка истории
  async clearHistory(storageKey: string): Promise<void> {
    if (!__DEV__) {
      return;
    }

    try {
      await AsyncStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }

  // Валидация адреса (минимальная проверка)
  validateAddress(address: string): { isValid: boolean; error?: string } {
    const trimmed = address.trim();
    
    if (trimmed.length < 5) {
      return { isValid: false, error: 'components:common.autocomplete.errors.tooShort' };
    }
    
    // Проверяем наличие номера дома (цифры)
    const hasNumber = /\d/.test(trimmed);
    if (!hasNumber) {
      return { isValid: false, error: 'components:common.autocomplete.errors.noNumber' };
    }
    
    // Проверяем наличие улицы (минимум 3 символа)
    const words = trimmed.split(/\s+/);
    const hasStreet = words.some(word => word.length >= 3 && !/\d/.test(word));
    if (!hasStreet) {
      return { isValid: false, error: 'components:common.autocomplete.errors.noStreet' };
    }
    
    return { isValid: true };
  }
}

export const placesService = new PlacesService();
