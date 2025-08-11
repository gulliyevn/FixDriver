// Утилитарные функции для навигации

export interface ChatNavigationParams {
  driverId: string;
  driverName: string;
  driverCar: string;
  driverNumber: string;
  driverRating: string;
  driverStatus: string;
}

/**
 * Безопасная навигация в чат из любого экрана
 * @param navigation - объект навигации
 * @param params - параметры водителя для чата
 */
export const navigateToChat = (
  navigation: { navigate: (name: string, params?: unknown) => void },
  params: {
    driverId: string;
    driverName: string;
    driverCar: string;
    driverNumber: string;
    driverRating: string;
    driverStatus: string;
  }
): boolean => {
  try {
    navigation.navigate('Chat', params);
    return true;
  } catch (error) {
    console.error('Navigation error:', error);
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
    driverId: (driver.id || driver.driverId || 'unknown') as string,
    driverName: (driver.name || driver.driverName || 'Неизвестный водитель') as string,
    driverCar: (driver.car || driver.carModel || driver.driverCar || 'Неизвестный автомобиль') as string,
    driverNumber: (driver.number || driver.carNumber || driver.driverNumber || 'Неизвестный номер') as string,
    driverRating: (driver.rating || driver.driverRating || 0).toString(),
    driverStatus: (driver.status || driver.driverStatus || (driver.isOnline ? 'online' : 'offline')) as string,
  };
};

 