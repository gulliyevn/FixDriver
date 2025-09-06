export interface IAPIClient {
  get<T = any>(url: string, config?: RequestConfig): Promise<APIResponse<T>>;
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<APIResponse<T>>;
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<APIResponse<T>>;
  delete<T = any>(url: string, config?: RequestConfig): Promise<APIResponse<T>>;
  patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<APIResponse<T>>;
  grpcRequest<T = any>(service: string, method: string, data?: any): Promise<APIResponse<T>>;
  getGrpcClient(): any;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
  headers?: Record<string, string>;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  baseURL?: string;
}

export interface GrpcConfig {
  host: string;
  port: number;
  credentials?: any;
  options?: Record<string, any>;
}

export interface RetryConfig {
  attempts: number;
  delay: number;
  backoff: 'linear' | 'exponential';
  maxDelay: number;
}

export interface RequestOptions {
  method: string;
  url: string;
  data?: any;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface ErrorResponse {
  success: false;
  error: string;
  status?: number;
  code?: string;
  details?: any;
}

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  status: number;
  headers?: Record<string, string>;
}

export type APIResult<T = any> = SuccessResponse<T> | ErrorResponse;
