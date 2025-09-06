import { ENV_CONFIG, ConfigUtils } from '../../../shared/config/environment';
import { API_CLIENT_CONSTANTS } from '../../../shared/constants';
import { APIResponse, RequestOptions, RetryConfig } from './APITypes';

export class APIRequestHandler {
  /**
   * Make HTTP request with retry logic
   */
  static async makeRequest<T = any>(options: RequestOptions): Promise<APIResponse<T>> {
    const retryConfig: RetryConfig = {
      attempts: options.retries || API_CLIENT_CONSTANTS.RETRY_ATTEMPTS,
      delay: options.retryDelay || 1000,
      backoff: 'exponential',
      maxDelay: 10000,
    };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retryConfig.attempts; attempt++) {
      try {
        const response = await this.executeRequest<T>(options);
        return response;
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === retryConfig.attempts) {
          break;
        }

        const delay = this.calculateRetryDelay(attempt, retryConfig);
        await this.sleep(delay);
      }
    }

    return this.handleError(lastError || new Error('Request failed'));
  }

  /**
   * Execute single HTTP request
   */
  private static async executeRequest<T = any>(options: RequestOptions): Promise<APIResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || API_CLIENT_CONSTANTS.REQUEST_TIMEOUT);

    try {
      const fullUrl = this.buildUrl(options.url);
      const requestOptions: RequestInit = {
        method: options.method,
        headers: {
          'Content-Type': API_CLIENT_CONSTANTS.HEADERS.CONTENT_TYPE_JSON,
          ...options.headers,
        },
        signal: controller.signal,
      };

      if (options.data && options.method !== 'GET') {
        requestOptions.body = JSON.stringify(options.data);
      }

      const response = await fetch(fullUrl, requestOptions);
      clearTimeout(timeoutId);

      return await this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Handle HTTP response
   */
  private static async handleResponse<T = any>(response: Response): Promise<APIResponse<T>> {
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    try {
      const data = await response.json();
      return {
        success: true,
        data,
        status: response.status,
        headers,
      };
    } catch (error) {
      return {
        success: true,
        data: {} as T,
        status: response.status,
        headers,
      };
    }
  }

  /**
   * Handle request errors
   */
  static handleError(error: Error): APIResponse {
    console.error('API Request Error:', error);

    if (error.name === 'AbortError') {
      return {
        success: false,
        error: 'Request timeout',
        status: 408,
      };
    }

    if (error.message.includes('HTTP')) {
      const statusMatch = error.message.match(/HTTP (\d+):/);
      const status = statusMatch ? parseInt(statusMatch[1]) : 500;
      
      return {
        success: false,
        error: error.message,
        status,
      };
    }

    return {
      success: false,
      error: error.message || 'Network error',
      status: 0,
    };
  }

  /**
   * Build full URL
   */
  private static buildUrl(url: string): string {
    if (url.startsWith('http')) {
      return url;
    }
    
    const baseUrl = ENV_CONFIG.API.BASE_URL;
    return `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
  }

  /**
   * Calculate retry delay
   */
  private static calculateRetryDelay(attempt: number, config: RetryConfig): number {
    if (config.backoff === 'exponential') {
      const delay = config.delay * Math.pow(2, attempt);
      return Math.min(delay, config.maxDelay);
    }
    
    return config.delay;
  }

  /**
   * Sleep utility
   */
  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if error is retryable
   */
  static isRetryableError(error: Error): boolean {
    if (error.name === 'AbortError') return true;
    if (error.message.includes('HTTP 5')) return true;
    if (error.message.includes('Network error')) return true;
    return false;
  }
}
