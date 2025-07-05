import { Alert, Linking } from 'react-native';
import { ENV, logError } from '../config/environment';

/**
 * Production-ready error handler
 */
export const handleProductionError = (error: unknown, context: string = 'App') => {
  logError(error, context);
  
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
        onPress: () => Linking.openURL(`mailto:${ENV.SUPPORT_EMAIL}`) 
      },
      { 
        text: 'Телефон', 
        onPress: () => Linking.openURL(`tel:${ENV.SUPPORT_PHONE}`) 
      }
    ]
  );
};

/**
 * Validate production data
 */
export const validateProductionData = (data: unknown, schema: unknown) => {
  try {
    // TODO: Add proper validation library (Joi, Yup, etc.)
    return true;
  } catch (error) {
    logError(error, 'DataValidation');
    return false;
  }
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
export const formatDate = (date: Date | string, format: 'short' | 'long' = 'short') => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'long') {
    return dateObj.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  return dateObj.toLocaleDateString('ru-RU', {
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
    logError(error, 'DeepClone');
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
  let timeout: NodeJS.Timeout;
  
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