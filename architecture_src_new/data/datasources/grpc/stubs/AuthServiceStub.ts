import { IAuthService } from '../types/IAuthService';
import { AuthResponse, RegisterData, User, UserRole } from '../../../../shared/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  USERS: '@AuthServiceStub:users',
  PASSWORDS: '@AuthServiceStub:passwords',
  CURRENT_USER: '@AuthServiceStub:currentUser',
  CURRENT_TOKEN: '@AuthServiceStub:currentToken',
};

// Mock data for testing
let MOCK_USERS: Record<string, User> = {};
let USER_PASSWORDS: Record<string, string> = {};

// Simulate network delay
const simulateNetworkDelay = (min: number = 300, max: number = 800): Promise<void> => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

export class AuthServiceStub implements IAuthService {
  private currentUser: User | null = null;
  private currentToken: string | null = null;
  private resetRequests: Record<string, { email: string; otp: string } > = {};
  private resetTokens: Record<string, { email: string }> = {};

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

      if (usersData) MOCK_USERS = JSON.parse(usersData);
      if (passwordsData) USER_PASSWORDS = JSON.parse(passwordsData);
      if (currentUserData) this.currentUser = JSON.parse(currentUserData);
      if (currentTokenData) this.currentToken = currentTokenData;
    } catch (error) {
      console.warn('Failed to load mock data from storage:', error);
    }
  }

  private async saveToStorage() {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS)],
        [STORAGE_KEYS.PASSWORDS, JSON.stringify(USER_PASSWORDS)],
        [STORAGE_KEYS.CURRENT_USER, this.currentUser ? JSON.stringify(this.currentUser) : ''],
        [STORAGE_KEYS.CURRENT_TOKEN, this.currentToken || ''],
      ]);
    } catch (error) {
      console.warn('Failed to save mock data to storage:', error);
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    await simulateNetworkDelay();

    console.log('Login attempt for:', email);
    console.log('Available users:', Object.keys(MOCK_USERS));
    console.log('Available passwords:', Object.keys(USER_PASSWORDS));

    // Validate against mock DB
    const user = Object.values(MOCK_USERS).find(u => u.email === email) || null;
    
    if (!user) {
      console.log('User not found in MOCK_USERS');
      throw new Error('auth.login.userNotFound');
    }
    
    const validPassword = USER_PASSWORDS[email];
    if (!validPassword || validPassword !== password) {
      console.log('Password mismatch. Expected:', validPassword, 'Got:', password);
      throw new Error('auth.login.invalidPassword');
    }

    console.log('Login successful for user:', user.email);
    const token = `mock-jwt-token-${Date.now()}`;
    
    this.currentUser = user;
    this.currentToken = token;
    await this.saveToStorage();

    return {
      token,
      userId: user.id,
      success: true,
      user,
    };
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    await simulateNetworkDelay();

    // Simulate new user creation
    const newUser: User = {
      id: `new-user-${Date.now()}`,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      role: userData.role,
      avatar: undefined,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profiles: {},
    };

    // Save mock password
    USER_PASSWORDS[userData.email] = userData.password;
    
    // Save user to mock users
    MOCK_USERS[newUser.id] = newUser;
    
    console.log('Registered user:', userData.email);
    console.log('MOCK_USERS now contains:', Object.keys(MOCK_USERS));
    console.log('USER_PASSWORDS now contains:', Object.keys(USER_PASSWORDS));
    
    await this.saveToStorage();

    const token = `mock-jwt-token-${Date.now()}`;
    
    this.currentUser = newUser;
    this.currentToken = token;
    await this.saveToStorage();

    return {
      token,
      userId: newUser.id,
      success: true,
      user: newUser,
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
      token: newToken,
      userId: this.currentUser.id,
      success: true,
      user: this.currentUser,
    };
  }

  async validateToken(token: string): Promise<boolean> {
    await simulateNetworkDelay();
    
    // Simulate token validation
    return token.startsWith('mock-jwt-token-');
  }

  async getCurrentUser(): Promise<User | null> {
    await simulateNetworkDelay();
    
    return this.currentUser;
  }

  async switchRole(role: UserRole): Promise<User> {
    await simulateNetworkDelay();

    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    // Update user role
    const updatedUser: User = {
      ...this.currentUser,
      role,
      updatedAt: new Date().toISOString(),
    };

    this.currentUser = updatedUser;
    await this.saveToStorage();
    return updatedUser;
  }

  async createProfile(role: UserRole, profileData: any): Promise<User> {
    await simulateNetworkDelay();

    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    // Create profile for specified role
    const updatedUser: User = {
      ...this.currentUser,
      profiles: {
        ...this.currentUser.profiles,
        [role]: {
          ...profileData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      updatedAt: new Date().toISOString(),
    };

    this.currentUser = updatedUser;
    await this.saveToStorage();
    return updatedUser;
  }

  async sendPasswordReset(email: string): Promise<{ success: boolean; requestId: string }> {
    await simulateNetworkDelay();
    const requestId = `reset-${Date.now()}`;
    const otp = String(Math.floor(1000 + Math.random() * 9000));
    this.resetRequests[requestId] = { email, otp };
    // Dev log to help test OTP flow
    console.log(`[AuthServiceStub] Password reset requested for ${email}. requestId=${requestId}, otp=${otp}`);
    return { success: true, requestId };
  }

  async verifyPasswordResetOtp(requestId: string, otp: string): Promise<{ success: boolean; token: string }> {
    await simulateNetworkDelay();
    const req = this.resetRequests[requestId];
    if (!req) throw new Error('Invalid request');
    if (req.otp !== otp) throw new Error('Invalid OTP');
    const token = `reset-token-${Date.now()}`;
    this.resetTokens[token] = { email: req.email };
    return { success: true, token };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean }> {
    await simulateNetworkDelay();
    const record = this.resetTokens[token];
    if (!record) throw new Error('Invalid reset token');
    // Update mock password by email
    USER_PASSWORDS[record.email] = newPassword;
    delete this.resetTokens[token];
    await this.saveToStorage();
    return { success: true };
  }
}
