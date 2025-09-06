import AsyncStorage from '@react-native-async-storage/async-storage';
import { JWTPayload, TokenResponse, IJWTService } from './JWTTypes';
import { JWTTokenHandler } from './JWTTokenHandler';
import { JWTValidationService } from './JWTValidationService';
import { JWT_CONSTANTS } from '../../../shared/constants/adaptiveConstants';

/**
 * Main JWT service
 */
export class JWTService implements IJWTService {
  private tokenHandler: JWTTokenHandler;
  private validationService: JWTValidationService;

  constructor() {
    this.tokenHandler = new JWTTokenHandler();
    this.validationService = new JWTValidationService();
  }

  /**
   * Generate JWT token
   */
  async generateToken(payload: JWTPayload): Promise<string> {
    return this.tokenHandler.generateToken(payload);
  }

  /**
   * Verify JWT token
   */
  async verifyToken(token: string): Promise<JWTPayload | null> {
    return this.tokenHandler.verifyToken(token);
  }

  /**
   * Refresh JWT token
   */
  async refreshToken(refreshToken: string): Promise<TokenResponse | null> {
    return this.tokenHandler.refreshToken(refreshToken);
  }

  /**
   * Check if token is expired
   */
  async isTokenExpired(token: string): Promise<boolean> {
    return this.validationService.isTokenExpired(token);
  }

  /**
   * Decode JWT token without verification
   */
  decode(token: string): JWTPayload | null {
    return this.tokenHandler.decode(token);
  }

  /**
   * Get token expiration date
   */
  getTokenExpiration(token: string): Date | null {
    return this.validationService.getTokenExpiration(token);
  }

  /**
   * Store tokens in AsyncStorage
   */
  async storeTokens(tokens: TokenResponse): Promise<void> {
    try {
      await AsyncStorage.setItem(JWT_CONSTANTS.STORAGE_KEYS.TOKENS, JSON.stringify(tokens));
    } catch (error) {
      console.error('Failed to store tokens:', error);
      throw new Error('Failed to store tokens');
    }
  }

  /**
   * Get stored tokens from AsyncStorage
   */
  async getStoredTokens(): Promise<TokenResponse | null> {
    try {
      const tokens = await AsyncStorage.getItem(JWT_CONSTANTS.STORAGE_KEYS.TOKENS);
      return tokens ? JSON.parse(tokens) : null;
    } catch (error) {
      console.error('Failed to get stored tokens:', error);
      return null;
    }
  }

  /**
   * Clear stored tokens
   */
  async clearTokens(): Promise<void> {
    try {
      await AsyncStorage.removeItem(JWT_CONSTANTS.STORAGE_KEYS.TOKENS);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
      throw new Error('Failed to clear tokens');
    }
  }

  /**
   * Validate stored tokens
   */
  async validateStoredTokens(): Promise<boolean> {
    try {
      const tokens = await this.getStoredTokens();
      if (!tokens) {
        return false;
      }

      const isValid = await this.validationService.validateToken(tokens.accessToken);
      return isValid;
    } catch (error) {
      console.error('Failed to validate stored tokens:', error);
      return false;
    }
  }

  /**
   * Get valid access token (refresh if needed)
   */
  async getValidAccessToken(): Promise<string | null> {
    try {
      const tokens = await this.getStoredTokens();
      if (!tokens) {
        return null;
      }

      const isExpired = await this.isTokenExpired(tokens.accessToken);
      if (!isExpired) {
        return tokens.accessToken;
      }

      // Try to refresh token
      const newTokens = await this.refreshToken(tokens.refreshToken);
      if (newTokens) {
        await this.storeTokens(newTokens);
        return newTokens.accessToken;
      }

      return null;
    } catch (error) {
      console.error('Failed to get valid access token:', error);
      return null;
    }
  }
}
