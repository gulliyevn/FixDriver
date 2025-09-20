import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { AuthService } from '../datasources/grpc/AuthService';
import { storageService } from '../datasources/local/AsyncStorageService';
import { STORAGE_KEYS } from '../../shared/utils/storageKeys';
import { User, AuthResponse, LoginCredentials, RegisterData, UserRole } from '../../shared/types';

export class AuthRepository implements IAuthRepository {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(email: string, password: string, options?: { remember?: boolean }): Promise<AuthResponse> {
    try {
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Call service
      const response = await this.authService.login(email, password);
      
      // Store session data only if remember flag is true (default true)
      const shouldRemember = options?.remember ?? true;
      if (shouldRemember) {
        await storageService.setItem(STORAGE_KEYS.CURRENT_USER, response.user);
        await storageService.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      }

      return response;
    } catch (error) {
      // Pass through the original error message without adding prefix
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error');
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      // Validate input
      if (!userData.email || !userData.firstName || !userData.lastName) {
        throw new Error('Email, first name, and last name are required');
      }

      // Call service
      const response = await this.authService.register(userData);
      
      // Store session data in AsyncStorage
      await storageService.setItem(STORAGE_KEYS.CURRENT_USER, response.user);
      await storageService.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);

      return response;
    } catch (error) {
      throw new Error(`Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async logout(): Promise<void> {
    try {
      // Call service
      await this.authService.logout();
      
      // Clear session data from AsyncStorage
      await storageService.removeItem(STORAGE_KEYS.CURRENT_USER);
      await storageService.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      throw new Error(`Logout failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const currentToken = await storageService.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
      if (!currentToken) {
        throw new Error('No token to refresh');
      }

      // Call service
      const response = await this.authService.refreshToken();
      
      // Update session data in AsyncStorage
      await storageService.setItem(STORAGE_KEYS.CURRENT_USER, response.user);
      await storageService.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);

      return response;
    } catch (error) {
      throw new Error(`Token refresh failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      // Try to get from AsyncStorage first
      const cachedUser = await storageService.getItem<User>(STORAGE_KEYS.CURRENT_USER);
      if (cachedUser) {
        return cachedUser;
      }

      // Try to get from service
      const user = await this.authService.getCurrentUser();
      if (user) {
        await storageService.setItem(STORAGE_KEYS.CURRENT_USER, user);
      }
      return user;
    } catch (error) {
      // Clear invalid session
      await storageService.removeItem(STORAGE_KEYS.CURRENT_USER);
      await storageService.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      return null;
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      if (!token) {
        return false;
      }

      return await this.authService.validateToken(token);
    } catch (error) {
      return false;
    }
  }

  async switchRole(role: UserRole): Promise<User> {
    try {
      const currentUser = await storageService.getItem<User>(STORAGE_KEYS.CURRENT_USER);
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Call service
      const updatedUser = await this.authService.switchRole(role);
      
      // Update cached user in AsyncStorage
      await storageService.setItem(STORAGE_KEYS.CURRENT_USER, updatedUser);

      return updatedUser;
    } catch (error) {
      throw new Error(`Role switch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createProfile(role: UserRole, profileData: any): Promise<User> {
    try {
      const currentUser = await storageService.getItem<User>(STORAGE_KEYS.CURRENT_USER);
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Call service
      const updatedUser = await this.authService.createProfile(role, profileData);
      
      // Update cached user in AsyncStorage
      await storageService.setItem(STORAGE_KEYS.CURRENT_USER, updatedUser);

      return updatedUser;
    } catch (error) {
      throw new Error(`Profile creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async sendPasswordReset(email: string): Promise<{ requestId: string }> {
    try {
      const { requestId } = await this.authService.sendPasswordReset(email);
      return { requestId };
    } catch (error) {
      throw new Error(`Password reset request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async verifyPasswordResetOtp(requestId: string, otp: string): Promise<{ token: string }> {
    try {
      const { token } = await this.authService.verifyPasswordResetOtp(requestId, otp);
      return { token };
    } catch (error) {
      throw new Error(`OTP verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean }> {
    try {
      const result = await this.authService.resetPassword(token, newPassword);
      return result;
    } catch (error) {
      throw new Error(`Password reset failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const currentToken = await storageService.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
      if (!currentToken) {
        return false;
      }

      // Validate token
      const isValid = await this.validateToken(currentToken);
      if (!isValid) {
        // Clear invalid session
        await storageService.removeItem(STORAGE_KEYS.CURRENT_USER);
        await storageService.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  async clearSession(): Promise<void> {
    await storageService.removeItem(STORAGE_KEYS.CURRENT_USER);
    await storageService.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  // Helper methods
  async getCurrentToken(): Promise<string | null> {
    return await storageService.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
  }

  async setCurrentUser(user: User): Promise<void> {
    await storageService.setItem(STORAGE_KEYS.CURRENT_USER, user);
  }

  async setCurrentToken(token: string): Promise<void> {
    await storageService.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }
}
