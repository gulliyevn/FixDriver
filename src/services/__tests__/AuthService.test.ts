import { AuthService, AuthResponse } from "../AuthService";
import { JWTService } from "../JWTService";
import { UserRole } from "../../types/user";
import { ENV_CONFIG, ConfigUtils } from "../../config/environment";

// Мокаем все зависимости
jest.mock("../JWTService");
jest.mock("../../config/environment");
jest.mock("../../mocks/auth");

const mockJWTService = JWTService as jest.Mocked<typeof JWTService>;
const mockConfigUtils = ConfigUtils as jest.Mocked<typeof ConfigUtils>;
const mockEnvConfig = ENV_CONFIG as jest.Mocked<typeof ENV_CONFIG>;

// Мокаем fetch
global.fetch = jest.fn();

// Мокаем __DEV__
const originalDev = (global as typeof globalThis & { __DEV__: boolean }).__DEV__;
(global as typeof globalThis & { __DEV__: boolean }).__DEV__ = false;

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  afterAll(() => {
    (global as typeof globalThis & { __DEV__: boolean }).__DEV__ = originalDev;
  });

  describe("login", () => {
    const mockUser = {
      id: "1",
      email: "test@example.com",
      name: "Test",
      surname: "User",
      phone: "+1234567890",
      role: UserRole.CLIENT,
      avatar: null,
      rating: 0,
      createdAt: "2024-01-01T00:00:00.000Z",
      address: "",
    };

    const mockTokens = {
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
      expiresIn: 3600,
      tokenType: "Bearer",
    };

    it("successfully logs in with valid credentials", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          access_token: "mock-access-token",
          refresh_token: "mock-refresh-token",
          token_type: "Bearer",
          expires_in: 3600,
          expires_at: "2024-01-01T01:00:00.000Z",
          user_info: {
            id: 1,
            email: "test@example.com",
            phone_number: "+1234567890",
            first_name: "Test",
            last_name: "User",
            status: "active",
          },
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
      mockConfigUtils.checkServerHealth.mockResolvedValue(true);
      mockEnvConfig.API = {
        DEFAULT_HEADERS: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };

      const result = await AuthService.login("test@example.com", "password123");

      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockUser);
      expect(result.tokens).toEqual(mockTokens);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/client/login"),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "test@example.com",
            password: "password123",
          }),
        }),
      );
    });

    it("falls back to mock login when server is unavailable", async () => {
      mockConfigUtils.checkServerHealth.mockResolvedValue(false);
      mockJWTService.forceRefreshTokens.mockResolvedValue(mockTokens);

      const result = await AuthService.login("test@example.com", "password123");

      expect(result.success).toBe(true);
      expect(mockConfigUtils.checkServerHealth).toHaveBeenCalled();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("handles server error response", async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        json: jest.fn().mockResolvedValue({ message: "Invalid credentials" }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
      mockConfigUtils.checkServerHealth.mockResolvedValue(true);
      mockEnvConfig.API = {
        DEFAULT_HEADERS: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };

      const result = await AuthService.login(
        "test@example.com",
        "wrongpassword",
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid credentials");
    });

    it("handles network error", async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));
      mockConfigUtils.checkServerHealth.mockResolvedValue(true);
      mockEnvConfig.API = {
        DEFAULT_HEADERS: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };

      const result = await AuthService.login("test@example.com", "password123");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Network error");
    });
  });

  describe("register", () => {
    const mockUserData = {
      name: "Test",
      surname: "User",
      email: "test@example.com",
      phone: "+1234567890",
      country: "US",
      role: UserRole.CLIENT,
    };

    const mockTokens = {
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
      expiresIn: 3600,
      tokenType: "Bearer",
    };

    it("successfully registers new user", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          access_token: "mock-access-token",
          refresh_token: "mock-refresh-token",
          token_type: "Bearer",
          expires_in: 3600,
          expires_at: "2024-01-01T01:00:00.000Z",
          user_info: {
            id: 1,
            email: "test@example.com",
            phone_number: "+1234567890",
            first_name: "Test",
            last_name: "User",
            status: "active",
          },
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
      mockConfigUtils.checkServerHealth.mockResolvedValue(true);
      mockEnvConfig.API = {
        DEFAULT_HEADERS: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };

      const result = await AuthService.register(mockUserData, "password123");

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.tokens).toEqual(mockTokens);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/client/register"),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "test@example.com",
            password: "password123",
            phone_number: "+1234567890",
            first_name: "Test",
            last_name: "User",
          }),
        }),
      );
    });

    it("falls back to mock register when server is unavailable", async () => {
      mockConfigUtils.checkServerHealth.mockResolvedValue(false);
      mockJWTService.forceRefreshTokens.mockResolvedValue(mockTokens);

      const result = await AuthService.register(mockUserData, "password123");

      expect(result.success).toBe(true);
      expect(mockConfigUtils.checkServerHealth).toHaveBeenCalled();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("handles registration error", async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: jest.fn().mockResolvedValue({ message: "Email already exists" }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
      mockConfigUtils.checkServerHealth.mockResolvedValue(true);
      mockEnvConfig.API = {
        DEFAULT_HEADERS: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };

      const result = await AuthService.register(mockUserData, "password123");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Email already exists");
    });
  });

  describe("logout", () => {
    it("successfully logs out with refresh token", async () => {
      mockJWTService.getRefreshToken.mockResolvedValue("mock-refresh-token");
      mockConfigUtils.checkServerHealth.mockResolvedValue(true);
      mockJWTService.clearTokens.mockResolvedValue();

      const mockResponse = { ok: true };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
      mockEnvConfig.API = {
        DEFAULT_HEADERS: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };

      const result = await AuthService.logout();

      expect(result.success).toBe(true);
      expect(result.message).toBe("Logged out successfully");
      expect(mockJWTService.clearTokens).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/client/logout"),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: "mock-refresh-token" }),
        }),
      );
    });

    it("logs out without refresh token", async () => {
      mockJWTService.getRefreshToken.mockResolvedValue(null);
      mockJWTService.clearTokens.mockResolvedValue();

      const result = await AuthService.logout();

      expect(result.success).toBe(true);
      expect(result.message).toBe("Logged out successfully");
      expect(mockJWTService.clearTokens).toHaveBeenCalled();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("continues logout even if server logout fails", async () => {
      mockJWTService.getRefreshToken.mockResolvedValue("mock-refresh-token");
      mockConfigUtils.checkServerHealth.mockResolvedValue(true);
      mockJWTService.clearTokens.mockResolvedValue();

      const mockResponse = { ok: false };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
      mockEnvConfig.API = {
        DEFAULT_HEADERS: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };

      const result = await AuthService.logout();

      expect(result.success).toBe(true);
      expect(result.message).toBe("Logged out successfully");
      expect(mockJWTService.clearTokens).toHaveBeenCalled();
    });

    it("handles logout error", async () => {
      mockJWTService.getRefreshToken.mockRejectedValue(
        new Error("Storage error"),
      );

      const result = await AuthService.logout();

      expect(result.success).toBe(false);
      expect(result.message).toBe("Storage error");
    });
  });

  describe("refreshToken", () => {
    const mockTokens = {
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
      expiresIn: 3600,
      tokenType: "Bearer",
    };

    it("successfully refreshes token", async () => {
      mockJWTService.getRefreshToken.mockResolvedValue("old-refresh-token");
      mockConfigUtils.checkServerHealth.mockResolvedValue(true);

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          access_token: "new-access-token",
          refresh_token: "new-refresh-token",
          token_type: "Bearer",
          expires_in: 3600,
          expires_at: "2024-01-01T01:00:00.000Z",
          user_info: {
            id: 1,
            email: "test@example.com",
            phone_number: "+1234567890",
            first_name: "Test",
            last_name: "User",
            status: "active",
          },
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
      mockEnvConfig.API = {
        DEFAULT_HEADERS: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };

      const result = await AuthService.refreshToken();

      expect(result.success).toBe(true);
      expect(result.message).toBe("Token refreshed successfully");
      expect(result.tokens).toEqual(mockTokens);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/client/refresh"),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: "old-refresh-token" }),
        }),
      );
    });

    it("returns error when no refresh token available", async () => {
      mockJWTService.getRefreshToken.mockResolvedValue(null);

      const result = await AuthService.refreshToken();

      expect(result.success).toBe(false);
      expect(result.message).toBe("No refresh token available");
    });

    it("falls back to mock refresh when server is unavailable", async () => {
      mockJWTService.getRefreshToken.mockResolvedValue("old-refresh-token");
      mockConfigUtils.checkServerHealth.mockResolvedValue(false);
      mockJWTService.getCurrentUser.mockResolvedValue({
        userId: "1",
        email: "test@example.com",
        role: UserRole.CLIENT,
        phone: "+1234567890",
      });
      mockJWTService.forceRefreshTokens.mockResolvedValue(mockTokens);

      const result = await AuthService.refreshToken();

      expect(result.success).toBe(true);
      expect(result.message).toBe("Token refreshed successfully");
      expect(mockConfigUtils.checkServerHealth).toHaveBeenCalled();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("handles refresh token error", async () => {
      mockJWTService.getRefreshToken.mockResolvedValue("old-refresh-token");
      mockConfigUtils.checkServerHealth.mockResolvedValue(true);

      const mockResponse = {
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        json: jest.fn().mockResolvedValue({ message: "Invalid refresh token" }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
      mockEnvConfig.API = {
        DEFAULT_HEADERS: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };

      const result = await AuthService.refreshToken();

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid refresh token");
    });
  });

  describe("mock methods", () => {
    it("mockLogin creates new user when not found", async () => {
      // Временно включаем __DEV__ для тестирования mock методов
      (global as typeof globalThis & { __DEV__: boolean }).__DEV__ = true;

      const {
        createAuthMockUser,
        findAuthUserByCredentials,
      } = require("../../mocks/auth");
      createAuthMockUser.mockReturnValue({
        id: "1",
        email: "test@example.com",
        name: "Test",
        surname: "User",
        phone: "+1234567890",
        role: UserRole.CLIENT,
        avatar: null,
        rating: 0,
        createdAt: "2024-01-01T00:00:00.000Z",
        address: "",
      });
      findAuthUserByCredentials.mockReturnValue(null);

      mockJWTService.forceRefreshTokens.mockResolvedValue({
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
        expiresIn: 3600,
        tokenType: "Bearer",
      });

      const result = await AuthService.login("test@example.com", "password123");

      expect(result.success).toBe(true);
      expect(createAuthMockUser).toHaveBeenCalled();
      expect(mockJWTService.forceRefreshTokens).toHaveBeenCalled();

      (global as typeof globalThis & { __DEV__: boolean }).__DEV__ = false;
    });

    it("mockRegister creates new user", async () => {
      (global as typeof globalThis & { __DEV__: boolean }).__DEV__ = true;

      const { createAuthMockUser } = require("../../mocks/auth");
      const mockUser = {
        id: "1",
        email: "test@example.com",
        name: "Test",
        surname: "User",
        phone: "+1234567890",
        role: UserRole.CLIENT,
        avatar: null,
        rating: 0,
        createdAt: "2024-01-01T00:00:00.000Z",
        address: "",
      };
      createAuthMockUser.mockReturnValue(mockUser);

      mockJWTService.forceRefreshTokens.mockResolvedValue({
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
        expiresIn: 3600,
        tokenType: "Bearer",
      });

      const userData = {
        name: "Test",
        surname: "User",
        email: "test@example.com",
        phone: "+1234567890",
        country: "US",
        role: UserRole.CLIENT,
      };

      const result = await AuthService.register(userData, "password123");

      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockUser);
      expect(createAuthMockUser).toHaveBeenCalledWith({
        email: "test@example.com",
        role: UserRole.CLIENT,
        name: "Test",
        surname: "User",
        phone: "+1234567890",
      });

      (global as typeof globalThis & { __DEV__: boolean }).__DEV__ = false;
    });
  });
});
