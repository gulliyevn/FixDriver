/**
 * 🔐 MOCK AUTHENTICATION SERVICE
 * 
 * Mock implementation of authentication service.
 * Easy to replace with gRPC later.
 */

import { User, AuthResult } from '../types';
import MockData from '../MockData';

export class AuthService {
  async login(email: string, password: string): Promise<AuthResult> {
    const user = MockData.users.find(u => 
      u.email === email && u.password === password
    );
    
    if (user) {
      return {
        success: true,
        user,
        token: `mock_token_${user.id}_${Date.now()}`,
      };
    }
    
    throw new Error('Invalid credentials');
  }

  async register(userData: Partial<User>): Promise<AuthResult> {
    const newUser: User = {
      id: `user_${Date.now()}`,
      email: userData.email!,
      password: userData.password!,
      name: userData.name || 'New User',
      role: userData.role || 'client',
      phone: userData.phone || '',
      avatar: userData.avatar || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('🆕 Mock user registered:', newUser);

    return {
      success: true,
      user: newUser,
      token: `mock_token_${newUser.id}_${Date.now()}`,
    };
  }

  async logout(): Promise<void> {
    console.log('🚪 Mock user logged out');
  }

  async refreshToken(): Promise<AuthResult> {
    const currentUser = MockData.getCurrentUser();
    if (!currentUser) {
      throw new Error('No user logged in');
    }

    return {
      success: true,
      user: currentUser,
      token: `mock_token_${currentUser.id}_${Date.now()}`,
    };
  }
}

export default AuthService;
