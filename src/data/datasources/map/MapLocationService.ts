import * as Location from 'expo-location';
import { MapLocation, DefaultRegion } from './MapTypes';
import { MapCacheService } from './MapCacheService';
import { MAP_CONSTANTS } from '../../../shared/constants/adaptiveConstants';

export class MapLocationService {
  private cacheService: MapCacheService;

  constructor() {
    this.cacheService = new MapCacheService();
  }

  // Get default region based on device locale
  getDefaultRegion(): DefaultRegion {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    const countryCode = locale.split('-')[1]?.toUpperCase() || 'AZ';
    return MAP_CONSTANTS.DEFAULT_REGIONS[countryCode as keyof typeof MAP_CONSTANTS.DEFAULT_REGIONS] || MAP_CONSTANTS.DEFAULT_REGIONS['AZ'];
  }

  // Get current location
  async getCurrentLocation(): Promise<MapLocation> {
    try {
      // First check cache
      const cachedLocation = await this.cacheService.getCachedLocation();
      if (cachedLocation) {
        return cachedLocation;
      }

      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        // Return cached location or default region
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

      // Get current location with optimized settings
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced, // Balance between accuracy and speed
        timeInterval: MAP_CONSTANTS.LOCATION_INTERVALS.TIME,
        distanceInterval: MAP_CONSTANTS.LOCATION_INTERVALS.DISTANCE,
        mayShowUserSettingsDialog: true, // Show settings if needed
      });

      // Get address by coordinates with retry
      let address = 'Determining address...';
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
          
          address = addressParts.join(', ') || 'Unknown address';
        }
      } catch (geocodeError) {
        console.warn('Geocoding error, using coordinates:', geocodeError);
        address = `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`;
      }

      const result: MapLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address,
        timestamp: Date.now(),
      };

      // Cache result
      await this.cacheService.cacheLocation(result);

      return result;
    } catch (error) {
      console.error('Error getting location:', error);
      
      // Return cached location or default region
      const cachedLocation = await this.cacheService.getCachedLocation();
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

  // Get current location with retry
  async getCurrentLocationWithRetry(maxRetries: number = MAP_CONSTANTS.RETRY.MAX_RETRIES): Promise<MapLocation> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.getCurrentLocation();
      } catch (error) {
        console.warn(`Attempt ${attempt}/${maxRetries} to get location failed:`, error);
        
        if (attempt === maxRetries) {
          // Last attempt - return cache or default
          const cachedLocation = await this.cacheService.getCachedLocation();
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
        
        // Wait before next attempt
        await new Promise(resolve => setTimeout(resolve, MAP_CONSTANTS.RETRY.DELAY * attempt));
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

  // Watch location
  async watchLocation(callback: (location: MapLocation) => void): Promise<() => void> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        throw new Error('Location permission not granted');
      }

      // First call callback with current location
      const currentLocation = await this.getCurrentLocation();
      callback(currentLocation);

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced, // Optimized accuracy
          timeInterval: MAP_CONSTANTS.WATCH_INTERVALS.TIME,
          distanceInterval: MAP_CONSTANTS.WATCH_INTERVALS.DISTANCE,
        },
        async (location) => {
          try {
            // Get address for new position
            let address = 'Updating address...';
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
                
                address = addressParts.join(', ') || 'Unknown address';
              }
            } catch (geocodeError) {
              console.warn('Geocoding error during tracking:', geocodeError);
              address = `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`;
            }

            const newLocation: MapLocation = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              address,
              timestamp: Date.now(),
            };

            // Cache new location
            await this.cacheService.cacheLocation(newLocation);

            // Call callback
            callback(newLocation);
          } catch (error) {
            console.warn('Error processing new location:', error);
          }
        }
      );

      return () => subscription.remove();
    } catch (error) {
      console.error('Error watching location:', error);
      return () => {};
    }
  }

  // Geocode address
  async geocodeAddress(address: string): Promise<MapLocation> {
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
        throw new Error('Address not found');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      // Return default location in case of error
      return {
        latitude: MAP_CONSTANTS.DEFAULT_REGIONS['RU'].lat,
        longitude: MAP_CONSTANTS.DEFAULT_REGIONS['RU'].lng,
        address,
      };
    }
  }
}
