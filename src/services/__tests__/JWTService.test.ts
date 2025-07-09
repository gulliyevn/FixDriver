import JWTService from '../JWTService';
import { SECURITY_CONFIG } from '../../config/security';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('JWTService', () => {
  const mockUserData = {
    userId: '123',
    email: 'test@example.com',
    role: 'client' as const,
    phone: '+1234567890',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateTokens', () => {
    it('generates access and refresh tokens', async () => {
      const tokens = await JWTService.generateTokens(mockUserData);
      
      expect(tokens).toHaveProperty('accessToken');
      expect(tokens).toHaveProperty('refreshToken');
      expect(tokens).toHaveProperty('expiresIn');
      expect(tokens).toHaveProperty('tokenType');
      expect(tokens.tokenType).toBe('Bearer');
    });

    it('generates tokens with correct payload', async () => {
      const tokens = await JWTService.generateTokens(mockUserData);
      
      // Verify tokens to check payload
      const accessTokenPayload = await JWTService.verifyToken(tokens.accessToken);
      const refreshTokenPayload = await JWTService.verifyToken(tokens.refreshToken);
      
      expect(accessTokenPayload).toMatchObject({
        userId: mockUserData.userId,
        email: mockUserData.email,
        role: mockUserData.role,
        phone: mockUserData.phone,
      });
      
      expect(refreshTokenPayload).toMatchObject({
        userId: mockUserData.userId,
        email: mockUserData.email,
        role: mockUserData.role,
        phone: mockUserData.phone,
        type: 'refresh',
      });
    });
  });

  describe('verifyToken', () => {
    it('verifies valid token', async () => {
      const tokens = await JWTService.generateTokens(mockUserData);
      const verified = await JWTService.verifyToken(tokens.accessToken);
      
      expect(verified).toMatchObject({
        userId: mockUserData.userId,
        email: mockUserData.email,
        role: mockUserData.role,
        phone: mockUserData.phone,
      });
    });

    it('returns null for invalid token', async () => {
      const result = await JWTService.verifyToken('invalid.token.here');
      expect(result).toBeNull();
    });

    it('returns null for expired token', async () => {
      // Create a token that's already expired
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoiY2xpZW50IiwicGhvbmUiOiIrMTIzNDU2Nzg5MCIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MjM5MDIyfQ.invalid_signature';
      
      const result = await JWTService.verifyToken(expiredToken);
      expect(result).toBeNull();
    });
  });

  describe('isTokenExpired', () => {
    it('returns true for expired token', () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoiY2xpZW50IiwicGhvbmUiOiIrMTIzNDU2Nzg5MCIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MjM5MDIyfQ.invalid_signature';
      
      const result = JWTService.isTokenExpired(expiredToken);
      expect(result).toBe(true);
    });

    it('returns false for valid token', async () => {
      const tokens = await JWTService.generateTokens(mockUserData);
      const result = JWTService.isTokenExpired(tokens.accessToken);
      expect(result).toBe(false);
    });
  });

  describe('getTokenExpiration', () => {
    it('returns expiration date for valid token', async () => {
      const tokens = await JWTService.generateTokens(mockUserData);
      const expiration = JWTService.getTokenExpiration(tokens.accessToken);
      
      expect(expiration).toBeInstanceOf(Date);
      expect(expiration!.getTime()).toBeGreaterThan(Date.now());
    });

    it('returns null for invalid token', () => {
      const result = JWTService.getTokenExpiration('invalid-token');
      expect(result).toBeNull();
    });
  });
}); 