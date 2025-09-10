/**
 * 🌍 LANGUAGE SERVICE
 * 
 * Mock language service for development and testing.
 * Easy to replace with gRPC implementation.
 */

// Types for LanguageService
enum AppLanguage {
  ENGLISH = 'en',
  RUSSIAN = 'ru',
  AZERBAIJANI = 'az'
}

interface DateFormat {
  format: string;
}

export default class LanguageService {
  /**
   * Get available languages
   */
  async getLanguages(): Promise<AppLanguage[]> {
    return [AppLanguage.ENGLISH, AppLanguage.RUSSIAN, AppLanguage.AZERBAIJANI];
  }

  /**
   * Get current language
   */
  async getCurrentLanguage(): Promise<AppLanguage> {
    return AppLanguage.ENGLISH;
  }

  /**
   * Set language
   */
  async setLanguage(language: AppLanguage): Promise<void> {
    console.log('🌍 Mock language set to:', language);
  }

  /**
   * Get date format for language
   */
  async getDateFormat(language: AppLanguage): Promise<DateFormat> {
    const formats: Record<AppLanguage, DateFormat> = {
      [AppLanguage.ENGLISH]: { format: 'MM/DD/YYYY' },
      [AppLanguage.RUSSIAN]: { format: 'DD.MM.YYYY' },
      [AppLanguage.AZERBAIJANI]: { format: 'DD.MM.YYYY' },
    };

    return formats[language] || formats[AppLanguage.ENGLISH];
  }
}