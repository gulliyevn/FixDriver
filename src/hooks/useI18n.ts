import { useCallback } from 'react';
import { t, setLanguage, getLanguage, getCurrentLanguage, isRTL, SUPPORTED_LANGUAGES, type SupportedLanguage } from '../i18n';

export const useI18n = () => {
  const translate = useCallback((key: string, params?: Record<string, string | number>) => {
    return t(key, params);
  }, []);

  const changeLanguage = useCallback(async (language: SupportedLanguage) => {
    await setLanguage(language);
  }, []);

  const getCurrentLang = useCallback(() => {
    return getCurrentLanguage();
  }, []);

  const getStoredLanguage = useCallback(async () => {
    return await getLanguage();
  }, []);

  const checkRTL = useCallback(() => {
    return isRTL();
  }, []);

  return {
    t: translate,
    setLanguage: changeLanguage,
    getCurrentLanguage: getCurrentLang,
    getStoredLanguage,
    isRTL: checkRTL,
    SUPPORTED_LANGUAGES,
  };
}; 