export const VERIFICATION_CONSTANTS = {
  STORAGE_KEYS: {
    EMAIL: 'verification_email',
    PHONE: 'verification_phone',
  },
  VERIFICATION: {
    CODE: '1234', // Mock verification code
    TIMEOUT: 1000, // 1 second delay for mock verification
  },
  TYPES: {
    EMAIL: 'email',
    PHONE: 'phone',
  },
} as const;
