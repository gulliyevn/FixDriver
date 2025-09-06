import AsyncStorage from '@react-native-async-storage/async-storage';
import { MapLocation, CachedLocation } from './MapTypes';
import { MAP_CONSTANTS } from '../../../shared/constants/adaptiveConstants';

export class MapCacheService {
  // Cache location
  async cacheLocation(location: MapLocation): Promise<void> {
    try {
      const cachedLocation: CachedLocation = {
        location: { ...location, timestamp: Date.now() },
        timestamp: Date.now(),
        expiresAt: Date.now() + MAP_CONSTANTS.CACHE_DURATION,
      };
      await AsyncStorage.setItem(MAP_CONSTANTS.STORAGE_KEYS.LOCATION_CACHE, JSON.stringify(cachedLocation));
    } catch (error) {
      console.warn('Failed to cache location:', error);
    }
  }

  // Get cached location
  async getCachedLocation(): Promise<MapLocation | null> {
    try {
      const cached = await AsyncStorage.getItem(MAP_CONSTANTS.STORAGE_KEYS.LOCATION_CACHE);
      if (!cached) return null;

      const cachedLocation: CachedLocation = JSON.parse(cached);
      if (Date.now() > cachedLocation.expiresAt) {
        await AsyncStorage.removeItem(MAP_CONSTANTS.STORAGE_KEYS.LOCATION_CACHE);
        return null;
      }

      return cachedLocation.location;
    } catch (error) {
      console.warn('Error getting cached location:', error);
      return null;
    }
  }

  // Clear location cache
  async clearLocationCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(MAP_CONSTANTS.STORAGE_KEYS.LOCATION_CACHE);
    } catch (error) {
      console.warn('Error clearing location cache:', error);
    }
  }
}
