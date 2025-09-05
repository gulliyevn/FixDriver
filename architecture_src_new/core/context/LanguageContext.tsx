import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import MockServices from '../../shared/mocks/MockServices';

// 📋 Types
export type SupportedLanguage = 'en' | 'ru' | 'az';

interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
  t: (key: string, params?: Record<string, string | number>) => string;
  languageOptions: LanguageInfo[];
  getLanguageInfo: (code: SupportedLanguage) => LanguageInfo | undefined;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateKey, setUpdateKey] = useState(0); // Force re-render

  // Language options
  const languageOptions: LanguageInfo[] = useMemo(() => [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
    { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan', flag: '🇦🇿' },
  ], []);

  // Initialize language on mount
  useEffect(() => {
    initializeLanguage();
  }, []);

  const initializeLanguage = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const currentLanguage = await MockServices.i18n.getCurrentLanguage();
      setLanguageState(currentLanguage);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize language';
      setError(errorMessage);
      console.error('Error initializing language:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const setLanguage = useCallback(async (lang: SupportedLanguage) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await MockServices.i18n.setLanguage(lang);
      setLanguageState(lang);
      setUpdateKey(prev => prev + 1); // Force re-render
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change language';
      setError(errorMessage);
      console.error('Error changing language:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Translation function
  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    try {
      return MockServices.i18n.translate(key, params, language);
    } catch (err) {
      console.error('Translation error:', err);
      return key; // Return key as fallback
    }
  }, [language, updateKey]);

  const getLanguageInfo = useCallback((code: SupportedLanguage): LanguageInfo | undefined => {
    return languageOptions.find(option => option.code === code);
  }, [languageOptions]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo<LanguageContextType>(() => ({
    language,
    setLanguage,
    t,
    languageOptions,
    getLanguageInfo,
    isLoading,
    error,
    clearError,
  }), [language, setLanguage, t, languageOptions, getLanguageInfo, isLoading, error, clearError, updateKey]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
