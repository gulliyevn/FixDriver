import { createAuthMockUser, findAuthUserByCredentials } from '../../../shared/mocks/auth';
import JWTService from '../JWTService';
import { UserRole } from '../../../shared/types/user';
import { AUTH_CONSTANTS } from '../../../shared/constants';
import { AuthResponse } from './AuthTypes';

export class AuthMockService {
  /**
   * Mock login for development
   */
  static async mockLogin(email: string, password: string): Promise<AuthResponse> {
    try {
      await new Promise(resolve => setTimeout(resolve, AUTH_CONSTANTS.MOCK.DELAY));
      
      // First try to find user in existing mocks
      const existingUser = findAuthUserByCredentials(email, password);
      
      if (existingUser) {
        const tokens = await JWTService.forceRefreshTokens({
          userId: existingUser.id,
          email: existingUser.email,
          role: existingUser.role,
          phone: existingUser.phone,
        });
        
        return {
          success: true,
          user: existingUser,
          tokens,
        };
      }
      
      // If user not found, create new one
      let role = UserRole.CLIENT;
      if (email.includes(AUTH_CONSTANTS.MOCK.DRIVER_EMAIL_PATTERN)) {
        role = UserRole.DRIVER;
      }
      
      const mockUser = createAuthMockUser({ email, role });
      
      const tokens = await JWTService.forceRefreshTokens({
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        phone: mockUser.phone,
      });
      
      return {
        success: true,
        user: mockUser,
        tokens,
      };
    } catch (error) {
      console.error('❌ Mock login error:', error);
      return {
        success: false,
        message: 'Mock login failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
      };
    }
  }

  /**
   * Mock register for development
   */
  static async mockRegister(userData: any, password: string): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, AUTH_CONSTANTS.MOCK.DELAY));
    
    const newUser = createAuthMockUser({
      email: userData.email,
      role: userData.role,
      name: userData.name,
      surname: userData.surname,
      phone: userData.phone,
    });

    const tokens = await JWTService.forceRefreshTokens({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
    });

    return {
      success: true,
      user: newUser,
      tokens,
    };
  }

  /**
   * Mock token refresh for development
   */
  static async mockRefreshToken(): Promise<AuthResponse> {
    const currentUser = await JWTService.getCurrentUser();
    
    if (currentUser) {
      const tokens = await JWTService.forceRefreshTokens({
        userId: currentUser.userId,
        email: currentUser.email,
        role: currentUser.role,
        phone: currentUser.phone,
      });
      
      return {
        success: true,
        message: 'Token refreshed successfully',
        tokens,
      };
    } else {
      return {
        success: false,
        message: 'No current user found',
      };
    }
  }
}
