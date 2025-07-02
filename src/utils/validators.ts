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
  /**
   * Валидация email
   */
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!email) {
      errors.push('Email обязателен');
      return { isValid: false, errors, warnings };
    }

    if (!SECURITY_CONFIG.VALIDATION.PATTERNS.EMAIL.test(email)) {
      errors.push('Некорректный формат email');
    }

    if (email.length > SECURITY_CONFIG.VALIDATION.MAX_LENGTHS.EMAIL) {
      errors.push(`Email не должен превышать ${SECURITY_CONFIG.VALIDATION.MAX_LENGTHS.EMAIL} символов`);
    }

    // Проверка на временные email сервисы
    const tempEmailDomains = ['10minutemail.com', 'tempmail.org', 'guerrillamail.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    if (domain && tempEmailDomains.some(temp => domain.includes(temp))) {
      warnings.push('Рекомендуется использовать постоянный email адрес');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Валидация пароля с детальной обратной связью
   */
  static validatePassword(password: string): ValidationResult {
    const result = SecurityUtils.validatePassword(password);
    const strength = this.getPasswordStrength(password);

    return {
      isValid: result.isValid,
      errors: result.errors,
      warnings: strength.level === 'weak' ? ['Пароль слишком слабый'] : undefined
    };
  }

  /**
   * Анализ силы пароля
   */
  static getPasswordStrength(password: string): PasswordStrength {
    let score = 0;
    const feedback: string[] = [];

    // Базовая длина
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;

    // Сложность
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[@$!%*?&]/.test(password)) score += 1;

    // Разнообразие символов
    const uniqueChars = new Set(password).size;
    if (uniqueChars >= 8) score += 1;
    if (uniqueChars >= 12) score += 1;

    // Проверка на повторяющиеся символы
    if (/(.)\1{2,}/.test(password)) {
      score -= 1;
      feedback.push('Избегайте повторяющихся символов');
    }

    // Проверка на последовательности
    if (/123|abc|qwe/i.test(password)) {
      score -= 1;
      feedback.push('Избегайте простых последовательностей');
    }

    // Определение уровня
    let level: 'weak' | 'medium' | 'strong' | 'very-strong';
    if (score <= 3) level = 'weak';
    else if (score <= 5) level = 'medium';
    else if (score <= 7) level = 'strong';
    else level = 'very-strong';

    // Добавляем рекомендации
    if (password.length < 8) feedback.push('Добавьте больше символов');
    if (!/[A-Z]/.test(password)) feedback.push('Добавьте заглавные буквы');
    if (!/[a-z]/.test(password)) feedback.push('Добавьте строчные буквы');
    if (!/\d/.test(password)) feedback.push('Добавьте цифры');
    if (!/[@$!%*?&]/.test(password)) feedback.push('Добавьте специальные символы');

    return { score, level, feedback };
  }

  /**
   * Валидация телефона
   */
  static validatePhone(phone: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!phone) {
      errors.push('Номер телефона обязателен');
      return { isValid: false, errors, warnings };
    }

    // Очищаем от форматирования
    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length < 7) {
      errors.push('Номер телефона слишком короткий');
    }

    if (cleanPhone.length > 15) {
      errors.push('Номер телефона слишком длинный');
    }

    if (!SECURITY_CONFIG.VALIDATION.PATTERNS.PHONE.test(phone)) {
      errors.push('Некорректный формат номера телефона');
    }

    // Проверка на российские номера (если нужно)
    if (phone.startsWith('+7') && cleanPhone.length !== 11) {
      warnings.push('Проверьте правильность российского номера');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Валидация имени
   */
  static validateName(name: string, fieldName: string = 'Имя'): ValidationResult {
    const errors: string[] = [];

    if (!name) {
      errors.push(`${fieldName} обязательно`);
      return { isValid: false, errors };
    }

    if (name.length < 2) {
      errors.push(`${fieldName} должно содержать минимум 2 символа`);
    }

    if (name.length > SECURITY_CONFIG.VALIDATION.MAX_LENGTHS.NAME) {
      errors.push(`${fieldName} не должно превышать ${SECURITY_CONFIG.VALIDATION.MAX_LENGTHS.NAME} символов`);
    }

    if (!SECURITY_CONFIG.VALIDATION.PATTERNS.NAME.test(name)) {
      errors.push(`${fieldName} содержит недопустимые символы`);
    }

    // Проверка на повторяющиеся символы
    if (/(.)\1{3,}/.test(name)) {
      errors.push(`${fieldName} содержит слишком много повторяющихся символов`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Валидация номера водительских прав
   */
  static validateLicenseNumber(licenseNumber: string): ValidationResult {
    const errors: string[] = [];

    if (!licenseNumber) {
      errors.push('Номер водительских прав обязателен');
      return { isValid: false, errors };
    }

    // Азербайджанский формат: AZ12345678
    const azPattern = /^[A-Z]{2}\d{8}$/;
    if (!azPattern.test(licenseNumber)) {
      errors.push('Некорректный формат номера прав (AZ12345678)');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Валидация номера автомобиля
   */
  static validateVehicleNumber(vehicleNumber: string): ValidationResult {
    const errors: string[] = [];

    if (!vehicleNumber) {
      errors.push('Номер автомобиля обязателен');
      return { isValid: false, errors };
    }

    // Азербайджанский формат: 12-AB-123
    const azPattern = /^\d{2}-[A-Z]{2}-\d{3}$/;
    if (!azPattern.test(vehicleNumber)) {
      errors.push('Некорректный формат номера автомобиля (12-AB-123)');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Валидация даты истечения прав
   */
  static validateLicenseExpiry(expiryDate: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!expiryDate) {
      errors.push('Дата истечения прав обязательна');
      return { isValid: false, errors, warnings };
    }

    const expiry = new Date(expiryDate);
    const today = new Date();

    if (isNaN(expiry.getTime())) {
      errors.push('Некорректная дата');
      return { isValid: false, errors, warnings };
    }

    if (expiry <= today) {
      errors.push('Срок действия прав истек');
    }

    // Предупреждение если права истекают в течение 3 месяцев
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    
    if (expiry <= threeMonthsFromNow && expiry > today) {
      warnings.push('Права истекают в течение 3 месяцев');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Валидация OTP кода
   */
  static validateOTP(otp: string): ValidationResult {
    const errors: string[] = [];

    if (!otp) {
      errors.push('OTP код обязателен');
      return { isValid: false, errors };
    }

    if (!/^\d{6}$/.test(otp)) {
      errors.push('OTP код должен содержать 6 цифр');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Валидация формы регистрации клиента
   */
  static validateClientRegistration(data: {
    name: string;
    surname: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Валидация имени
    const nameValidation = this.validateName(data.name, 'Имя');
    errors.push(...nameValidation.errors);

    // Валидация фамилии
    const surnameValidation = this.validateName(data.surname, 'Фамилия');
    errors.push(...surnameValidation.errors);

    // Валидация email
    const emailValidation = this.validateEmail(data.email);
    errors.push(...emailValidation.errors);
    warnings.push(...(emailValidation.warnings || []));

    // Валидация телефона
    const phoneValidation = this.validatePhone(data.phone);
    errors.push(...phoneValidation.errors);
    warnings.push(...(phoneValidation.warnings || []));

    // Валидация пароля
    const passwordValidation = this.validatePassword(data.password);
    errors.push(...passwordValidation.errors);
    warnings.push(...(passwordValidation.warnings || []));

    // Проверка совпадения паролей
    if (data.password !== data.confirmPassword) {
      errors.push('Пароли не совпадают');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Валидация формы регистрации водителя
   */
  static validateDriverRegistration(data: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Базовая валидация клиента
    const clientValidation = this.validateClientRegistration({
      name: data.first_name || '',
      surname: data.last_name || '',
      email: data.email || '',
      phone: data.phone_number || '',
      password: data.password || '',
      confirmPassword: data.confirmPassword || ''
    });

    errors.push(...clientValidation.errors);
    warnings.push(...(clientValidation.warnings || []));

    // Дополнительная валидация для водителей
    const licenseValidation = this.validateLicenseNumber(data.license_number || '');
    errors.push(...licenseValidation.errors);

    const vehicleValidation = this.validateVehicleNumber(data.vehicle_number || '');
    errors.push(...vehicleValidation.errors);

    const expiryValidation = this.validateLicenseExpiry(data.license_expiry_date || '');
    errors.push(...expiryValidation.errors);
    warnings.push(...(expiryValidation.warnings || []));

    // Проверка обязательных полей
    if (!data.vehicle_category) {
      errors.push('Категория автомобиля обязательна');
    }

    if (!data.vehicle_brand) {
      errors.push('Марка автомобиля обязательна');
    }

    if (!data.vehicle_model) {
      errors.push('Модель автомобиля обязательна');
    }

    if (!data.vehicle_year) {
      errors.push('Год выпуска автомобиля обязателен');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Валидация формы входа
   */
  static validateLogin(data: { email: string; password: string }): ValidationResult {
    const errors: string[] = [];

    if (!data.email) {
      errors.push('Email обязателен');
    }

    if (!data.password) {
      errors.push('Пароль обязателен');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default Validators;
