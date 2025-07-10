import { AuthService } from '../AuthService';

// Mock fetch
global.fetch = jest.fn();

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock JWTService
jest.mock('../JWTService', () => ({
  generateTokens: jest.fn().mockResolvedValue({
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    expiresIn: 3600,
    tokenType: 'Bearer',
  }),
  verifyToken: jest.fn().mockResolvedValue({
    userId: 'mock-user-id',
    email: 'test@example.com',
    role: 'client',
    phone: '+1234567890',
  }),
  getCurrentUser: jest.fn().mockResolvedValue({
    userId: 'mock-user-id',
    email: 'test@example.com',
    role: 'client',
    phone: '+1234567890',
  }),
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  describe('login', () => {
    it('successfully logs in user', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          user: {
            id: '123',
            email: 'test@example.com',
            name: 'Test User',
            role: 'client',
          },
          tokens: {
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token',
          },
        }),
      };

      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await AuthService.login('test@example.com', 'password');

      expect(result.success).toBe(true);
      expect(result.user).toEqual({
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'client',
      });
      expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password',
        }),
      });
    });

    it('handles login failure', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        json: jest.fn().mockResolvedValue({
          error: 'Invalid credentials',
        }),
      };

      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await AuthService.login('test@example.com', 'wrong-password');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });

    it('handles network error', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await AuthService.login('test@example.com', 'password');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Network error');
    });
  });

  describe('register', () => {
    it('successfully registers user', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          user: {
            id: '123',
            email: 'new@example.com',
            name: 'New User',
            role: 'client',
          },
          tokens: {
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token',
          },
        }),
      };

      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const userData = {
        name: 'New User',
        surname: 'Test',
        email: 'new@example.com',
        phone: '+1234567890',
        country: 'US',
        role: 'client',
      };

      const result = await AuthService.register(userData, 'password123');

      expect(result.success).toBe(true);
      expect(result.user).toEqual({
        id: '123',
        email: 'new@example.com',
        name: 'New User',
        role: 'client',
      });
    });

    it('handles registration failure', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValue({
          error: 'Email already exists',
        }),
      };

      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const userData = {
        name: 'New User',
        surname: 'Test',
        email: 'existing@example.com',
        phone: '+1234567890',
        country: 'US',
        role: 'client',
      };

      const result = await AuthService.register(userData, 'password123');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email already exists');
    });
  });

  describe('logout', () => {
    it('successfully logs out user', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          message: 'Logged out successfully',
        }),
      };

      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await AuthService.logout();

      expect(result.success).toBe(true);
      expect(fetch).toHaveBeenCalledWith('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-access-token',
        },
      });
    });

    it('handles logout failure gracefully', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await AuthService.logout();

      expect(result.success).toBe(false);
      expect(result.error).toContain('Network error');
    });
  });

  describe('forgotPassword', () => {
    it('successfully sends reset email', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          message: 'Reset email sent',
        }),
      };

      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await AuthService.forgotPassword('test@example.com');

      expect(result.success).toBe(true);
      expect(fetch).toHaveBeenCalledWith('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
        }),
      });
    });

    it('handles forgot password failure', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        json: jest.fn().mockResolvedValue({
          error: 'User not found',
        }),
      };

      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await AuthService.forgotPassword('nonexistent@example.com');

      expect(result.success).toBe(false);
      expect(result.error).toBe('User not found');
    });
  });

  describe('resetPassword', () => {
    it('successfully resets password', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          message: 'Password reset successfully',
        }),
      };

      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await AuthService.resetPassword('token123', 'newpassword123');

      expect(result.success).toBe(true);
      expect(fetch).toHaveBeenCalledWith('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: 'token123',
          password: 'newpassword123',
        }),
      });
    });

    it('handles reset password failure', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValue({
          error: 'Invalid token',
        }),
      };

      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await AuthService.resetPassword('invalid-token', 'newpassword123');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid token');
    });
  });
}); 