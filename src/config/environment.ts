// Конфигурация окружения для FixDrive

export const ENV_CONFIG = {
  // API конфигурация
  API: {
    // Базовый URL для API
    BASE_URL: __DEV__ 
      ? 'http://31.97.76.106:8080'  // Реальный сервер в разработке
      : 'https://api.fixdrive.com', // Продакшен URL
    
    // Таймаут запросов (30 секунд)
    TIMEOUT: 30000,
    
    // Заголовки по умолчанию
    DEFAULT_HEADERS: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  },

  // JWT конфигурация
  JWT: {
    // Секретный ключ (должен совпадать с бэкендом)
    SECRET: 'default-secret-change-me',
    
    // Время жизни токенов (должно совпадать с бэкендом)
    ACCESS_TOKEN_EXPIRY: 30 * 60, // 30 минут
    REFRESH_TOKEN_EXPIRY: 30 * 24 * 60 * 60, // 30 дней
  },

  // Twilio конфигурация для OTP
  TWILIO: {
    ACCOUNT_SID: process.env.EXPO_PUBLIC_TWILIO_ACCOUNT_SID || '',
    AUTH_TOKEN: process.env.EXPO_PUBLIC_TWILIO_AUTH_TOKEN || '',
    FROM_PHONE: process.env.EXPO_PUBLIC_TWILIO_FROM_PHONE || '',
  },

  // Redis конфигурация (если нужно)
  REDIS: {
    HOST: process.env.EXPO_PUBLIC_REDIS_HOST || '31.97.76.106',
    PORT: process.env.EXPO_PUBLIC_REDIS_PORT || '6379',
    PASSWORD: process.env.EXPO_PUBLIC_REDIS_PASSWORD || '',
    DB: 0,
  },

  // Логирование
  LOGGING: {
    // Включить логирование API запросов
    ENABLE_API_LOGS: __DEV__,
    
    // Включить логирование ошибок
    ENABLE_ERROR_LOGS: true,
    
    // Маскировать чувствительные данные
    MASK_SENSITIVE_DATA: true,
  },
};

// Утилиты для работы с конфигурацией
export const ConfigUtils = {
  /**
   * Получить полный URL для API эндпоинта
   */
  getApiUrl(endpoint: string): string {
    return `${ENV_CONFIG.API.BASE_URL}${endpoint}`;
  },

  /**
   * Получить заголовки для авторизованных запросов
   */
  async getAuthHeaders(): Promise<Record<string, string>> {
    const { useAuth } = await import('../context/AuthContext');
    // В реальном использовании нужно получить контекст
    // Здесь возвращаем базовые заголовки
    return {
      ...ENV_CONFIG.API.DEFAULT_HEADERS,
    };
  },

  /**
   * Проверить, доступен ли сервер
   */
  async checkServerHealth(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(this.getApiUrl('/health'), {
        method: 'GET',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.error('Server health check failed:', error);
      return false;
    }
  },
}; 