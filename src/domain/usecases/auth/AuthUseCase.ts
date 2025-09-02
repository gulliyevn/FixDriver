import { IAuthRepository } from '../../repositories/IAuthRepository';
import { User, AuthResponse, LoginCredentials, RegisterData, UserRole } from '../../../shared/types';

export class AuthUseCase {
  private authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Attempt login
      const response = await this.authRepository.login(email, password);
      
      // Store user session
      if (response.user) {
        await this.authRepository.setCurrentUser(response.user);
      }
      if (response.token) {
        await this.authRepository.setCurrentToken(response.token);
      }

      return response;
    } catch (error) {
      throw new Error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      // Validate input
      if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
        throw new Error('All required fields must be provided');
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        throw new Error('Invalid email format');
      }

      // Validate password strength
      if (userData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      // Validate names
      if (userData.firstName.length < 2) {
        throw new Error('First name must be at least 2 characters long');
      }
      if (userData.lastName.length < 2) {
        throw new Error('Last name must be at least 2 characters long');
      }

      // Attempt registration
      const response = await this.authRepository.register(userData);
      
      // Store user session
      if (response.user) {
        await this.authRepository.setCurrentUser(response.user);
      }
      if (response.token) {
        await this.authRepository.setCurrentToken(response.token);
      }

      return response;
    } catch (error) {
      throw new Error(`Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async logout(): Promise<void> {
    try {
      // Clear session
      await this.authRepository.logout();
      await this.authRepository.clearSession();
    } catch (error) {
      throw new Error(`Logout failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const currentToken = await this.authRepository.getCurrentToken();
      if (!currentToken) {
        throw new Error('No token to refresh');
      }

      const response = await this.authRepository.refreshToken();
      
      // Update session
      if (response.user) {
        this.authRepository.setCurrentUser(response.user);
      }
      if (response.token) {
        this.authRepository.setCurrentToken(response.token);
      }

      return response;
    } catch (error) {
      throw new Error(`Token refresh failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      return await this.authRepository.getCurrentUser();
    } catch (error) {
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      return await this.authRepository.isAuthenticated();
    } catch (error) {
      return false;
    }
  }

  async switchRole(role: UserRole): Promise<User> {
    try {
      // Validate role
      const validRoles: UserRole[] = ['client', 'driver', 'admin'];
      if (!validRoles.includes(role)) {
        throw new Error('Invalid role');
      }

      // Get current user
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Check if user has this role
      if (!currentUser.profiles[role]) {
        throw new Error(`User does not have ${role} profile`);
      }

      // Switch role
      const updatedUser = await this.authRepository.switchRole(role);
      
      // Update session
      this.authRepository.setCurrentUser(updatedUser);

      return updatedUser;
    } catch (error) {
      throw new Error(`Role switch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createProfile(role: UserRole, profileData: any): Promise<User> {
    try {
      // Validate role
      const validRoles: UserRole[] = ['client', 'driver', 'admin'];
      if (!validRoles.includes(role)) {
        throw new Error('Invalid role');
      }

      // Get current user
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Check if profile already exists
      if (currentUser.profiles[role]) {
        throw new Error(`${role} profile already exists`);
      }

      // Create profile
      const updatedUser = await this.authRepository.createProfile(role, profileData);
      
      // Update session
      this.authRepository.setCurrentUser(updatedUser);

      return updatedUser;
    } catch (error) {
      throw new Error(`Profile creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Helper methods
  async validateToken(token: string): Promise<boolean> {
    try {
      return await this.authRepository.validateToken(token);
    } catch (error) {
      return false;
    }
  }

  async getCurrentToken(): Promise<string | null> {
    return await this.authRepository.getCurrentToken();
  }

  async hasRole(role: UserRole): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return user ? !!user.profiles[role] : false;
    } catch (error) {
      return false;
    }
  }
}
