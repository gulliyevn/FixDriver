import { ENV, getApiUrl, logError, logInfo } from '../config/environment';
import { safeApiCall } from '../utils/productionHelpers';

interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

interface APIError {
  message: string;
  code: string;
  details?: unknown;
}

class ProductionAPIClient {
  private baseURL: string;
  private timeout: number;
  private retryAttempts: number = 3;
  private retryDelay: number = 1000;

  constructor() {
    this.baseURL = ENV.API_BASE_URL;
    this.timeout = ENV.API_TIMEOUT;
  }

  /**
   * Make API request with retry logic
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount: number = 0
  ): Promise<APIResponse<T>> {
    const url = getApiUrl(endpoint);
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': `FixDrive/${ENV.APP_VERSION}`,
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.timeout),
    };

    try {
      logInfo(`API Request: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      logInfo(`API Response: ${url}`, { status: response.status });
      
      return data;
    } catch (error) {
      logError(error, `API Request Failed: ${url}`);
      
      // Retry logic for network errors
      if (retryCount < this.retryAttempts && this.shouldRetry(error)) {
        logInfo(`Retrying request (${retryCount + 1}/${this.retryAttempts}): ${url}`);
        
        await this.delay(this.retryDelay * Math.pow(2, retryCount));
        
        return this.makeRequest<T>(endpoint, options, retryCount + 1);
      }
      
      throw this.formatError(error);
    }
  }

  /**
   * Determine if request should be retried
   */
  private shouldRetry(error: unknown): boolean {
    // Retry on network errors, timeouts, and 5xx server errors
    if (error instanceof AbortError || error instanceof TypeError) {
      return true;
    }
    
    if (error instanceof Error && error.message && error.message.includes('HTTP')) {
      const statusCode = parseInt(error.message.match(/HTTP (\d+)/)?.[1] || '0');
      return statusCode >= 500;
    }
    
    return false;
  }

  /**
   * Format error for consistent error handling
   */
  private formatError(error: unknown): APIError {
    if (error instanceof AbortError) {
      return {
        message: 'Превышено время ожидания запроса',
        code: 'TIMEOUT',
      };
    }
    
    if (error instanceof TypeError) {
      return {
        message: 'Ошибка сети. Проверьте подключение к интернету',
        code: 'NETWORK_ERROR',
      };
    }
    
    return {
      message: error instanceof Error ? error.message || 'Неизвестная ошибка' : 'Неизвестная ошибка',
      code: 'UNKNOWN_ERROR',
      details: error,
    };
  }

  /**
   * Delay function for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<APIResponse<T>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.makeRequest<T>(`${endpoint}${queryString}`);
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown): Promise<APIResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: unknown): Promise<APIResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<APIResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'DELETE',
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: unknown): Promise<APIResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Upload file
   */
  async uploadFile<T>(
    endpoint: string, 
    file: { uri: string; type: string; name: string }, 
    additionalData?: Record<string, unknown>
  ): Promise<APIResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string) {
    // TODO: Implement token storage and automatic inclusion in requests
    logInfo('Auth token set');
  }

  /**
   * Clear authentication token
   */
  clearAuthToken() {
    // TODO: Implement token removal
    logInfo('Auth token cleared');
  }
}

// Export singleton instance
export const productionAPIClient = new ProductionAPIClient();

// Export safe wrapper functions
export const safeGet = <T>(endpoint: string, params?: Record<string, unknown>) =>
  safeApiCall(() => productionAPIClient.get<T>(endpoint, params), 'GET');

export const safePost = <T>(endpoint: string, data?: unknown) =>
  safeApiCall(() => productionAPIClient.post<T>(endpoint, data), 'POST');

export const safePut = <T>(endpoint: string, data?: unknown) =>
  safeApiCall(() => productionAPIClient.put<T>(endpoint, data), 'PUT');

export const safeDelete = <T>(endpoint: string) =>
  safeApiCall(() => productionAPIClient.delete<T>(endpoint), 'DELETE');

export const safePatch = <T>(endpoint: string, data?: unknown) =>
  safeApiCall(() => productionAPIClient.patch<T>(endpoint, data), 'PATCH'); 