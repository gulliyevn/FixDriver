/**
 * Social Authentication Mock Service
 * 
 * Mock implementations for social authentication
 */

import { SocialUser, SocialAuthResult } from './SocialAuthTypes';
import { SOCIAL_AUTH_CONSTANTS } from '../../../shared/constants';

export class SocialAuthMockService {
  /**
   * Mock Google Sign-In
   */
  static async mockGoogleSignIn(): Promise<SocialAuthResult> {
    await new Promise(resolve => setTimeout(resolve, SOCIAL_AUTH_CONSTANTS.MOCK.DELAY));
    
    return {
      success: true,
      user: {
        id: 'google_user_123',
        email: 'user@gmail.com',
        name: 'Google User',
        photo: 'https://via.placeholder.com/150',
        provider: 'google',
        accessToken: 'mock_google_token',
      }
    };
  }

  /**
   * Mock Facebook Sign-In
   */
  static async mockFacebookSignIn(): Promise<SocialAuthResult> {
    await new Promise(resolve => setTimeout(resolve, SOCIAL_AUTH_CONSTANTS.MOCK.DELAY));
    
    return {
      success: true,
      user: {
        id: 'facebook_user_456',
        email: 'user@facebook.com',
        name: 'Facebook User',
        photo: 'https://via.placeholder.com/150',
        provider: 'facebook',
        accessToken: 'mock_facebook_token',
      }
    };
  }

  /**
   * Mock Apple Sign-In
   */
  static async mockAppleSignIn(): Promise<SocialAuthResult> {
    await new Promise(resolve => setTimeout(resolve, SOCIAL_AUTH_CONSTANTS.MOCK.DELAY));
    
    return {
      success: true,
      user: {
        id: 'apple_user_789',
        email: 'user@icloud.com',
        name: 'Apple User',
        photo: null,
        provider: 'apple',
        accessToken: 'mock_apple_token',
      }
    };
  }

  /**
   * Get Facebook user info from Graph API
   */
  static async getFacebookUserInfo(accessToken: string): Promise<Record<string, unknown>> {
    // TODO: Real integration with Facebook Graph API
    const response = await fetch(
      `${SOCIAL_AUTH_CONSTANTS.FACEBOOK.GRAPH_API_URL}?fields=id,name,email,picture&access_token=${accessToken}`
    );
    return response.json();
  }
}
