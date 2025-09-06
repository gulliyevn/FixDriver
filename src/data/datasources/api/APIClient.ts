import { ENV_CONFIG, ConfigUtils } from '../../../shared/config/environment';
import { API_CLIENT_CONSTANTS } from '../../../shared/constants';
import { IAPIClient, APIResponse, RequestConfig, RequestOptions } from './APITypes';
import { APIRequestHandler } from './APIRequestHandler';
import { APIGrpcClient } from './APIGrpcClient';

export class APIClient implements IAPIClient {
  private static instance: APIClient;
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  private constructor() {
    this.baseURL = ENV_CONFIG.API.BASE_URL;
    this.defaultHeaders = {
      'Content-Type': API_CLIENT_CONSTANTS.HEADERS.CONTENT_TYPE_JSON,
      'Accept': API_CLIENT_CONSTANTS.HEADERS.CONTENT_TYPE_JSON,
    };
  }

  public static getInstance(): APIClient {
    if (!APIClient.instance) {
      APIClient.instance = new APIClient();
    }
    return APIClient.instance;
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, config?: RequestConfig): Promise<APIResponse<T>> {
    const options: RequestOptions = {
      method: API_CLIENT_CONSTANTS.METHODS.GET,
      url,
      headers: { ...this.defaultHeaders, ...config?.headers },
      timeout: config?.timeout,
      retries: config?.retries,
      retryDelay: config?.retryDelay,
    };

    return APIRequestHandler.makeRequest<T>(options);
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<APIResponse<T>> {
    const options: RequestOptions = {
      method: API_CLIENT_CONSTANTS.METHODS.POST,
      url,
      data,
      headers: { ...this.defaultHeaders, ...config?.headers },
      timeout: config?.timeout,
      retries: config?.retries,
      retryDelay: config?.retryDelay,
    };

    return APIRequestHandler.makeRequest<T>(options);
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<APIResponse<T>> {
    const options: RequestOptions = {
      method: API_CLIENT_CONSTANTS.METHODS.PUT,
      url,
      data,
      headers: { ...this.defaultHeaders, ...config?.headers },
      timeout: config?.timeout,
      retries: config?.retries,
      retryDelay: config?.retryDelay,
    };

    return APIRequestHandler.makeRequest<T>(options);
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config?: RequestConfig): Promise<APIResponse<T>> {
    const options: RequestOptions = {
      method: API_CLIENT_CONSTANTS.METHODS.DELETE,
      url,
      headers: { ...this.defaultHeaders, ...config?.headers },
      timeout: config?.timeout,
      retries: config?.retries,
      retryDelay: config?.retryDelay,
    };

    return APIRequestHandler.makeRequest<T>(options);
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<APIResponse<T>> {
    const options: RequestOptions = {
      method: API_CLIENT_CONSTANTS.METHODS.PATCH,
      url,
      data,
      headers: { ...this.defaultHeaders, ...config?.headers },
      timeout: config?.timeout,
      retries: config?.retries,
      retryDelay: config?.retryDelay,
    };

    return APIRequestHandler.makeRequest<T>(options);
  }

  /**
   * gRPC request
   */
  async grpcRequest<T = any>(service: string, method: string, data?: any): Promise<APIResponse<T>> {
    return APIGrpcClient.grpcRequest<T>(service, method, data);
  }

  /**
   * Get gRPC client
   */
  getGrpcClient(): any {
    return APIGrpcClient.getGrpcClient();
  }

  /**
   * Set base URL
   */
  setBaseURL(url: string): void {
    this.baseURL = url;
  }

  /**
   * Get base URL
   */
  getBaseURL(): string {
    return this.baseURL;
  }

  /**
   * Set default headers
   */
  setDefaultHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  /**
   * Get default headers
   */
  getDefaultHeaders(): Record<string, string> {
    return { ...this.defaultHeaders };
  }

  /**
   * Add authorization header
   */
  setAuthToken(token: string): void {
    this.defaultHeaders[API_CLIENT_CONSTANTS.HEADERS.AUTHORIZATION] = 
      `${API_CLIENT_CONSTANTS.HEADERS.BEARER_PREFIX}${token}`;
  }

  /**
   * Remove authorization header
   */
  clearAuthToken(): void {
    delete this.defaultHeaders[API_CLIENT_CONSTANTS.HEADERS.AUTHORIZATION];
  }

  /**
   * Check server health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await this.get('/health');
      return response.success;
    } catch (error) {
      return false;
    }
  }

  /**
   * Setup gRPC connection
   */
  async setupGrpc(config: { host: string; port: number; credentials?: any; options?: Record<string, any> }): Promise<boolean> {
    return APIGrpcClient.setupGrpcConnection(config);
  }

  /**
   * Close gRPC connection
   */
  async closeGrpc(): Promise<void> {
    return APIGrpcClient.closeGrpcConnection();
  }

  /**
   * Check if gRPC is available
   */
  isGrpcAvailable(): boolean {
    return APIGrpcClient.isGrpcAvailable();
  }
}

// Export singleton instance
export default APIClient.getInstance();
