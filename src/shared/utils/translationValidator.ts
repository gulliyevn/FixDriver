// Local language map to avoid depending on i18n implementation details
export type SupportedLanguage = 'ru' | 'en' | 'az';
const SUPPORTED_LANGUAGES: Record<SupportedLanguage, true> = { ru: true, en: true, az: true };

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
 * Utility to validate translation completeness
 */
export class TranslationValidator {
  private static readonly REQUIRED_NAMESPACES = [
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

  /** Validate completeness across languages */
  static validateTranslations(): MissingTranslation[] {
    const missingTranslations: MissingTranslation[] = [];
    
    // Use RU as base language
    const baseLanguage: SupportedLanguage = 'ru';
    const baseKeys = this.getAllTranslationKeys(baseLanguage);
    
    // Validate each key across languages
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

  /** Collect all translation keys for a language */
  private static getAllTranslationKeys(language: SupportedLanguage): TranslationKey[] {
    const keys: TranslationKey[] = [];
    
    for (const namespace of this.REQUIRED_NAMESPACES) {
      try {
        const translations = require(`../i18n/${namespace}/${language}.json`);
        this.extractKeys(translations, namespace, [], keys);
      } catch (error) {
        // Silently skip missing namespaces
      }
    }
    
    return keys;
  }

  /** Recursively extract keys from translation object */
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

  /** Check translation presence for a key */
  private static hasTranslation(language: SupportedLanguage, key: string): boolean {
    try {
      const [namespace, ...pathParts] = key.split('.');
      const translations = require(`../i18n/${namespace}/${language}.json`);
      
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

  /** Generate report for missing translations */
  static generateReport(): string {
    const missingTranslations = this.validateTranslations();
    
    if (missingTranslations.length === 0) {
      return 'All translations are complete';
    }

    let report = `Missing translations: ${missingTranslations.length}\n\n`;
    for (const missing of missingTranslations) {
      report += `Key: ${missing.key}\n`;
      report += `Namespace: ${missing.namespace}\n`;
      report += `Missing in: ${missing.missingLanguages.join(', ')}\n\n`;
    }
    return report;
  }

  /** Check a specific key across languages */
  static checkKey(key: string): { [language: string]: boolean } {
    const result: { [language: string]: boolean } = {};
    
    for (const language of Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[]) {
      result[language] = this.hasTranslation(language, key);
    }
    
    return result;
  }

  /** Get translation stats (number of keys per language) */
  static getTranslationStats(): { [language: string]: number } {
    const stats: { [language: string]: number } = {};
    
    for (const language of Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[]) {
      const keys = this.getAllTranslationKeys(language);
      stats[language] = keys.length;
    }
    
    return stats;
  }
} 