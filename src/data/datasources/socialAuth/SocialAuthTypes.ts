/**
 * Social Authentication Types
 * 
 * Types and interfaces for social authentication service
 */

export interface SocialUser {
  id: string;
  email: string;
  name: string;
  photo?: string | null;
  provider: 'google' | 'facebook' | 'apple';
  accessToken?: string;
  refreshToken?: string;
}

export interface SocialAuthResult {
  success: boolean;
  user?: SocialUser;
  error?: string;
}

export interface ISocialAuthService {
  signInWithGoogle(): Promise<SocialAuthResult>;
  signInWithFacebook(): Promise<SocialAuthResult>;
  signInWithApple(): Promise<SocialAuthResult>;
  signOut(): Promise<void>;
  isSocialAuthAvailable(provider: 'google' | 'facebook' | 'apple'): boolean;
  validateSocialUser(user: SocialUser): boolean;
  createUserFromSocial(user: SocialUser): Record<string, unknown>;
  checkAvailability(): { apple: boolean; facebook: boolean; google: boolean; platform: string };
  syncWithBackend(): Promise<boolean>;
}

export interface SocialAuthAvailability {
  apple: boolean;
  facebook: boolean;
  google: boolean;
  platform: string;
}

export interface SocialUserData {
  email: string;
  name: string;
  phone: string;
  role: string;
  socialProvider: string;
  socialId: string;
  photo?: string | null;
  isEmailVerified: boolean;
  [key: string]: unknown;
}
