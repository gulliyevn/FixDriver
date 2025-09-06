import { JWTPayload, TokenResponse, IJWTTokenHandler } from './JWTTypes';
import { JWTUtils } from './JWTUtils';
import { JWT_CONSTANTS } from '../../../shared/constants/adaptiveConstants';

/**
 * Handles JWT token generation and verification
 */
export class JWTTokenHandler implements IJWTTokenHandler {
  /**
   * Generate JWT token
   */
  async generateToken(payload: JWTPayload): Promise<string> {
    try {
      const header = {
        alg: 'HS256',
        typ: 'JWT'
      };

      const now = JWTUtils.getCurrentTimestamp();
      const tokenPayload = {
        ...payload,
        iat: now,
        exp: now + JWT_CONSTANTS.JWT.EXPIRES_IN
      };

      const encodedHeader = JWTUtils.base64UrlEncode(JSON.stringify(header));
      const encodedPayload = JWTUtils.base64UrlEncode(JSON.stringify(tokenPayload));
      
      const message = `${encodedHeader}.${encodedPayload}`;
      const signature = await JWTUtils.hmacSha256(message, JWT_CONSTANTS.JWT.SECRET);
      
      return `${message}.${signature}`;
    } catch (error) {
      console.error('Token generation error:', error);
      throw new Error('Failed to generate token');
    }
  }

  /**
   * Verify JWT token
   */
  async verifyToken(token: string): Promise<JWTPayload | null> {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const [header, payload, signature] = parts;
      const message = `${header}.${payload}`;
      
      const expectedSignature = await JWTUtils.hmacSha256(message, JWT_CONSTANTS.JWT.SECRET);
      
      if (signature !== expectedSignature) {
        return null;
      }

      const decodedPayload = JSON.parse(JWTUtils.base64UrlDecode(payload));
      
      // Check expiration
      if (decodedPayload.exp && JWTUtils.isTimestampExpired(decodedPayload.exp)) {
        return null;
      }

      return decodedPayload as JWTPayload;
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }

  /**
   * Refresh JWT token
   */
  async refreshToken(refreshToken: string): Promise<TokenResponse | null> {
    try {
      // Verify refresh token
      const payload = await this.verifyToken(refreshToken);
      if (!payload) {
        return null;
      }

      // Generate new tokens
      const newAccessToken = await this.generateToken(payload);
      const newRefreshToken = await this.generateToken({
        ...payload,
        exp: JWTUtils.getCurrentTimestamp() + JWT_CONSTANTS.JWT.REFRESH_EXPIRES_IN
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: JWT_CONSTANTS.JWT.EXPIRES_IN,
        tokenType: 'Bearer'
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  }

  /**
   * Decode JWT token without verification
   */
  decode(token: string): JWTPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const payload = JSON.parse(JWTUtils.base64UrlDecode(parts[1]));
      return payload as JWTPayload;
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  }
}
