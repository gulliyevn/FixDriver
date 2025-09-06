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

export interface IJWTService {
  generateToken(payload: JWTPayload): Promise<string>;
  verifyToken(token: string): Promise<JWTPayload | null>;
  refreshToken(refreshToken: string): Promise<TokenResponse | null>;
  isTokenExpired(token: string): Promise<boolean>;
  decode(token: string): JWTPayload | null;
  getTokenExpiration(token: string): Date | null;
  storeTokens(tokens: TokenResponse): Promise<void>;
  getStoredTokens(): Promise<TokenResponse | null>;
  clearTokens(): Promise<void>;
}

export interface IJWTTokenHandler {
  generateToken(payload: JWTPayload): Promise<string>;
  verifyToken(token: string): Promise<JWTPayload | null>;
  refreshToken(refreshToken: string): Promise<TokenResponse | null>;
  decode(token: string): JWTPayload | null;
}

export interface IJWTValidationService {
  isTokenExpired(token: string): Promise<boolean>;
  validateToken(token: string): Promise<boolean>;
  getTokenExpiration(token: string): Date | null;
}
