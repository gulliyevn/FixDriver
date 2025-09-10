/**
 * 🚗 DRIVER SERVICE
 * 
 * Mock driver service for development and testing.
 * Easy to replace with gRPC implementation.
 */

import MockData from '../MockData';

// Types for DriverService
interface Driver {
  id: string;
  name: string;
  status: string;
  isOnline: boolean;
  rating?: number;
  totalTrips?: number;
}

interface DriverStatus {
  status: string;
  isOnline: boolean;
}

export default class DriverService {
  /**
   * Get all drivers
   */
  async getAll(): Promise<Driver[]> {
    return MockData.drivers;
  }

  /**
   * Get driver by ID
   */
  async getById(driverId: string): Promise<Driver | null> {
    return MockData.drivers.find(d => d.id === driverId) || null;
  }

  /**
   * Update driver status
   */
  async updateStatus(driverId: string, status: DriverStatus): Promise<void> {
    const driver = MockData.drivers.find(d => d.id === driverId);
    if (!driver) throw new Error('Driver not found');

    driver.status = status.status;
    driver.isOnline = status.isOnline;

    console.log('🚗 Mock driver status updated:', driver);
  }

  /**
   * Get online drivers
   */
  async getOnline(): Promise<Driver[]> {
    return MockData.drivers.filter(driver => driver.isOnline);
  }
}