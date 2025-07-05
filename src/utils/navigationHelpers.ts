// Утилитарные функции для навигации
import { CommonActions, NavigationProp } from '@react-navigation/native';
import { ChatNavigationParams } from '../types/navigation';

export interface ChatNavigationParams {
  driverId: string;
  driverName: string;
  driverCar: string;
  driverNumber: string;
  driverRating: string;
  driverStatus?: string;
  driverPhoto?: string;
}

/**
 * Проверка, является ли ошибка Error объектом
 */
const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

/**
 * Безопасная навигация в чат из любого экрана
 * @param navigation - объект навигации
 * @param params - параметры водителя для чата
 */
export const navigateToChat = (navigation: NavigationProp<unknown>, params: ChatNavigationParams): boolean => {
  try {
    // Метод 1: Использование CommonActions для безопасной навигации
    try {
      navigation.dispatch(
        CommonActions.navigate({
          name: 'Chat',
          params: {
            screen: 'ChatConversation',
            params
          }
        })
      );
      return true;
    } catch (error1) {
      // Продолжаем к следующему методу
    }

    // Метод 2: Простая навигация как fallback
    try {
      (navigation as any).navigate('Chat', {
        screen: 'ChatConversation',
        params
      });
      return true;
    } catch (error2) {
      // Продолжаем к следующему методу
    }

    // Метод 3: Прямая навигация в ChatConversation
    try {
      (navigation as any).navigate('ChatConversation', params);
      return true;
    } catch (error3) {
      // Все методы провалились
    }
    
    return false;
  } catch (error) {
    return false;
  }
};

/**
 * Проверка доступности водителя для чата
 * @param driverStatus - статус водителя
 */
export const isDriverAvailableForChat = (driverStatus?: string): boolean => {
  return driverStatus === 'online' || driverStatus === 'busy';
};

/**
 * Форматирование параметров водителя для чата
 * @param driver - объект водителя
 */
export const formatDriverForChat = (driver: Record<string, unknown>): ChatNavigationParams => {
  return {
    driverId: driver.id || driver.driverId || 'unknown',
    driverName: driver.name || driver.driverName || 'Неизвестный водитель',
    driverCar: driver.car || driver.carModel || driver.driverCar || 'Неизвестный автомобиль',
    driverNumber: driver.number || driver.carNumber || driver.driverNumber || 'Неизвестный номер',
    driverRating: (driver.rating || driver.driverRating || 0).toString(),
    driverStatus: driver.status || driver.driverStatus || (driver.isOnline ? 'online' : 'offline'),
    driverPhoto: driver.photo || driver.driverPhoto
  };
};

 