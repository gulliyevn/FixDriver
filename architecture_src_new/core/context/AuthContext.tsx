import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../../shared/types/user';
import { LoginCredentials, RegisterData } from '../../shared/types/auth';
import MockServices from '../../shared/mocks/MockServices';
import { AuthService } from '../../data/datasources/grpc/AuthService';
import { Validators } from '../../shared/utils/validators';

// 🔌 Service Interface for easy switching between Mock and gRPC
interface IAuthService {
  login(email: string, password: string): Promise<AuthResult>;
  register(userData: RegisterData): Promise<AuthResult>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  refreshUser(id: string): Promise<User | null>;
}

// 🔄 Service Factory - easy to switch between Mock and gRPC
class AuthServiceFactory {
  private static instance: IAuthService;
  
  static getService(): IAuthService {
    if (!this.instance) {
      // Use gRPC service by default (which falls back to stub)
      this.instance = new GRPCAuthService();
    }
    return this.instance;
  }
  
  static setService(service: IAuthService): void {
    this.instance = service;
  }
}

// 🎭 Mock Implementation
class MockAuthService implements IAuthService {
  async login(email: string, password: string): Promise<AuthResult> {
    const result = await MockServices.auth.login(email, password);
    return {
      success: result.success,
      user: result.user,
      token: result.token || '',
    };
  }
  
  async register(userData: RegisterData): Promise<AuthResult> {
    const result = await MockServices.auth.register(userData);
    return {
      success: result.success,
      user: result.user,
      token: result.token || '',
    };
  }
  
  async logout(): Promise<void> {
    return MockServices.auth.logout();
  }
  
  async getCurrentUser(): Promise<User | null> {
    return MockServices.users.getCurrent();
  }
  
  async refreshUser(id: string): Promise<User | null> {
    return MockServices.users.getById(id);
  }
}

// 🔌 gRPC Implementation (with fallback to stub)
class GRPCAuthService implements IAuthService {
  private grpcService: AuthService;

  constructor() {
    this.grpcService = new AuthService();
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const result = await this.grpcService.login(email, password);
    return {
      success: result.success,
      user: result.user,
      token: result.token,
    };
  }
  
  async register(userData: RegisterData): Promise<AuthResult> {
    const result = await this.grpcService.register(userData);
    return {
      success: result.success,
      user: result.user,
      token: result.token,
    };
  }
  
  async logout(): Promise<void> {
    return this.grpcService.logout();
  }
  
  async getCurrentUser(): Promise<User | null> {
    return this.grpcService.getCurrentUser();
  }
  
  async refreshUser(id: string): Promise<User | null> {
    // For now, get current user since refreshUser is not in the interface
    return this.grpcService.getCurrentUser();
  }

  // Get service status for debugging
  getServiceStatus() {
    return this.grpcService.getServiceStatus();
  }
}

// 📋 Types
interface AuthResult {
  success: boolean;
  user: User;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<boolean>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 🔌 Get auth service instance
  const authService = AuthServiceFactory.getService();

  // Check if user is already authenticated on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log('No authenticated user found');
    } finally {
      setIsLoading(false);
    }
  };


  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);

      // Validate credentials
      const validation = Validators.validateLogin({ 
        email: credentials.email, 
        password: credentials.password 
      });
      if (!validation.isValid) {
        setError(validation.errors[0]);
        return false;
      }

      // Attempt login using auth service
      const authResult = await authService.login(credentials.email, credentials.password);
      
      if (authResult.success && authResult.user) {
        setUser(authResult.user);
        setIsAuthenticated(true);
        return true;
      } else {
        setError('Login failed');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Call logout service
      await authService.logout();
      
      // Clear local state
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);

      // Validate registration data
      const validation = Validators.validateRegistration({
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        phone: userData.phone || '',
        password: userData.password,
        confirmPassword: userData.password
      });
      if (!validation.isValid) {
        setError(validation.errors[0]);
        return false;
      }

      // Attempt registration using auth service
      const authResult = await authService.register(userData);
      
      if (authResult.success && authResult.user) {
        setUser(authResult.user);
        setIsAuthenticated(true);
        return true;
      } else {
        setError('Registration failed');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const refreshUser = async (): Promise<void> => {
    if (!user) return;
    
    try {
      const updatedUser = await authService.refreshUser(user.id);
      if (updatedUser) {
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };


  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    clearError,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
