import JWTService from './JWTService';

// Типы для fetch API
declare global {
  interface RequestInit {
    signal?: AbortSignal;
  }
}

// Конфигурация API
const API_CONFIG = {
  BASE_URL: 'https://api.fixdrive.com/api',
  TIMEOUT: 30000, // 30 секунд
  RETRY_ATTEMPTS: 3,
};

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}

export interface APIError {
  message: string;
  statusCode: number;
  code?: string;
}

class APIClient {
  private static instance: APIClient;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (error: unknown) => void;
  }> = [];

  private constructor() {}

  static getInstance(): APIClient {
    if (!APIClient.instance) {
      APIClient.instance = new APIClient();
    }
    return APIClient.instance;
  }

  /**
   * Выполняет HTTP запрос с автоматической обработкой токенов
   */
  async request<T = unknown>(
    endpoint: string,
    options: Record<string, unknown> = {}
  ): Promise<APIResponse<T>> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    try {
      // Добавляем заголовки авторизации
      const headers = await this.getHeaders(options.headers as Record<string, string>);
      
      const config: Record<string, unknown> = {
        ...options,
        headers,
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
      };

      const response = await fetch(url, config);
      
      // Обрабатываем ответ
      return await this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error) as APIResponse<T>;
    }
  }

  /**
   * GET запрос
   */
  async get<T = unknown>(endpoint: string, params?: Record<string, unknown>): Promise<APIResponse<T>> {
    const queryString = params ? this.buildQueryString(params) : '';
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request<T>(url, {
      method: 'GET',
    });
  }

  /**
   * POST запрос
   */
  async post<T = unknown>(endpoint: string, data: Record<string, unknown>): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT запрос
   */
  async put<T = unknown>(endpoint: string, data?: unknown): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE запрос
   */
  async delete<T = unknown>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  /**
   * PATCH запрос
   */
  async patch<T = unknown>(endpoint: string, data?: unknown): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Получает заголовки для запроса
   */
  private async getHeaders(customHeaders?: Record<string, string>): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'FixDrive-Mobile/1.0',
      ...customHeaders,
    };

    // Добавляем токен авторизации
    const authHeader = await JWTService.getAuthHeader();
    if (authHeader) {
      Object.assign(headers, authHeader);
    }

    return headers;
  }

  /**
   * Обрабатывает ответ от сервера
   */
  private async handleResponse<T>(response: Response): Promise<APIResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    let data: unknown;
    
    try {
      data = isJson ? await response.json() : await response.text();
    } catch (error) {
      console.error('Error parsing response:', error);
      data = null;
    }

    // Проверяем статус ответа
    if (response.ok) {
      return {
        success: true,
        data: data as T,
        statusCode: response.status,
      };
    }

    // Обрабатываем ошибки авторизации
    if (response.status === 401) {
      return await this.handleAuthError() as APIResponse<T>;
    }

    // Обрабатываем другие ошибки
    const errorData = data as { message?: string };
    return {
      success: false,
      error: errorData?.message || `HTTP ${response.status}`,
      message: errorData?.message || 'Request failed',
      statusCode: response.status,
    };
  }

  /**
   * Обрабатывает ошибки авторизации
   */
  private async handleAuthError(): Promise<APIResponse<unknown>> {
    // Если уже обновляем токен, добавляем в очередь
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;

    try {
      // Пытаемся обновить токен
      const newToken = await JWTService.refreshAccessToken();
      
      if (newToken) {
        // Обрабатываем очередь запросов
        this.processQueue(null, newToken);
        return {
          success: false,
          error: 'Token refreshed, retry request',
          statusCode: 401,
        };
      } else {
        // Токен не обновился - НЕ выкидываем пользователя
        console.warn('Token refresh failed, but continuing without authentication');
        this.processQueue(null, null);
        return {
          success: false,
          error: 'Authentication required',
          statusCode: 401,
        };
      }
    } catch (error) {
      console.error('Auth error handling failed:', error);
      this.processQueue(null, null);
      return {
        success: false,
        error: 'Authentication error',
        statusCode: 401,
      };
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Обрабатывает очередь запросов
   */
  private processQueue(error: Error | null, token: string | null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    
    this.failedQueue = [];
  }

  /**
   * Проверка здоровья API
   * TODO: Заменить на реальную проверку здоровья API
   */
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 секунд таймаут
      });
      return response.ok;
    } catch (error) {
      console.warn('API health check failed:', error);
      return false;
    }
  }

  /**
   * Обрабатывает сетевые ошибки
   * TODO: Добавить более детальную обработку ошибок для production
   */
  private handleError(error: Error): APIResponse {
    console.error('API request error:', error);
    
    if (error.name === 'AbortError') {
      return {
        success: false,
        error: 'Request timeout',
        message: 'Request took too long to complete',
        statusCode: 408,
      };
    }

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        success: false,
        error: 'Network error',
        message: 'No internet connection',
        statusCode: 0,
      };
    }

    return {
      success: false,
      error: 'Unknown error',
      message: error.message || 'An unexpected error occurred',
      statusCode: 500,
    };
  }

  /**
   * Строит query string из параметров
   */
  private buildQueryString(params: Record<string, unknown>): string {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(item => searchParams.append(key, String(item)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });
    
    return searchParams.toString();
  }

  /**
   * Загружает файл
   */
  async uploadFile<T = unknown>(
    endpoint: string, 
    file: { uri: string; type: string; name: string },
    additionalData?: Record<string, unknown>
  ): Promise<APIResponse<T>> {
    const formData = new FormData();
    
    // Добавляем файл
    formData.append('file', {
      uri: file.uri,
      type: file.type,
      name: file.name,
    } as never);
    
    // Добавляем дополнительные данные
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const headers = await this.getHeaders();
    delete headers['Content-Type']; // FormData сам установит правильный Content-Type

    return this.request<T>(endpoint, {
      method: 'POST',
      headers,
      body: formData,
    });
  }
}

export default APIClient.getInstance(); 