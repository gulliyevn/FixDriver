/**
 * 🚗 DRIVER STATUS SERVICE
 * 
 * gRPC wrapper for driver status operations
 * Currently uses mock implementation, ready for gRPC integration
 */

import MockServices from '../../../shared/mocks/MockServices';

export default class DriverStatusService {
  static async updateDriverStatus(driverId: string, status: string): Promise<void> {
    // TODO: Replace with real gRPC call
    await MockServices.driverStatus.updateStatus(driverId, status);
  }

  static async getDriverStatus(driverId: string): Promise<string> {
    // TODO: Replace with real gRPC call
    return await MockServices.driverStatus.getStatus(driverId);
  }

  static async setOnlineStatus(driverId: string, isOnline: boolean): Promise<void> {
    // TODO: Replace with real gRPC call
    await MockServices.driverStatus.setOnlineStatus(driverId, isOnline);
  }

  static async setOnline(isOnline: boolean): Promise<void> {
    // TODO: Replace with real gRPC call
    await MockServices.driverStatus.setOnline(isOnline);
  }
}
