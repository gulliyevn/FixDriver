import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserServiceStub } from '../datasources/grpc/stubs/UserServiceStub';
import { User, PaginationParams, PaginatedResponse } from '../../shared/types';

export class UserRepository implements IUserRepository {
  private userService: UserServiceStub;

  constructor() {
    this.userService = new UserServiceStub();
  }

  async getUser(id: string): Promise<User> {
    try {
      // Validate input
      if (!id || id.trim() === '') {
        throw new Error('User ID is required');
      }

      // Call service
      return await this.userService.getUser(id);
    } catch (error) {
      throw new Error(`Failed to get user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    try {
      // Validate input
      if (!id || id.trim() === '') {
        throw new Error('User ID is required');
      }

      // Validate user data
      const isValid = await this.validateUserData(data);
      if (!isValid) {
        throw new Error('Invalid user data');
      }

      // Call service
      return await this.userService.updateUser(id, data);
    } catch (error) {
      throw new Error(`Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      // Validate input
      if (!id || id.trim() === '') {
        throw new Error('User ID is required');
      }

      // Call service
      await this.userService.deleteUser(id);
    } catch (error) {
      throw new Error(`Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUsers(params?: PaginationParams): Promise<PaginatedResponse<User>> {
    try {
      // Validate pagination params
      if (params) {
        if (params.page && params.page < 1) {
          throw new Error('Page number must be greater than 0');
        }
        if (params.limit && (params.limit < 1 || params.limit > 100)) {
          throw new Error('Limit must be between 1 and 100');
        }
      }

      // Call service
      return await this.userService.getUsers(params);
    } catch (error) {
      throw new Error(`Failed to get users: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async searchUsers(query: string, params?: PaginationParams): Promise<PaginatedResponse<User>> {
    try {
      // Validate input
      if (!query || query.trim() === '') {
        throw new Error('Search query is required');
      }

      if (query.length < 2) {
        throw new Error('Search query must be at least 2 characters long');
      }

      // Validate pagination params
      if (params) {
        if (params.page && params.page < 1) {
          throw new Error('Page number must be greater than 0');
        }
        if (params.limit && (params.limit < 1 || params.limit > 100)) {
          throw new Error('Limit must be between 1 and 100');
        }
      }

      // Call service
      return await this.userService.searchUsers(query, params);
    } catch (error) {
      throw new Error(`Failed to search users: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateAvatar(id: string, avatarUrl: string): Promise<User> {
    try {
      // Validate input
      if (!id || id.trim() === '') {
        throw new Error('User ID is required');
      }

      if (!avatarUrl || avatarUrl.trim() === '') {
        throw new Error('Avatar URL is required');
      }

      // Validate URL format
      try {
        new URL(avatarUrl);
      } catch {
        throw new Error('Invalid avatar URL format');
      }

      // Call service
      return await this.userService.updateAvatar(id, avatarUrl);
    } catch (error) {
      throw new Error(`Failed to update avatar: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async verifyUser(id: string): Promise<User> {
    try {
      // Validate input
      if (!id || id.trim() === '') {
        throw new Error('User ID is required');
      }

      // Call service
      return await this.userService.verifyUser(id);
    } catch (error) {
      throw new Error(`Failed to verify user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async toggleUserStatus(id: string, isBlocked: boolean): Promise<User> {
    try {
      // Validate input
      if (!id || id.trim() === '') {
        throw new Error('User ID is required');
      }

      // Call service
      return await this.userService.toggleUserStatus(id, isBlocked);
    } catch (error) {
      throw new Error(`Failed to toggle user status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async isUserExists(email: string): Promise<boolean> {
    try {
      // Validate input
      if (!email || email.trim() === '') {
        return false;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return false;
      }

      // Try to search for user with this email
      const result = await this.userService.searchUsers(email, { limit: 1 });
      return result.data.some(user => user.email.toLowerCase() === email.toLowerCase());
    } catch (error) {
      // If search fails, assume user doesn't exist
      return false;
    }
  }

  async validateUserData(userData: Partial<User>): Promise<boolean> {
    try {
      // Validate email if provided
      if (userData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
          return false;
        }
      }

      // Validate first name if provided
      if (userData.firstName) {
        if (userData.firstName.trim().length < 2) {
          return false;
        }
      }

      // Validate last name if provided
      if (userData.lastName) {
        if (userData.lastName.trim().length < 2) {
          return false;
        }
      }

      // Validate phone if provided
      if (userData.phone) {
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        if (!phoneRegex.test(userData.phone)) {
          return false;
        }
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  // Helper methods
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const result = await this.searchUsers(email, { limit: 1 });
      const user = result.data.find(u => u.email.toLowerCase() === email.toLowerCase());
      return user || null;
    } catch (error) {
      return null;
    }
  }

  async getUsersByRole(role: string): Promise<User[]> {
    try {
      const result = await this.getUsers({ limit: 100 });
      return result.data.filter(user => user.role === role);
    } catch (error) {
      return [];
    }
  }
}
