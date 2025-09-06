import JWTService from '../JWTService';
import { ENV_CONFIG, ConfigUtils } from '../../../shared/config/environment';
import { AUTH_CONSTANTS } from '../../../shared/constants';
import { AuthResponse, GoLoginRequest, GoRegisterRequest, GoTokenResponse } from './AuthTypes';
import { transformGoUserToFrontend, transformGoTokensToFrontend } from './AuthUtils';
import { AuthMockService } from './AuthMockService';
import { AuthGrpcService } from './AuthGrpcService';

export class AuthService {
  /**
   * User login
   */
  static async login(email: string, password: string, authMethod?: string): Promise<AuthResponse> {
    try {
      // In dev mode always use mocks for testing
      if (__DEV__) {
        return AuthMockService.mockLogin(email, password);
      }

      // Check server availability
      const isServerAvailable = await ConfigUtils.checkServerHealth();
      
      if (!isServerAvailable) {
        // Server unavailable, falling back to mock data
        return AuthMockService.mockLogin(email, password);
      }

      const loginData: GoLoginRequest = { email, password };
      const response = await fetch(`${ENV_CONFIG.API.BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`);
      }

      const goResponse: GoTokenResponse = await response.json();
      
      // Convert data to frontend format
      const user = transformGoUserToFrontend(goResponse.user_info);
      const tokens = transformGoTokensToFrontend(goResponse);
      
      // Save tokens
      await JWTService.saveTokens(tokens);
      
      return {
        success: true,
        user,
        tokens,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : AUTH_CONSTANTS.ERRORS.LOGIN_FAILED,
      };
    }
  }

  /**
   * User registration
   */
  static async register(userData: {
    name: string;
    surname: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<AuthResponse> {
    try {
      // Check server availability
      const isServerAvailable = await ConfigUtils.checkServerHealth();
      
      if (!isServerAvailable) {
        // Server unavailable, falling back to mock data
        return AuthMockService.mockRegister(userData, userData.password);
      }

      const registerData: GoRegisterRequest = {
        email: userData.email,
        password: userData.password,
        phone_number: userData.phone,
        first_name: userData.name,
        last_name: userData.surname,
      };

      const response = await fetch(`${ENV_CONFIG.API.BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        throw new Error(`Registration failed: ${response.status}`);
      }

      const goResponse: GoTokenResponse = await response.json();
      
      // Convert data to frontend format
      const user = transformGoUserToFrontend(goResponse.user_info);
      const tokens = transformGoTokensToFrontend(goResponse);
      
      // Save tokens
      await JWTService.saveTokens(tokens);
      
      return {
        success: true,
        user,
        tokens,
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : AUTH_CONSTANTS.ERRORS.REGISTRATION_FAILED,
      };
    }
  }

  /**
   * User logout
   */
  static async logout(): Promise<AuthResponse> {
    try {
      // Get refresh token
      const refreshToken = await JWTService.getRefreshToken();
      
      if (refreshToken) {
        // Check server availability
        const isServerAvailable = await ConfigUtils.checkServerHealth();
        
        if (isServerAvailable) {
          try {
            await fetch(`${ENV_CONFIG.API.BASE_URL}/auth/logout`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refreshToken}`,
              },
            });
          } catch (serverError) {
            console.warn('Server logout failed, but continuing with local cleanup');
          }
        }
      }

      // Clear tokens locally
      await JWTService.clearTokens();
      
      return {
        success: true,
        message: AUTH_CONSTANTS.SUCCESS.LOGGED_OUT,
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : AUTH_CONSTANTS.ERRORS.LOGOUT_FAILED,
      };
    }
  }

  /**
   * Token refresh
   */
  static async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = await JWTService.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Check server availability
      const isServerAvailable = await ConfigUtils.checkServerHealth();
      
      if (!isServerAvailable) {
        // Server unavailable, falling back to mock data
        return AuthMockService.mockRefreshToken();
      }

      const response = await fetch(`${ENV_CONFIG.API.BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const goResponse: GoTokenResponse = await response.json();
      
      // Convert data to frontend format
      const tokens = transformGoTokensToFrontend(goResponse);
      
      // Save new tokens
      await JWTService.saveTokens(tokens);
      
      return {
        success: true,
        tokens,
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : AUTH_CONSTANTS.ERRORS.TOKEN_REFRESH_FAILED,
      };
    }
  }
}

// Export gRPC methods for future use
export { AuthGrpcService };
