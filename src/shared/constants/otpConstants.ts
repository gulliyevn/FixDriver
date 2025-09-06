/**
 * OTP Service Constants
 * 
 * Constants for OTP (One-Time Password) service functionality
 */

export const OTP_CONSTANTS = {
  LENGTH: 6,
  EXPIRY_MINUTES: 10,
  MAX_ATTEMPTS: 3,
  DEV_MOCK_CODE: '123456',
  MOCK: {
    SMS_DELAY: 1500,
    VERIFICATION_DELAY: 1000,
  },
  VALIDATION: {
    FORMAT_REGEX: /^\d{6}$/,
  }
} as const;
