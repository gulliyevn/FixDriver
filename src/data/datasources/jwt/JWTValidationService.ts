import { JWTPayload, IJWTValidationService } from './JWTTypes';
import { JWTUtils } from './JWTUtils';

/**
 * JWT validation service
 */
export class JWTValidationService implements IJWTValidationService {
  /**
   * Check if token is expired
   */
  async isTokenExpired(token: string): Promise<boolean> {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) {
        return true;
      }

      return JWTUtils.isTimestampExpired(decoded.exp);
    } catch (error) {
      return true;
    }
  }

  /**
   * Validate token structure and content
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      if (!token || typeof token !== 'string') {
        return false;
      }

      const parts = token.split('.');
      if (parts.length !== 3) {
        return false;
      }

      const decoded = this.decodeToken(token);
      if (!decoded) {
        return false;
      }

      // Check required fields
      if (!decoded.userId || !decoded.email || !decoded.role) {
        return false;
      }

      // Check role validity
      if (!['client', 'driver'].includes(decoded.role)) {
        return false;
      }

      // Check expiration
      if (decoded.exp && JWTUtils.isTimestampExpired(decoded.exp)) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get token expiration date
   */
  getTokenExpiration(token: string): Date | null {
    try {
      const decoded = this.decodeToken(token);
      return decoded?.exp ? new Date(decoded.exp * 1000) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Decode token payload
   */
  private decodeToken(token: string): JWTPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const payload = JSON.parse(JWTUtils.base64UrlDecode(parts[1]));
      return payload as JWTPayload;
    } catch (error) {
      return null;
    }
  }
}
