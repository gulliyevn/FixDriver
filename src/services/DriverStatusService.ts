type Listener = (isOnline: boolean) => void;

class DriverStatusServiceImpl {
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
}

export const DriverStatusService = new DriverStatusServiceImpl();
export default DriverStatusService;


