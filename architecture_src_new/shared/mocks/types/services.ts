/**
 * 🔌 SERVICE TYPES FOR MOCK DATA
 */

export interface MockServiceInterface<T> {
  getById(id: string): Promise<T | null>;
  getAll(): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

export interface MockAuthServiceInterface {
  login(email: string, password: string): Promise<any>;
  register(userData: any): Promise<any>;
  logout(): Promise<void>;
  refreshToken(): Promise<any>;
}

export interface MockMapServiceInterface {
  getCurrentLocation(): Promise<any>;
  geocodeAddress(address: string): Promise<any>;
  buildRoute(from: any, to: any): Promise<any[]>;
  calculateDistance(from: any, to: any): Promise<number>;
}
