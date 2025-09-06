import { MapLocation, DriverLocation } from './MapTypes';
import { createMockDriverLocations } from '../../../shared/mocks/mapMock';
import { MAP_CONSTANTS } from '../../../shared/constants/adaptiveConstants';

export class MapDriversService {
  // Get nearby drivers (mock implementation)
  async getNearbyDrivers(location: MapLocation): Promise<DriverLocation[]> {
    // TODO: Replace with real API request
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockDrivers = createMockDriverLocations(location, MAP_CONSTANTS.MOCK.DRIVER_COUNT);
        resolve(mockDrivers);
      }, MAP_CONSTANTS.MOCK.DELAY);
    });
  }

  // Get route between two points (mock implementation)
  async getRoute(from: MapLocation, to: MapLocation): Promise<MapLocation[]> {
    // TODO: Replace with real route API
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
      }, MAP_CONSTANTS.MOCK.ROUTE_DELAY);
    });
  }
}
