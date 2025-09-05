import { IUserService } from '../types/IUserService';
import { User, PaginationParams, PaginatedResponse } from '../../../../shared/types';
import MockData from '../../../../shared/mocks/MockData';

// Simulate network delay
const simulateNetworkDelay = (min: number = 200, max: number = 600): Promise<void> => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

export class UserServiceStub implements IUserService {
  private users = new Map<string, User>();

  constructor() {
    // Initialize with users from centralized MockData
    MockData.users.forEach(user => {
      this.users.set(user.id, user);
    });
  }

  async getUser(id: string): Promise<User> {
    await simulateNetworkDelay();

    const user = this.users.get(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    await simulateNetworkDelay();

    const user = this.users.get(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    const updatedUser: User = {
      ...user,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // Update in local map
    this.users.set(id, updatedUser);

    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    await simulateNetworkDelay();

    const user = this.users.get(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    this.users.delete(id);
  }

  async getUsers(params?: PaginationParams): Promise<PaginatedResponse<User>> {
    await simulateNetworkDelay();

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const offset = params?.offset || (page - 1) * limit;

    const allUsers = Array.from(this.users.values());
    const total = allUsers.length;
    const data = allUsers.slice(offset, offset + limit);
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async searchUsers(query: string, params?: PaginationParams): Promise<PaginatedResponse<User>> {
    await simulateNetworkDelay();

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const offset = params?.offset || (page - 1) * limit;

    const allUsers = Array.from(this.users.values());
    const filteredUsers = allUsers.filter(user =>
      user.firstName.toLowerCase().includes(query.toLowerCase()) ||
      user.lastName.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    );

    const total = filteredUsers.length;
    const data = filteredUsers.slice(offset, offset + limit);
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async updateAvatar(id: string, avatarUrl: string): Promise<User> {
    await simulateNetworkDelay();

    const user = this.users.get(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    const updatedUser: User = {
      ...user,
      avatar: avatarUrl,
      updatedAt: new Date().toISOString(),
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async verifyUser(id: string): Promise<User> {
    await simulateNetworkDelay();

    const user = this.users.get(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    const updatedUser: User = {
      ...user,
      isVerified: true,
      updatedAt: new Date().toISOString(),
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async toggleUserStatus(id: string, isBlocked: boolean): Promise<User> {
    await simulateNetworkDelay();

    const user = this.users.get(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    const updatedUser: User = {
      ...user,
      updatedAt: new Date().toISOString(),
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Additional methods required by IUserService interface
  async createUser(userData: any): Promise<User> {
    await simulateNetworkDelay();
    throw new Error('createUser not implemented in stub');
  }

  async getUserById(id: string): Promise<User | null> {
    await simulateNetworkDelay();
    return this.users.get(id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    await simulateNetworkDelay();
    const user = Array.from(this.users.values()).find(u => u.email === email);
    return user || null;
  }

  async getClientProfile(userId: string): Promise<any> {
    await simulateNetworkDelay();
    throw new Error('getClientProfile not implemented in stub');
  }

  async getDriverProfile(userId: string): Promise<any> {
    await simulateNetworkDelay();
    throw new Error('getDriverProfile not implemented in stub');
  }

  async getAdminProfile(userId: string): Promise<any> {
    await simulateNetworkDelay();
    throw new Error('getAdminProfile not implemented in stub');
  }

  async updateClientProfile(userId: string, updates: any): Promise<any> {
    await simulateNetworkDelay();
    throw new Error('updateClientProfile not implemented in stub');
  }

  async updateDriverProfile(userId: string, updates: any): Promise<any> {
    await simulateNetworkDelay();
    throw new Error('updateDriverProfile not implemented in stub');
  }

  async updateAdminProfile(userId: string, updates: any): Promise<any> {
    await simulateNetworkDelay();
    throw new Error('updateAdminProfile not implemented in stub');
  }

  async switchUserRole(userId: string, newRole: any): Promise<User> {
    await simulateNetworkDelay();
    throw new Error('switchUserRole not implemented in stub');
  }

  async addUserRole(userId: string, role: any): Promise<User> {
    await simulateNetworkDelay();
    throw new Error('addUserRole not implemented in stub');
  }

  async removeUserRole(userId: string, role: any): Promise<User> {
    await simulateNetworkDelay();
    throw new Error('removeUserRole not implemented in stub');
  }

  async getUserRoles(userId: string): Promise<any[]> {
    await simulateNetworkDelay();
    throw new Error('getUserRoles not implemented in stub');
  }

  async getUsersByRole(role: any, filters?: any): Promise<User[]> {
    await simulateNetworkDelay();
    throw new Error('getUsersByRole not implemented in stub');
  }

  async getOnlineDrivers(location?: any, radius?: number): Promise<any[]> {
    await simulateNetworkDelay();
    throw new Error('getOnlineDrivers not implemented in stub');
  }

  async getUserStats(userId: string): Promise<any> {
    await simulateNetworkDelay();
    throw new Error('getUserStats not implemented in stub');
  }

  async getSystemStats(): Promise<any> {
    await simulateNetworkDelay();
    throw new Error('getSystemStats not implemented in stub');
  }
}
