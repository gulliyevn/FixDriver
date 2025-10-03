import AsyncStorage from "@react-native-async-storage/async-storage";

export interface OrderData {
  id: string;
  familyMemberId: string;
  familyMemberName: string;
  packageType: string;
  addresses: Array<{
    id: string;
    type: "from" | "to" | "stop";
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  }>;
  createdAt: number;
  status: "draft" | "confirmed" | "completed" | "cancelled";
}

class FixDriveOrderService {
  private storageKey = "fixdrive_order_data";
  private sessionKey = "fixdrive_session_data";

  // Сохранение данных заказа
  async saveOrderData(
    orderData: Omit<OrderData, "id" | "createdAt" | "status">,
  ): Promise<OrderData> {
    try {
      const order: OrderData = {
        ...orderData,
        id: `order_${Date.now()}`,
        createdAt: Date.now(),
        status: "draft",
      };

      await AsyncStorage.setItem(this.storageKey, JSON.stringify(order));
      return order;
    } catch (error) {
      console.error("Не удалось сохранить данные заказа");
      return;
    }
  }

  // Загрузка данных заказа
  async loadOrderData(): Promise<OrderData | null> {
    try {
      const data = await AsyncStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      return null;
    }
  }

  // Обновление данных заказа
  async updateOrderData(
    updates: Partial<OrderData>,
  ): Promise<OrderData | null> {
    try {
      const currentData = await this.loadOrderData();
      if (!currentData) {
        console.error("Нет сохраненных данных заказа");
        return;
      }

      const updatedData: OrderData = {
        ...currentData,
        ...updates,
      };

      await AsyncStorage.setItem(this.storageKey, JSON.stringify(updatedData));
      return updatedData;
    } catch (error) {
      console.error("Не удалось обновить данные заказа");
      return;
    }
  }

  // Сохранение данных сессии (для навигации между страницами)
  async saveSessionData(sessionData: {
    currentPage: string;
    addressData?: any;
    timeScheduleData?: any;
  }): Promise<void> {
    try {
      const sessionDataWithTimestamp = {
        ...sessionData,
        lastUpdate: Date.now(),
      };
      await AsyncStorage.setItem(
        this.sessionKey,
        JSON.stringify(sessionDataWithTimestamp),
      );
    } catch (error) {
      console.error("Не удалось сохранить данные сессии");
      return;
    }
  }

  // Сохранение данных контейнеров по отдельности
  async saveContainerTimes(
    containerData: Array<{
      containerId: string;
      containerType: string;
      containerIndex: number;
      address: string;
      fromCoordinate?: { latitude: number; longitude: number };
      toCoordinate?: { latitude: number; longitude: number };
      time: string;
      isActive: boolean;
      isCalculated: boolean;
    }>,
  ): Promise<void> {
    try {
      const containerTimesKey = "fixdrive_container_times";
      const containerTimesWithTimestamp = {
        containers: containerData,
        lastUpdate: Date.now(),
      };
      await AsyncStorage.setItem(
        containerTimesKey,
        JSON.stringify(containerTimesWithTimestamp),
      );
    } catch (error) {
      console.error("Не удалось сохранить данные контейнеров");
      return;
    }
  }

  // Загрузка данных сессии
  async loadSessionData(): Promise<{
    currentPage: string;
    addressData?: any;
    timeScheduleData?: any;
    lastUpdate?: number;
  } | null> {
    try {
      const data = await AsyncStorage.getItem(this.sessionKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      return null;
    }
  }

  // Очистка данных заказа
  async clearOrderData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error("Не удалось очистить данные заказа");
      return;
    }
  }

  // Очистка данных сессии
  async clearSessionData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.sessionKey);
    } catch (error) {
      console.error("Не удалось очистить данные сессии");
      return;
    }
  }

  // Очистка всех данных
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([this.storageKey, this.sessionKey]);
    } catch (error) {
      console.error("Не удалось очистить все данные");
      return;
    }
  }

  // Получение времени последнего обновления сессии
  async getSessionLastUpdate(): Promise<number | null> {
    try {
      const sessionData = await this.loadSessionData();
      return sessionData?.lastUpdate || null;
    } catch (error) {
      return null;
    }
  }

  // Проверка и очистка устаревшей сессии
  async checkAndClearExpiredSession(): Promise<void> {
    try {
      const lastUpdate = await this.getSessionLastUpdate();
      if (lastUpdate) {
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000; // 5 минут в миллисекундах

        if (now - lastUpdate > fiveMinutes) {
          await this.clearSessionData();
        }
      }
    } catch (error) {}
  }

  // Проверка валидности данных заказа
  validateOrderData(data: {
    familyMemberId: string;
    packageType: string;
    addresses: Array<{
      type: string;
      address: string;
      coordinates?: any;
      coordinate?: any; // Добавляем поддержку обоих форматов
    }>;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Проверка участника семьи
    if (!data.familyMemberId) {
      errors.push("Не выбран участник семьи");
    }

    // Проверка пакета
    if (!data.packageType) {
      errors.push("Не выбран пакет");
    }

    // Проверка адресов
    if (!data.addresses || data.addresses.length === 0) {
      errors.push("Не указаны адреса");
    } else {
      const fromAddress = data.addresses.find((addr) => addr.type === "from");
      const toAddress = data.addresses.find((addr) => addr.type === "to");

      if (!fromAddress || !fromAddress.address) {
        errors.push("Не указан адрес отправления");
      }

      if (!toAddress || !toAddress.address) {
        errors.push("Не указан адрес назначения");
      }

      // Проверка координат для основных адресов (проверяем оба формата)
      if (fromAddress && !fromAddress.coordinates && !fromAddress.coordinate) {
        errors.push("Не удалось определить координаты адреса отправления");
      }

      if (toAddress && !toAddress.coordinates && !toAddress.coordinate) {
        errors.push("Не удалось определить координаты адреса назначения");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export const fixdriveOrderService = new FixDriveOrderService();
