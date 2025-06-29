// Утилитарные функции для навигации
import { CommonActions } from '@react-navigation/native';

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
 * Безопасная навигация в чат из любого экрана
 * @param navigation - объект навигации
 * @param params - параметры водителя для чата
 */
export const navigateToChat = (navigation: any, params: ChatNavigationParams) => {
  console.log('🚀 NavigationHelper: начинаем навигацию в чат с', params.driverName);
  
  try {
    // Способ 1: Использование CommonActions для сброса стека и перехода к чату
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
      console.log('❌ Метод 1 не сработал:', error1.message);
    }

    // Способ 2: Простая навигация (может работать в некоторых случаях)
    try {
      console.log('📱 Метод 2: Простая навигация');
      navigation.navigate('Chat', {
        screen: 'ChatConversation',
        params
      });
      console.log('✅ Метод 2: Простая навигация успешна');
      return true;
    } catch (error2) {
      console.log('❌ Метод 2 не сработал:', error2.message);
    }

    // Способ 3: Через getParent (для доступа к tab navigator)
    try {
      console.log('📱 Метод 3: Навигация через parent');
      const parent = navigation.getParent();
      if (parent) {
        parent.navigate('Chat', {
          screen: 'ChatConversation',
          params
        });
        console.log('✅ Метод 3: Parent навигация успешна');
        return true;
      }
    } catch (error3) {
      console.log('❌ Метод 3 не сработал:', error3.message);
    }

    // Способ 4: Сначала переходим на Chat вкладку, потом на конкретный экран
    try {
      console.log('📱 Метод 4: Поэтапная навигация');
      // Сначала переходим на вкладку Chat
      navigation.navigate('Chat');
      // Через небольшую задержку переходим на конкретный экран
      setTimeout(() => {
        navigation.navigate('Chat', {
          screen: 'ChatConversation',
          params
        });
      }, 100);
      console.log('✅ Метод 4: Поэтапная навигация запущена');
      return true;
    } catch (error4) {
      console.log('❌ Метод 4 не сработал:', error4.message);
    }

    // Способ 5: Принудительный сброс состояния навигации
    try {
      console.log('📱 Метод 5: Сброс состояния навигации');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'Chat',
              params: {
                screen: 'ChatConversation',
                params
              }
            }
          ]
        })
      );
      console.log('✅ Метод 5: Сброс навигации успешен');
      return true;  
    } catch (error5) {
      console.log('❌ Метод 5 не сработал:', error5.message);
    }
    
    console.error('❌ Все методы навигации провалились');
    return false;
  } catch (error) {
    console.error('❌ Общая ошибка навигации в чат:', error);
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
export const formatDriverForChat = (driver: any): ChatNavigationParams => {
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