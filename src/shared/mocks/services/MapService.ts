/**
 * 🗺️ MAP SERVICE
 * 
 * Mock map service for development and testing.
 * Easy to replace with gRPC implementation.
 */

import MockData from '../MockData';

export default class MapService {
  /**
   * Get all locations
   */
  async getLocations(): Promise<any[]> {
    return MockData.locations;
  }

  /**
   * Search locations by query
   */
  async searchLocation(query: string): Promise<any[]> {
    return MockData.locations.filter(location => 
      location.address.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * Get location by coordinates
   */
  async getLocationByCoordinates(lat: number, lng: number): Promise<any | null> {
    return MockData.locations.find(location => 
      Math.abs(location.latitude - lat) < 0.001 && 
      Math.abs(location.longitude - lng) < 0.001
    ) || null;
  }
}
