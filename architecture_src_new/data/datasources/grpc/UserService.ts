import { IUserService, CreateUserData, UserFilters, UserStats, SystemStats } from './types/IUserService';
import { UserServiceStub } from './stubs/UserServiceStub';
import { 
  User, 
  UserRole, 
  ClientProfile, 
  DriverProfile, 
  AdminProfile,
  Location,
  UserWithClientProfile,
  UserWithDriverProfile,
  UserWithAdminProfile,
  PaginationParams, 
  PaginatedResponse 
} from '../../../shared/types';

/**
 * gRPC UserService
 *
 * This service will eventually connect to real gRPC backend.
 * For now, it uses UserServiceStub for development/testing.
 */
export class UserService implements IUserService {
  private stub: UserServiceStub;
  private isGRPCReady: boolean = false;

  constructor() {
    this.stub = new UserServiceStub();
    this.checkGRPCConnection();
  }

  /**
   * Check if gRPC connection is available
   */
  private async checkGRPCConnection(): Promise<void> {
    try {
      // For now, always use stub
      this.isGRPCReady = false;
    } catch (error) {
      console.warn('gRPC connection not available, using stub:', error);
      this.isGRPCReady = false;
    }
  }

  // Basic CRUD operations
  async createUser(userData: CreateUserData): Promise<User> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.createUser(userData);
      }
    } catch (error) {
      console.error('UserService createUser error:', error);
      throw error;
    }
  }

  async getUser(id: string): Promise<User> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.getUser(id);
      }
    } catch (error) {
      console.error('UserService getUser error:', error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.getUserById(id);
      }
    } catch (error) {
      console.error('UserService getUserById error:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.getUserByEmail(email);
      }
    } catch (error) {
      console.error('UserService getUserByEmail error:', error);
      throw error;
    }
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.updateUser(id, data);
      }
    } catch (error) {
      console.error('UserService updateUser error:', error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.deleteUser(id);
      }
    } catch (error) {
      console.error('UserService deleteUser error:', error);
      throw error;
    }
  }

  // Profile management
  async getClientProfile(userId: string): Promise<ClientProfile | null> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.getClientProfile(userId);
      }
    } catch (error) {
      console.error('UserService getClientProfile error:', error);
      throw error;
    }
  }

  async getDriverProfile(userId: string): Promise<DriverProfile | null> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.getDriverProfile(userId);
      }
    } catch (error) {
      console.error('UserService getDriverProfile error:', error);
      throw error;
    }
  }

  async getAdminProfile(userId: string): Promise<AdminProfile | null> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.getAdminProfile(userId);
      }
    } catch (error) {
      console.error('UserService getAdminProfile error:', error);
      throw error;
    }
  }

  async updateClientProfile(userId: string, updates: Partial<ClientProfile>): Promise<ClientProfile> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.updateClientProfile(userId, updates);
      }
    } catch (error) {
      console.error('UserService updateClientProfile error:', error);
      throw error;
    }
  }

  async updateDriverProfile(userId: string, updates: Partial<DriverProfile>): Promise<DriverProfile> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.updateDriverProfile(userId, updates);
      }
    } catch (error) {
      console.error('UserService updateDriverProfile error:', error);
      throw error;
    }
  }

  async updateAdminProfile(userId: string, updates: Partial<AdminProfile>): Promise<AdminProfile> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.updateAdminProfile(userId, updates);
      }
    } catch (error) {
      console.error('UserService updateAdminProfile error:', error);
      throw error;
    }
  }

  // Role management
  async switchUserRole(userId: string, newRole: UserRole): Promise<User> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.switchUserRole(userId, newRole);
      }
    } catch (error) {
      console.error('UserService switchUserRole error:', error);
      throw error;
    }
  }

  async addUserRole(userId: string, role: UserRole): Promise<User> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.addUserRole(userId, role);
      }
    } catch (error) {
      console.error('UserService addUserRole error:', error);
      throw error;
    }
  }

  async removeUserRole(userId: string, role: UserRole): Promise<User> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.removeUserRole(userId, role);
      }
    } catch (error) {
      console.error('UserService removeUserRole error:', error);
      throw error;
    }
  }

  async getUserRoles(userId: string): Promise<UserRole[]> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.getUserRoles(userId);
      }
    } catch (error) {
      console.error('UserService getUserRoles error:', error);
      throw error;
    }
  }

  // Search and filtering
  async getUsers(params?: PaginationParams): Promise<PaginatedResponse<User>> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.getUsers(params);
      }
    } catch (error) {
      console.error('UserService getUsers error:', error);
      throw error;
    }
  }

  async searchUsers(query: string, params?: PaginationParams): Promise<PaginatedResponse<User>> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.searchUsers(query, params);
      }
    } catch (error) {
      console.error('UserService searchUsers error:', error);
      throw error;
    }
  }

  async getUsersByRole(role: UserRole, filters?: UserFilters): Promise<User[]> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.getUsersByRole(role, filters);
      }
    } catch (error) {
      console.error('UserService getUsersByRole error:', error);
      throw error;
    }
  }

  async getOnlineDrivers(location?: Location, radius?: number): Promise<UserWithDriverProfile[]> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.getOnlineDrivers(location, radius);
      }
    } catch (error) {
      console.error('UserService getOnlineDrivers error:', error);
      throw error;
    }
  }

  // Avatar and verification
  async updateAvatar(id: string, avatarUrl: string): Promise<User> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.updateAvatar(id, avatarUrl);
      }
    } catch (error) {
      console.error('UserService updateAvatar error:', error);
      throw error;
    }
  }

  async verifyUser(id: string): Promise<User> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.verifyUser(id);
      }
    } catch (error) {
      console.error('UserService verifyUser error:', error);
      throw error;
    }
  }

  async toggleUserStatus(id: string, isBlocked: boolean): Promise<User> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.toggleUserStatus(id, isBlocked);
      }
    } catch (error) {
      console.error('UserService toggleUserStatus error:', error);
      throw error;
    }
  }

  // Statistics
  async getUserStats(userId: string): Promise<UserStats> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.getUserStats(userId);
      }
    } catch (error) {
      console.error('UserService getUserStats error:', error);
      throw error;
    }
  }

  async getSystemStats(): Promise<SystemStats> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.getSystemStats();
      }
    } catch (error) {
      console.error('UserService getSystemStats error:', error);
      throw error;
    }
  }
}
