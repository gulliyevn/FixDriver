type Listener = (isOnline: boolean) => void;

export interface IDriverStatusService {
  setOnline(isOnline: boolean): void;
  getOnline(): boolean;
  subscribe(cb: Listener): () => void;
  syncWithBackend(): Promise<boolean>;
}

class DriverStatusServiceImpl implements IDriverStatusService {
  private listeners: Set<Listener> = new Set();
  private current: boolean = false;

  setOnline(isOnline: boolean) {
    this.current = isOnline;
    for (const cb of this.listeners) {
      try { cb(isOnline); } catch {}
    }
  }

  getOnline(): boolean {
    return this.current;
  }

  subscribe(cb: Listener) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  async syncWithBackend(): Promise<boolean> {
    // TODO: Implement gRPC call to sync driver status with backend
    try {
      // Mock implementation - replace with actual gRPC call
      console.log('Syncing driver status with backend...');
      return true;
    } catch (error) {
      console.error('Failed to sync driver status:', error);
      return false;
    }
  }
}

export const DriverStatusService = new DriverStatusServiceImpl();
export default DriverStatusService;


