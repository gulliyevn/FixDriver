import { UserDriver } from '../../../shared/types/user';

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

export interface CachedLocation {
  location: MapLocation;
  timestamp: number;
  expiresAt: number;
}

export interface DefaultRegion {
  lat: number;
  lng: number;
  name: string;
}

export interface IMapService {
  getCurrentLocation(): Promise<MapLocation>;
  getNearbyDrivers(location: MapLocation): Promise<DriverLocation[]>;
  getRoute(from: MapLocation, to: MapLocation): Promise<MapLocation[]>;
  geocodeAddress(address: string): Promise<MapLocation>;
  watchLocation(callback: (location: MapLocation) => void): Promise<() => void>;
  getCurrentLocationWithRetry(maxRetries?: number): Promise<MapLocation>;
  clearLocationCache(): Promise<void>;
  syncWithBackend(): Promise<boolean>;
}
