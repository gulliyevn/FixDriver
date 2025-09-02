// Общие типы для всего приложения

export interface AppError {
  code: string;
  message: string;
  details?: string;
  retryable?: boolean;
  action?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: AppError;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'select';
  required?: boolean;
  validation?: ValidationRule[];
  options?: SelectOption[];
  placeholder?: string;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

export interface AppConfig {
  apiUrl: string;
  grpcUrl: string;
  environment: 'development' | 'staging' | 'production';
  version: string;
  buildNumber: string;
}

export interface LoadingState {
  isLoading: boolean;
  error?: AppError;
  retry?: () => void;
}

export interface AsyncState<T> extends LoadingState {
  data?: T;
}

// Утилиты для работы с типами
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
