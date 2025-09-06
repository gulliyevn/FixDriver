import { 
  IMapService, 
  MapLocation, 
  DriverLocation 
} from './MapTypes';
import { MapLocationService } from './MapLocationService';
import { MapCacheService } from './MapCacheService';
import { MapDriversService } from './MapDriversService';
import { MapGrpcService } from './MapGrpcService';

export class MapService implements IMapService {
  private locationService: MapLocationService;
  private cacheService: MapCacheService;
  private driversService: MapDriversService;
  private grpcService: MapGrpcService;

  constructor() {
    this.locationService = new MapLocationService();
    this.cacheService = new MapCacheService();
    this.driversService = new MapDriversService();
    this.grpcService = new MapGrpcService();
  }

  // Get current location
  async getCurrentLocation(): Promise<MapLocation> {
    return this.locationService.getCurrentLocation();
  }

  // Get nearby drivers
  async getNearbyDrivers(location: MapLocation): Promise<DriverLocation[]> {
    return this.driversService.getNearbyDrivers(location);
  }

  // Get route between two points
  async getRoute(from: MapLocation, to: MapLocation): Promise<MapLocation[]> {
    return this.driversService.getRoute(from, to);
  }

  // Geocode address
  async geocodeAddress(address: string): Promise<MapLocation> {
    return this.locationService.geocodeAddress(address);
  }

  // Watch location
  async watchLocation(callback: (location: MapLocation) => void): Promise<() => void> {
    return this.locationService.watchLocation(callback);
  }

  // Get current location with retry
  async getCurrentLocationWithRetry(maxRetries?: number): Promise<MapLocation> {
    return this.locationService.getCurrentLocationWithRetry(maxRetries);
  }

  // Clear location cache
  async clearLocationCache(): Promise<void> {
    return this.cacheService.clearLocationCache();
  }

  // Sync with backend
  async syncWithBackend(): Promise<boolean> {
    return this.grpcService.syncWithBackend();
  }
}

export default MapService;
