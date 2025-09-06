import AsyncStorage from '@react-native-async-storage/async-storage';
import { PLACES_CONSTANTS } from '../../shared/constants';

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

export interface IPlacesService {
  getPlacePredictions(input: string, country?: string): Promise<PlacePrediction[]>;
  getPlaceDetails(placeId: string): Promise<PlaceDetails | null>;
  saveToHistory(address: string, placeId: string, coordinates: { latitude: number; longitude: number }): Promise<void>;
  getHistory(): Promise<AddressHistory[]>;
  clearHistory(): Promise<void>;
  validateAddress(address: string): { isValid: boolean; error?: string };
  syncWithBackend(): Promise<boolean>;
}

class PlacesService implements IPlacesService {

  constructor() {}

  // Get address predictions via OpenStreetMap Nominatim
  async getPlacePredictions(input: string, country?: string): Promise<PlacePrediction[]> {
    if (!input.trim() || input.length < PLACES_CONSTANTS.MIN_INPUT_LENGTH) {
      return [];
    }

    try {
      const params = new URLSearchParams({
        q: input.trim(),
        format: 'json',
        limit: PLACES_CONSTANTS.SEARCH_LIMIT.toString(),
        addressdetails: '1',
        'accept-language': PLACES_CONSTANTS.ACCEPT_LANGUAGE,
      });

      const response = await fetch(
        `${PLACES_CONSTANTS.BASE_URL}/search?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Convert OpenStreetMap response to Google Places format
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

  // Get place details by place_id
  async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    try {
      const params = new URLSearchParams({
        place_id: placeId,
        format: 'json',
        addressdetails: '1',
        'accept-language': PLACES_CONSTANTS.ACCEPT_LANGUAGE,
      });

      const response = await fetch(
        `${PLACES_CONSTANTS.BASE_URL}/lookup?${params.toString()}`
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

  // Save address to history
  async saveToHistory(address: string, placeId: string, coordinates: { latitude: number; longitude: number }) {
    try {
      const history = await this.getHistory();
      
      // Check if address already exists
      const existingIndex = history.findIndex(item => item.placeId === placeId);
      
      if (existingIndex !== -1) {
        // Update existing
        history[existingIndex].useCount += 1;
        history[existingIndex].timestamp = Date.now();
      } else {
        // Add new
        const newItem: AddressHistory = {
          id: Date.now().toString(),
          address,
          placeId,
          coordinates,
          timestamp: Date.now(),
          useCount: 1,
        };
        
        history.unshift(newItem);
        
        // Limit number of items
        if (history.length > PLACES_CONSTANTS.MAX_HISTORY_ITEMS) {
          history.splice(PLACES_CONSTANTS.MAX_HISTORY_ITEMS);
        }
      }
      
      await AsyncStorage.setItem(PLACES_CONSTANTS.HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  }

  // Get address history
  async getHistory(): Promise<AddressHistory[]> {
    try {
      const history = await AsyncStorage.getItem(PLACES_CONSTANTS.HISTORY_KEY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error getting history:', error);
      return [];
    }
  }

  // Clear history
  async clearHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(PLACES_CONSTANTS.HISTORY_KEY);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }

  // Address validation (minimal check)
  validateAddress(address: string): { isValid: boolean; error?: string } {
    const trimmed = address.trim();
    
    if (trimmed.length < PLACES_CONSTANTS.MIN_ADDRESS_LENGTH) {
      return { isValid: false, error: PLACES_CONSTANTS.ERRORS.ADDRESS_TOO_SHORT };
    }
    
    // Check for house number (digits)
    const hasNumber = /\d/.test(trimmed);
    if (!hasNumber) {
      return { isValid: false, error: PLACES_CONSTANTS.ERRORS.MISSING_HOUSE_NUMBER };
    }
    
    // Check for street name (minimum 3 characters)
    const words = trimmed.split(/\s+/);
    const hasStreet = words.some(word => word.length >= PLACES_CONSTANTS.MIN_STREET_LENGTH && !/\d/.test(word));
    if (!hasStreet) {
      return { isValid: false, error: PLACES_CONSTANTS.ERRORS.MISSING_STREET_NAME };
    }
    
    return { isValid: true };
  }

  // Sync with backend via gRPC
  async syncWithBackend(): Promise<boolean> {
    // TODO: Implement gRPC call to sync places data with backend
    try {
      console.log('Syncing places data with backend...');
      // Mock implementation - replace with actual gRPC call
      return true;
    } catch (error) {
      console.error('Failed to sync with backend:', error);
      return false;
    }
  }
}

export const placesService = new PlacesService();
