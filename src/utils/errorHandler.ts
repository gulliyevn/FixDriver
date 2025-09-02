export interface AppError {
  code: string;
  message: string;
  details?: string;
  retryable?: boolean;
  action?: string;
}

// Интерфейс для ошибок с дополнительными свойствами
interface ExtendedError extends Error {
  code?: string;
  status?: number;
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
   * Обрабатывает API ошибки
   */
  static handleAPIError(error: unknown): AppError {
    // Если это уже наша ошибка
    if (this.isAppError(error)) {
      return error;
    }

    const extendedError = error as ExtendedError;

    // Обработка HTTP ошибок
    if (extendedError.status) {
      switch (extendedError.status) {
        case 400:
          return this.createError(
            this.NETWORK_ERRORS.BAD_REQUEST,
            'Некорректный запрос',
            extendedError.message,
            false
          );
        case 401:
          return this.createError(
            this.AUTH_ERRORS.TOKEN_INVALID,
            'Необходима повторная авторизация',
            extendedError.message,
            true,
            'Попробуйте войти снова'
          );
        case 403:
          return this.createError(
            this.NETWORK_ERRORS.FORBIDDEN,
            'Доступ запрещен',
            extendedError.message,
            false
          );
        case 404:
          return this.createError(
            this.NETWORK_ERRORS.NOT_FOUND,
            'Ресурс не найден',
            extendedError.message,
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
            extendedError.message,
            true
          );
      }
    }

    // Обработка сетевых ошибок
    if (extendedError.message) {
      if (extendedError.message.includes('Network request failed')) {
        return this.createError(
          this.NETWORK_ERRORS.NO_INTERNET,
          'Нет подключения к интернету',
          'Проверьте соединение и попробуйте снова',
          true,
          'Повторить'
        );
      }
      if (extendedError.message.includes('timeout')) {
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
      extendedError.message || 'Неизвестная ошибка',
      true
    );
  }

  /**
   * Обрабатывает ошибки аутентификации
   */
  static handleAuthError(error: unknown): AppError {
    if (this.isAppError(error)) {
      return error;
    }

    const extendedError = error as ExtendedError;
    const message = extendedError.message || '';

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

  static createAppError(error: unknown): AppError {
    // Проверяем, является ли ошибка объектом с кодом и сообщением
    if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
      const errorObj = error as { code: string; message: string };
      return {
        code: errorObj.code,
        message: errorObj.message,
      };
    }

    // Проверяем, является ли ошибка объектом со статусом
    if (error && typeof error === 'object' && 'status' in error) {
      const errorObj = error as { status: number; message?: string };
      switch (errorObj.status) {
        case 400:
          return {
            code: 'VALIDATION_ERROR',
            message: errorObj.message || 'Некорректные данные',
          };
        case 401:
          return {
            code: 'UNAUTHORIZED',
            message: errorObj.message || 'Необходима авторизация',
          };
        case 403:
          return {
            code: 'FORBIDDEN',
            message: errorObj.message || 'Доступ запрещен',
          };
        case 404:
          return {
            code: 'NOT_FOUND',
            message: errorObj.message || 'Ресурс не найден',
          };
        case 500:
          return {
            code: 'SERVER_ERROR',
            message: errorObj.message || 'Ошибка сервера',
          };
        default:
          return {
            code: 'UNKNOWN_ERROR',
            message: errorObj.message || 'Неизвестная ошибка',
          };
      }
    }

    // Проверяем, является ли ошибка строкой или объектом с сообщением
    if (error && typeof error === 'object' && 'message' in error) {
      const errorObj = error as { message: string };
      if (errorObj.message.includes('Network request failed')) {
        return {
          code: 'NETWORK_ERROR',
          message: 'Ошибка сети. Проверьте подключение к интернету.',
        };
      }
      if (errorObj.message.includes('timeout')) {
        return {
          code: 'TIMEOUT_ERROR',
          message: 'Превышено время ожидания ответа от сервера.',
        };
      }
    }

    // Обрабатываем строковые ошибки
    if (typeof error === 'string') {
      return {
        code: 'GENERAL_ERROR',
        message: error,
      };
    }

    // Обрабатываем объекты с сообщением
    if (error && typeof error === 'object' && 'message' in error) {
      const errorObj = error as { message: string };
      return {
        code: 'GENERAL_ERROR',
        message: errorObj.message || 'Неизвестная ошибка',
      };
    }

    // Обрабатываем объекты с кодом и сообщением
    if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
      const errorObj = error as { code: string; message: string };
      return {
        code: errorObj.code,
        message: errorObj.message || '',
      };
    }

    // Fallback для неизвестных ошибок
    return {
      code: 'UNKNOWN_ERROR',
      message: 'Произошла неизвестная ошибка',
    };
  }

  /**
   * Проверяет, является ли ошибка AppError
   */
  private static isAppError(error: unknown): error is AppError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      'message' in error
    );
  }
}

export default ErrorHandler; 