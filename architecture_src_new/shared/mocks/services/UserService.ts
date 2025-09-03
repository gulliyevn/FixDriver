/**
 * 👥 MOCK USER SERVICE
 */

import { User } from '../types';
import MockData from '../MockData';

export class UserService {
  async getById(id: string): Promise<User | null> {
    return MockData.getUserById(id) || null;
  }

  async getCurrent(): Promise<User | null> {
    return MockData.getCurrentUser();
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    const user = MockData.getUserById(id);
    if (!user) throw new Error('User not found');
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    console.log('✏️ Mock user updated:', updatedUser);
    
    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    console.log('🗑️ Mock user deleted:', id);
  }
}

export default UserService;
