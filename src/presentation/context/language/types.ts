/**
 * Language context types
 * Type definitions for language management
 */

export type SupportedLanguage = 'ru' | 'en';

export interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
  t: (key: string, params?: Record<string, string | number>) => string;
  isLoading: boolean;
  error: string | null;
}

export interface LanguageProviderProps {
  children: React.ReactNode;
}
