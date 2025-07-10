import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18n } from 'i18n-js';

// Import all translation files using require for better JSON compatibility
const login = require('./login');
const register = require('./register');
const profile = require('./profile');
const common = require('./common');
const errors = require('./errors');
const notifications = require('./notifications');
const support = require('./support');
const navigation = require('./navigation');
const components = require('./components');
const driver = require('./driver');
const client = require('./client');

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

// Helper function to flatten nested objects
const flattenObject = (obj: any, prefix = ''): Record<string, string> => {
  const flattened: Record<string, string> = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(flattened, flattenObject(obj[key], newKey));
      } else {
        flattened[newKey] = obj[key];
      }
    }
  }
  
  return flattened;
};

// Create flattened translations for each language
const createFlattenedTranslations = (lang: string) => {
  const translations = {
    ...login[lang],
    ...register[lang],
    ...profile[lang],
    ...common[lang],
    ...errors[lang],
    ...notifications[lang],
    ...support[lang],
    ...navigation[lang],
    ...components[lang],
    ...driver[lang],
    ...client[lang],
  };
  
  const flattened = flattenObject(translations);
  
  // Debug: log some keys for the current language
  if (lang === 'ru') {
    console.log('Debug - Available keys for ru:', Object.keys(flattened).slice(0, 10));
    console.log('Debug - common.selectLanguage:', flattened['common.selectLanguage']);
    console.log('Debug - title:', flattened['title']);
  }
  
  return flattened;
};

// Create i18n instance with flattened translations
const i18n = new I18n({
  ru: createFlattenedTranslations('ru'),
  en: createFlattenedTranslations('en'),
  tr: createFlattenedTranslations('tr'),
  az: createFlattenedTranslations('az'),
  fr: createFlattenedTranslations('fr'),
  ar: createFlattenedTranslations('ar'),
  es: createFlattenedTranslations('es'),
  de: createFlattenedTranslations('de'),
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