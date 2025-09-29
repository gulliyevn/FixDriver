import { IAuthService } from '../types/IAuthService';
import { AuthResponse, RegisterData, User } from '../../../../shared/types';
import { UserRole } from '../../../../shared/types/common';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  USERS: '@AuthServiceStub:users',
  PASSWORDS: '@AuthServiceStub:passwords',
  CURRENT_USER: '@AuthServiceStub:currentUser',
  CURRENT_TOKEN: '@AuthServiceStub:currentToken',
};

// Simulate network delay
const simulateNetworkDelay = (min: number = 300, max: number = 800): Promise<void> => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

export class AuthServiceStub implements IAuthService {
  private currentUser: User | null = null;
  private currentToken: string | null = null;
  
  // Статические данные для сохранения между экземплярами
  private static resetRequests: Record<string, { email: string; otp: string }> = {};
  private static resetTokens: Record<string, { email: string }> = {};
  private static userPasswords: Record<string, string> = {};
  
  private mockUsers: Record<string, User> = {};

  constructor() {
    this.initializeStorage();
  }

  private async initializeStorage() {
    try {
      // Load users and passwords from AsyncStorage
      const usersData = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      const passwordsData = await AsyncStorage.getItem(STORAGE_KEYS.PASSWORDS);
      const currentUserData = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      const currentTokenData = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_TOKEN);

      if (usersData) this.mockUsers = JSON.parse(usersData);
      if (passwordsData) AuthServiceStub.userPasswords = JSON.parse(passwordsData);
      if (currentUserData) this.currentUser = JSON.parse(currentUserData);
      if (currentTokenData) this.currentToken = currentTokenData;
    } catch (error) {
      console.warn('Failed to load mock data from storage:', error);
    }
  }

  private async saveToStorage() {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.USERS, JSON.stringify(this.mockUsers)],
        [STORAGE_KEYS.PASSWORDS, JSON.stringify(AuthServiceStub.userPasswords)],
        [STORAGE_KEYS.CURRENT_USER, this.currentUser ? JSON.stringify(this.currentUser) : ''],
        [STORAGE_KEYS.CURRENT_TOKEN, this.currentToken || ''],
      ]);
    } catch (error) {
      console.warn('Failed to save mock data to storage:', error);
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    await simulateNetworkDelay();

    // Validate against mock DB
    const user = Object.values(this.mockUsers).find(u => u.email === email) || null;
    
    if (!user) {
      throw new Error('auth.login.userNotFound');
    }
    
    const validPassword = AuthServiceStub.userPasswords[email];
    if (!validPassword || validPassword !== password) {
      throw new Error('auth.login.invalidPassword');
    }

    const token = `mock-jwt-token-${Date.now()}`;
    
    this.currentUser = user;
    this.currentToken = token;
    await this.saveToStorage();

    return {
      user,
      token,
      refreshToken: `mock-refresh-${Date.now()}`,
    };
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    await simulateNetworkDelay();

    // Simulate new user creation
    const newUser: User = {
      id: `new-user-${Date.now()}`,
      email: userData.email,
      name: userData.firstName,
      surname: userData.lastName,
      phone: userData.phone || '',
      role: userData.role as UserRole,
      avatar: null,
      rating: 5,
      createdAt: new Date().toISOString(),
      address: '',
      birthDate: undefined,
    };

    // Save mock password
    AuthServiceStub.userPasswords[userData.email] = userData.password;
    
    // Save user to mock users
    this.mockUsers[newUser.id] = newUser;
    
    await this.saveToStorage();

    const token = `mock-jwt-token-${Date.now()}`;
    
    this.currentUser = newUser;
    this.currentToken = token;
    await this.saveToStorage();

    return {
      user: newUser,
      token,
      refreshToken: `mock-refresh-${Date.now()}`,
    };
  }

  async logout(): Promise<void> {
    await simulateNetworkDelay();
    
    this.currentUser = null;
    this.currentToken = null;
    await this.saveToStorage();
  }

  async refreshToken(): Promise<AuthResponse> {
    await simulateNetworkDelay();

    if (!this.currentUser || !this.currentToken) {
      throw new Error('User not authenticated');
    }

    const newToken = `mock-jwt-token-${Date.now()}`;
    this.currentToken = newToken;
    await this.saveToStorage();

    return {
      user: this.currentUser,
      token: newToken,
      refreshToken: `mock-refresh-${Date.now()}`,
    };
  }

  async validateToken(token: string): Promise<boolean> {
    await simulateNetworkDelay();
    
    // Simulate token validation
    return token.startsWith('mock-jwt-token-');
  }

  async getCurrentUser(): Promise<User | null> {
    await simulateNetworkDelay();
    // Ensure we hydrate from storage if memory is empty (e.g., after app reload)
    try {
      if (!this.currentUser) {
        const currentUserData = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        if (currentUserData) {
          this.currentUser = JSON.parse(currentUserData);
          console.log('👤 AuthServiceStub user from AsyncStorage:', {
            id: this.currentUser?.id,
            name: this.currentUser?.name,
            surname: this.currentUser?.surname,
            email: this.currentUser?.email
          });
          
          // Add user to MockData.users for ProfileContext to find it
          const MockData = require('../../../../shared/mocks/MockData').default;
          MockData.addUser(this.currentUser);
        }
      }
      if (!this.currentToken) {
        const currentTokenData = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_TOKEN);
        if (currentTokenData) {
          this.currentToken = currentTokenData || null;
        }
      }
    } catch (error) {
      // ignore storage errors here
    }
    return this.currentUser;
  }

  async switchRole(role: UserRole): Promise<User> {
    await simulateNetworkDelay();

    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    // Update user role
    const updatedUser: User = { ...this.currentUser, role } as User;

    this.currentUser = updatedUser;
    await this.saveToStorage();
    return updatedUser;
  }

  async createProfile(role: UserRole, profileData: any): Promise<User> {
    await simulateNetworkDelay();

    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    // Profiles are not part of User type in this app model; no-op for stub
    await this.saveToStorage();
    return this.currentUser;
  }

  async sendPasswordReset(email: string): Promise<{ success: boolean; requestId: string }> {
    await simulateNetworkDelay();
    const requestId = `reset-${Date.now()}`;
    const otp = String(Math.floor(1000 + Math.random() * 9000));
    AuthServiceStub.resetRequests[requestId] = { email, otp };
    
    // 🔐 ВРЕМЕННЫЙ OTP КОД ДЛЯ РАЗРАБОТКИ
    console.log('================================');
    console.log('📧 PASSWORD RESET OTP SENT');
    console.log('📧 Email:', email);
    console.log('🔐 OTP Code:', otp);
    console.log('🆔 Request ID:', requestId);
    console.log('⏰ Valid for 10 minutes');
    console.log('================================');
    
    return { success: true, requestId };
  }

  async verifyPasswordResetOtp(requestId: string, otp: string): Promise<{ success: boolean; token: string }> {
    await simulateNetworkDelay();
    const req = AuthServiceStub.resetRequests[requestId];
    
    console.log('🔍 OTP VERIFICATION ATTEMPT');
    console.log('🆔 Request ID:', requestId);
    console.log('🔐 Entered OTP:', otp);
    console.log('✅ Expected OTP:', req?.otp);
    
    if (!req) {
      console.log('❌ Invalid request ID');
      throw new Error('Invalid request');
    }
    if (req.otp !== otp) {
      console.log('❌ OTP mismatch');
      throw new Error('Invalid OTP');
    }
    
    const token = `reset-token-${Date.now()}`;
    AuthServiceStub.resetTokens[token] = { email: req.email };
    delete AuthServiceStub.resetRequests[requestId];
    
    console.log('✅ OTP VERIFIED SUCCESSFULLY');
    console.log('🎫 Reset Token:', token);
    console.log('📧 Email:', req.email);
    
    return { success: true, token };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean }> {
    await simulateNetworkDelay();
    const record = AuthServiceStub.resetTokens[token];
    if (!record) throw new Error('Invalid reset token');
    // Update mock password by email
    AuthServiceStub.userPasswords[record.email] = newPassword;
    
    console.log('🔑 PASSWORD RESET COMPLETED');
    console.log('📧 Email:', record.email);
    console.log('🔐 New password saved:', newPassword);
    console.log('✅ You can now login with the new password');
    delete AuthServiceStub.resetTokens[token];
    await this.saveToStorage();
    return { success: true };
  }
}
