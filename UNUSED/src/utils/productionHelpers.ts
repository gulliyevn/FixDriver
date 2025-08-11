import { Alert, Linking } from 'react-native';
import { ENV_CONFIG, logError } from '../config/environment';

/**
 * Production-ready error handler
 */
export const handleProductionError = (error: unknown, context: string = 'App') => {
  logError(error instanceof Error ? error : String(error), context);
  
  // Show user-friendly error message
  Alert.alert(
    'Произошла ошибка',
    'Пожалуйста, попробуйте еще раз или обратитесь в поддержку.',
    [
      { text: 'OK', style: 'default' },
      { 
        text: 'Поддержка', 
        onPress: () => contactSupport() 
      }
    ]
  );
};

/**
 * Contact support
 */
export const contactSupport = () => {
  Alert.alert(
    'Связаться с поддержкой',
    'Выберите способ связи:',
    [
      { text: 'Отмена', style: 'cancel' },
      { 
        text: 'Email', 
        onPress: () => Linking.openURL(`mailto:${ENV_CONFIG.SUPPORT.EMAIL}`) 
      },
      { 
        text: 'Телефон', 
        onPress: () => Linking.openURL(`tel:${ENV_CONFIG.SUPPORT.PHONE}`) 
      }
    ]
  );
};

/**
 * Validate production data
 */
export const validateProductionData = () => {
  // TODO: Add proper validation library (Joi, Yup, etc.)
  return true;
};

/**
 * Safe API call wrapper
 */
export const safeApiCall = async <T>(
  apiCall: () => Promise<T>,
  context: string = 'API'
): Promise<T | null> => {
  try {
    return await apiCall();
  } catch (error) {
    handleProductionError(error, context);
    return null;
  }
};

/**
 * Production-ready navigation guard
 */
export const navigationGuard = (condition: boolean, message: string = 'Доступ запрещен') => {
  if (!condition) {
    Alert.alert('Внимание', message);
    return false;
  }
  return true;
};

/**
 * Format currency for production
 */
export const formatCurrency = (amount: number, currency: string = 'RUB') => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Format date for production
 */
export const formatDate = (date: Date | string, format: 'short' | 'long' = 'short', language: string = 'ru') => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Map language to locale
  const localeMap: Record<string, string> = {
    'ru': 'ru-RU',
    'en': 'en-US',
    'az': 'az-AZ',
    'de': 'de-DE',
    'es': 'es-ES',
    'fr': 'fr-FR',
    'tr': 'tr-TR',
    'ar': 'ar-SA'
  };
  
  const locale = localeMap[language] || 'ru-RU';
  
  if (format === 'long') {
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
};

/**
 * Production-ready deep clone
 */
export const deepClone = <T>(obj: T): T => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    logError(error instanceof Error ? error : String(error), 'DeepClone');
    return obj;
  }
};

/**
 * Debounce function for production
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function for production
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const validateData = (): boolean => {
  // TODO: Добавить валидацию данных
  return true;
}; 