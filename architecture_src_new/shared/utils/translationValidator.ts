/**
 * 🌍 TRANSLATION VALIDATOR
 * Clean, compact validator for i18n - gRPC ready!
 */

import { TRANSLATION_KEYS } from '../i18n/translationKeys';

export type SupportedLanguage = 'ru' | 'en';

export const SUPPORTED_LANGUAGES = {
  ru: 'Русский',
  en: 'English'
};

interface TranslationKey {
  key: string;
  namespace: string;
  path: string[];
}

interface MissingTranslation {
  key: string;
  namespace: string;
  missingLanguages: SupportedLanguage[];
}

/**
 * 🧪 Translation validation utility
 */
export class TranslationValidator {
  private static readonly REQUIRED_NAMESPACES = [
    'common', 'auth', 'profile', 'errors', 'notifications', 'support', 'navigation'
  ];

  /**
   * ✅ Validates translation completeness
   */
  static validateTranslations(): MissingTranslation[] {
    const missingTranslations: MissingTranslation[] = [];
    const baseLanguage: SupportedLanguage = 'ru';
    const baseKeys = this.getAllTranslationKeys(baseLanguage);
    
    for (const translationKey of baseKeys) {
      const missingLanguages: SupportedLanguage[] = [];
      
      for (const language of Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[]) {
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
   * 🔑 Gets all translation keys for a language
   */
  private static getAllTranslationKeys(language: SupportedLanguage): TranslationKey[] {
    const keys: TranslationKey[] = [];
    
    for (const namespace of this.REQUIRED_NAMESPACES) {
      try {
        // Mock translations for now - in real app load from JSON files
        const mockTranslations = this.getMockTranslations(namespace, language);
        this.extractKeys(mockTranslations, namespace, [], keys);
      } catch (error) {
        console.warn(`Failed to load translations for ${namespace}/${language}:`, error);
      }
    }
    
    return keys;
  }

  /**
   * 📁 Extracts keys recursively from translation object
   */
  private static extractKeys(
    obj: any, 
    namespace: string, 
    path: string[], 
    keys: TranslationKey[]
  ): void {
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
   * 🔍 Checks if translation exists for a key
   */
  private static hasTranslation(language: SupportedLanguage, key: string): boolean {
    try {
      const [namespace, ...pathParts] = key.split('.');
      const mockTranslations = this.getMockTranslations(namespace, language);
      
      let current = mockTranslations;
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
   * 📊 Generates missing translations report
   */
  static generateReport(): string {
    const missingTranslations = this.validateTranslations();
    
    if (missingTranslations.length === 0) {
      return '✅ All translations are complete!';
    }
    
    let report = `❌ Found ${missingTranslations.length} missing translations:\n\n`;
    
    for (const missing of missingTranslations) {
      report += `🔑 Key: ${missing.key}\n`;
      report += `📁 Namespace: ${missing.namespace}\n`;
      report += `🌍 Missing in: ${missing.missingLanguages.join(', ')}\n\n`;
    }
    
    return report;
  }

  /**
   * 🔐 Checks specific key in all languages
   */
  static checkKey(key: string): { [language: string]: boolean } {
    const result: { [language: string]: boolean } = {};
    
    for (const language of Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[]) {
      result[language] = this.hasTranslation(language, key);
    }
    
    return result;
  }

  /**
   * 📈 Gets translation statistics
   */
  static getTranslationStats(): { [language: string]: number } {
    const stats: { [language: string]: number } = {};
    
    for (const language of Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[]) {
      const keys = this.getAllTranslationKeys(language);
      stats[language] = keys.length;
    }
    
    return stats;
  }

  /**
   * 🎭 Mock translations for development
   */
  private static getMockTranslations(namespace: string, language: SupportedLanguage): any {
    // In real app, load from JSON files
    const mockData: Record<string, any> = {
      common: {
        roleSelect: {
          clientTitle: language === 'ru' ? 'Клиент' : 'Client',
          driverTitle: language === 'ru' ? 'Водитель' : 'Driver'
        }
      },
      auth: {
        login: {
          title: language === 'ru' ? 'Вход' : 'Login',
          email: language === 'ru' ? 'Почта' : 'Email'
        }
      }
    };
    
    return mockData[namespace] || {};
  }
}

export default TranslationValidator;
