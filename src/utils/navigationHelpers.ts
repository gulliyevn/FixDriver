// Утилитарные функции для навигации
import { CommonActions, NavigationProp } from '@react-navigation/native';

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
export const navigateToChat = (navigation: NavigationProp<any>, params: ChatNavigationParams): boolean => {
  console.log('🚀 NavigationHelper: начинаем навигацию в чат с', params.driverName);
  
  try {
    // Метод 1: Использование CommonActions для безопасной навигации
    try {
      console.log('📱 Метод 1: Использование CommonActions');
      navigation.dispatch(
        CommonActions.navigate({
          name: 'Chat',
          params: {
            screen: 'ChatConversation',
            params
          }
        })
      );
      console.log('✅ Метод 1: CommonActions навигация успешна');
      return true;
    } catch (error1) {
      const message = isError(error1) ? error1.message : 'Неизвестная ошибка';
      console.log('❌ Метод 1 не сработал:', message);
    }

    // Метод 2: Простая навигация как fallback
    try {
      console.log('📱 Метод 2: Простая навигация');
      (navigation as any).navigate('Chat', {
        screen: 'ChatConversation',
        params
      });
      console.log('✅ Метод 2: Простая навигация успешна');
      return true;
    } catch (error2) {
      const message = isError(error2) ? error2.message : 'Неизвестная ошибка';
      console.log('❌ Метод 2 не сработал:', message);
    }
    
    console.error('❌ Все методы навигации провалились');
    return false;
  } catch (error) {
    const message = isError(error) ? error.message : 'Неизвестная ошибка навигации';
    console.error('❌ Общая ошибка навигации в чат:', message);
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
export const formatDriverForChat = (driver: Record<string, any>): ChatNavigationParams => {
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