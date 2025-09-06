/**
 * Social Authentication Utils
 * 
 * Utility functions for social authentication
 */

import { Platform } from 'react-native';
import { SocialUser, SocialUserData } from './SocialAuthTypes';
import { SOCIAL_AUTH_CONSTANTS } from '../../../shared/constants';

export class SocialAuthUtils {
  /**
   * Log function for social auth (disabled for production)
   */
  static log(message: string, data?: unknown): void {
    if (SOCIAL_AUTH_CONSTANTS.ENABLE_LOGS) {
      console.log(`[SocialAuth] ${message}`, data);
    }
  }

  /**
   * Validate social user data
   */
  static validateSocialUser(user: SocialUser): boolean {
    return !!(
      user.id &&
      user.email &&
      user.name &&
      user.provider &&
      SOCIAL_AUTH_CONSTANTS.PROVIDERS.includes(user.provider)
    );
  }

  /**
   * Create user data from social authentication
   */
  static createUserFromSocial(user: SocialUser): SocialUserData {
    return {
      email: user.email,
      name: user.name,
      phone: '', // Social networks don't provide phone
      role: SOCIAL_AUTH_CONSTANTS.DEFAULT_ROLE,
      socialProvider: user.provider,
      socialId: user.id,
      photo: user.photo,
      isEmailVerified: true, // Social accounts are already verified
    };
  }

  /**
   * Check if social authentication is available for provider
   */
  static isSocialAuthAvailable(provider: 'google' | 'facebook' | 'apple'): boolean {
    switch (provider) {
      case 'google':
        return Platform.OS === 'android' || Platform.OS === 'ios';
      case 'facebook':
        return Platform.OS === 'android' || Platform.OS === 'ios';
      case 'apple':
        return Platform.OS === 'ios';
      default:
        return false;
    }
  }

  /**
   * Check availability of all social providers
   */
  static checkAvailability(): { apple: boolean; facebook: boolean; google: boolean; platform: string } {
    const platform = Platform.OS;
    const availability = {
      apple: platform === 'ios',
      facebook: true,
      google: true,
      platform,
    };
    
    this.log('Social Auth Availability:', availability);
    return availability;
  }
}
