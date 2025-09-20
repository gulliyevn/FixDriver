import { User, AuthResponse, LoginCredentials, RegisterData, UserRole } from '../../shared/types';

export interface IAuthRepository {
  // Authentication
  login(email: string, password: string, options?: { remember?: boolean }): Promise<AuthResponse>;
  register(userData: RegisterData): Promise<AuthResponse>;
  logout(): Promise<void>;
  refreshToken(): Promise<AuthResponse>;
  
  // User management
  getCurrentUser(): Promise<User | null>;
  validateToken(token: string): Promise<boolean>;
  
  // Role management
  switchRole(role: UserRole): Promise<User>;
  createProfile(role: UserRole, profileData: any): Promise<User>;
  
  // Session management
  isAuthenticated(): Promise<boolean>;
  clearSession(): Promise<void>;
  
  // Token management
  getCurrentToken(): Promise<string | null>;
  setCurrentUser(user: User): Promise<void>;
  setCurrentToken(token: string): Promise<void>;
}
