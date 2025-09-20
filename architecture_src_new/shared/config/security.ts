/**
 * 🔐 SECURITY CONFIGURATION
 * Clean, compact, gRPC-ready security settings
 */

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
      EMAIL: 254,
      NAME: 50,
      PHONE: 20
    }
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL: false
  },
  SESSION: {
    TOKEN_EXPIRY: 0, // 0 = no expiry (disabled auto logout)
    REFRESH_THRESHOLD: 0 // 0 = no refresh needed (disabled auto logout)
  }
};

export class SecurityUtils {
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < SECURITY_CONFIG.PASSWORD.MIN_LENGTH) {
      errors.push('minLength');
    }
    if (SECURITY_CONFIG.PASSWORD.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
      errors.push('uppercase');
    }
    if (SECURITY_CONFIG.PASSWORD.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
      errors.push('lowercase');
    }
    if (SECURITY_CONFIG.PASSWORD.REQUIRE_NUMBERS && !/\d/.test(password)) {
      errors.push('numbers');
    }
    if (SECURITY_CONFIG.PASSWORD.REQUIRE_SPECIAL && !/[@$!%*?&]/.test(password)) {
      errors.push('specialChars');
    }
    
    return { isValid: errors.length === 0, errors };
  }

  static generateSecureToken(): string {
    return `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static hashPassword(password: string): string {
    // In real app, use bcrypt or similar
    return `hashed_${password}_${Date.now()}`;
  }
}
