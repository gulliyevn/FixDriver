/**
 * 🚗 MOCK DRIVER SERVICE
 */

import { Driver, Location } from '../types';
import MockData from '../MockData';

export class DriverService {
  async getById(id: string): Promise<Driver | null> {
    return MockData.getDriverById(id) || null;
  }

  async getNearby(location: Location, radius: number = 5000): Promise<Driver[]> {
    return MockData.getNearbyDrivers(location, radius);
  }

  async updateStatus(id: string, status: string): Promise<Driver> {
    const driver = MockData.getDriverById(id);
    if (!driver) throw new Error('Driver not found');
    
    const updatedDriver = { ...driver, status, updatedAt: new Date() };
    console.log('🚦 Mock driver status updated:', updatedDriver);
    
    return updatedDriver;
  }

  async getEarnings(id: string, period: string): Promise<number> {
    return Math.random() * 1000;
  }
}

export default DriverService;
