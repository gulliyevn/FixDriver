import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDriver, UserRole } from '../types/user';

export interface MapLocation {
  latitude: number;
  longitude: number;
  address?: string;
  timestamp?: number;
}

export interface DriverLocation extends MapLocation {
  driver: UserDriver;
  isAvailable: boolean;
  rating: number;
}

interface CachedLocation {
  location: MapLocation;
  timestamp: number;
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
        location: { ...location, timestamp: Date.now() },
        timestamp: Date.now(),
        expiresAt: Date.now() + this.LOCATION_CACHE_DURATION,
      };
      await AsyncStorage.setItem(this.LOCATION_CACHE_KEY, JSON.stringify(cachedLocation));
    } catch (error) {
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
      return null;
    }
  }

  static async getCurrentLocation(): Promise<MapLocation> {
    try {
      // Сначала проверяем кэш
      const cachedLocation = await this.getCachedLocation();
      if (cachedLocation) {
        return cachedLocation;
      }

      // Запрашиваем разрешение на геолокацию
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        // Возвращаем кэшированную локацию или регион по умолчанию
        if (cachedLocation) {
          return cachedLocation;
        }
        const defaultRegion = this.getDefaultRegion();
        return {
          latitude: defaultRegion.lat,
          longitude: defaultRegion.lng,
          address: defaultRegion.name,
        };
      }

      // Получаем текущую локацию с оптимизированными настройками
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced, // Баланс между точностью и скоростью
        timeInterval: 10000, // 10 секунд
        distanceInterval: 50, // 50 метров
        mayShowUserSettingsDialog: true, // Показать настройки если нужно
      });

      // Получаем адрес по координатам с retry
      let address = 'Определение адреса...';
      try {
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

        if (addressResponse[0]) {
          const addr = addressResponse[0];
          const addressParts = [
            addr.street,
            addr.streetNumber,
            addr.city,
            addr.region,
            addr.country
          ].filter(Boolean);
          
          address = addressParts.join(', ') || 'Неизвестный адрес';
        }
      } catch (geocodeError) {
        address = `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`;
      }

      const result: MapLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address,
        timestamp: Date.now(),
      };

      // Кэшируем результат
      await this.cacheLocation(result);

      return result;
    } catch (error) {
      
      // Возвращаем кэшированную локацию или регион по умолчанию
      const cachedLocation = await this.getCachedLocation();
      if (cachedLocation) {
        return cachedLocation;
      }

      const defaultRegion = this.getDefaultRegion();
      return {
        latitude: defaultRegion.lat,
        longitude: defaultRegion.lng,
        address: defaultRegion.name,
      };
    }
  }

  static async getNearbyDrivers(location: MapLocation): Promise<DriverLocation[]> {
    // TODO: заменить на реальный API запрос
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            latitude: location.latitude + 0.001,
            longitude: location.longitude + 0.001,
            address: 'Москва, ул. Тверская',
            driver: {
              id: '1',
              name: 'Алексей',
              surname: 'Петров',
              email: 'alex@example.com',
              address: 'Москва',
              role: UserRole.DRIVER,
              phone: '+7 (999) 123-45-67',
              avatar: null,
              rating: 4.8,
              createdAt: new Date().toISOString(),
              vehicle: {
                make: 'Toyota',
                model: 'Camry',
                year: 2020,
                color: 'белый',
                licensePlate: 'A123BC',
              },
              isAvailable: true,
            },
            isAvailable: true,
            rating: 4.8,
          },
          {
            latitude: location.latitude - 0.001,
            longitude: location.longitude - 0.001,
            address: 'Москва, ул. Арбат',
            driver: {
              id: '2',
              name: 'Мария',
              surname: 'Иванова',
              email: 'maria@example.com',
              address: 'Москва',
              role: UserRole.DRIVER,
              phone: '+7 (999) 234-56-78',
              avatar: null,
              rating: 4.9,
              createdAt: new Date().toISOString(),
              vehicle: {
                make: 'Honda',
                model: 'Civic',
                year: 2019,
                color: 'серебристый',
                licensePlate: 'B456DE',
              },
              isAvailable: true,
            },
            isAvailable: true,
            rating: 4.9,
          },
          {
            latitude: location.latitude + 0.002,
            longitude: location.longitude - 0.002,
            address: 'Москва, ул. Покровка',
            driver: {
              id: '3',
              name: 'Дмитрий',
              surname: 'Сидоров',
              email: 'dmitry@example.com',
              address: 'Москва',
              role: UserRole.DRIVER,
              phone: '+7 (999) 345-67-89',
              avatar: null,
              rating: 4.7,
              createdAt: new Date().toISOString(),
              vehicle: {
                make: 'BMW',
                model: 'X5',
                year: 2021,
                color: 'черный',
                licensePlate: 'C789FG',
              },
              isAvailable: false,
            },
            isAvailable: false,
            rating: 4.7,
          },
        ]);
      }, 1000);
    });
  }

  static async getRoute(from: MapLocation, to: MapLocation): Promise<MapLocation[]> {
    // TODO: заменить на реальный API маршрутов
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          from,
          {
            latitude: (from.latitude + to.latitude) / 2,
            longitude: (from.longitude + to.longitude) / 2,
          },
          to,
        ]);
      }, 500);
    });
  }

  static async geocodeAddress(address: string): Promise<MapLocation> {
    try {
      const geocodeResult = await Location.geocodeAsync(address);
      
      if (geocodeResult.length > 0) {
        const { latitude, longitude } = geocodeResult[0];
        return {
          latitude,
          longitude,
          address,
        };
      } else {
        console.error('Адрес не найден'); return;
      }
    } catch (error) {
      // Возвращаем дефолтную локацию в случае ошибки
      return {
        latitude: 55.7558,
        longitude: 37.6176,
        address,
      };
    }
  }

  static async watchLocation(callback: (location: MapLocation) => void): Promise<() => void> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.error('Разрешение на геолокацию не предоставлено'); return;
      }

      // Сначала вызываем callback с текущей локацией
      const currentLocation = await this.getCurrentLocation();
      callback(currentLocation);

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced, // Оптимизированная точность
          timeInterval: 15000, // 15 секунд - меньше батареи
          distanceInterval: 100, // 100 метров - меньше запросов
        },
        async (location) => {
          try {
            // Получаем адрес для новой позиции
            let address = 'Обновление адреса...';
            try {
              const addressResponse = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });

              if (addressResponse[0]) {
                const addr = addressResponse[0];
                const addressParts = [
                  addr.street,
                  addr.streetNumber,
                  addr.city,
                  addr.region,
                  addr.country
                ].filter(Boolean);
                
                address = addressParts.join(', ') || 'Неизвестный адрес';
              }
            } catch (geocodeError) {
              address = `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`;
            }

            const newLocation: MapLocation = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              address,
              timestamp: Date.now(),
            };

            // Кэшируем новую локацию
            await this.cacheLocation(newLocation);

            // Вызываем callback
            callback(newLocation);
          } catch (error) {
          }
        }
      );

      return () => subscription.remove();
    } catch (error) {
      return () => {};
    }
  }

  // Новый метод для получения локации с retry
  static async getCurrentLocationWithRetry(maxRetries: number = 3): Promise<MapLocation> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.getCurrentLocation();
      } catch (error) {
        
        if (attempt === maxRetries) {
          // Последняя попытка - возвращаем кэш или дефолт
          const cachedLocation = await this.getCachedLocation();
          if (cachedLocation) {
            return cachedLocation;
          }
          
          const defaultRegion = this.getDefaultRegion();
          return {
            latitude: defaultRegion.lat,
            longitude: defaultRegion.lng,
            address: defaultRegion.name,
          };
        }
        
        // Ждем перед следующей попыткой
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    
    // Fallback
    const defaultRegion = this.getDefaultRegion();
    return {
      latitude: defaultRegion.lat,
      longitude: defaultRegion.lng,
      address: defaultRegion.name,
    };
  }

  // Метод для очистки кэша
  static async clearLocationCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.LOCATION_CACHE_KEY);
    } catch (error) {
    }
  }
}

export default MapService;
