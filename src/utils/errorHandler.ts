export interface AppError {
  code: string;
  message: string;
  details?: string;
  retryable?: boolean;
  action?: string;
}

export class ErrorHandler {
  // Коды ошибок аутентификации
  static readonly AUTH_ERRORS = {
    INVALID_CREDENTIALS: 'AUTH_001',
    USER_NOT_FOUND: 'AUTH_002',
    ACCOUNT_LOCKED: 'AUTH_003',
    TOO_MANY_ATTEMPTS: 'AUTH_004',
    TOKEN_EXPIRED: 'AUTH_005',
    TOKEN_INVALID: 'AUTH_006',
    EMAIL_NOT_VERIFIED: 'AUTH_007',
    PHONE_NOT_VERIFIED: 'AUTH_008',
    WEAK_PASSWORD: 'AUTH_009',
    EMAIL_ALREADY_EXISTS: 'AUTH_010',
    PHONE_ALREADY_EXISTS: 'AUTH_011',
  };

  // Коды ошибок сети
  static readonly NETWORK_ERRORS = {
    NO_INTERNET: 'NET_001',
    TIMEOUT: 'NET_002',
    SERVER_ERROR: 'NET_003',
    BAD_REQUEST: 'NET_004',
    UNAUTHORIZED: 'NET_005',
    FORBIDDEN: 'NET_006',
    NOT_FOUND: 'NET_007',
    RATE_LIMITED: 'NET_008',
  };

  // Коды ошибок валидации
  static readonly VALIDATION_ERRORS = {
    INVALID_EMAIL: 'VAL_001',
    INVALID_PHONE: 'VAL_002',
    INVALID_PASSWORD: 'VAL_003',
    INVALID_NAME: 'VAL_004',
    INVALID_LICENSE: 'VAL_005',
    INVALID_VEHICLE: 'VAL_006',
    INVALID_OTP: 'VAL_007',
    MISSING_FIELDS: 'VAL_008',
  };

  /**
   * Создает объект ошибки приложения
   */
  static createError(
    code: string,
    message: string,
    details?: string,
    retryable: boolean = false,
    action?: string
  ): AppError {
    return {
      code,
      message,
      details,
      retryable,
      action,
    };
  }

  /**
   * Обрабатывает ошибки API
   */
  static handleAPIError(error: any): AppError {
    // Если это уже наша ошибка
    if (error.code && error.message) {
      return error;
    }

    // Обработка HTTP ошибок
    if (error.status) {
      switch (error.status) {
        case 400:
          return this.createError(
            this.NETWORK_ERRORS.BAD_REQUEST,
            'Некорректный запрос',
            error.message,
            false
          );
        case 401:
          return this.createError(
            this.AUTH_ERRORS.TOKEN_INVALID,
            'Необходима повторная авторизация',
            error.message,
            true,
            'Попробуйте войти снова'
          );
        case 403:
          return this.createError(
            this.NETWORK_ERRORS.FORBIDDEN,
            'Доступ запрещен',
            error.message,
            false
          );
        case 404:
          return this.createError(
            this.NETWORK_ERRORS.NOT_FOUND,
            'Ресурс не найден',
            error.message,
            false
          );
        case 429:
          return this.createError(
            this.NETWORK_ERRORS.RATE_LIMITED,
            'Слишком много запросов',
            'Попробуйте позже',
            true,
            'Подождите немного'
          );
        case 500:
          return this.createError(
            this.NETWORK_ERRORS.SERVER_ERROR,
            'Ошибка сервера',
            'Попробуйте позже',
            true,
            'Повторить попытку'
          );
        default:
          return this.createError(
            'UNKNOWN_ERROR',
            'Неизвестная ошибка',
            error.message,
            true
          );
      }
    }

    // Обработка сетевых ошибок
    if (error.message) {
      if (error.message.includes('Network request failed')) {
        return this.createError(
          this.NETWORK_ERRORS.NO_INTERNET,
          'Нет подключения к интернету',
          'Проверьте соединение и попробуйте снова',
          true,
          'Повторить'
        );
      }
      if (error.message.includes('timeout')) {
        return this.createError(
          this.NETWORK_ERRORS.TIMEOUT,
          'Превышено время ожидания',
          'Попробуйте позже',
          true,
          'Повторить'
        );
      }
    }

    // Общая ошибка
    return this.createError(
      'UNKNOWN_ERROR',
      'Произошла ошибка',
      error.message || 'Неизвестная ошибка',
      true
    );
  }

  /**
   * Обрабатывает ошибки аутентификации
   */
  static handleAuthError(error: any): AppError {
    if (error.code && error.message) {
      return error;
    }

    const message = error.message || '';

    // Обработка специфичных ошибок аутентификации
    if (message.includes('Invalid credentials') || message.includes('Wrong password')) {
      return this.createError(
        this.AUTH_ERRORS.INVALID_CREDENTIALS,
        'Неверный email или пароль',
        'Проверьте правильность введенных данных',
        false,
        'Проверить данные'
      );
    }

    if (message.includes('User not found')) {
      return this.createError(
        this.AUTH_ERRORS.USER_NOT_FOUND,
        'Пользователь не найден',
        'Возможно, вы еще не зарегистрированы',
        false,
        'Зарегистрироваться'
      );
    }

    if (message.includes('Account locked')) {
      return this.createError(
        this.AUTH_ERRORS.ACCOUNT_LOCKED,
        'Аккаунт заблокирован',
        'Обратитесь в службу поддержки',
        false,
        'Связаться с поддержкой'
      );
    }

    if (message.includes('Too many attempts')) {
      return this.createError(
        this.AUTH_ERRORS.TOO_MANY_ATTEMPTS,
        'Слишком много попыток входа',
        'Попробуйте позже или восстановите пароль',
        true,
        'Восстановить пароль'
      );
    }

    if (message.includes('Email already exists')) {
      return this.createError(
        this.AUTH_ERRORS.EMAIL_ALREADY_EXISTS,
        'Email уже используется',
        'Попробуйте войти или восстановить пароль',
        false,
        'Войти'
      );
    }

    if (message.includes('Phone already exists')) {
      return this.createError(
        this.AUTH_ERRORS.PHONE_ALREADY_EXISTS,
        'Номер телефона уже используется',
        'Попробуйте войти или восстановить пароль',
        false,
        'Войти'
      );
    }

    // Общая ошибка аутентификации
    return this.createError(
      'AUTH_ERROR',
      'Ошибка аутентификации',
      message,
      true
    );
  }

