// Конфигурация безопасности для FixDrive

export const SECURITY_CONFIG = {
  // JWT настройки
  JWT: {
    // Секретный ключ для подписи JWT (в продакшене должен быть в переменных окружения)
    SECRET: __DEV__ 
      ? 'fixdrive-dev-secret-key-2024' 
      : process.env.JWT_SECRET || 'fixdrive-prod-secret-key-2024',
    
    // Время жизни access token (24 часа)
    ACCESS_TOKEN_EXPIRY: 24 * 60 * 60,
    
    // Время жизни refresh token (7 дней)
    REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60,
    
    // Алгоритм подписи
    ALGORITHM: 'HS256' as const,
    
    // Идентификатор приложения в токене
    ISSUER: 'fixdrive-app',
    
    // Аудитория токена
    AUDIENCE: 'fixdrive-users',
  },

  // Настройки паролей
  PASSWORD: {
    // Минимальная длина пароля
    MIN_LENGTH: 8,
    
    // Максимальная длина пароля
    MAX_LENGTH: 128,
    
    // Требования к паролю
    REQUIREMENTS: {
      UPPERCASE: true,    // Заглавные буквы
      LOWERCASE: true,    // Строчные буквы
      NUMBERS: true,      // Цифры
      SPECIAL_CHARS: true, // Специальные символы
    },
    
    // Регулярное выражение для валидации пароля
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  },

  // Настройки OTP
  OTP: {
    // Длина OTP кода
    LENGTH: 6,
    
    // Время жизни OTP кода (10 минут)
    EXPIRY_MINUTES: 10,
    
    // Максимальное количество попыток
    MAX_ATTEMPTS: 3,
    
    // Время блокировки после превышения попыток (30 минут)
    BLOCK_DURATION_MINUTES: 30,
    
    // Интервал между повторными отправками (60 секунд)
    RESEND_INTERVAL_SECONDS: 60,
  },

  // Настройки API
  API: {
    // Таймаут запросов (30 секунд)
    TIMEOUT: 30000,
    
    // Максимальное количество повторных попыток
    MAX_RETRIES: 3,
    
    // Задержка между повторными попытками (1 секунда)
    RETRY_DELAY: 1000,
    
    // Заголовки безопасности
    SECURITY_HEADERS: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    },
  },

  // Настройки шифрования
  ENCRYPTION: {
    // Алгоритм шифрования для чувствительных данных
    ALGORITHM: 'AES-256-GCM',
    
    // Размер ключа (32 байта для AES-256)
    KEY_SIZE: 32,
    
    // Размер IV (12 байт для GCM)
    IV_SIZE: 12,
    
    // Размер тега аутентификации (16 байт для GCM)
    TAG_SIZE: 16,
  },

  // Настройки сессий
  SESSION: {
    // Максимальное количество активных сессий на пользователя
    MAX_SESSIONS_PER_USER: 5,
    
    // Время неактивности для автоматического выхода (30 минут)
    INACTIVITY_TIMEOUT: 30 * 60 * 1000,
    
    // Проверка активности каждые 5 минут
    ACTIVITY_CHECK_INTERVAL: 5 * 60 * 1000,
  },

  // Настройки логирования
  LOGGING: {
    // Логировать ли чувствительные данные
    LOG_SENSITIVE_DATA: false,
    
    // Маскировать ли персональные данные в логах
    MASK_PERSONAL_DATA: true,
    
    // Паттерны для маскировки данных
    MASK_PATTERNS: {
      EMAIL: /([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
      PHONE: /(\+?\d{1,3})?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{2})[-.\s]?(\d{2})/g,
      CREDIT_CARD: /\b(\d{4})[-.\s]?(\d{4})[-.\s]?(\d{4})[-.\s]?(\d{4})\b/g,
    },
  },

  // Настройки валидации
  VALIDATION: {
    // Максимальная длина полей
    MAX_LENGTHS: {
      NAME: 50,
      SURNAME: 50,
      EMAIL: 255,
      PHONE: 20,
      ADDRESS: 500,
      DESCRIPTION: 1000,
    },
    
    // Паттерны валидации
    PATTERNS: {
      EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      PHONE: /^\+?[1-9]\d{1,14}$/,
      NAME: /^[a-zA-Zа-яА-ЯёЁ\s'-]+$/,
      LICENSE_PLATE: /^[A-ZА-Я]{1,3}\d{3}[A-ZА-Я]{2}\d{2,3}$/,
    },
  },

  // Настройки rate limiting
  RATE_LIMITING: {
    // Максимальное количество запросов в минуту
    REQUESTS_PER_MINUTE: 60,
    
    // Максимальное количество попыток входа в час
    LOGIN_ATTEMPTS_PER_HOUR: 5,
    
    // Максимальное количество OTP запросов в час
    OTP_REQUESTS_PER_HOUR: 10,
  },
};

// Утилиты для безопасности
export const SecurityUtils = {
  /**
   * Маскирует персональные данные
   */
  maskPersonalData(text: string): string {
    if (!SECURITY_CONFIG.LOGGING.MASK_PERSONAL_DATA) {
      return text;
    }

    let masked = text;

    // Маскируем email
    masked = masked.replace(
      SECURITY_CONFIG.LOGGING.MASK_PATTERNS.EMAIL,
      (match, username, domain) => {
        const maskedUsername = username.length > 2 
          ? username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1)
          : username;
        return `${maskedUsername}@${domain}`;
      }
    );

    // Маскируем телефон
    masked = masked.replace(
      SECURITY_CONFIG.LOGGING.MASK_PATTERNS.PHONE,
      (match, country, area, prefix, middle, last) => {
        return `${country || ''}***-***-${last}`;
      }
    );

    // Маскируем номер карты
    masked = masked.replace(
      SECURITY_CONFIG.LOGGING.MASK_PATTERNS.CREDIT_CARD,
      (match, first, second, third, fourth) => {
        return `${first}-****-****-${fourth}`;
      }
    );

    return masked;
  },

  /**
   * Валидирует пароль
   */
  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < SECURITY_CONFIG.PASSWORD.MIN_LENGTH) {
      errors.push(`Пароль должен содержать минимум ${SECURITY_CONFIG.PASSWORD.MIN_LENGTH} символов`);
    }

    if (password.length > SECURITY_CONFIG.PASSWORD.MAX_LENGTH) {
      errors.push(`Пароль не должен превышать ${SECURITY_CONFIG.PASSWORD.MAX_LENGTH} символов`);
    }

    if (SECURITY_CONFIG.PASSWORD.REQUIREMENTS.UPPERCASE && !/[A-Z]/.test(password)) {
      errors.push('Пароль должен содержать заглавные буквы');
    }

    if (SECURITY_CONFIG.PASSWORD.REQUIREMENTS.LOWERCASE && !/[a-z]/.test(password)) {
      errors.push('Пароль должен содержать строчные буквы');
    }

    if (SECURITY_CONFIG.PASSWORD.REQUIREMENTS.NUMBERS && !/\d/.test(password)) {
      errors.push('Пароль должен содержать цифры');
    }

    if (SECURITY_CONFIG.PASSWORD.REQUIREMENTS.SPECIAL_CHARS && !/[@$!%*?&]/.test(password)) {
      errors.push('Пароль должен содержать специальные символы (@$!%*?&)');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Валидирует email
   */
  validateEmail(email: string): boolean {
    return SECURITY_CONFIG.VALIDATION.PATTERNS.EMAIL.test(email);
  },

  /**
   * Валидирует телефон
   */
  validatePhone(phone: string): boolean {
    return SECURITY_CONFIG.VALIDATION.PATTERNS.PHONE.test(phone);
  },

  /**
   * Валидирует имя
   */
  validateName(name: string): boolean {
    return SECURITY_CONFIG.VALIDATION.PATTERNS.NAME.test(name) && 
           name.length <= SECURITY_CONFIG.VALIDATION.MAX_LENGTHS.NAME;
  },

  /**
   * Генерирует безопасный случайный токен
   */
  generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const randomArray = new Uint8Array(length);
    crypto.getRandomValues(randomArray);
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(randomArray[i] % chars.length);
    }
    
    return result;
  },

  /**
   * Проверяет силу пароля
   */
  getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
    let score = 0;

    // Длина
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Сложность
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[@$!%*?&]/.test(password)) score += 1;

    // Разнообразие символов
    const uniqueChars = new Set(password).size;
    if (uniqueChars >= 8) score += 1;
    if (uniqueChars >= 12) score += 1;

    if (score <= 3) return 'weak';
    if (score <= 5) return 'medium';
    return 'strong';
  },
};

export default SECURITY_CONFIG; 