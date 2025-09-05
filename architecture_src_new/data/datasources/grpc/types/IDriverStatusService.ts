/**
 * Driver Status Service Interface
 * Defines contract for driver online/offline status management
 */
export interface IDriverStatusService {
  /**
   * Set driver online status
   * @param driverId - Driver identifier
   * @param isOnline - Online status
   */
  setOnlineStatus(driverId: string, isOnline: boolean): Promise<void>;

  /**
   * Get current online status
   * @returns Current online status
   */
  getOnlineStatus(): boolean;

  /**
   * Get driver ID
   * @returns Current driver ID or null
   */
  getDriverId(): string | null;

  /**
   * Subscribe to status changes
   * @param listener - Callback function for status changes
   * @returns Unsubscribe function
   */
  subscribe(listener: (isOnline: boolean) => void): () => void;

  /**
   * Fetch driver status from server
   * @param driverId - Driver identifier
   * @returns Driver online status
   */
  fetchDriverStatus(driverId: string): Promise<boolean>;

  /**
   * Start online session
   * @param driverId - Driver identifier
   */
  startOnlineSession(driverId: string): Promise<void>;

  /**
   * End online session
   * @param driverId - Driver identifier
   */
  endOnlineSession(driverId: string): Promise<void>;

  /**
   * Toggle online status
   * @param driverId - Driver identifier
   * @returns New online status
   */
  toggleOnlineStatus(driverId: string): Promise<boolean>;

  /**
   * Clear all listeners
   */
  clearListeners(): void;
}
