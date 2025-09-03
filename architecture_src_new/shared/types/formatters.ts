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
