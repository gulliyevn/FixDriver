// Types for formatters
export enum AppLanguage {
  RUSSIAN = 'ru',
  ENGLISH = 'en',
  AZERBAIJANI = 'az',
  GERMAN = 'de',
  SPANISH = 'es',
  FRENCH = 'fr',
  TURKISH = 'tr',
  ARABIC = 'ar'
}

export enum DateFormat {
  SHORT = 'short',
  LONG = 'long'
}

export interface LocaleMapping {
  [key: string]: string;
}

export interface FormattingOptions {
  language?: AppLanguage;
  format?: DateFormat;
  currency?: string;
}

export interface FormattersService {
  formatTime(date: Date | string, language?: AppLanguage): string;
  formatDate(date: Date | string): string;
  formatCurrency(amount: number, currency?: string): string;
  formatPhone(phone: string): string;
  formatDistance(meters: number): string;
  formatDuration(minutes: number): string;
  capitalize(str: string): string;
  truncate(text: string, maxLength: number): string;
  formatBalance(balance: number): string;
  formatDateWithLanguage(date: Date | string, language?: AppLanguage, format?: DateFormat): string;
}

/**
 * Formatters service implementation
 * Provides utility functions for data formatting
 */
export class Formatters implements FormattersService {
  private readonly LOCALE_MAP: LocaleMapping = {
    [AppLanguage.RUSSIAN]: 'ru-RU',
    [AppLanguage.ENGLISH]: 'en-US',
    [AppLanguage.AZERBAIJANI]: 'az-AZ',
    [AppLanguage.GERMAN]: 'de-DE',
    [AppLanguage.SPANISH]: 'es-ES',
    [AppLanguage.FRENCH]: 'fr-FR',
    [AppLanguage.TURKISH]: 'tr-TR',
    [AppLanguage.ARABIC]: 'ar-SA'
  };

  private readonly DEFAULT_LANGUAGE = AppLanguage.RUSSIAN;
  private readonly DEFAULT_CURRENCY = 'USD';

  /**
   * Convert string or Date to Date object
   */
  private toDate(date: Date | string): Date {
    return typeof date === 'string' ? new Date(date) : date;
  }

  /**
   * Get locale for language
   */
  private getLocale(language: AppLanguage = this.DEFAULT_LANGUAGE): string {
    return this.LOCALE_MAP[language] || this.LOCALE_MAP[AppLanguage.ENGLISH];
  }

  /**
   * Format time in HH:MM format with app language
   */
  formatTime(date: Date | string, language: AppLanguage = this.DEFAULT_LANGUAGE): string {
    const dateObj = this.toDate(date);
    const locale = this.getLocale(language);
    
    return dateObj.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  /**
   * Format date in DD.MM.YYYY format
   */
  formatDate(date: Date | string): string {
    const dateObj = this.toDate(date);
    return dateObj.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  /**
   * Format currency
   */
  formatCurrency(amount: number, currency: string = this.DEFAULT_CURRENCY): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  }

  /**
   * Format phone number
   */
  formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
    
    if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
    }
    
    return phone;
  }

  /**
   * Format distance in meters/kilometers
   */
  formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  }

  /**
   * Format duration in minutes/hours
   */
  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}min`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  }

  /**
   * Capitalize first letter
   */
  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Truncate text with ellipsis
   */
  truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  }

  /**
   * Format balance to show exactly 2 decimal places
   */
  formatBalance(balance: number): string {
    return Number(balance || 0).toFixed(2);
  }

  /**
   * Format date with app language instead of system locale
   */
  formatDateWithLanguage(
    date: Date | string, 
    language: AppLanguage = this.DEFAULT_LANGUAGE, 
    format: DateFormat = DateFormat.SHORT
  ): string {
    const dateObj = this.toDate(date);
    const locale = this.getLocale(language);
    
    if (format === DateFormat.LONG) {
      return dateObj.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    return dateObj.toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}

// Default instance for backward compatibility
export const formatters = new Formatters();

// Legacy function exports for smooth migration
export const formatTime = (date: Date | string, language: string = 'ru') => 
  formatters.formatTime(date, language as AppLanguage);
export const formatDate = (date: Date | string) => formatters.formatDate(date);
export const formatCurrency = (amount: number, currency = 'USD') => 
  formatters.formatCurrency(amount, currency);
export const formatPhone = (phone: string) => formatters.formatPhone(phone);
export const formatDistance = (meters: number) => formatters.formatDistance(meters);
export const formatDuration = (minutes: number) => formatters.formatDuration(minutes);
export const capitalize = (str: string) => formatters.capitalize(str);
export const truncate = (text: string, maxLength: number) => 
  formatters.truncate(text, maxLength);
export const formatBalance = (balance: number) => formatters.formatBalance(balance);
export const formatDateWithLanguage = (
  date: Date | string, 
  language: string = 'ru', 
  format: 'short' | 'long' = 'short'
) => formatters.formatDateWithLanguage(
  date, 
  language as AppLanguage, 
  format as DateFormat
);

// Export mock service for testing and gRPC preparation
export { MockServices } from '../mocks';
