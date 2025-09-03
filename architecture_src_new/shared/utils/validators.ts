/**
 * ✅ VALIDATORS
 * Clean, compact validation for forms - gRPC ready!
 */

import { SECURITY_CONFIG, SecurityUtils } from '../config/security';

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
    if (!email) return { isValid: false, errors: ['Email обязателен'] };
    
    const errors: string[] = [];
    if (!SECURITY_CONFIG.VALIDATION.PATTERNS.EMAIL.test(email)) {
      errors.push('Некорректный формат email');
    }
    if (email.length > SECURITY_CONFIG.VALIDATION.MAX_LENGTHS.EMAIL) {
      errors.push(`Email не должен превышать ${SECURITY_CONFIG.VALIDATION.MAX_LENGTHS.EMAIL} символов`);
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
      warnings: strength.level === 'weak' ? ['Пароль слишком слабый'] : undefined
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
    if (!phone) return { isValid: false, errors: ['Номер телефона обязателен'] };
    
    const cleanPhone = phone.replace(/\D/g, '');
    const errors: string[] = [];
    
    if (cleanPhone.length < 7) errors.push('Номер телефона слишком короткий');
    if (cleanPhone.length > 15) errors.push('Номер телефона слишком длинный');
    if (!SECURITY_CONFIG.VALIDATION.PATTERNS.PHONE.test(phone)) {
      errors.push('Некорректный формат номера телефона');
    }
    
    return { isValid: errors.length === 0, errors };
  }

  // 👤 NAME VALIDATION
  static validateName(name: string, fieldName: string = 'Имя'): ValidationResult {
    if (!name) return { isValid: false, errors: [`${fieldName} обязательно`] };
    
    const errors: string[] = [];
    if (name.length < 2) errors.push(`${fieldName} должно содержать минимум 2 символа`);
    if (name.length > SECURITY_CONFIG.VALIDATION.MAX_LENGTHS.NAME) {
      errors.push(`${fieldName} не должно превышать ${SECURITY_CONFIG.VALIDATION.MAX_LENGTHS.NAME} символов`);
    }
    if (!SECURITY_CONFIG.VALIDATION.PATTERNS.NAME.test(name)) {
      errors.push(`${fieldName} содержит недопустимые символы`);
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
      errors.push('Некорректный формат номера прав (AZ12345678)');
    }
    
    // Vehicle validation
    if (!SECURITY_CONFIG.VALIDATION.PATTERNS.VEHICLE.test(data.vehicleNumber)) {
      errors.push('Некорректный формат номера автомобиля (12-AB-123)');
    }
    
    // Expiry validation
    const expiry = new Date(data.licenseExpiry);
    if (isNaN(expiry.getTime())) {
      errors.push('Некорректная дата');
    } else if (expiry <= new Date()) {
      errors.push('Срок действия прав истек');
    }
    
    return { isValid: errors.length === 0, errors };
  }

  // 🔐 LOGIN VALIDATION
  static validateLogin(data: { email: string; password: string }): ValidationResult {
    const errors: string[] = [];
    if (!data.email) errors.push('Email обязателен');
    if (!data.password) errors.push('Пароль обязателен');
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
      errors.push('Пароли не совпадают');
    }
    
    return { isValid: errors.length === 0, errors };
  }
}

export default Validators;
