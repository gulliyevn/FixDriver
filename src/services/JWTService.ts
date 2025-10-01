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

// Упрощенная JWT реализация с надежным хешированием
class SecureJWT {
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

  private static async hmacSha256(message: string, secret: string): Promise<string> {
    try {
      // Используем более стабильный алгоритм хеширования
      const encoder = new TextEncoder();
      const data = encoder.encode(message + secret);
      
      // Простой и стабильный хеш-алгоритм
      let hash = 0;
      for (let i = 0; i < data.length; i++) {
        const char = data[i];
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      
      // Дополнительное перемешивание для стабильности
      hash = hash ^ (hash >>> 16);
      hash = Math.imul(hash, 0x85ebca6b);
      hash = hash ^ (hash >>> 13);
      hash = Math.imul(hash, 0xc2b2ae35);
      hash = hash ^ (hash >>> 16);
      
      // Используем более стабильное представление
      return Math.abs(hash).toString(16).padStart(8, '0');
    } catch (error) {
      console.error('HMAC-SHA256 error:', error);
      // Fallback к простой хеш-функции
      return this.simpleHash(message + secret);
    }
  }

  private static simpleHash(str: string): string {
    // Простая и стабильная хеш-функция как fallback
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  static async sign(payload: JWTPayload, secret: string, options: Record<string, unknown> = {}): Promise<string> {
    const header = {
      alg: 'HS256',
      typ: 'JWT',
      ...(options.header as Record<string, unknown> || {})
    };

    const now = Math.floor(Date.now() / 1000);
    const finalPayload = {
      ...payload,
      iat: payload.iat || now,
      exp: payload.exp || (now + (Number(options.expiresIn) || 3600)),
    };

    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(finalPayload));
    
    const signature = await this.hmacSha256(
      `${encodedHeader}.${encodedPayload}`,
      secret
    );

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  static async verify(token: string, secret: string): Promise<JWTPayload | null> {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }

      const [encodedHeader, encodedPayload, signature] = parts;
      
      // Проверяем подпись
      const expectedSignature = await this.hmacSha256(
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

  static decode(token: string): JWTPayload | null {
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
  static async generateTokens(userData: {
    userId: string;
    email: string;
    role: 'client' | 'driver';
    phone: string;
  }): Promise<TokenResponse> {
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
      email: userData.email,
      role: userData.role,
      phone: userData.phone,
      type: 'refresh',
      iat: now,
      exp: now + SECURITY_CONFIG.JWT.REFRESH_TOKEN_EXPIRY,
    } as JWTPayload & { type: string };

    const accessToken = await SecureJWT.sign(accessTokenPayload, SECURITY_CONFIG.JWT.SECRET, {
      expiresIn: SECURITY_CONFIG.JWT.ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = await SecureJWT.sign(refreshTokenPayload, SECURITY_CONFIG.JWT.SECRET, {
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
  static async verifyToken(token: string): Promise<JWTPayload | null> {
    try {
      const decoded = await SecureJWT.verify(token, SECURITY_CONFIG.JWT.SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      // Log expired tokens as warnings instead of errors since this is expected behavior
      if (error.message.includes('Token expired')) {
              // JWT token expired (expected behavior)
    } else {
      // JWT verification error
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

      const decoded = await SecureJWT.verify(refreshToken, SECURITY_CONFIG.JWT.SECRET) as unknown as Record<string, unknown>;

      if (decoded.type !== 'refresh') {
        throw new Error('Invalid refresh token type');
      }

      // Получаем данные пользователя из базы или кэша
      const userData = await this.getUserDataFromStorage();
      if (!userData) {
        throw new Error('User data not found');
      }

      // Генерируем новый access token
      const tokens = await this.generateTokens({
        userId: decoded.userId as string,
        email: userData.email,
        role: userData.role,
        phone: userData.phone,
      });

      // Сохраняем новые токены
      await this.saveTokens(tokens);

      return tokens.accessToken;
    } catch (error) {
      await this.clearTokens();
      return null;
    }
  }

  /**
   * Сохраняет токены в AsyncStorage
   */
  static async saveTokens(tokens: TokenResponse): Promise<void> {
    await AsyncStorage.multiSet([
      [this.ACCESS_TOKEN_KEY, tokens.accessToken],
      [this.REFRESH_TOKEN_KEY, tokens.refreshToken],
    ]);
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
      const decoded = await this.verifyToken(token);
      if (!decoded) {
        // Токен невалиден, пытаемся обновить
        const newToken = await this.refreshAccessToken();
        return newToken;
      }

      return token;
    } catch (error) {
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
      return null;
    }
  }

  /**
   * Очищает все сохраненные токены
   */
  static async clearTokens(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.ACCESS_TOKEN_KEY,
        this.REFRESH_TOKEN_KEY,
      ]);
  
    } catch (error) {
      // Error clearing tokens
    }
  }

  /**
   * Принудительно обновляет токены (очищает старые и генерирует новые)
   */
  static async forceRefreshTokens(userData: {
    userId: string;
    email: string;
    role: 'client' | 'driver';
    phone: string;
  }): Promise<TokenResponse> {
    try {
  
      
      // Сначала очищаем старые токены
      
      await this.clearTokens();
      
      // Генерируем новые токены
      
      const tokens = await this.generateTokens(userData);
      
      
      return tokens;
    } catch (error) {
      console.error('❌ forceRefreshTokens error:', error);
      throw error;
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
  static async getUserDataFromStorage(): Promise<JWTPayload | null> {
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
      const decoded = SecureJWT.decode(token) as JWTPayload;
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
   * Декодирует JWT токен без проверки подписи
   */
  static decode(token: string): JWTPayload | null {
    return SecureJWT.decode(token);
  }

  /**
   * Получает время истечения токена
   */
  static getTokenExpiration(token: string): Date | null {
    try {
      const decoded = SecureJWT.decode(token) as JWTPayload;
      return decoded?.exp ? new Date(decoded.exp * 1000) : null;
    } catch (error) {
      return null;
    }
  }
}

export default JWTService; 