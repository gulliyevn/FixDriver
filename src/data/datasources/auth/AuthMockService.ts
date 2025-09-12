import { createAuthMockUser, findAuthUserByCredentials } from '../../../shared/mocks/shared/auth';
import { JWTService } from '../jwt';
import { UserRole } from '../../../shared/types/user';
import { AUTH_CONSTANTS } from '../../../shared/constants/adaptiveConstants';
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
        const jwt = new JWTService();
        const refresh = await jwt.generateToken({
          userId: existingUser.id,
          email: existingUser.email,
          role: existingUser.role === 'driver' ? 'driver' : 'client',
          phone: existingUser.phone,
        } as any);
        const tokens = await jwt.refreshToken(refresh);
        
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
      
      const jwt2 = new JWTService();
      const refresh2 = await jwt2.generateToken({
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role === 'driver' ? 'driver' : 'client',
        phone: mockUser.phone,
      } as any);
      const tokens = await jwt2.refreshToken(refresh2);
      
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

    const jwt3 = new JWTService();
    const refresh3 = await jwt3.generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role === 'driver' ? 'driver' : 'client',
      phone: newUser.phone,
    } as any);
    const tokens = await jwt3.refreshToken(refresh3);

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
    const jwt4 = new JWTService();
    const tokensStored = await jwt4.getStoredTokens();
    const currentUser = tokensStored?.accessToken ? jwt4.decode(tokensStored.accessToken) : null;
    
    if (currentUser) {
      const newRefresh = await jwt4.generateToken({
        userId: currentUser.userId,
        email: currentUser.email,
        role: currentUser.role,
        phone: currentUser.phone,
      } as any);
      const tokens = await jwt4.refreshToken(newRefresh);
      
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
