/**
 * ✅ VALIDATORS
 * Clean, compact validation for forms - gRPC ready!
 */

import { SECURITY_CONFIG, SecurityUtils } from '../config/security';

// 📝 Centralized validation messages
const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Invalid email format',
  EMAIL_TOO_LONG: 'Email must not exceed 254 characters',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_TOO_WEAK: 'Password is too weak',
  PHONE_REQUIRED: 'Phone number is required',
  PHONE_TOO_SHORT: 'Phone number is too short',
  PHONE_TOO_LONG: 'Phone number is too long',
  PHONE_INVALID: 'Invalid phone number format',
  NAME_REQUIRED: 'Name is required',
  NAME_TOO_SHORT: 'Name must contain at least 2 characters',
  NAME_TOO_LONG: 'Name must not exceed 50 characters',
  NAME_INVALID: 'Name contains invalid characters',
  LICENSE_INVALID: 'Invalid license number format (AZ12345678)',
  VEHICLE_INVALID: 'Invalid vehicle number format (12-AB-123)',
  DATE_INVALID: 'Invalid date',
  LICENSE_EXPIRED: 'License has expired',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
} as const;

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface PasswordStrength {
  score: number;
  level: 'weak' | 'medium' | 'strong' | 'very-strong';
  feedback: string[];
}

export class Validators {
  // 📧 EMAIL VALIDATION
  static validateEmail(email: string): ValidationResult {
    if (!email) return { isValid: false, errors: [VALIDATION_MESSAGES.EMAIL_REQUIRED] };
    
    const errors: string[] = [];
    if (!SECURITY_CONFIG.VALIDATION.PATTERNS.EMAIL.test(email)) {
      errors.push(VALIDATION_MESSAGES.EMAIL_INVALID);
    }
    if (email.length > SECURITY_CONFIG.VALIDATION.MAX_LENGTHS.EMAIL) {
      errors.push(VALIDATION_MESSAGES.EMAIL_TOO_LONG);
    }
    
    return { isValid: errors.length === 0, errors };
  }

  // 🔑 PASSWORD VALIDATION
  static validatePassword(password: string): ValidationResult {
    const result = SecurityUtils.validatePassword(password);
    const strength = this.getPasswordStrength(password);
    
    return {
      isValid: result.isValid,
      errors: result.errors,
      warnings: strength.level === 'weak' ? [VALIDATION_MESSAGES.PASSWORD_TOO_WEAK] : undefined
    };
  }

  // 📊 PASSWORD STRENGTH
  static getPasswordStrength(password: string): PasswordStrength {
    let score = 0;
    const feedback: string[] = [];
    
    // Length scoring
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    
    // Complexity scoring
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[@$!%*?&]/.test(password)) score += 1;
    
    // Penalties
    if (/(.)\1{2,}/.test(password)) score -= 1;
    if (/123|abc|qwe/i.test(password)) score -= 1;
    
    // Level determination
    const level = score <= 3 ? 'weak' : score <= 5 ? 'medium' : score <= 7 ? 'strong' : 'very-strong';
    
    // Feedback
    if (password.length < 8) feedback.push('minLength');
    if (!/[A-Z]/.test(password)) feedback.push('uppercase');
    if (!/[a-z]/.test(password)) feedback.push('lowercase');
    if (!/\d/.test(password)) feedback.push('numbers');
    if (!/[@$!%*?&]/.test(password)) feedback.push('specialChars');
    
    return { score, level, feedback };
  }

  // 📱 PHONE VALIDATION
  static validatePhone(phone: string): ValidationResult {
    if (!phone) return { isValid: false, errors: [VALIDATION_MESSAGES.PHONE_REQUIRED] };
    
    const cleanPhone = phone.replace(/\D/g, '');
    const errors: string[] = [];
    
    if (cleanPhone.length < 7) errors.push(VALIDATION_MESSAGES.PHONE_TOO_SHORT);
    if (cleanPhone.length > 15) errors.push(VALIDATION_MESSAGES.PHONE_TOO_LONG);
    if (!SECURITY_CONFIG.VALIDATION.PATTERNS.PHONE.test(phone)) {
      errors.push(VALIDATION_MESSAGES.PHONE_INVALID);
    }
    
    return { isValid: errors.length === 0, errors };
  }

  // 👤 NAME VALIDATION
  static validateName(name: string, fieldName: string = 'Name'): ValidationResult {
    if (!name) return { isValid: false, errors: [`${fieldName} is required`] };
    
    const errors: string[] = [];
    if (name.length < 2) errors.push(`${fieldName} must contain at least 2 characters`);
    if (name.length > SECURITY_CONFIG.VALIDATION.MAX_LENGTHS.NAME) {
      errors.push(`${fieldName} must not exceed ${SECURITY_CONFIG.VALIDATION.MAX_LENGTHS.NAME} characters`);
    }
    if (!SECURITY_CONFIG.VALIDATION.PATTERNS.NAME.test(name)) {
      errors.push(`${fieldName} contains invalid characters`);
    }
    
    return { isValid: errors.length === 0, errors };
  }

  // 🚗 DRIVER VALIDATION
  static validateDriverData(data: {
    licenseNumber: string;
    vehicleNumber: string;
    licenseExpiry: string;
  }): ValidationResult {
    const errors: string[] = [];
    
    // License validation
    if (!SECURITY_CONFIG.VALIDATION.PATTERNS.LICENSE.test(data.licenseNumber)) {
      errors.push(VALIDATION_MESSAGES.LICENSE_INVALID);
    }
    
    // Vehicle validation
    if (!SECURITY_CONFIG.VALIDATION.PATTERNS.VEHICLE.test(data.vehicleNumber)) {
      errors.push(VALIDATION_MESSAGES.VEHICLE_INVALID);
    }
    
    // Expiry validation
    const expiry = new Date(data.licenseExpiry);
    if (isNaN(expiry.getTime())) {
      errors.push(VALIDATION_MESSAGES.DATE_INVALID);
    } else if (expiry <= new Date()) {
      errors.push(VALIDATION_MESSAGES.LICENSE_EXPIRED);
    }
    
    return { isValid: errors.length === 0, errors };
  }

  // 🔐 LOGIN VALIDATION
  static validateLogin(data: { email: string; password: string }): ValidationResult {
    const errors: string[] = [];
    if (!data.email) errors.push(VALIDATION_MESSAGES.EMAIL_REQUIRED);
    if (!data.password) errors.push(VALIDATION_MESSAGES.PASSWORD_REQUIRED);
    return { isValid: errors.length === 0, errors };
  }

  // 📝 REGISTRATION VALIDATION
  static validateRegistration(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }): ValidationResult {
    const errors: string[] = [];
    
    // Basic validations
    errors.push(...this.validateName(data.name).errors);
    errors.push(...this.validateEmail(data.email).errors);
    errors.push(...this.validatePhone(data.phone).errors);
    errors.push(...this.validatePassword(data.password).errors);
    
    // Password confirmation
    if (data.password !== data.confirmPassword) {
      errors.push(VALIDATION_MESSAGES.PASSWORDS_DONT_MATCH);
    }
    
    return { isValid: errors.length === 0, errors };
  }
}

export default Validators;
