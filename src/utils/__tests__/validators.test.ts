import { Validators } from '../validators';

describe('Validators', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(Validators.validateEmail('test@example.com')).toEqual({
        isValid: true,
        errors: [],
        warnings: []
      });
      
      expect(Validators.validateEmail('user.name+tag@domain.co.uk')).toEqual({
        isValid: true,
        errors: [],
        warnings: []
      });
    });

    it('should reject invalid email addresses', () => {
      expect(Validators.validateEmail('invalid-email')).toEqual({
        isValid: false,
        errors: ['Некорректный формат email'],
        warnings: []
      });
      
      expect(Validators.validateEmail('test@')).toEqual({
        isValid: false,
        errors: ['Некорректный формат email'],
        warnings: []
      });
      
      expect(Validators.validateEmail('')).toEqual({
        isValid: false,
        errors: ['Email обязателен'],
        warnings: []
      });
    });
  });

  describe('validatePhone', () => {
    it('should validate correct phone numbers', () => {
      expect(Validators.validatePhone('+994501234567')).toEqual({
        isValid: true,
        errors: [],
        warnings: []
      });
      
      expect(Validators.validatePhone('994501234567')).toEqual({
        isValid: true,
        errors: [],
        warnings: []
      });
    });

    it('should reject invalid phone numbers', () => {
      expect(Validators.validatePhone('123')).toEqual({
        isValid: false,
        errors: ['Номер телефона слишком короткий'],
        warnings: []
      });
      
      expect(Validators.validatePhone('')).toEqual({
        isValid: false,
        errors: ['Номер телефона обязателен'],
        warnings: []
      });
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      expect(Validators.validatePassword('StrongPass123!')).toEqual({
        isValid: true,
        errors: [],
        warnings: undefined
      });
      
      expect(Validators.validatePassword('MySecureP@ss1')).toEqual({
        isValid: true,
        errors: [],
        warnings: undefined
      });
    });

    it('should reject weak passwords', () => {
      expect(Validators.validatePassword('weak')).toEqual({
        isValid: false,
        errors: [
          'Пароль должен содержать минимум 8 символов',
          'Пароль должен содержать заглавные буквы',
          'Пароль должен содержать цифры',
          'Пароль должен содержать специальные символы (@$!%*?&)'
        ],
        warnings: ['Пароль слишком слабый']
      });
      
      expect(Validators.validatePassword('12345678')).toEqual({
        isValid: false,
        errors: [
          'Пароль должен содержать заглавные буквы',
          'Пароль должен содержать строчные буквы',
          'Пароль должен содержать специальные символы (@$!%*?&)'
        ],
        warnings: ['Пароль слишком слабый']
      });
    });
  });

  describe('validateName', () => {
    it('should validate correct names', () => {
      expect(Validators.validateName('John')).toEqual({
        isValid: true,
        errors: []
      });
      
      expect(Validators.validateName('Mary-Jane')).toEqual({
        isValid: true,
        errors: []
      });
    });

    it('should reject invalid names', () => {
      expect(Validators.validateName('')).toEqual({
        isValid: false,
        errors: ['Имя обязательно']
      });
      
      expect(Validators.validateName('123')).toEqual({
        isValid: false,
        errors: ['Имя содержит недопустимые символы']
      });
    });
  });
}); 