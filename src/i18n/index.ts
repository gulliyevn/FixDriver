import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

// Import all translation files using require for better JSON compatibility
const login = require('./login');
const register = require('./register');
const profile = require('./profile');
const common = require('./common');
const errors = require('./errors');
const notifications = require('./notifications');
const support = require('./support');
const help = require('./help');
const navigation = require('./navigation');
const components = require('./components');
const driver = require('./driver');
const client = require('./client');
const cards = require('./components/cards');
const about = require('./client/about');
const theme = require('./profile/theme');
const premium = require('./premium');
const newNs = require('./new@new.json');

// Supported languages with flags and native names
export const SUPPORTED_LANGUAGES = {
  ru: { name: 'Русский', native: 'Русский', flag: '🇷🇺' },
  en: { name: 'English', native: 'English', flag: '🇺🇸' },
  tr: { name: 'Türkçe', native: 'Türkçe', flag: '🇹🇷' },
  az: { name: 'Azərbaycan', native: 'Azərbaycan', flag: '🇦🇿' },
  fr: { name: 'Français', native: 'Français', flag: '🇫🇷' },
  ar: { name: 'العربية', native: 'العربية', flag: '🇸🇦' },
  es: { name: 'Español', native: 'Español', flag: '🇪🇸' },
  de: { name: 'Deutsch', native: 'Deutsch', flag: '🇩🇪' },
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

// Default language
const DEFAULT_LANGUAGE: SupportedLanguage = 'ru';

// Create translations for each language (сохраняем namespace)
const createTranslations = (lang: string) => {
  return {
    common: common[lang],
    login: login[lang],
    register: register[lang],
    profile: profile[lang],
    errors: errors[lang],
    notifications: notifications[lang],
    support: support[lang],
    help: help[lang],
    navigation: navigation[lang],
    components: {
      ...components[lang],
      cards: cards[lang],
    },
    driver: driver[lang],
    client: {
      ...client[lang],
      about: about[lang],
    },
    theme: theme[lang],
    premium: premium[lang],
    new: newNs[lang] || {},
  };
};

// Create i18n instance with translations
const i18n = new I18n({
  ru: createTranslations('ru'),
  en: createTranslations('en'),
  tr: createTranslations('tr'),
  az: createTranslations('az'),
  fr: createTranslations('fr'),
  ar: createTranslations('ar'),
  es: createTranslations('es'),
  de: createTranslations('de'),
});

i18n.defaultLocale = DEFAULT_LANGUAGE;
i18n.locale = DEFAULT_LANGUAGE;
i18n.enableFallback = true;
i18n.defaultSeparator = '.';

// Storage keys
const LANGUAGE_STORAGE_KEY = '@FixDrive:language';

// Event listeners for language changes
type LanguageChangeListener = (language: SupportedLanguage) => void;
const languageChangeListeners: LanguageChangeListener[] = [];

export const addLanguageChangeListener = (listener: LanguageChangeListener) => {
  languageChangeListeners.push(listener);
};

export const removeLanguageChangeListener = (listener: LanguageChangeListener) => {
  const index = languageChangeListeners.indexOf(listener);
  if (index > -1) {
    languageChangeListeners.splice(index, 1);
  }
};

const notifyLanguageChange = (language: SupportedLanguage) => {
  languageChangeListeners.forEach(listener => listener(language));
};

// Language management
export const setLanguage = async (language: SupportedLanguage): Promise<void> => {
  try {
    if (!SUPPORTED_LANGUAGES[language]) {
      throw new Error(`Unsupported language: ${language}`);
    }
    
    i18n.locale = language;
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    notifyLanguageChange(language);
  } catch (error) {
    console.warn('Language set error:', error);
    throw error;
  }
};

// Get system language and map to supported language
export const getSystemLanguage = (): SupportedLanguage => {
  try {
    const systemLocale = Localization.getLocales()[0]?.languageCode || 'en';
    return SUPPORTED_LANGUAGES[systemLocale] ? systemLocale as SupportedLanguage : DEFAULT_LANGUAGE;
  } catch (error) {
    return DEFAULT_LANGUAGE;
  }
};

export const getLanguage = async (): Promise<SupportedLanguage> => {
  try {
    const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage && storedLanguage in SUPPORTED_LANGUAGES) {
      return storedLanguage as SupportedLanguage;
    }
    // Если нет сохраненного языка, используем системный
    return getSystemLanguage();
  } catch (error) {
    return getSystemLanguage();
  }
};

export const initializeLanguage = async (): Promise<void> => {
  try {
    const language = await getLanguage();
    i18n.locale = language;
    notifyLanguageChange(language);
  } catch (error) {


    i18n.locale = DEFAULT_LANGUAGE;
  }
};

// Main translation function using i18n-js
export const t = (key: string, params?: Record<string, string | number>): string => {
  try {
    let result = i18n.t(key, params);
    
    // Если интерполяция не сработала, делаем замену вручную
    if (params && result.includes('{clientName}')) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        result = result.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue));
      });
    }
    
    return result;
  } catch (error) {
    console.error('Translation error:', error, 'for key:', key);
    return key;
  }
};

// Get current language
export const getCurrentLanguage = (): SupportedLanguage => {
  return i18n.locale as SupportedLanguage;
};



// Check if RTL language
export const isRTL = (): boolean => {
  return i18n.locale === 'ar';
};

// Get language info
export const getLanguageInfo = (language: SupportedLanguage) => {
  return SUPPORTED_LANGUAGES[language];
};

// Get all language options for selector
export const getLanguageOptions = () => {
  return Object.entries(SUPPORTED_LANGUAGES).map(([code, info]) => ({
    code: code as SupportedLanguage,
    ...info,
  }));
};

export default i18n; 