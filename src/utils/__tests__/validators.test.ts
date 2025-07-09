import { Validators } from '../validators';

describe('Validators', () => {
  describe('validateEmail', () => {
    it('validates correct email addresses', () => {
      expect(Validators.validateEmail('test@example.com').isValid).toBe(true);
      expect(Validators.validateEmail('user.name+tag@domain.co.uk').isValid).toBe(true);
      expect(Validators.validateEmail('123@test.org').isValid).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(Validators.validateEmail('invalid-email').isValid).toBe(false);
      expect(Validators.validateEmail('test@').isValid).toBe(false);
      expect(Validators.validateEmail('@example.com').isValid).toBe(false);
      expect(Validators.validateEmail('test@.com').isValid).toBe(false);
      expect(Validators.validateEmail('').isValid).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('validates strong passwords', () => {
      expect(Validators.validatePassword('StrongPass123!').isValid).toBe(true);
      expect(Validators.validatePassword('MyP@ssw0rd').isValid).toBe(true);
      expect(Validators.validatePassword('Secure123#').isValid).toBe(true);
    });

    it('rejects weak passwords', () => {
      expect(Validators.validatePassword('weak').isValid).toBe(false);
      expect(Validators.validatePassword('12345678').isValid).toBe(false);
      expect(Validators.validatePassword('password').isValid).toBe(false);
      expect(Validators.validatePassword('').isValid).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('validates correct phone numbers', () => {
      expect(Validators.validatePhone('+1234567890').isValid).toBe(true);
      expect(Validators.validatePhone('+7 (999) 123-45-67').isValid).toBe(true);
      expect(Validators.validatePhone('+44 20 7946 0958').isValid).toBe(true);
    });

    it('rejects invalid phone numbers', () => {
      expect(Validators.validatePhone('123').isValid).toBe(false);
      expect(Validators.validatePhone('not-a-number').isValid).toBe(false);
      expect(Validators.validatePhone('').isValid).toBe(false);
    });
  });

  describe('validateName', () => {
    it('validates correct names', () => {
      expect(Validators.validateName('John').isValid).toBe(true);
      expect(Validators.validateName('Mary-Jane').isValid).toBe(true);
      expect(Validators.validateName('O\'Connor').isValid).toBe(true);
    });

    it('rejects invalid names', () => {
      expect(Validators.validateName('').isValid).toBe(false);
      expect(Validators.validateName('123').isValid).toBe(false);
      expect(Validators.validateName('A').isValid).toBe(false);
    });
  });

  describe('validateLicenseNumber', () => {
    it('validates correct license numbers', () => {
      expect(Validators.validateLicenseNumber('1234567890').isValid).toBe(true);
      expect(Validators.validateLicenseNumber('AB123456').isValid).toBe(true);
      expect(Validators.validateLicenseNumber('12-34-56-78-90').isValid).toBe(true);
    });

    it('rejects invalid license numbers', () => {
      expect(Validators.validateLicenseNumber('').isValid).toBe(false);
      expect(Validators.validateLicenseNumber('123').isValid).toBe(false);
      expect(Validators.validateLicenseNumber('invalid').isValid).toBe(false);
    });
  });

  describe('validateVehicleNumber', () => {
    it('validates correct vehicle numbers', () => {
      expect(Validators.validateVehicleNumber('A123BC77').isValid).toBe(true);
      expect(Validators.validateVehicleNumber('123ABC77').isValid).toBe(true);
      expect(Validators.validateVehicleNumber('AB123C77').isValid).toBe(true);
    });

    it('rejects invalid vehicle numbers', () => {
      expect(Validators.validateVehicleNumber('').isValid).toBe(false);
      expect(Validators.validateVehicleNumber('123').isValid).toBe(false);
      expect(Validators.validateVehicleNumber('invalid').isValid).toBe(false);
    });
  });

  describe('validateOTP', () => {
    it('validates correct OTP codes', () => {
      expect(Validators.validateOTP('123456').isValid).toBe(true);
      expect(Validators.validateOTP('000000').isValid).toBe(true);
      expect(Validators.validateOTP('999999').isValid).toBe(true);
    });

    it('rejects invalid OTP codes', () => {
      expect(Validators.validateOTP('').isValid).toBe(false);
      expect(Validators.validateOTP('12345').isValid).toBe(false);
      expect(Validators.validateOTP('1234567').isValid).toBe(false);
      expect(Validators.validateOTP('12345a').isValid).toBe(false);
    });
  });

  describe('validateLogin', () => {
    it('validates correct login data', () => {
      const result = Validators.validateLogin({
        email: 'test@example.com',
        password: 'StrongPass123!'
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('rejects invalid login data', () => {
      const result = Validators.validateLogin({
        email: 'invalid-email',
        password: 'weak'
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('getPasswordStrength', () => {
    it('returns correct strength for weak passwords', () => {
      const strength = Validators.getPasswordStrength('weak');
      expect(strength.level).toBe('weak');
      expect(strength.score).toBeLessThanOrEqual(3);
    });

    it('returns correct strength for strong passwords', () => {
      const strength = Validators.getPasswordStrength('StrongPass123!');
      expect(strength.level).toBe('strong');
      expect(strength.score).toBeGreaterThan(5);
    });

    it('provides feedback for password improvement', () => {
      const strength = Validators.getPasswordStrength('weak');
      expect(strength.feedback.length).toBeGreaterThan(0);
    });
  });
}); 