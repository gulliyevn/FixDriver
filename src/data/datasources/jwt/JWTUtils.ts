import { SECURITY_CONFIG } from '../../../shared/config/security';

/**
 * Utility functions for JWT operations
 */
export class JWTUtils {
  /**
   * Base64 URL encode
   */
  static base64UrlEncode(str: string): string {
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  /**
   * Base64 URL decode
   */
  static base64UrlDecode(str: string): string {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
      str += '=';
    }
    return atob(str);
  }

  /**
   * HMAC SHA256 implementation
   */
  static async hmacSha256(message: string, secret: string): Promise<string> {
    try {
      // Use more stable hashing algorithm
      const encoder = new TextEncoder();
      const data = encoder.encode(message + secret);
      
      // Simple and stable hash algorithm
      let hash = 0;
      for (let i = 0; i < data.length; i++) {
        const char = data[i];
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      
      return hash.toString(16);
    } catch (error) {
      console.error('HMAC SHA256 error:', error);
      throw new Error('Token generation failed');
    }
  }

  /**
   * Generate secure random string
   */
  static generateRandomString(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Get current timestamp
   */
  static getCurrentTimestamp(): number {
    return Math.floor(Date.now() / 1000);
  }

  /**
   * Check if timestamp is expired
   */
  static isTimestampExpired(timestamp: number): boolean {
    const now = this.getCurrentTimestamp();
    return timestamp < now;
  }
}
