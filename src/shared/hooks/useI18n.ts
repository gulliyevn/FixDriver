import { useCallback } from 'react';
import { useLanguage } from '../../presentation/context/LanguageContext';
import { t as i18nT } from '../i18n';

export const useI18n = () => {
  const { setLanguage, language, languageOptions, isLoading, error } = useLanguage();

  const changeLanguage = useCallback(async (newLanguage: string) => {
    await setLanguage(newLanguage);
  }, [setLanguage]);

  const getCurrentLang = useCallback(() => {
    return language;
  }, [language]);

  const getStoredLanguage = useCallback(async () => {
    return language;
  }, [language]);

  const checkRTL = useCallback(() => {
    return language === 'ar';
  }, [language]);

  return {
    t: i18nT,
    setLanguage: changeLanguage,
    getCurrentLanguage: getCurrentLang,
    getStoredLanguage,
    isRTL: checkRTL,
    language,
    languageOptions,
    isLoading,
    error,
    SUPPORTED_LANGUAGES: languageOptions,
  };
}; 