import JWTService from "./JWTService";
import { ENV_CONFIG } from "../config/environment";

// Типы для fetch API
interface RequestInitType {
  method?: string;
  headers?: Record<string, string> | string[][];
  body?: string | FormData | Blob | ArrayBuffer | null;
  mode?: string;
  credentials?: string;
  cache?: string;
  redirect?: string;
  referrer?: string;
  referrerPolicy?: string;
  integrity?: string;
  signal?: AbortSignal | null;
}

// Конфигурация API
const API_CONFIG = {
  BASE_URL: ENV_CONFIG.API.BASE_URL,
  TIMEOUT: ENV_CONFIG.API.TIMEOUT,
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

  static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
        method: "GET",
        signal: AbortSignal.timeout(5000), // 5 секунд таймаут
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  private handleError(error: Error): APIResponse {
    if (error.name === "AbortError") {
      return {
        success: false,
        error: "Request timeout",
        message: "Request took too long to complete",
        statusCode: 408,
      };
    }

    if (error.name === "TypeError" && error.message.includes("fetch")) {
      return {
        success: false,
        error: "Network error",
        message: "No internet connection",
        statusCode: 0,
      };
    }

    return {
      success: false,
      error: "Unknown error",
      message: error.message || "An unexpected error occurred",
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
          value.forEach((item) => searchParams.append(key, String(item)));
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
    additionalData?: Record<string, unknown>,
  ): Promise<APIResponse<T>> {
    const formData = new FormData();

    // Добавляем файл
    formData.append("file", {
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
    delete headers["Content-Type"]; // FormData сам установит правильный Content-Type

    return this.request<T>(endpoint, {
      method: "POST",
      headers,
      body: formData,
    });
  }

  /**
   * Получает заголовки для запроса
   */
  private async getHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const token = await JWTService.getAccessToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Выполняет HTTP запрос
   */
  private async request<T>(
    endpoint: string,
    options: RequestInitType = {},
  ): Promise<APIResponse<T>> {
    try {
      const url = `${API_CONFIG.BASE_URL}${endpoint}`;
      const headers = await this.getHeaders();

      const response = await fetch(url, {
        method: options.method,
        body: options.body,
        mode: options.mode as "cors" | "no-cors" | "same-origin",
        credentials: options.credentials as "omit" | "same-origin" | "include",
        cache: options.cache as "default" | "no-store" | "reload" | "no-cache" | "force-cache" | "only-if-cached",
        redirect: options.redirect as "follow" | "error" | "manual",
        referrer: options.referrer,
        referrerPolicy: options.referrerPolicy as "no-referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin" | "unsafe-url",
        integrity: options.integrity,
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        headers: {
          ...headers,
          ...(options.headers as Record<string, string>),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch((error) => {
          console.warn('Failed to parse error response:', error);
          return {};
        });
        return {
          success: false,
          error: errorData.message || "Request failed",
          statusCode: response.status,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
        statusCode: response.status,
      };
    } catch (error) {
      return this.handleError(error as Error) as APIResponse<T>;
    }
  }

  // HTTP методы
  async get<T>(
    endpoint: string,
    params?: Record<string, unknown>,
  ): Promise<APIResponse<T>> {
    const url = params
      ? `${endpoint}?${new URLSearchParams(params as Record<string, string>).toString()}`
      : endpoint;
    return this.request<T>(url, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export default APIClient.getInstance();
