import { AuthResponse, RegisterData, User, UserRole } from '../../../../shared/types';

export interface IAuthService {
  /**
   * User login
   */
  login(email: string, password: string): Promise<AuthResponse>;

  /**
   * Register new user
   */
  register(userData: RegisterData): Promise<AuthResponse>;

  /**
   * User logout
   */
  logout(): Promise<void>;

  /**
   * Refresh authentication token
   */
  refreshToken(): Promise<AuthResponse>;

  /**
   * Validate authentication token
   */
  validateToken(token: string): Promise<boolean>;

  /**
   * Get current authenticated user
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Switch user role
   */
  switchRole(role: UserRole): Promise<User>;

  /**
   * Create profile for specific role
   */
  createProfile(role: UserRole, profileData: any): Promise<User>;

  /**
   * Send password reset OTP to email
   */
  sendPasswordReset(email: string): Promise<{ success: boolean; requestId: string }>;

  /**
   * Verify OTP for password reset
   */
  verifyPasswordResetOtp(requestId: string, otp: string): Promise<{ success: boolean; token: string }>;

  /**
   * Finalize password reset using server-issued reset token
   */
  resetPassword(token: string, newPassword: string): Promise<{ success: boolean }>;
}
