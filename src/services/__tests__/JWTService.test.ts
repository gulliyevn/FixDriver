import { JWTService } from "../JWTService";

describe("JWTService", () => {
  const userData = {
    userId: "123",
    email: "test@example.com",
    role: "client" as const,
    phone: "+1234567890",
  };

  beforeEach(() => {
    // Clear AsyncStorage before each test
    jest.clearAllMocks();
  });

  describe("generateTokens", () => {
    it("generates valid access and refresh tokens", async () => {
      const tokens = await JWTService.generateTokens(userData);

      expect(tokens).toHaveProperty("accessToken");
      expect(tokens).toHaveProperty("refreshToken");
      expect(typeof tokens.accessToken).toBe("string");
      expect(typeof tokens.refreshToken).toBe("string");
      expect(tokens.accessToken.length).toBeGreaterThan(0);
      expect(tokens.refreshToken.length).toBeGreaterThan(0);
    });

    it("generates different tokens for different users", async () => {
      const user2 = { ...userData, userId: "456", email: "test2@example.com" };

      const tokens1 = await JWTService.generateTokens(userData);
      const tokens2 = await JWTService.generateTokens(user2);

      expect(tokens1.accessToken).not.toBe(tokens2.accessToken);
      expect(tokens1.refreshToken).not.toBe(tokens2.refreshToken);
    });

    it("includes user data in tokens", async () => {
      const tokens = await JWTService.generateTokens(userData);

      const decodedAccess = JWTService.decode(tokens.accessToken);
      const decodedRefresh = JWTService.decode(tokens.refreshToken);

      expect(decodedAccess).toMatchObject({
        userId: userData.userId,
        email: userData.email,
        role: userData.role,
        phone: userData.phone,
      });

      expect(decodedRefresh).toMatchObject({
        userId: userData.userId,
        email: userData.email,
        role: userData.role,
        phone: userData.phone,
      });
    });
  });

  describe("verifyToken", () => {
    it("verifies valid access token", async () => {
      const tokens = await JWTService.generateTokens(userData);
      const result = await JWTService.verifyToken(tokens.accessToken);

      expect(result).toMatchObject(userData);
    });

    it("verifies valid refresh token", async () => {
      const tokens = await JWTService.generateTokens(userData);
      const result = await JWTService.verifyToken(tokens.refreshToken);

      expect(result).toMatchObject(userData);
    });

    it("rejects invalid token", async () => {
      const result = await JWTService.verifyToken("invalid-token");
      expect(result).toBeNull();
    });

    it("rejects empty token", async () => {
      const result = await JWTService.verifyToken("");
      expect(result).toBeNull();
    });

    it("rejects null token", async () => {
      const result = await JWTService.verifyToken(null as any);
      expect(result).toBeNull();
    });

    it("rejects token with wrong signature", async () => {
      const tokens = await JWTService.generateTokens(userData);

      // Modify the token to have wrong signature
      const modifiedToken = tokens.accessToken.slice(0, -10) + "modified";

      const result = await JWTService.verifyToken(modifiedToken);
      expect(result).toBeNull();
    });
  });

  describe("decodeToken", () => {
    it("decodes valid token", async () => {
      const tokens = await JWTService.generateTokens(userData);
      const decoded = JWTService.decode(tokens.accessToken);

      expect(decoded).toMatchObject(userData);
      expect(decoded).toHaveProperty("iat");
      expect(decoded).toHaveProperty("exp");
    });

    it("handles invalid token format", () => {
      const decoded = JWTService.decode("invalid-token-format");
      expect(decoded).toBeNull();
    });

    it("handles empty token", () => {
      const decoded = JWTService.decode("");
      expect(decoded).toBeNull();
    });

    it("handles null token", () => {
      const decoded = JWTService.decode(null as any);
      expect(decoded).toBeNull();
    });
  });

  describe("forceRefreshTokens", () => {
    it("generates new tokens without verification", async () => {
      const tokens = await JWTService.forceRefreshTokens(userData);

      expect(tokens).toHaveProperty("accessToken");
      expect(tokens).toHaveProperty("refreshToken");
      expect(typeof tokens.accessToken).toBe("string");
      expect(typeof tokens.refreshToken).toBe("string");
    });

    it("includes user data in forced refresh tokens", async () => {
      const tokens = await JWTService.forceRefreshTokens(userData);
      const decodedAccess = JWTService.decode(tokens.accessToken);
      const decodedRefresh = JWTService.decode(tokens.refreshToken);

      expect(decodedAccess).toMatchObject(userData);
      expect(decodedRefresh).toMatchObject(userData);
    });
  });

  describe("getTokenExpiry", () => {
    it("returns correct expiry for access token", async () => {
      const tokens = await JWTService.generateTokens(userData);
      const expiry = JWTService.getTokenExpiration(tokens.accessToken);

      expect(expiry).toBeInstanceOf(Date);
      expect(expiry!.getTime()).toBeGreaterThan(Date.now());
    });

    it("returns correct expiry for refresh token", async () => {
      const tokens = await JWTService.generateTokens(userData);
      const expiry = JWTService.getTokenExpiration(tokens.refreshToken);

      expect(expiry).toBeInstanceOf(Date);
      expect(expiry!.getTime()).toBeGreaterThan(Date.now());
    });

    it("returns null for invalid token", () => {
      const expiry = JWTService.getTokenExpiration("invalid-token");
      expect(expiry).toBeNull();
    });

    it("returns null for empty token", () => {
      const expiry = JWTService.getTokenExpiration("");
      expect(expiry).toBeNull();
    });

    it("returns null for null token", () => {
      const expiry = JWTService.getTokenExpiration(null as any);
      expect(expiry).toBeNull();
    });
  });

  describe("isTokenExpired", () => {
    it("returns false for valid token", async () => {
      const tokens = await JWTService.generateTokens(userData);
      const isExpired = JWTService.isTokenExpired(tokens.accessToken);
      expect(isExpired).toBe(false);
    });

    it("returns true for invalid token", () => {
      const isExpired = JWTService.isTokenExpired("invalid-token");
      expect(isExpired).toBe(true);
    });

    it("returns true for empty token", () => {
      const isExpired = JWTService.isTokenExpired("");
      expect(isExpired).toBe(true);
    });

    it("returns true for null token", () => {
      const isExpired = JWTService.isTokenExpired(null as any);
      expect(isExpired).toBe(true);
    });
  });

  describe("Token expiry times", () => {
    it("access token expires in correct time", async () => {
      const tokens = await JWTService.generateTokens(userData);
      const expiry = JWTService.getTokenExpiration(tokens.accessToken);
      const now = new Date();
      const timeDiff = expiry!.getTime() - now.getTime();

      // Should expire in approximately 24 hours (86400000 ms)
      expect(timeDiff).toBeGreaterThan(23 * 60 * 60 * 1000); // At least 23 hours
      expect(timeDiff).toBeLessThan(25 * 60 * 60 * 1000); // Less than 25 hours
    });

    it("refresh token expires in correct time", async () => {
      const tokens = await JWTService.generateTokens(userData);
      const expiry = JWTService.getTokenExpiration(tokens.refreshToken);
      const now = new Date();
      const timeDiff = expiry!.getTime() - now.getTime();

      // Should expire in approximately 7 days (604800000 ms)
      expect(timeDiff).toBeGreaterThan(6 * 24 * 60 * 60 * 1000); // At least 6 days
      expect(timeDiff).toBeLessThan(8 * 24 * 60 * 60 * 1000); // Less than 8 days
    });
  });

  describe("Error handling", () => {
    it("handles malformed tokens gracefully", async () => {
      const result = await JWTService.verifyToken("header.payload.signature");
      expect(result).toBeNull();
    });

    it("handles tokens with missing parts", async () => {
      const result = await JWTService.verifyToken("header.payload");
      expect(result).toBeNull();
    });

    it("handles tokens with invalid base64", async () => {
      const result = await JWTService.verifyToken("invalid.base64.signature");
      expect(result).toBeNull();
    });
  });
});
