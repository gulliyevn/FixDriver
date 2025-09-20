import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserService } from '../datasources/grpc/UserService';
import { User, PaginationParams, PaginatedResponse } from '../../shared/types';
import { validateUserId, validateSearchQuery, validateAvatarUrl, validateUserData, validatePaginationParams, isValidEmailFormat } from '../../shared/utils/userValidators';

export class UserRepository implements IUserRepository {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getUser(id: string): Promise<User> {
    try {
      validateUserId(id);
      return await this.userService.getUser(id);
    } catch (error) {
      throw new Error(`Failed to get user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    try {
      validateUserId(id);
      validateUserData(data);
      return await this.userService.updateUser(id, data);
    } catch (error) {
      throw new Error(`Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      validateUserId(id);
      await this.userService.deleteUser(id);
    } catch (error) {
      throw new Error(`Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUsers(params?: PaginationParams): Promise<PaginatedResponse<User>> {
    try {
      if (params) validatePaginationParams(params);
      return await this.userService.getUsers(params);
    } catch (error) {
      throw new Error(`Failed to get users: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async searchUsers(query: string, params?: PaginationParams): Promise<PaginatedResponse<User>> {
    try {
      validateSearchQuery(query);
      if (params) validatePaginationParams(params);
      return await this.userService.searchUsers(query, params);
    } catch (error) {
      throw new Error(`Failed to search users: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateAvatar(id: string, avatarUrl: string): Promise<User> {
    try {
      validateUserId(id);
      validateAvatarUrl(avatarUrl);
      return await this.userService.updateAvatar(id, avatarUrl);
    } catch (error) {
      throw new Error(`Failed to update avatar: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async verifyUser(id: string): Promise<User> {
    try {
      validateUserId(id);
      return await this.userService.verifyUser(id);
    } catch (error) {
      throw new Error(`Failed to verify user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async toggleUserStatus(id: string, isBlocked: boolean): Promise<User> {
    try {
      validateUserId(id);
      return await this.userService.toggleUserStatus(id, isBlocked);
    } catch (error) {
      throw new Error(`Failed to toggle user status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async isUserExists(email: string): Promise<boolean> {
    try {
      if (!isValidEmailFormat(email)) {
        return false;
      }

      const result = await this.userService.searchUsers(email, { limit: 1 });
      return result.data.some(user => user.email.toLowerCase() === email.toLowerCase());
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
