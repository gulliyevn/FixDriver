/**
 * 👥 USER SERVICE
 * 
 * Mock user service for development and testing.
 * Easy to replace with gRPC implementation.
 */

import MockData from '../MockData';
import { User } from '../types';

// Types for UserService
interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  birthDate: string;
}

export default class UserService {
  /**
   * Get user by ID
   */
  async getById(userId: string): Promise<User | null> {
    return MockData.users.find(user => user.id === userId) || null;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, profileData: ProfileFormData): Promise<User> {
    const user = MockData.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    user.name = profileData.firstName;
    user.surname = profileData.lastName;
    user.phone = profileData.phone;
    user.email = profileData.email;

    console.log('👤 Mock user profile updated:', user);
    return user;
  }

  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<void> {
    const userIndex = MockData.users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error('User not found');

    MockData.users.splice(userIndex, 1);
    console.log('🗑️ Mock user deleted:', userId);
  }

  /**
   * Get all users
   */
  async getAll(): Promise<User[]> {
    return MockData.users;
  }
}