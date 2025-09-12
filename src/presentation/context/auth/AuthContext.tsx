/**
 * Auth context
 * Main authentication context implementation
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '../../../shared/types/user';
import JWTService from '../../services/JWTService';
import { createAuthMockUser } from '../../../shared/mocks/shared/auth';
import { AuthContextType, AuthProviderProps, RegisterUserData } from './types';
import { loadUserFromStorage, saveUserToStorage, clearUserFromStorage, updateUserRoleInStorage } from './utils';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  /**
   * Refresh authentication
   */
  const refreshAuth = useCallback(async (): Promise<boolean> => {
    if (isRefreshing) {
      return false;
    }

    try {
      setIsRefreshing(true);
      
      const newToken = await JWTService.refreshAccessToken();
      if (newToken) {
        // Check if user still exists
        const userData = await loadUserFromStorage();
        if (userData) {
          setUser(userData);
          return true;
        }
      }
      
      // If refresh failed - don't logout automatically
      return false;
    } catch (error) {
      // Don't logout automatically on refresh errors
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  /**
   * Initialize authentication on app startup
   */
  const initializeAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Check for valid token
      const hasToken = await JWTService.hasValidToken();
      
      if (hasToken) {
        // Get user data from token
        const tokenUser = await JWTService.getCurrentUser();
        
        if (tokenUser) {
          // Load full user data from AsyncStorage
          const userData = await loadUserFromStorage();
          if (userData) {
            setUser(userData);
          } else {
            // If no user data but token is valid - try to restore
            // Don't logout automatically, let user stay in app
          }
        } else {
          // Token invalid - try to refresh
          const refreshed = await refreshAuth();
          if (!refreshed) {
            // If refresh failed, don't logout automatically
          }
        }
      }
    } catch (error) {
      // Don't logout automatically on initialization errors
    } finally {
      setIsLoading(false);
    }
  }, [refreshAuth]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  /**
   * Login
   */
  const login = async (email: string, password: string, authMethod?: 'google' | 'facebook' | 'apple'): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Use AuthService for login
      const authService = await import('../../../data/datasources/auth/AuthService');
      const result = await authService.AuthService.login(email, password, authMethod);
      
      if (result.success && result.user && result.tokens) {
        // Save tokens and user data
        await Promise.all([
          JWTService.saveTokens({
            ...result.tokens,
            tokenType: 'Bearer' as const
          }),
          saveUserToStorage(result.user),
        ]);

        setUser(result.user);
        return true;
      } else {
        console.error('Login failed:', result.message);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register user
   */
  const register = async (userData: RegisterUserData, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Use AuthService for registration
      const authService = await import('../../../data/datasources/auth/AuthService');
      const result = await authService.AuthService.register({
        ...userData,
        password
      });
      
      if (result.success && result.user && result.tokens) {
        // Save tokens and user data
        await Promise.all([
          JWTService.saveTokens({
            ...result.tokens,
            tokenType: 'Bearer' as const
          }),
          saveUserToStorage(result.user),
        ]);

        setUser(result.user);
        return true;
      } else {
        console.error('Registration failed:', result.message);
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // In real app send request to server for token invalidation
      if (!__DEV__) {
        try {
          const authHeader = await JWTService.getAuthHeader();
          if (authHeader) {
            await fetch('/api/auth/logout', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...authHeader,
              },
            });
          }
        } catch (error) {
          console.warn('Logout API error:', error);
        }
      }

      // Clear all data
      await Promise.all([
        JWTService.clearTokens(),
        clearUserFromStorage(),
      ]);

      setUser(null);
    } catch (error) {
      console.warn('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get authorization header for API requests
   */
  const getAuthHeader = async (): Promise<{ Authorization: string } | null> => {
    return await JWTService.getAuthHeader();
  };

  /**
   * Change user role
   */
  const changeRole = useCallback((role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      // Save updated user to AsyncStorage
      updateUserRoleInStorage(updatedUser);
    }
  }, [user]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading: isLoading || isRefreshing,
    login,
    register,
    logout,
    refreshAuth,
    getAuthHeader,
    changeRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
