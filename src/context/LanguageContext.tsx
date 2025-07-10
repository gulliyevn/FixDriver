import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { t as i18nT, setLanguage as i18nSetLanguage, getLanguage as i18nGetLanguage, SUPPORTED_LANGUAGES, type SupportedLanguage } from '../i18n';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
  t: typeof i18nT;
  SUPPORTED_LANGUAGES: typeof SUPPORTED_LANGUAGES;
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

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const lang = await i18nGetLanguage();
      setLanguageState(lang);
      await i18nSetLanguage(lang);
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const setLanguage = useCallback(async (lang: SupportedLanguage) => {
    try {
      setLanguageState(lang);
      await i18nSetLanguage(lang);
      console.log('Language changed to:', lang);
    } catch (error) {
      console.error('Error setting language:', error);
    }
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    return i18nT(key, params);
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    SUPPORTED_LANGUAGES,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 