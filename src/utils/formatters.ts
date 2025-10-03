/**
 * Utility functions for formatting data
 */

/**
 * Format time in HH:MM format with app language
 */
export const formatTime = (
  date: Date | string,
  language: string = "ru",
): string => {
  const d = typeof date === "string" ? new Date(date) : date;

  // Map language to locale
  const localeMap: Record<string, string> = {
    ru: "ru-RU",
    en: "en-US",
    az: "az-AZ",
    de: "de-DE",
    es: "es-ES",
    fr: "fr-FR",
    tr: "tr-TR",
    ar: "ar-SA",
  };

  const locale = localeMap[language] || "en-US";

  return d.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

/**
 * Format date in DD.MM.YYYY format
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/**
 * Format currency
 */
export const formatCurrency = (amount: number, currency = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

/**
 * Format phone number
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
  }
  return phone;
};

/**
 * Format distance in meters/kilometers
 */
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

/**
 * Format duration in minutes/hours
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0
    ? `${hours}h ${remainingMinutes}min`
    : `${hours}h`;
};

/**
 * Capitalize first letter
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Truncate text with ellipsis
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

/**
 * Format balance to show exactly 2 decimal places
 */
export const formatBalance = (balance: number): string => {
  // Строго 2 цифры после запятой
  return Number(balance || 0).toFixed(2);
};

/**
 * Format date with app language instead of system locale
 */
export const formatDateWithLanguage = (
  date: Date | string,
  language: string = "ru",
  format: "short" | "long" = "short",
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Map app language to locale
  const localeMap: Record<string, string> = {
    ru: "ru-RU",
    en: "en-US",
    az: "az-AZ",
    de: "de-DE",
    es: "es-ES",
    fr: "fr-FR",
    tr: "tr-TR",
    ar: "ar-SA",
  };

  const locale = localeMap[language] || "en-US";

  if (format === "long") {
    return dateObj.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return dateObj.toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
