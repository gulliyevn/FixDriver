import * as Linking from 'expo-linking';

// Экстренные номера по странам
const EMERGENCY_NUMBERS: { [key: string]: string } = {
  // Европа
  'RU': '112', // Россия
  'DE': '112', // Германия
  'FR': '112', // Франция
  'IT': '112', // Италия
  'ES': '112', // Испания
  'GB': '999', // Великобритания
  'TR': '112', // Турция
  'AZ': '112', // Азербайджан
  
  // Америка
  'US': '911', // США
  'CA': '911', // Канада
  'MX': '911', // Мексика
  'BR': '190', // Бразилия
  'AR': '911', // Аргентина
  
  // Азия
  'CN': '110', // Китай
  'JP': '110', // Япония
  'KR': '112', // Южная Корея
  'IN': '100', // Индия
  'TH': '191', // Таиланд
  
  // Африка
  'ZA': '10111', // ЮАР
  'EG': '122', // Египет
  'NG': '112', // Нигерия
  
  // Австралия и Океания
  'AU': '000', // Австралия
  'NZ': '111', // Новая Зеландия
  
  // По умолчанию используем 112 (европейский стандарт)
  'DEFAULT': '112'
};

/**
 * Определяет экстренный номер по коду страны
 */
export const getEmergencyNumber = (countryCode: string): string => {
  const upperCountryCode = countryCode.toUpperCase();
  return EMERGENCY_NUMBERS[upperCountryCode] || EMERGENCY_NUMBERS['DEFAULT'];
};

/**
 * Совершает звонок в экстренную службу
 */
export const callEmergencyService = async (countryCode?: string): Promise<void> => {
  try {
    const emergencyNumber = getEmergencyNumber(countryCode || 'DEFAULT');
    const phoneUrl = `tel:${emergencyNumber}`;
    
    const canOpen = await Linking.canOpenURL(phoneUrl);
    if (canOpen) {
      await Linking.openURL(phoneUrl);
    } else {
      throw new Error('Не удается совершить звонок');
    }
  } catch (error) {
    console.error('Ошибка при звонке в экстренную службу:', error);
    throw error;
  }
};

/**
 * Получает код страны устройства
 * Работает даже без интернета
 */
export const getCountryCodeByLocation = async (): Promise<string> => {
  try {
    // В реальном приложении здесь можно использовать:
    // 1. expo-localization для получения локали устройства
    // 2. Сохраненную страну из настроек пользователя
    // 3. Определение по GPS координатам (если есть интернет)
    
    // Пока используем заглушку - можно настроить в настройках приложения
    return 'RU'; // По умолчанию Россия
  } catch (error) {
    console.error('Ошибка при определении страны устройства:', error);
    return 'DEFAULT';
  }
};
