/**
 * Social Authentication Constants
 * 
 * Constants for social authentication service
 */

export const SOCIAL_AUTH_CONSTANTS = {
  ENABLE_LOGS: false, // Disabled for production - only for development
  DEFAULT_ROLE: 'client',
  PROVIDERS: ['google', 'facebook', 'apple'] as const,
  MOCK: {
    DELAY: 1000,
  },
  FACEBOOK: {
    GRAPH_API_URL: 'https://graph.facebook.com/me',
  },
  ERRORS: {
    GOOGLE_NOT_CONFIGURED: 'Google Sign-In not configured',
    FACEBOOK_NOT_CONFIGURED: 'Facebook Login not configured',
    APPLE_NOT_CONFIGURED: 'Apple Sign-In not configured',
    GOOGLE_SIGNIN_ERROR: 'Google Sign-In error',
    FACEBOOK_LOGIN_ERROR: 'Facebook Login error',
    APPLE_SIGNIN_ERROR: 'Apple Sign-In error',
  }
} as const;
