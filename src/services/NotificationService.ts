// Сервис для real-time уведомлений
import WebSocketService, { WebSocketMessage } from "./WebSocketService";
import APIClient from "./APIClient";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  category: "order" | "payment" | "driver" | "system";
  data?: any;
  timestamp: number;
  read: boolean;
  priority: "low" | "normal" | "high";
}

export interface NotificationSettings {
  pushEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  categories: {
    orders: boolean;
    payments: boolean;
    drivers: boolean;
    system: boolean;
  };
}

class NotificationService {
  private static instance: NotificationService;
  private ws: typeof WebSocketService;
  private isInitialized = false;
  private notificationQueue: NotificationData[] = [];
  private settings: NotificationSettings = {
    pushEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    categories: {
      orders: true,
      payments: true,
      drivers: true,
      system: true,
    },
  };

  private constructor() {
    this.ws = WebSocketService;
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Инициализация сервиса уведомлений
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Настройка Expo Notifications
      await this.setupExpoNotifications();

      // Подключение к WebSocket для real-time уведомлений
      await this.setupWebSocketListeners();

      // Загрузка настроек уведомлений
      await this.loadSettings();

      this.isInitialized = true;
    } catch (error) {
      console.error("Ошибка инициализации NotificationService:", error);
      throw error;
    }
  }

  /**
   * Настройка Expo Notifications
   */
  private async setupExpoNotifications(): Promise<void> {
    // Настройка обработчика уведомлений
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: this.settings.soundEnabled,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    // Запрос разрешений
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      this.settings.pushEnabled = false;
      return;
    }

    // Получение Expo Push Token
    try {
      const token = await Notifications.getExpoPushTokenAsync();
      await this.registerPushToken(token.data);
    } catch (error) {
      console.error("Ошибка получения Expo Push Token:", error);
    }
  }

  /**
   * Настройка WebSocket слушателей для real-time уведомлений
   */
  private async setupWebSocketListeners(): Promise<void> {
    await this.ws.connect({
      onMessage: (message: WebSocketMessage) => {
        if (message.type === "notification") {
          this.handleRealtimeNotification(message.data);
        }
      },
      onError: (error) => {
        console.error("WebSocket ошибка в NotificationService:", error);
      },
      onClose: () => {},
    });
  }

  /**
   * Обработка real-time уведомления
   */
  private handleRealtimeNotification(data: NotificationData): void {
    // Проверяем настройки категории
    if (
      !this.settings.categories[
        data.category as keyof typeof this.settings.categories
      ]
    ) {
      return;
    }

    // Добавляем в очередь
    this.notificationQueue.push(data);

    // Показываем локальное уведомление
    this.showLocalNotification(data);

    // Сохраняем уведомление
    this.saveNotification(data);
  }

  /**
   * Показ локального уведомления
   */
  private async showLocalNotification(
    notification: NotificationData,
  ): Promise<void> {
    if (!this.settings.pushEnabled) return;

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.message,
          data: notification.data,
          sound: this.settings.soundEnabled,
        },
        trigger: null, // Показать немедленно
      });
    } catch (error) {
      console.error("Ошибка показа локального уведомления:", error);
    }
  }

  /**
   * Регистрация Push Token на сервере
   */
  private async registerPushToken(token: string): Promise<void> {
    try {
      const response = await APIClient.post("/notifications/register-token", {
        token,
        platform: Platform.OS,
        appVersion: "1.0.0", // Можно получить из app.json
      });

      if (!response.success) {
        console.error("Ошибка регистрации Push Token:", response.error);
      }
    } catch (error) {
      console.error("Ошибка регистрации Push Token:", error);
    }
  }

  /**
   * Сохранение уведомления локально
   */
  private async saveNotification(
    notification: NotificationData,
  ): Promise<void> {
    try {
      // Можно использовать AsyncStorage или базу данных
      // Для простоты пока просто логируем
      console.log("Уведомление сохранено:", notification);
    } catch (error) {
      console.error("Ошибка сохранения уведомления:", error);
    }
  }

  /**
   * Получение всех уведомлений
   */
  async getNotifications(limit = 50, offset = 0): Promise<NotificationData[]> {
    try {
      const response = await APIClient.get("/notifications", {
        limit,
        offset,
      });

      if (response.success && response.data) {
        return (response.data as any)?.notifications || [];
      }

      return [];
    } catch (error) {
      console.error("Ошибка получения уведомлений:", error);
      return [];
    }
  }

  /**
   * Отметка уведомления как прочитанного
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await APIClient.patch(`/notifications/${notificationId}/read`);

      // Обновляем локальную очередь
      const index = this.notificationQueue.findIndex(
        (n) => n.id === notificationId,
      );
      if (index !== -1) {
        this.notificationQueue[index].read = true;
      }
    } catch (error) {
      console.error("Ошибка отметки уведомления как прочитанного:", error);
    }
  }

  /**
   * Отметка всех уведомлений как прочитанных
   */
  async markAllAsRead(): Promise<void> {
    try {
      await APIClient.patch("/notifications/mark-all-read");

      // Обновляем локальную очередь
      this.notificationQueue.forEach((notification) => {
        notification.read = true;
      });
    } catch (error) {
      console.error("Ошибка отметки всех уведомлений как прочитанных:", error);
    }
  }

  /**
   * Удаление уведомления
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await APIClient.delete(`/notifications/${notificationId}`);

      // Удаляем из локальной очереди
      this.notificationQueue = this.notificationQueue.filter(
        (n) => n.id !== notificationId,
      );
    } catch (error) {
      console.error("Ошибка удаления уведомления:", error);
    }
  }

  /**
   * Отправка тестового уведомления
   */
  async sendTestNotification(): Promise<void> {
    const testNotification: NotificationData = {
      id: `test-${Date.now()}`,
      title: "Тестовое уведомление",
      message: "Это тестовое уведомление для проверки работы системы",
      type: "info",
      category: "system",
      timestamp: Date.now(),
      read: false,
      priority: "normal",
    };

    this.handleRealtimeNotification(testNotification);
  }

  /**
   * Обновление настроек уведомлений
   */
  async updateSettings(
    newSettings: Partial<NotificationSettings>,
  ): Promise<void> {
    try {
      this.settings = { ...this.settings, ...newSettings };

      await APIClient.put("/notifications/settings", this.settings);

      // Если отключили push уведомления, отменяем все запланированные
      if (!newSettings.pushEnabled) {
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
    } catch (error) {
      console.error("Ошибка обновления настроек уведомлений:", error);
    }
  }

  /**
   * Загрузка настроек уведомлений
   */
  private async loadSettings(): Promise<void> {
    try {
      const response = await APIClient.get("/notifications/settings");

      if (response.success && response.data) {
        this.settings = { ...this.settings, ...(response.data as any) };
      }
    } catch (error) {
      console.error("Ошибка загрузки настроек уведомлений:", error);
    }
  }

  /**
   * Получение текущих настроек
   */
  getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  /**
   * Получение количества непрочитанных уведомлений
   */
  getUnreadCount(): number {
    return this.notificationQueue.filter((n) => !n.read).length;
  }

  /**
   * Очистка всех уведомлений
   */
  async clearAllNotifications(): Promise<void> {
    try {
      await APIClient.delete("/notifications/clear-all");
      this.notificationQueue = [];
    } catch (error) {
      console.error("Ошибка очистки всех уведомлений:", error);
    }
  }

  /**
   * Деинициализация сервиса
   */
  destroy(): void {
    this.ws.disconnect();
    this.isInitialized = false;
    this.notificationQueue = [];
  }
}

export default NotificationService.getInstance();
