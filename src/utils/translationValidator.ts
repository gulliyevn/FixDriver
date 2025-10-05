import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "../i18n";

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
 * Утилита для проверки полноты переводов
 */
export class TranslationValidator {
  private static readonly REQUIRED_NAMESPACES = [
    "common",
    "login",
    "register",
    "profile",
    "errors",
    "notifications",
    "support",
    "navigation",
    "components",
    "driver",
    "client",
  ];

  /**
   * Проверяет полноту переводов для всех языков
   */
  static validateTranslations(): MissingTranslation[] {
    const missingTranslations: MissingTranslation[] = [];

    // Получаем все ключи из русского языка (основного)
    const baseLanguage: SupportedLanguage = "ru";
    const baseKeys = this.getAllTranslationKeys(baseLanguage);

    // Проверяем каждый ключ во всех языках
    for (const translationKey of baseKeys) {
      const missingLanguages: SupportedLanguage[] = [];

      for (const language of Object.keys(
        SUPPORTED_LANGUAGES,
      ) as SupportedLanguage[]) {
        if (language === baseLanguage) continue;

        if (!this.hasTranslation(language, translationKey.key)) {
          missingLanguages.push(language);
        }
      }

      if (missingLanguages.length > 0) {
        missingTranslations.push({
          key: translationKey.key,
          namespace: translationKey.namespace,
          missingLanguages,
        });
      }
    }

    return missingTranslations;
  }

  /**
   * Получает все ключи переводов для указанного языка
   */
  private static getAllTranslationKeys(
    language: SupportedLanguage,
  ): TranslationKey[] {
    const keys: TranslationKey[] = [];

    for (const namespace of this.REQUIRED_NAMESPACES) {
      try {
        const translations = require(`../i18n/${namespace}/${language}.json`);
        this.extractKeys(translations, namespace, [], keys);
      } catch (error) {
        console.warn(`Failed to load translations for ${namespace}/${language}:`, error);
      }
    }

    return keys;
  }

  /**
   * Рекурсивно извлекает все ключи из объекта переводов
   */
  private static extractKeys(
    obj: unknown,
    namespace: string,
    path: string[],
    keys: TranslationKey[],
  ): void {
    if (!obj || typeof obj !== 'object') return;
    for (const [key, value] of Object.entries(obj as Record<string, any>)) {
      const currentPath = [...path, key];

      if (typeof value === "string") {
        keys.push({
          key: `${namespace}.${currentPath.join(".")}`,
          namespace,
          path: currentPath,
        });
      } else if (typeof value === "object" && value !== null) {
        this.extractKeys(value, namespace, currentPath, keys);
      }
    }
  }

  /**
   * Проверяет наличие перевода для указанного ключа
   */
  private static hasTranslation(
    language: SupportedLanguage,
    key: string,
  ): boolean {
    try {
      const [namespace, ...pathParts] = key.split(".");
      const translations = require(`../i18n/${namespace}/${language}.json`);

      let current = translations;
      for (const part of pathParts) {
        if (current && typeof current === "object" && part in current) {
          current = current[part];
        } else {
          return false;
        }
      }

      return typeof current === "string" && current.trim().length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Генерирует отчет о недостающих переводах
   */
  static generateReport(): string {
    const missingTranslations = this.validateTranslations();

    if (missingTranslations.length === 0) {
      return "✅ Все переводы полные!";
    }

    let report = `❌ Найдено ${missingTranslations.length} недостающих переводов:\n\n`;

    for (const missing of missingTranslations) {
      report += `🔑 Ключ: ${missing.key}\n`;
      report += `📁 Namespace: ${missing.namespace}\n`;
      report += `🌍 Отсутствует в: ${missing.missingLanguages.join(", ")}\n\n`;
    }

    return report;
  }

  /**
   * Проверяет конкретный ключ во всех языках
   */
  static checkKey(key: string): { [language: string]: boolean } {
    const result: { [language: string]: boolean } = {};

    for (const language of Object.keys(
      SUPPORTED_LANGUAGES,
    ) as SupportedLanguage[]) {
      result[language] = this.hasTranslation(language, key);
    }

    return result;
  }

  /**
   * Получает статистику переводов
   */
  static getTranslationStats(): { [language: string]: number } {
    const stats: { [language: string]: number } = {};

    for (const language of Object.keys(
      SUPPORTED_LANGUAGES,
    ) as SupportedLanguage[]) {
      const keys = this.getAllTranslationKeys(language);
      stats[language] = keys.length;
    }

    return stats;
  }
}
