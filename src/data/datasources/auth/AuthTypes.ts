import { User } from '../../../shared/types/user';

export interface AuthResponse {
  success: boolean;
  user?: User;
  tokens?: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
  };
  message?: string;
}

export interface IAuthService {
  login(email: string, password: string, authMethod?: string): Promise<AuthResponse>;
  register(userData: {
    name: string;
    surname: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<AuthResponse>;
  logout(): Promise<AuthResponse>;
  refreshToken(): Promise<AuthResponse>;
}

// Interfaces for Go API compatibility
export interface GoUserInfo {
  id: number;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  status: string;
}

export interface GoTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  expires_at: string;
  user_info: GoUserInfo;
}

export interface GoLoginRequest {
  email: string;
  password: string;
}

export interface GoRegisterRequest {
  email: string;
  password: string;
  phone_number: string;
  first_name: string;
  last_name: string;
}
