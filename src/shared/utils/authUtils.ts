/**
 * Authentication utilities
 *
 * These helpers operate on token expiration and session timing.
 */

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
  return new Date(Date.now() + expiresIn * 1000);
};

/**
 * Determine if token should be refreshed within thresholdMinutes.
 */
export const shouldRefreshToken = (
  expiresAt: string,
  thresholdMinutes: number = 5,
): boolean => {
  const expiryTime = new Date(expiresAt);
  const thresholdTime = new Date(Date.now() + thresholdMinutes * 60 * 1000);
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


