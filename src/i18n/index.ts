import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18n } from 'i18n-js';

// Import all translation files
import login from './login';
import register from './register';
import profile from './profile';
import common from './common';
import errors from './errors';
import notifications from './notifications';
import support from './support';
import navigation from './navigation';
import components from './components';
import driver from './driver';
import client from './client';

// Supported languages
export const SUPPORTED_LANGUAGES = {
  ru: 'Русский',
  en: 'English',
  tr: 'Türkçe',
  az: 'Azərbaycan',
  fr: 'Français',
  ar: 'العربية',
  es: 'Español',
  de: 'Deutsch',
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

// Default language
const DEFAULT_LANGUAGE: SupportedLanguage = 'ru';

// Create i18n instance
const i18n = new I18n({
  ru: {
    ...login.ru,
    ...register.ru,
    ...profile.ru,
    ...common.ru,
    ...errors.ru,
    ...notifications.ru,
    ...support.ru,
    ...navigation.ru,
    ...components.ru,
    ...driver.ru,
    ...client.ru,
  },
  en: {
    ...login.en,
    ...register.en,
    ...profile.en,
    ...common.en,
    ...errors.en,
    ...notifications.en,
    ...support.en,
    ...navigation.en,
    ...components.en,
    ...driver.en,
    ...client.en,
  },
  tr: {
    ...login.tr,
    ...register.tr,
    ...profile.tr,
    ...common.tr,
    ...errors.tr,
    ...notifications.tr,
    ...support.tr,
    ...navigation.tr,
    ...components.tr,
    ...driver.tr,
    ...client.tr,
  },
  az: {
    ...login.az,
    ...register.az,
    ...profile.az,
    ...common.az,
    ...errors.az,
    ...notifications.az,
    ...support.az,
    ...navigation.az,
    ...components.az,
    ...driver.az,
    ...client.az,
  },
  fr: {
    ...login.fr,
    ...register.fr,
    ...profile.fr,
    ...common.fr,
    ...errors.fr,
    ...notifications.fr,
    ...support.fr,
    ...navigation.fr,
    ...components.fr,
    ...driver.fr,
    ...client.fr,
  },
  ar: {
    ...login.ar,
    ...register.ar,
    ...profile.ar,
    ...common.ar,
    ...errors.ar,
    ...notifications.ar,
    ...support.ar,
    ...navigation.ar,
    ...components.ar,
    ...driver.ar,
    ...client.ar,
  },
  es: {
    ...login.es,
    ...register.es,
    ...profile.es,
    ...common.es,
    ...errors.es,
    ...notifications.es,
    ...support.es,
    ...navigation.es,
    ...components.es,
    ...driver.es,
    ...client.es,
  },
  de: {
    ...login.de,
    ...register.de,
    ...profile.de,
    ...common.de,
    ...errors.de,
    ...notifications.de,
    ...support.de,
    ...navigation.de,
    ...components.de,
    ...driver.de,
    ...client.de,
  },
});

// Configure i18n
i18n.defaultLocale = DEFAULT_LANGUAGE;
i18n.locale = DEFAULT_LANGUAGE;
i18n.enableFallback = true;

// Storage keys
const LANGUAGE_STORAGE_KEY = '@FixDrive:language';

// Language management
export const setLanguage = async (language: SupportedLanguage): Promise<void> => {
  try {
    i18n.locale = language;
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    console.error('Error setting language:', error);
  }
};

export const getLanguage = async (): Promise<SupportedLanguage> => {
  try {
    const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage && storedLanguage in SUPPORTED_LANGUAGES) {
      return storedLanguage as SupportedLanguage;
    }
  } catch (error) {
    console.error('Error getting language:', error);
  }
  return DEFAULT_LANGUAGE;
};

export const initializeLanguage = async (): Promise<void> => {
  const language = await getLanguage();
  i18n.locale = language;
};

// Main translation function
export const t = (key: string, params?: Record<string, string | number>): string => {
  return i18n.t(key, params);
};

// Get current language
export const getCurrentLanguage = (): SupportedLanguage => {
  return i18n.locale as SupportedLanguage;
};

// Check if RTL language
export const isRTL = (): boolean => {
  return i18n.locale === 'ar';
};

export default i18n; 