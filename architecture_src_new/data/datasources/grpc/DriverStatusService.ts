import { IDriverStatusService } from './types/IDriverStatusService';
import MockServices from '../../../shared/mocks/MockServices';

/**
 * Driver Status Service
 * Manages driver online/offline status with gRPC integration
 */
export class DriverStatusService implements IDriverStatusService {
  private listeners: Set<(isOnline: boolean) => void> = new Set();
  private currentStatus: boolean = false;
  private driverId: string | null = null;

  /**
   * Set driver online status
   */
  async setOnlineStatus(driverId: string, isOnline: boolean): Promise<void> {
    try {
      // TODO: Replace with real gRPC call
      await MockServices.driverStatus.setOnlineStatus(driverId, isOnline);
      
      this.driverId = driverId;
      this.currentStatus = isOnline;
      
      // Notify all listeners
      this.notifyListeners(isOnline);
      
      console.log(`Driver ${driverId} status changed to: ${isOnline ? 'online' : 'offline'}`);
    } catch (error) {
      console.error('Error setting driver status:', error);
      throw error;
    }
  }

  /**
   * Get current online status
   */
  getOnlineStatus(): boolean {
    return this.currentStatus;
  }

  /**
   * Get driver ID
   */
  getDriverId(): string | null {
    return this.driverId;
  }

  /**
   * Subscribe to status changes
   */
  subscribe(listener: (isOnline: boolean) => void): () => void {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Get driver status from server
   */
  async fetchDriverStatus(driverId: string): Promise<boolean> {
    try {
      // TODO: Replace with real gRPC call
      const status = await MockServices.driverStatus.getOnlineStatus(driverId);
      
      this.driverId = driverId;
      this.currentStatus = status;
      
      return status;
    } catch (error) {
      console.error('Error fetching driver status:', error);
      throw error;
    }
  }

  /**
   * Start online session
   */
  async startOnlineSession(driverId: string): Promise<void> {
    await this.setOnlineStatus(driverId, true);
  }

  /**
   * End online session
   */
  async endOnlineSession(driverId: string): Promise<void> {
    await this.setOnlineStatus(driverId, false);
  }

  /**
   * Toggle online status
   */
  async toggleOnlineStatus(driverId: string): Promise<boolean> {
    const newStatus = !this.currentStatus;
    await this.setOnlineStatus(driverId, newStatus);
    return newStatus;
  }

  /**
   * Notify all listeners about status change
   */
  private notifyListeners(isOnline: boolean): void {
    this.listeners.forEach(listener => {
      try {
        listener(isOnline);
      } catch (error) {
        console.error('Error in status listener:', error);
      }
    });
  }

  /**
   * Clear all listeners (for cleanup)
   */
  clearListeners(): void {
    this.listeners.clear();
  }
}

// Export singleton instance
export const driverStatusService = new DriverStatusService();
export default driverStatusService;