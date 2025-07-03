import AsyncStorage from '@react-native-async-storage/async-storage';
import { SECURITY_CONFIG } from '../config/security';

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'client' | 'driver';
  phone: string;
  iat?: number; // issued at
  exp?: number; // expiration
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

// Простая реализация JWT для React Native
class SimpleJWT {
  private static base64UrlEncode(str: string): string {
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  private static base64UrlDecode(str: string): string {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
      str += '=';
    }
    return atob(str);
  }

  private static hmacSha256(message: string, secret: string): string {
    // Простая реализация HMAC-SHA256 (в продакшене используйте нативную криптографию)
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(message);
    
    // Используем Web Crypto API если доступен
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      // В реальном приложении здесь будет правильная реализация HMAC
      return this.simpleHash(message + secret);
    }
    
    return this.simpleHash(message + secret);
  }

  private static simpleHash(str: string): string {
    // Простая хеш-функция для демонстрации
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }

  static sign(payload: any, secret: string, options: any = {}): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT',
      ...options.header
    };

    const now = Math.floor(Date.now() / 1000);
    const finalPayload = {
      ...payload,
      iat: payload.iat || now,
      exp: payload.exp || (now + (options.expiresIn || 3600)),
    };

    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(finalPayload));
    
    const signature = this.hmacSha256(
      `${encodedHeader}.${encodedPayload}`,
      secret
    );

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  static verify(token: string, secret: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }

      const [encodedHeader, encodedPayload, signature] = parts;
      
      // Проверяем подпись
      const expectedSignature = this.hmacSha256(
        `${encodedHeader}.${encodedPayload}`,
        secret
      );

      if (signature !== expectedSignature) {
        throw new Error('Invalid signature');
      }

      // Декодируем payload
      const payload = JSON.parse(this.base64UrlDecode(encodedPayload));
      
      // Проверяем срок действия
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        throw new Error('Token expired');
      }

      return payload;
    } catch (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }

  static decode(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const payload = JSON.parse(this.base64UrlDecode(parts[1]));
      return payload;
    } catch (error) {
      return null;
    }
  }
}

export class JWTService {
  private static readonly ACCESS_TOKEN_KEY = 'fixdrive_access_token';
  private static readonly REFRESH_TOKEN_KEY = 'fixdrive_refresh_token';

  /**
   * Генерирует JWT токены для пользователя
   */
  static generateTokens(userData: {
    userId: string;
    email: string;
    role: 'client' | 'driver';
    phone: string;
  }): TokenResponse {
    const now = Math.floor(Date.now() / 1000);
    
    const accessTokenPayload: JWTPayload = {
      userId: userData.userId,
      email: userData.email,
      role: userData.role,
      phone: userData.phone,
      iat: now,
      exp: now + SECURITY_CONFIG.JWT.ACCESS_TOKEN_EXPIRY,
    };

    const refreshTokenPayload = {
      userId: userData.userId,
      type: 'refresh',
      iat: now,
      exp: now + SECURITY_CONFIG.JWT.REFRESH_TOKEN_EXPIRY,
    };

    const accessToken = SimpleJWT.sign(accessTokenPayload, SECURITY_CONFIG.JWT.SECRET, {
      expiresIn: SECURITY_CONFIG.JWT.ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = SimpleJWT.sign(refreshTokenPayload, SECURITY_CONFIG.JWT.SECRET, {
      expiresIn: SECURITY_CONFIG.JWT.REFRESH_TOKEN_EXPIRY,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: SECURITY_CONFIG.JWT.ACCESS_TOKEN_EXPIRY,
      tokenType: 'Bearer',
    };
  }

  /**
   * Проверяет валидность JWT токена
   */
  static verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = SimpleJWT.verify(token, SECURITY_CONFIG.JWT.SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      // Log expired tokens as warnings instead of errors since this is expected behavior
      if (error.message.includes('Token expired')) {
        console.warn('JWT token expired (expected behavior):', error.message);
      } else {
        console.error('JWT verification error:', error);
      }
      return null;
    }
  }

  /**
   * Обновляет access token используя refresh token
   */
  static async refreshAccessToken(): Promise<string | null> {
    try {
      const refreshToken = await this.getRefreshToken();
      if (!refreshToken) {
        return null;
      }

      const decoded = SimpleJWT.verify(refreshToken, SECURITY_CONFIG.JWT.SECRET) as any;

      if (decoded.type !== 'refresh') {
        throw new Error('Invalid refresh token type');
      }

      // Получаем данные пользователя из базы или кэша
      const userData = await this.getUserDataFromStorage();
      if (!userData) {
        throw new Error('User data not found');
      }

      // Генерируем новый access token
      const tokens = this.generateTokens({
        userId: decoded.userId,
        email: userData.email,
        role: userData.role,
        phone: userData.phone,
      });

      // Сохраняем новые токены
      await this.saveTokens(tokens);

      return tokens.accessToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      await this.clearTokens();
      return null;
    }
  }

  /**
   * Сохраняет токены в AsyncStorage
   */
  static async saveTokens(tokens: TokenResponse): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [this.ACCESS_TOKEN_KEY, tokens.accessToken],
        [this.REFRESH_TOKEN_KEY, tokens.refreshToken],
      ]);
    } catch (error) {
      console.error('Error saving tokens:', error);
      throw error;
    }
  }

  /**
   * Получает access token из хранилища
   */
  static async getAccessToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(this.ACCESS_TOKEN_KEY);
      
      if (!token) {
        return null;
      }

      // Проверяем валидность токена
      const decoded = this.verifyToken(token);
      if (!decoded) {
        // Токен невалиден, пытаемся обновить
        const newToken = await this.refreshAccessToken();
        return newToken;
      }

      return token;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  /**
   * Получает refresh token из хранилища
   */
  static async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  /**
   * Очищает все токены
   */
  static async clearTokens(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.ACCESS_TOKEN_KEY,
        this.REFRESH_TOKEN_KEY,
      ]);
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  /**
   * Проверяет, есть ли валидный токен
   */
  static async hasValidToken(): Promise<boolean> {
    const token = await this.getAccessToken();
    return !!token;
  }

  /**
   * Получает данные пользователя из токена
   */
  static async getCurrentUser(): Promise<JWTPayload | null> {
    const token = await this.getAccessToken();
    if (!token) {
      return null;
    }

    return this.verifyToken(token);
  }

  /**
   * Получает данные пользователя из AsyncStorage (для обновления токенов)
   */
  private static async getUserDataFromStorage(): Promise<any> {
    try {
      const userData = await AsyncStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data from storage:', error);
      return null;
    }
  }

  /**
   * Создает заголовок Authorization для API запросов
   */
  static async getAuthHeader(): Promise<{ Authorization: string } | null> {
    const token = await this.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : null;
  }

  /**
   * Проверяет, истек ли токен
   */
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = SimpleJWT.decode(token) as JWTPayload;
      if (!decoded || !decoded.exp) {
        return true;
      }

      const now = Math.floor(Date.now() / 1000);
      return decoded.exp < now;
    } catch (error) {
      return true;
    }
  }

  /**
   * Получает время истечения токена
   */
  static getTokenExpiration(token: string): Date | null {
    try {
      const decoded = SimpleJWT.decode(token) as JWTPayload;
      return decoded?.exp ? new Date(decoded.exp * 1000) : null;
    } catch (error) {
      return null;
    }
  }
}

export default JWTService; 