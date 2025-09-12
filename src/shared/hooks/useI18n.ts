import { useCallback } from 'react';
import { useLanguage } from '../../presentation/context/language/LanguageContext';
import { t as i18nT } from '../i18n';

export const useI18n = () => {
  const { setLanguage, language, isLoading, error } = useLanguage();

  const changeLanguage = useCallback(async (newLanguage: string) => {
    await setLanguage(newLanguage as any);
  }, [setLanguage]);

  const getCurrentLang = useCallback(() => {
    return language;
  }, [language]);

  const getStoredLanguage = useCallback(async () => {
    return language;
  }, [language]);

  const checkRTL = useCallback(() => {
    return language === 'ar' as any;
  }, [language]);

  return {
    t: i18nT,
    setLanguage: changeLanguage,
    getCurrentLanguage: getCurrentLang,
    getStoredLanguage,
    isRTL: checkRTL,
    language,
    languageOptions: ['en', 'ru', 'az', 'ar'],
    isLoading,
    error,
    SUPPORTED_LANGUAGES: ['en', 'ru', 'az', 'ar'],
  };
}; 