import { IAuthRepository } from '../../repositories/IAuthRepository';
import { User, AuthResponse, LoginCredentials, RegisterData, UserRole } from '../../../shared/types';
import { Validators } from '../../../shared/utils/validators';
import { VALID_ROLES, isValidRole } from '../../../shared/constants/roles';

export class AuthUseCase {
  private authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const validation = Validators.validateLogin({ email, password });
      if (!validation.isValid) {
        throw new Error(validation.errors[0]);
      }

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
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error');
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const validation = Validators.validateRegistration({
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        phone: userData.phone || '',
        password: userData.password,
        confirmPassword: userData.password
      });
      if (!validation.isValid) {
        throw new Error(validation.errors[0]);
      }

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
        await this.authRepository.setCurrentUser(response.user);
      }
      if (response.token) {
        await this.authRepository.setCurrentToken(response.token);
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
      if (!isValidRole(role)) {
        throw new Error('Invalid role');
      }

      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      if (!currentUser.profiles[role]) {
        throw new Error(`User does not have ${role} profile`);
      }

      const updatedUser = await this.authRepository.switchRole(role);
      await this.authRepository.setCurrentUser(updatedUser);

      return updatedUser;
    } catch (error) {
      throw new Error(`Role switch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createProfile(role: UserRole, profileData: any): Promise<User> {
    try {
      if (!isValidRole(role)) {
        throw new Error('Invalid role');
      }

      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      if (currentUser.profiles[role]) {
        throw new Error(`${role} profile already exists`);
      }

      const updatedUser = await this.authRepository.createProfile(role, profileData);
      await this.authRepository.setCurrentUser(updatedUser);

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