  /**
   * Обрабатывает ошибки валидации
   */
  static handleValidationError(field: string, error: string): AppError {
    const fieldMap: { [key: string]: string } = {
      email: this.VALIDATION_ERRORS.INVALID_EMAIL,
      phone: this.VALIDATION_ERRORS.INVALID_PHONE,
      password: this.VALIDATION_ERRORS.INVALID_PASSWORD,
      name: this.VALIDATION_ERRORS.INVALID_NAME,
      license_number: this.VALIDATION_ERRORS.INVALID_LICENSE,
      vehicle_number: this.VALIDATION_ERRORS.INVALID_VEHICLE,
      otp: this.VALIDATION_ERRORS.INVALID_OTP,
    };

    return this.createError(
      fieldMap[field] || this.VALIDATION_ERRORS.MISSING_FIELDS,
      `Ошибка в поле "${field}"`,
      error,
      false
    );
  }

  /**
   * Получает пользовательское сообщение для ошибки
   */
  static getUserFriendlyMessage(error: AppError): string {
    const messages: { [key: string]: string } = {
      // Аутентификация
      [this.AUTH_ERRORS.INVALID_CREDENTIALS]: 'Неверный email или пароль',
      [this.AUTH_ERRORS.USER_NOT_FOUND]: 'Пользователь не найден',
      [this.AUTH_ERRORS.ACCOUNT_LOCKED]: 'Аккаунт заблокирован',
      [this.AUTH_ERRORS.TOO_MANY_ATTEMPTS]: 'Слишком много попыток входа',
      [this.AUTH_ERRORS.TOKEN_EXPIRED]: 'Сессия истекла',
      [this.AUTH_ERRORS.TOKEN_INVALID]: 'Необходима повторная авторизация',
      [this.AUTH_ERRORS.EMAIL_NOT_VERIFIED]: 'Email не подтвержден',
      [this.AUTH_ERRORS.PHONE_NOT_VERIFIED]: 'Телефон не подтвержден',
      [this.AUTH_ERRORS.WEAK_PASSWORD]: 'Пароль слишком слабый',
      [this.AUTH_ERRORS.EMAIL_ALREADY_EXISTS]: 'Email уже используется',
      [this.AUTH_ERRORS.PHONE_ALREADY_EXISTS]: 'Номер телефона уже используется',

      // Сеть
      [this.NETWORK_ERRORS.NO_INTERNET]: 'Нет подключения к интернету',
      [this.NETWORK_ERRORS.TIMEOUT]: 'Превышено время ожидания',
      [this.NETWORK_ERRORS.SERVER_ERROR]: 'Ошибка сервера',
      [this.NETWORK_ERRORS.BAD_REQUEST]: 'Некорректный запрос',
      [this.NETWORK_ERRORS.UNAUTHORIZED]: 'Необходима авторизация',
      [this.NETWORK_ERRORS.FORBIDDEN]: 'Доступ запрещен',
      [this.NETWORK_ERRORS.NOT_FOUND]: 'Ресурс не найден',
      [this.NETWORK_ERRORS.RATE_LIMITED]: 'Слишком много запросов',

      // Валидация
      [this.VALIDATION_ERRORS.INVALID_EMAIL]: 'Некорректный email',
      [this.VALIDATION_ERRORS.INVALID_PHONE]: 'Некорректный номер телефона',
      [this.VALIDATION_ERRORS.INVALID_PASSWORD]: 'Некорректный пароль',
      [this.VALIDATION_ERRORS.INVALID_NAME]: 'Некорректное имя',
      [this.VALIDATION_ERRORS.INVALID_LICENSE]: 'Некорректный номер прав',
      [this.VALIDATION_ERRORS.INVALID_VEHICLE]: 'Некорректный номер автомобиля',
      [this.VALIDATION_ERRORS.INVALID_OTP]: 'Некорректный код подтверждения',
      [this.VALIDATION_ERRORS.MISSING_FIELDS]: 'Заполните все обязательные поля',
    };

    return messages[error.code] || error.message;
  }

  /**
   * Проверяет, можно ли повторить операцию
   */
  static isRetryable(error: AppError): boolean {
    return error.retryable === true;
  }

  /**
   * Получает рекомендуемое действие для ошибки
   */
  static getRecommendedAction(error: AppError): string | null {
    return error.action || null;
  }

  /**
   * Логирует ошибку для отладки
   */
  static logError(error: AppError, context?: string): void {
    if (__DEV__) {
      console.group(`🚨 Error: ${error.code}${context ? ` (${context})` : ''}`);
      console.error('Message:', error.message);
      console.error('Details:', error.details);
      console.error('Retryable:', error.retryable);
      console.error('Action:', error.action);
      console.groupEnd();
    }
  }
}

export default ErrorHandler; 