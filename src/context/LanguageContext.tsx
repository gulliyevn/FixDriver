import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  t as i18nT, 
  setLanguage as i18nSetLanguage, 
  getLanguage as i18nGetLanguage, 
  initializeLanguage as i18nInitializeLanguage,
  addLanguageChangeListener,
  removeLanguageChangeListener,
  getLanguageOptions,
  getLanguageInfo,
  type SupportedLanguage 
} from '../i18n';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
  t: typeof i18nT;
  languageOptions: ReturnType<typeof getLanguageOptions>;
  getLanguageInfo: typeof getLanguageInfo;
  isLoading: boolean;
  error: string | null;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('ru');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize language options to prevent unnecessary re-renders
  const languageOptions = useMemo(() => getLanguageOptions(), []);

  // Initialize language on mount
  useEffect(() => {
    initializeLanguage();
  }, []);

  // Listen for language changes from other parts of the app
  useEffect(() => {
    const handleLanguageChange = (newLanguage: SupportedLanguage) => {
      setLanguageState(newLanguage);
    };

    addLanguageChangeListener(handleLanguageChange);

    return () => {
      removeLanguageChangeListener(handleLanguageChange);
    };
  }, []);

  const initializeLanguage = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await i18nInitializeLanguage();
      const currentLanguage = await i18nGetLanguage();
      setLanguageState(currentLanguage);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize language';
      setError(errorMessage);
      console.error('Language initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const setLanguage = useCallback(async (lang: SupportedLanguage) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await i18nSetLanguage(lang);
      setLanguageState(lang);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change language';
      setError(errorMessage);
      console.error('Language change error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Memoize translation function to prevent unnecessary re-renders
  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    return i18nT(key, params);
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
  }), [language, setLanguage, t, languageOptions, isLoading, error]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 