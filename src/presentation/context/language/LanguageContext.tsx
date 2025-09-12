/**
 * Language context
 * Main language management context
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { t as i18nT, setLanguage as i18nSetLanguage } from '../../../shared/i18n';
import { LanguageContextType, LanguageProviderProps, SupportedLanguage } from './types';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('ru');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setLanguage = useCallback(async (lang: SupportedLanguage) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await i18nSetLanguage(lang);
      setLanguageState(lang);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change language';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Memoize translation function to prevent unnecessary re-renders
  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    return i18nT(key, params, language);
  }, [language]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo<LanguageContextType>(() => ({
    language,
    setLanguage,
    t,
    isLoading,
    error,
  }), [language, setLanguage, t, isLoading, error]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
