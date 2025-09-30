// Clean, modular i18n system - English only for now
import * as React from 'react';

// Import JSON files - using require for compatibility
const authLogin = require('./auth/login.json');
const authRegister = require('./auth/register.json');
const authRoleSelect = require('./auth/role-select.json');
const authForgotPassword = require('./auth/forgot-password.json');
const authResetPassword = require('./auth/reset-password.json');
const commonButtons = require('./common/buttons.json');
const commonMessages = require('./common/messages.json');
const commonLabels = require('./common/labels.json');
const navigationTabs = require('./navigation/tabs.json');
const earningsCommon = require('./common/earnings.json');
const levelsCommon = require('./common/levels.json');
const premiumCommon = require('./common/premium.json');

// Types
export interface I18nConfig {
  language: string;
  fallbackLanguage: string;
}

export interface TranslationData {
  [key: string]: string | TranslationData;
}

// Configuration - English only for now
const config: I18nConfig = {
  language: 'en',
  fallbackLanguage: 'en',
};

// Context
type I18nContextValue = {
  language: string;
  changeLanguage: (lang: string) => void;
  t: (key: string) => string;
};

const I18nContext = React.createContext<I18nContextValue | null>(null);

// Clean English translations structure
const translations: Record<string, TranslationData> = {
  en: {
    auth: {
      login: authLogin,
      register: authRegister,
      roleSelect: authRoleSelect,
      forgotPassword: authForgotPassword,
      resetPassword: authResetPassword,
    },
    common: {
      buttons: commonButtons,
      messages: commonMessages,
      labels: commonLabels,
      earnings: earningsCommon,
      levels: levelsCommon,
      premium: premiumCommon,
    },
    navigation: {
      tabs: navigationTabs,
    },
  },
};

// Helper function to get nested value
const getNestedValue = (obj: any, path: string): string => {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      console.warn(`Translation key not found: ${path}`);
      return path; // Return key if not found
    }
  }
  
  return typeof current === 'string' ? current : path;
};

// Translation function
const t = (key: string): string => {
  return getNestedValue(translations[config.language], key);
};

// Provider component
export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [language, setLanguage] = React.useState(config.language);

  const changeLanguage = React.useCallback((lang: string) => {
    setLanguage(lang);
    config.language = lang;
  }, []);

  const value = React.useMemo(
    () => ({
      language,
      changeLanguage,
      t: (key: string) => getNestedValue(translations[language], key),
    }),
    [language, changeLanguage]
  );

  return React.createElement(
    I18nContext.Provider,
    { value },
    children
  );
};

// Hook
export const useI18n = (): I18nContextValue => {
  const context = React.useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};

// Export for direct usage
export { t };
export default { t, useI18n, I18nProvider };