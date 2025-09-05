import { IUserRepository } from '../../repositories/IUserRepository';
import { User, PaginationParams, PaginatedResponse } from '../../../shared/types';
import { validateUserId, validateSearchQuery, validateAvatarUrl, validateUserData, validatePaginationParams } from '../../../shared/utils/userValidators';

export class ProfileUseCase {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async getUser(id: string): Promise<User> {
    try {
      validateUserId(id);
      return await this.userRepository.getUser(id);
    } catch (error) {
      throw new Error(`Failed to get user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    try {
      validateUserId(id);
      validateUserData(data);

      // Check if email is being changed
      if (data.email) {
        const existingUser = await this.userRepository.getUserByEmail(data.email);
        if (existingUser && existingUser.id !== id) {
          throw new Error('Email already exists');
        }
      }

      return await this.userRepository.updateUser(id, data);
    } catch (error) {
      throw new Error(`Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateAvatar(id: string, avatarUrl: string): Promise<User> {
    try {
      validateUserId(id);
      validateAvatarUrl(avatarUrl);
      return await this.userRepository.updateAvatar(id, avatarUrl);
    } catch (error) {
      throw new Error(`Failed to update avatar: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async verifyUser(id: string): Promise<User> {
    try {
      validateUserId(id);
      return await this.userRepository.verifyUser(id);
    } catch (error) {
      throw new Error(`Failed to verify user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async searchUsers(query: string, params?: PaginationParams): Promise<PaginatedResponse<User>> {
    try {
      validateSearchQuery(query);
      return await this.userRepository.searchUsers(query, params);
    } catch (error) {
      throw new Error(`Failed to search users: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUsers(params?: PaginationParams): Promise<PaginatedResponse<User>> {
    try {
      if (params) {
        validatePaginationParams(params);
      }
      return await this.userRepository.getUsers(params);
    } catch (error) {
      throw new Error(`Failed to get users: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async toggleUserStatus(id: string, isBlocked: boolean): Promise<User> {
    try {
      validateUserId(id);
      return await this.userRepository.toggleUserStatus(id, isBlocked);
    } catch (error) {
      throw new Error(`Failed to toggle user status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      validateUserId(id);
      await this.userRepository.deleteUser(id);
    } catch (error) {
      throw new Error(`Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Helper methods
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.getUserByEmail(email);
    } catch (error) {
      return null;
    }
  }

  async getUsersByRole(role: string): Promise<User[]> {
    try {
      return await this.userRepository.getUsersByRole(role);
    } catch (error) {
      return [];
    }
  }

  async isUserExists(email: string): Promise<boolean> {
    try {
      return await this.userRepository.isUserExists(email);
    } catch (error) {
      return false;
    }
  }


  // Profile-specific methods
  async updateProfile(id: string, profileData: Partial<User>): Promise<User> {
    try {
      // Remove sensitive fields that shouldn't be updated via profile
      const { id: userId, email, role, profiles, ...safeData } = profileData;
      
      return await this.updateUser(id, safeData);
    } catch (error) {
      throw new Error(`Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updatePersonalInfo(id: string, firstName: string, lastName: string, phone?: string): Promise<User> {
    try {
      const updateData: Partial<User> = {
        firstName,
        lastName
      };

      if (phone) {
        updateData.phone = phone;
      }

      return await this.updateUser(id, updateData);
    } catch (error) {
      throw new Error(`Failed to update personal info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateContactInfo(id: string, email: string, phone?: string): Promise<User> {
    try {
      const updateData: Partial<User> = {
        email
      };

      if (phone) {
        updateData.phone = phone;
      }

      return await this.updateUser(id, updateData);
    } catch (error) {
      throw new Error(`Failed to update contact info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
