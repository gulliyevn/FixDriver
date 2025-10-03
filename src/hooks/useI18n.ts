import { useCallback } from "react";
import { useLanguage } from "../context/LanguageContext";
import {
  getLanguageOptions,
  getLanguageInfo,
  type SupportedLanguage,
  t as i18nT,
} from "../i18n";

export const useI18n = () => {
  const { setLanguage, language, languageOptions, isLoading, error } =
    useLanguage();

  const changeLanguage = useCallback(
    async (newLanguage: SupportedLanguage) => {
      await setLanguage(newLanguage);
    },
    [setLanguage],
  );

  const getCurrentLang = useCallback(() => {
    return language;
  }, [language]);

  const getStoredLanguage = useCallback(async () => {
    return language;
  }, [language]);

  const checkRTL = useCallback(() => {
    return language === "ar";
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
    getLanguageInfo,
    SUPPORTED_LANGUAGES: languageOptions,
  };
};
