import { JWTService as DataJWTService } from '../../data/datasources/jwt/JWTService';
import { TokenResponse, JWTPayload } from '../../data/datasources/jwt/JWTTypes';

// Facade for presentation layer expected API
const jwt = new DataJWTService();

const refreshAccessToken = async (): Promise<string | null> => {
  const stored = await jwt.getStoredTokens();
  if (!stored?.refreshToken) return null;
  const refreshed = await jwt.refreshToken(stored.refreshToken);
  if (refreshed) {
    await jwt.storeTokens(refreshed);
    return refreshed.accessToken;
  }
  return null;
};

const hasValidToken = async (): Promise<boolean> => {
  return jwt.validateStoredTokens();
};

const getCurrentUser = async (): Promise<JWTPayload | null> => {
  const tokens = await jwt.getStoredTokens();
  if (!tokens?.accessToken) return null;
  return jwt.decode(tokens.accessToken);
};

const getAuthHeader = async (): Promise<{ Authorization: string } | null> => {
  const token = await jwt.getValidAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : null;
};

const saveTokens = async (tokens: TokenResponse): Promise<void> => {
  await jwt.storeTokens(tokens);
};

const clearTokens = async (): Promise<void> => {
  await jwt.clearTokens();
};

export default {
  refreshAccessToken,
  hasValidToken,
  getCurrentUser,
  getAuthHeader,
  saveTokens,
  clearTokens,
};


