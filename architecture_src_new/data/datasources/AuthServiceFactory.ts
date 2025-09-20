import { User } from '../types/user';
import { RegisterData } from '../types/auth';
import MockServices from '../mocks/MockServices';
import { AuthService } from '../../data/datasources/grpc/AuthService';

// 📋 Types
export interface AuthResult {
  success: boolean;
  user: User;
  token: string;
}

// 🔌 Service Interface for easy switching between Mock and gRPC
export interface IAuthService {
  login(email: string, password: string): Promise<AuthResult>;
  register(userData: RegisterData): Promise<AuthResult>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  refreshUser(id: string): Promise<User | null>;
}

// 🎭 Mock Implementation
export class MockAuthService implements IAuthService {
  async login(email: string, password: string): Promise<AuthResult> {
    const result = await MockServices.auth.login(email, password);
    return {
      success: result.success,
      user: result.user,
      token: result.token || '',
    };
  }
  
  async register(userData: RegisterData): Promise<AuthResult> {
    const result = await MockServices.auth.register(userData);
    return {
      success: result.success,
      user: result.user,
      token: result.token || '',
    };
  }
  
  async logout(): Promise<void> {
    return MockServices.auth.logout();
  }
  
  async getCurrentUser(): Promise<User | null> {
    return await MockServices.users.getCurrent();
  }
  
  async refreshUser(id: string): Promise<User | null> {
    return MockServices.users.getById(id);
  }
}

// 🔌 gRPC Implementation (with fallback to stub)
export class GRPCAuthService implements IAuthService {
  private grpcService: AuthService;

  constructor() {
    this.grpcService = new AuthService();
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const result = await this.grpcService.login(email, password);
    return {
      success: result.success,
      user: result.user,
      token: result.token,
    };
  }
  
  async register(userData: RegisterData): Promise<AuthResult> {
    const result = await this.grpcService.register(userData);
    return {
      success: result.success,
      user: result.user,
      token: result.token,
    };
  }
  
  async logout(): Promise<void> {
    return this.grpcService.logout();
  }
  
  async getCurrentUser(): Promise<User | null> {
    return this.grpcService.getCurrentUser();
  }
  
  async refreshUser(id: string): Promise<User | null> {
    // For now, get current user since refreshUser is not in the interface
    return this.grpcService.getCurrentUser();
  }

  // Get service status for debugging
  getServiceStatus() {
    return this.grpcService.getServiceStatus();
  }
}

// 🔄 Service Factory - easy to switch between Mock and gRPC
export class AuthServiceFactory {
  private static instance: IAuthService;
  
  static getService(): IAuthService {
    if (!this.instance) {
      // Use gRPC service by default (which falls back to stub)
      this.instance = new GRPCAuthService();
    }
    return this.instance;
  }
  
  static setService(service: IAuthService): void {
    this.instance = service;
  }
}
