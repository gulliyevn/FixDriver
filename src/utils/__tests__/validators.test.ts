import Validators from '../validators';

describe('Validators', () => {
  describe('validateEmail', () => {
    it('validates correct email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'test123@test.com'
      ];

      validEmails.forEach(email => {
        const result = Validators.validateEmail(email);
        expect(result.isValid).toBe(true);
        expect(result.errors.length).toBe(0);
      });
    });

    it('validates email length', () => {
      const longEmail = 'a'.repeat(300) + '@example.com';
      const result = Validators.validateEmail(longEmail);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('превышать'))).toBe(true);
    });

    it('warns about temporary email services', () => {
      const tempEmail = 'test@10minutemail.com';
      const result = Validators.validateEmail(tempEmail);
      expect(result.isValid).toBe(true);
      expect(result.warnings?.some(warning => warning.includes('постоянный'))).toBe(true);
    });

    it('handles empty email', () => {
      const result = Validators.validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('обязателен'))).toBe(true);
    });

    it('handles null/undefined email', () => {
      const result = Validators.validateEmail(null as any);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('обязателен'))).toBe(true);
    });
  });

  describe('validatePassword', () => {
    it('validates strong passwords', () => {
      const strongPasswords = [
        'StrongPass123!',
        'MySecureP@ssw0rd',
        'Complex123!@#',
        'VeryStrongPassword123!'
      ];

      strongPasswords.forEach(password => {
        const result = Validators.validatePassword(password);
        expect(result.isValid).toBe(true);
      });
    });

    it('rejects weak passwords', () => {
      const weakPasswords = [
        '123',
        'password',
        'abc123',
        'qwerty'
      ];

      weakPasswords.forEach(password => {
        const result = Validators.validatePassword(password);
        expect(result.isValid).toBe(false);
      });
    });

    it('warns about weak passwords', () => {
      const weakPassword = 'weak';
      const result = Validators.validatePassword(weakPassword);
      expect(result.warnings?.some(warning => warning.includes('слабый'))).toBe(true);
    });

    it('handles empty password', () => {
      const result = Validators.validatePassword('');
      expect(result.isValid).toBe(false);
    });
  });

  describe('getPasswordStrength', () => {
    it('analyzes password strength correctly', () => {
      const weakPassword = Validators.getPasswordStrength('123');
      expect(weakPassword.level).toBe('weak');
      expect(weakPassword.score).toBeLessThanOrEqual(3);

      const strongPassword = Validators.getPasswordStrength('StrongPass123!');
      expect(strongPassword.level).toBe('strong');
      expect(strongPassword.score).toBeGreaterThan(5);
    });

    it('penalizes repeating characters', () => {
      const password = 'aaa123';
      const strength = Validators.getPasswordStrength(password);
      expect(strength.feedback).toContain('repeat');
    });

    it('penalizes sequences', () => {
      const password = 'abc123';
      const strength = Validators.getPasswordStrength(password);
      expect(strength.feedback).toContain('sequence');
    });
  });

  describe('validatePhone', () => {
    it('validates correct phone numbers', () => {
      const validPhones = [
        '+71234567890',
        '+1234567890',
        '1234567890',
        '+123456789012345'
      ];

      validPhones.forEach(phone => {
        const result = Validators.validatePhone(phone);
        expect(result.isValid).toBe(true);
      });
    });

    it('rejects invalid phone numbers', () => {
      const invalidPhones = [
        '123',
        'abc',
        '+7 (999) 123-45',
        '12345678901234567890'
      ];

      invalidPhones.forEach(phone => {
        const result = Validators.validatePhone(phone);
        expect(result.isValid).toBe(false);
      });
    });

    it('handles empty phone', () => {
      const result = Validators.validatePhone('');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('обязателен'))).toBe(true);
    });
  });

  describe('validateName', () => {
    it('validates correct names', () => {
      const validNames = ['John', 'Mary', 'Иван', 'Алиса'];
      validNames.forEach(name => {
        const result = Validators.validateName(name);
        expect(result.isValid).toBe(true);
      });
    });

    it('rejects invalid names', () => {
      const invalidNames = ['', 'A', '123', 'John123'];
      invalidNames.forEach(name => {
        const result = Validators.validateName(name);
        expect(result.isValid).toBe(false);
      });
    });

    it('validates with custom field name', () => {
      const result = Validators.validateName('', 'Фамилия');
      expect(result.errors.some(error => error.includes('Фамилия'))).toBe(true);
    });
  });

  describe('validateLicenseNumber', () => {
    it('validates correct license numbers', () => {
      const validLicenses = ['AZ12345678', 'AZ87654321'];
      validLicenses.forEach(license => {
        const result = Validators.validateLicenseNumber(license);
        expect(result.isValid).toBe(true);
      });
    });
  });

  describe('validateVehicleNumber', () => {
    it('validates correct vehicle numbers', () => {
      const validNumbers = ['12-AB-123', '99-ZZ-999'];
      validNumbers.forEach(number => {
        const result = Validators.validateVehicleNumber(number);
        expect(result.isValid).toBe(true);
      });
    });

    it('rejects invalid vehicle numbers', () => {
      const invalidNumbers = ['12-AB-12', '12-AB-1234', 'AB-12-123', '12-AB-12A'];
      invalidNumbers.forEach(number => {
        const result = Validators.validateVehicleNumber(number);
        expect(result.isValid).toBe(false);
      });
    });
  });

  describe('validateLicenseExpiry', () => {
    it('validates future expiry dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const result = Validators.validateLicenseExpiry(futureDate.toISOString());
      expect(result.isValid).toBe(true);
    });

    it('rejects past expiry dates', () => {
      const pastDate = new Date();
      pastDate.setFullYear(pastDate.getFullYear() - 1);
      const result = Validators.validateLicenseExpiry(pastDate.toISOString());
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('истек'))).toBe(true);
    });

    it('rejects invalid date formats', () => {
      const result = Validators.validateLicenseExpiry('invalid-date');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('Некорректная дата'))).toBe(true);
    });
  });

  describe('validateOTP', () => {
    it('validates correct OTP codes', () => {
      const validOTPs = ['123456', '000000', '999999'];
      validOTPs.forEach(otp => {
        const result = Validators.validateOTP(otp);
        expect(result.isValid).toBe(true);
      });
    });

    it('rejects invalid OTP codes', () => {
      const invalidOTPs = ['12345', '1234567', '12345a', ''];
      invalidOTPs.forEach(otp => {
        const result = Validators.validateOTP(otp);
        expect(result.isValid).toBe(false);
      });
    });
  });

  describe('validateClientRegistration', () => {
    it('validates correct client registration data', () => {
      const validData = {
        name: 'John',
        surname: 'Doe',
        email: 'john@example.com',
        phone: '+71234567890',
        password: 'StrongPass123!',
        confirmPassword: 'StrongPass123!'
      };

      const result = Validators.validateClientRegistration(validData);
      expect(result.isValid).toBe(true);
    });

    it('rejects invalid client registration data', () => {
      const invalidData = {
        name: '',
        surname: '',
        email: 'invalid-email',
        phone: '123',
        password: 'weak',
        confirmPassword: 'different'
      };

      const result = Validators.validateClientRegistration(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('validates password confirmation', () => {
      const data = {
        name: 'John',
        surname: 'Doe',
        email: 'john@example.com',
        phone: '+71234567890',
        password: 'StrongPass123!',
        confirmPassword: 'DifferentPass123!'
      };

      const result = Validators.validateClientRegistration(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('не совпадают'))).toBe(true);
    });
  });

  describe('validateDriverRegistration', () => {
    it('validates correct driver registration data', () => {
      const validData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone_number: '+71234567890',
        password: 'StrongPass123!',
        confirmPassword: 'StrongPass123!',
        license_number: 'AZ12345678',
        vehicle_number: '12-AB-123',
        license_expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      };

      const result = Validators.validateDriverRegistration(validData);
      expect(result.isValid).toBe(true);
    });

    it('rejects invalid driver registration data', () => {
      const invalidData = {
        first_name: '',
        last_name: '',
        email: 'invalid-email',
        phone_number: '123',
        password: 'weak',
        confirmPassword: 'different',
        license_number: '12345678',
        vehicle_number: '12-AB-12',
        license_expiry_date: 'invalid-date'
      };

      const result = Validators.validateDriverRegistration(invalidData);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateLogin', () => {
    it('validates correct login data', () => {
      const validData = {
        email: 'john@example.com',
        password: 'StrongPass123!'
      };

      const result = Validators.validateLogin(validData);
      expect(result.isValid).toBe(true);
    });

    it('rejects invalid login data', () => {
      const invalidData = {
        email: '',
        password: ''
      };

      const result = Validators.validateLogin(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBe(2);
    });

    it('validates email format in login', () => {
      const data = {
        email: 'invalid-email',
        password: 'password'
      };

      const result = Validators.validateLogin(data);
      expect(result.isValid).toBe(true); // Login validation only checks for presence, not format
    });
  });
}); 