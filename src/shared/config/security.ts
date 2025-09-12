/**
 * 🔐 SECURITY CONFIGURATION
 * Clean, compact, gRPC-ready security settings
 */

// Security constants
const SECURITY_CONSTANTS = {
  VALIDATION: {
    MAX_LENGTHS: {
      EMAIL: 254,
      NAME: 50,
      PHONE: 20,
    },
  },
  PASSWORD: {
    MIN_LENGTH: 8,
  },
  SESSION: {
    TOKEN_EXPIRY_HOURS: 24,
    REFRESH_THRESHOLD_MINUTES: 5,
  },
  CRYPTO: {
    RANDOM_BYTES_LENGTH: 16,
    SALT_LENGTH: 16,
    HASH_ALGORITHM: 'SHA-256',
    HEX_PADDING: 2,
  },
  TOKEN: {
    PREFIX: 'token_',
  },
  VALIDATION_ERRORS: {
    MIN_LENGTH: 'minLength',
    UPPERCASE: 'uppercase',
    LOWERCASE: 'lowercase',
    NUMBERS: 'numbers',
    SPECIAL_CHARS: 'specialChars',
  },
} as const;

export const SECURITY_CONFIG = {
  VALIDATION: {
    PATTERNS: {
      EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      PHONE: /^\+?[\d\s\-\(\)]+$/,
      NAME: /^[а-яёa-z\s\-']+$/i,
      LICENSE: /^[A-Z]{2}\d{8}$/, // AZ12345678
      VEHICLE: /^\d{2}-[A-Z]{2}-\d{3}$/ // 12-AB-123
    },
    MAX_LENGTHS: {
      EMAIL: SECURITY_CONSTANTS.VALIDATION.MAX_LENGTHS.EMAIL,
      NAME: SECURITY_CONSTANTS.VALIDATION.MAX_LENGTHS.NAME,
      PHONE: SECURITY_CONSTANTS.VALIDATION.MAX_LENGTHS.PHONE
    }
  },
  PASSWORD: {
    MIN_LENGTH: SECURITY_CONSTANTS.PASSWORD.MIN_LENGTH,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL: false
  },
  SESSION: {
    TOKEN_EXPIRY: SECURITY_CONSTANTS.SESSION.TOKEN_EXPIRY_HOURS * 60 * 60 * 1000, // 24 hours
    REFRESH_THRESHOLD: SECURITY_CONSTANTS.SESSION.REFRESH_THRESHOLD_MINUTES * 60 * 1000 // 5 minutes
  }
};

export class SecurityUtils {
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < SECURITY_CONFIG.PASSWORD.MIN_LENGTH) {
      errors.push(SECURITY_CONSTANTS.VALIDATION_ERRORS.MIN_LENGTH);
    }
    if (SECURITY_CONFIG.PASSWORD.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
      errors.push(SECURITY_CONSTANTS.VALIDATION_ERRORS.UPPERCASE);
    }
    if (SECURITY_CONFIG.PASSWORD.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
      errors.push(SECURITY_CONSTANTS.VALIDATION_ERRORS.LOWERCASE);
    }
    if (SECURITY_CONFIG.PASSWORD.REQUIRE_NUMBERS && !/\d/.test(password)) {
      errors.push(SECURITY_CONSTANTS.VALIDATION_ERRORS.NUMBERS);
    }
    if (SECURITY_CONFIG.PASSWORD.REQUIRE_SPECIAL && !/[@$!%*?&]/.test(password)) {
      errors.push(SECURITY_CONSTANTS.VALIDATION_ERRORS.SPECIAL_CHARS);
    }
    
    return { isValid: errors.length === 0, errors };
  }

  static generateSecureToken(): string {
    // Generate cryptographically secure token
    const timestamp = Date.now().toString(36);
    const randomBytes = Array.from(crypto.getRandomValues(new Uint8Array(SECURITY_CONSTANTS.CRYPTO.RANDOM_BYTES_LENGTH)))
      .map(b => b.toString(36))
      .join('');
    return `${SECURITY_CONSTANTS.TOKEN.PREFIX}${timestamp}_${randomBytes}`;
  }

  static async hashPassword(password: string): Promise<string> {
    // Use Web Crypto API for secure hashing
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest(SECURITY_CONSTANTS.CRYPTO.HASH_ALGORITHM, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(SECURITY_CONSTANTS.CRYPTO.HEX_PADDING, '0')).join('');
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const hashedInput = await this.hashPassword(password);
    return hashedInput === hashedPassword;
  }

  static validateEmail(email: string): boolean {
    return SECURITY_CONFIG.VALIDATION.PATTERNS.EMAIL.test(email);
  }

  static validatePhone(phone: string): boolean {
    return SECURITY_CONFIG.VALIDATION.PATTERNS.PHONE.test(phone);
  }

  static validateName(name: string): boolean {
    return SECURITY_CONFIG.VALIDATION.PATTERNS.NAME.test(name) && 
           name.length <= SECURITY_CONFIG.VALIDATION.MAX_LENGTHS.NAME;
  }

  static validateLicense(license: string): boolean {
    return SECURITY_CONFIG.VALIDATION.PATTERNS.LICENSE.test(license);
  }

  static validateVehicleNumber(vehicleNumber: string): boolean {
    return SECURITY_CONFIG.VALIDATION.PATTERNS.VEHICLE.test(vehicleNumber);
  }

  static sanitizeInput(input: string): string {
    // Remove potentially dangerous characters
    return input
      .replace(/[<>\"'&]/g, '') // Remove HTML/XML characters
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  static generateSalt(): string {
    const array = new Uint8Array(SECURITY_CONSTANTS.CRYPTO.SALT_LENGTH);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(SECURITY_CONSTANTS.CRYPTO.HEX_PADDING, '0')).join('');
  }
}
