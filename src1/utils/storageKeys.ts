import { useAuth } from '../context/AuthContext';

/**
 * Генерирует ключ AsyncStorage с изоляцией по пользователю
 * @param baseKey - базовый ключ
 * @param userId - ID пользователя (опционально, если не передан - берется из AuthContext)
 * @returns ключ с ID пользователя
 */
export const getUserStorageKey = (baseKey: string, userId?: string): string => {
  if (userId) {
    return `${baseKey}_${userId}`;
  }
  
  // Если userId не передан, возвращаем базовый ключ
  // (для обратной совместимости и случаев, когда пользователь не авторизован)
  return baseKey;
};

/**
 * Хук для получения ключей с изоляцией по пользователю
 */
export const useUserStorageKey = (baseKey: string): string => {
  const { user } = useAuth();
  return getUserStorageKey(baseKey, user?.id);
};

/**
 * Базовые ключи для разных типов данных
 */
export const STORAGE_KEYS = {
  // Профиль
  USER_PROFILE: 'user_profile',
  
  // Баланс
  CLIENT_BALANCE: 'client_balance',
  CLIENT_TRANSACTIONS: 'client_transactions', 
  CLIENT_CASHBACK: 'client_cashback',
  DRIVER_BALANCE: 'driver_balance',
  DRIVER_TRANSACTIONS: 'driver_transactions',
  DRIVER_EARNINGS: 'driver_earnings',
  
  // Пакеты и подписки
  USER_SUBSCRIPTION: 'user_subscription',
  USER_PACKAGE: 'user_package',
  
  // Карты
  USER_CARDS: 'cards',
  
  // Настройки
  NOTIFICATION_SETTINGS: 'notification_settings',
  THEME: 'theme',
  LANGUAGE: 'language',
  
  // Аватары
  USER_AVATAR: 'user_avatar',
  DRIVER_AVATAR: 'driver_avatar',
  
  // Адреса
  USER_ADDRESSES: 'user_addresses',
  
  // Верификация
  VERIFICATION_EMAIL: 'verification_email',
  VERIFICATION_PHONE: 'verification_phone',
  
  // OTP
  OTP_PREFIX: 'otp_',
  
  // Кэш
  LOCATION_CACHE: 'location_cache',
} as const;

/**
 * Получает ключ для конкретного пользователя
 */
export const getUserKey = (key: keyof typeof STORAGE_KEYS, userId?: string): string => {
  return getUserStorageKey(STORAGE_KEYS[key], userId);
};
