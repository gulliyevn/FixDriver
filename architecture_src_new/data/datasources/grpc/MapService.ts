import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MockServices from '../../../shared/mocks/MockServices';

// Types
export interface MapLocation {
  latitude: number;
  longitude: number;
  address?: string;
  timestamp?: number;
}

export interface DriverLocation extends MapLocation {
  driver: {
    id: string;
    name: string;
    rating: number;
    vehicle: {
      model: string;
      color: string;
      plateNumber: string;
    };
  };
}

interface CachedLocation {
  location: MapLocation;
  expiresAt: number;
}

export class MapService {
  private static readonly LOCATION_CACHE_KEY = 'cached_location';
  private static readonly LOCATION_CACHE_DURATION = 5 * 60 * 1000; // 5 минут
  private static readonly DEFAULT_REGIONS = {
    'AZ': { lat: 40.3777, lng: 49.8920, name: 'Баку, Азербайджан' },
    'RU': { lat: 55.7558, lng: 37.6176, name: 'Москва, Россия' },
    'TR': { lat: 39.9334, lng: 32.8597, name: 'Анкара, Турция' },
    'US': { lat: 40.7128, lng: -74.0060, name: 'Нью-Йорк, США' },
    'DE': { lat: 52.5200, lng: 13.4050, name: 'Берлин, Германия' },
    'FR': { lat: 48.8566, lng: 2.3522, name: 'Париж, Франция' },
    'ES': { lat: 40.4168, lng: -3.7038, name: 'Мадрид, Испания' },
    'AR': { lat: 36.7525, lng: 3.0420, name: 'Алжир, Алжир' },
  };

  // Получить регион по умолчанию на основе локали устройства
  private static getDefaultRegion(): { lat: number; lng: number; name: string } {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    const countryCode = locale.split('-')[1]?.toUpperCase() || 'AZ';
    return this.DEFAULT_REGIONS[countryCode as keyof typeof this.DEFAULT_REGIONS] || this.DEFAULT_REGIONS['AZ'];
  }

  // Кэширование локации
  private static async cacheLocation(location: MapLocation): Promise<void> {
    try {
      const cachedLocation: CachedLocation = {
        location,
        expiresAt: Date.now() + this.LOCATION_CACHE_DURATION,
      };
      await AsyncStorage.setItem(this.LOCATION_CACHE_KEY, JSON.stringify(cachedLocation));
    } catch (error) {
      console.warn('Failed to cache location:', error);
    }
  }

  // Получить кэшированную локацию
  private static async getCachedLocation(): Promise<MapLocation | null> {
    try {
      const cached = await AsyncStorage.getItem(this.LOCATION_CACHE_KEY);
      if (!cached) return null;

      const cachedLocation: CachedLocation = JSON.parse(cached);
      if (Date.now() > cachedLocation.expiresAt) {
        await AsyncStorage.removeItem(this.LOCATION_CACHE_KEY);
        return null;
      }

      return cachedLocation.location;
    } catch (error) {
      console.warn('Failed to get cached location:', error);
      return null;
    }
  }

  // Получить текущую локацию с повторными попытками
  static async getCurrentLocationWithRetry(maxRetries: number = 3): Promise<MapLocation> {
    // Сначала проверяем кэш
    const cachedLocation = await this.getCachedLocation();
    if (cachedLocation) {
      return cachedLocation;
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Проверяем разрешения
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          throw new Error('Location permission not granted');
        }

        // Получаем текущую позицию
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const mapLocation: MapLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          timestamp: Date.now(),
        };

        // Кэшируем локацию
        await this.cacheLocation(mapLocation);

        return mapLocation;
      } catch (error) {
        console.warn(`Location attempt ${attempt} failed:`, error);
        
        if (attempt === maxRetries) {
          // Если все попытки неудачны, возвращаем регион по умолчанию
          const defaultRegion = this.getDefaultRegion();
          return {
            latitude: defaultRegion.lat,
            longitude: defaultRegion.lng,
            address: defaultRegion.name,
            timestamp: Date.now(),
          };
        }

        // Ждем перед следующей попыткой
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }

    // Fallback - никогда не должен достигнуть этой точки
    const defaultRegion = this.getDefaultRegion();
    return {
      latitude: defaultRegion.lat,
      longitude: defaultRegion.lng,
      address: defaultRegion.name,
      timestamp: Date.now(),
    };
  }

  // Получить ближайших водителей (mock implementation)
  static async getNearbyDrivers(location: MapLocation): Promise<DriverLocation[]> {
    // TODO: Replace with real gRPC call to driver service
    const mockDrivers = await MockServices.drivers.getNearby({
      latitude: location.latitude,
      longitude: location.longitude,
      address: location.address || 'Unknown',
    }, 5000);
    
    // Преобразуем в формат DriverLocation
    return mockDrivers.map((driver, index) => ({
      latitude: location.latitude + (Math.random() - 0.5) * 0.01,
      longitude: location.longitude + (Math.random() - 0.5) * 0.01,
      driver: {
        id: driver.id,
        name: driver.name,
        rating: 4.5 + Math.random() * 0.5, // 4.5-5.0
        vehicle: {
          model: 'Toyota Camry',
          color: ['Белый', 'Черный', 'Серый', 'Красный'][index % 4],
          plateNumber: `10-${String.fromCharCode(65 + index)}${String.fromCharCode(65 + index)}-${Math.floor(Math.random() * 900) + 100}`,
        },
      },
    }));
  }

  // Получить маршрут между точками (mock implementation)
  static async getRoute(from: MapLocation, to: MapLocation): Promise<MapLocation[]> {
    // TODO: Replace with real gRPC call to routing service
    return await MockServices.map.buildRoute(
      { latitude: from.latitude, longitude: from.longitude, address: from.address || 'Unknown' },
      { latitude: to.latitude, longitude: to.longitude, address: to.address || 'Unknown' }
    );
  }

  // Геокодирование адреса (mock implementation)
  static async geocodeAddress(address: string): Promise<MapLocation> {
    // TODO: Replace with real gRPC call to geocoding service
    try {
      const result = await Location.geocodeAsync(address);
      if (result.length > 0) {
        return {
          latitude: result[0].latitude,
          longitude: result[0].longitude,
          address,
          timestamp: Date.now(),
        };
      }
      throw new Error('Address not found');
    } catch (error) {
      console.warn('Geocoding failed, using mock service:', error);
      // Fallback to mock service
      const mockLocation = await MockServices.map.geocodeAddress(address);
      return {
        latitude: mockLocation.latitude,
        longitude: mockLocation.longitude,
        address: mockLocation.address || address,
        timestamp: Date.now(),
      };
    }
  }

  // Обратное геокодирование (mock implementation)
  static async reverseGeocode(location: MapLocation): Promise<string> {
    // TODO: Replace with real gRPC call to reverse geocoding service
    try {
      const result = await Location.reverseGeocodeAsync({
        latitude: location.latitude,
        longitude: location.longitude,
      });
      
      if (result.length > 0) {
        const address = result[0];
        return `${address.street || ''} ${address.streetNumber || ''}, ${address.city || ''}`.trim();
      }
      
      return 'Неизвестный адрес';
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
      return 'Неизвестный адрес';
    }
  }
}