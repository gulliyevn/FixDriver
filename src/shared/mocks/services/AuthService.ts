/**
 * 🔐 AUTHENTICATION SERVICE
 * 
 * Mock authentication service for development and testing.
 * Easy to replace with gRPC implementation.
 */

import MockData from '../MockData';
import { User } from '../types';

// Types for AuthService
interface AuthResult {
  success: boolean;
  user: User;
  token: string;
}

export default class AuthService {
  /**
   * Mock login - in real app this would be gRPC call
   */
  async login(email: string, password: string): Promise<AuthResult> {
    const user = MockData.users.find(u => u.email === email);
    
    if (user && password === 'password123') {
      return {
        success: true,
        user,
        token: `mock_token_${user.id}_${Date.now()}`,
      };
    }
    
    throw new Error('Invalid credentials');
  }

  /**
   * Mock registration - in real app this would be gRPC call
   */
  async register(userData: any): Promise<AuthResult> {
    const newUser: User = {
      id: `user_${Date.now()}`,
      email: userData.email,
      name: userData.firstName,
      surname: userData.lastName,
      phone: userData.phone || '',
      role: userData.role,
      avatar: '',
      rating: 0,
      createdAt: new Date().toISOString(),
      address: '',
    };

    MockData.users.push(newUser);
    console.log('🆕 Mock user registered:', newUser);

    return {
      success: true,
      user: newUser,
      token: `mock_token_${newUser.id}_${Date.now()}`,
    };
  }

  /**
   * Mock logout - in real app this would clear gRPC session
   */
  async logout(): Promise<void> {
    console.log('🚪 Mock user logged out');
  }
}