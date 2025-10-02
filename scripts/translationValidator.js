/**
 * Упрощенная JavaScript версия TranslationValidator для скриптов
 */

const SUPPORTED_LANGUAGES = {
  ru: { name: 'Русский', native: 'Русский', flag: '🇷🇺' },
  en: { name: 'English', native: 'English', flag: '🇺🇸' },
  tr: { name: 'Türkçe', native: 'Türkçe', flag: '🇹🇷' },
  az: { name: 'Azərbaycan', native: 'Azərbaycan', flag: '🇦🇿' },
  fr: { name: 'Français', native: 'Français', flag: '🇫🇷' },
  ar: { name: 'العربية', native: 'العربية', flag: '🇸🇦' },
  es: { name: 'Español', native: 'Español', flag: '🇪🇸' },
  de: { name: 'Deutsch', native: 'Deutsch', flag: '🇩🇪' },
};

const REQUIRED_NAMESPACES = [
  'common',
  'login',
  'register',
  'profile',
  'errors',
  'notifications',
  'support',
  'navigation',
  'components',
  'driver',
  'client'
];

class TranslationValidator {
  /**
   * Проверяет полноту переводов для всех языков
   */
  static validateTranslations() {
    const missingTranslations = [];
    
    // Получаем все ключи из русского языка (основного)
    const baseLanguage = 'ru';
    const baseKeys = this.getAllTranslationKeys(baseLanguage);
    
    // Проверяем каждый ключ во всех языках
    for (const translationKey of baseKeys) {
      const missingLanguages = [];
      
      for (const language of Object.keys(SUPPORTED_LANGUAGES)) {
        if (language === baseLanguage) continue;
        
        if (!this.hasTranslation(language, translationKey.key)) {
          missingLanguages.push(language);
        }
      }
      
      if (missingLanguages.length > 0) {
        missingTranslations.push({
          key: translationKey.key,
          namespace: translationKey.namespace,
          missingLanguages
        });
      }
    }
    
    return missingTranslations;
  }

  /**
   * Получает все ключи переводов для указанного языка
   */
  static getAllTranslationKeys(language) {
    const keys = [];
    
    for (const namespace of REQUIRED_NAMESPACES) {
      try {
        const translations = require(`../src/i18n/${namespace}/${language}.json`);
        this.extractKeys(translations, namespace, [], keys);
      } catch (error) {
        console.warn(`Failed to load translations for ${namespace}/${language}:`, error.message);
      }
    }
    
    return keys;
  }

  /**
   * Рекурсивно извлекает все ключи из объекта переводов
   */
  static extractKeys(obj, namespace, path, keys) {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = [...path, key];
      
      if (typeof value === 'string') {
        keys.push({
          key: `${namespace}.${currentPath.join('.')}`,
          namespace,
          path: currentPath
        });
      } else if (typeof value === 'object' && value !== null) {
        this.extractKeys(value, namespace, currentPath, keys);
      }
    }
  }

  /**
   * Проверяет наличие перевода для конкретного ключа
   */
  static hasTranslation(language, key) {
    const [namespace, ...pathParts] = key.split('.');
    
    try {
      const translations = require(`../src/i18n/${namespace}/${language}.json`);
      let current = translations;
      
      for (const part of pathParts) {
        if (current && typeof current === 'object' && part in current) {
          current = current[part];
        } else {
          return false;
        }
      }
      
      return typeof current === 'string' && current.trim().length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Генерирует отчет о состоянии переводов
   */
  static generateReport() {
    const missingTranslations = this.validateTranslations();
    
    if (missingTranslations.length === 0) {
      return '✅ Все переводы полные!';
    }
    
    let report = `⚠️  Найдено ${missingTranslations.length} недостающих переводов:\n\n`;
    
    // Группируем по языкам
    const missingByLanguage = {};
    missingTranslations.forEach(missing => {
      missing.missingLanguages.forEach(lang => {
        if (!missingByLanguage[lang]) {
          missingByLanguage[lang] = [];
        }
        missingByLanguage[lang].push(missing.key);
      });
    });
    
    Object.entries(missingByLanguage).forEach(([lang, keys]) => {
      const flag = SUPPORTED_LANGUAGES[lang]?.flag || '🌐';
      report += `${flag} ${lang.toUpperCase()}: ${keys.length} ключей\n`;
    });
    
    return report;
  }

  /**
   * Проверяет конкретный ключ во всех языках
   */
  static checkKey(key) {
    const result = {};
    
    for (const language of Object.keys(SUPPORTED_LANGUAGES)) {
      result[language] = this.hasTranslation(language, key);
    }
    
    return result;
  }

  /**
   * Получает статистику переводов по языкам
   */
  static getTranslationStats() {
    const stats = {};
    
    for (const language of Object.keys(SUPPORTED_LANGUAGES)) {
      const keys = this.getAllTranslationKeys(language);
      stats[language] = keys.length;
    }
    
    return stats;
  }
}

module.exports = { TranslationValidator };
