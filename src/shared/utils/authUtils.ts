/**
 * Authentication utilities
 *
 * These helpers operate on token expiration and session timing.
 */

// Auth utility constants
const AUTH_CONSTANTS = {
  MILLISECONDS_PER_SECOND: 1000,
  DEFAULT_THRESHOLD_MINUTES: 5,
  SECONDS_PER_MINUTE: 60,
} as const;

/**
 * Check whether a token is already expired.
 */
export const isTokenExpired = (expiresAt: string): boolean => {
  return new Date(expiresAt) < new Date();
};

/**
 * Compute the absolute expiration Date given expiresIn seconds.
 */
export const getTokenExpiryTime = (expiresIn: number): Date => {
  return new Date(Date.now() + expiresIn * AUTH_CONSTANTS.MILLISECONDS_PER_SECOND);
};

/**
 * Determine if token should be refreshed within thresholdMinutes.
 */
export const shouldRefreshToken = (
  expiresAt: string,
  thresholdMinutes: number = AUTH_CONSTANTS.DEFAULT_THRESHOLD_MINUTES,
): boolean => {
  const expiryTime = new Date(expiresAt);
  const thresholdTime = new Date(Date.now() + thresholdMinutes * AUTH_CONSTANTS.SECONDS_PER_MINUTE * AUTH_CONSTANTS.MILLISECONDS_PER_SECOND);
  return expiryTime <= thresholdTime;
};

/**
 * Calculate session duration in seconds between creation and expiration.
 */
export const getSessionDuration = (createdAt: string, expiresAt: string): number => {
  const created = new Date(createdAt);
  const expires = new Date(expiresAt);
  return Math.floor((expires.getTime() - created.getTime()) / 1000);
};


