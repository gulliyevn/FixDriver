import { mockNotifications } from '../mocks';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'trip' | 'payment' | 'driver' | 'system' | 'order';
  isRead: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
}

export interface PushNotificationPayload {
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

class NotificationService {
  private static instance: NotificationService;
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];

  private constructor() {
    this.notifications = mockNotifications;
    this.initializeMockNotifications();
    this.startTimeBasedNotifications();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Инициализация с моковыми уведомлениями
  private initializeMockNotifications() {
    this.notifications = [...this.notifications, ...mockNotifications];
  }

  // Запуск уведомлений по времени
  private startTimeBasedNotifications() {
    // Симуляция уведомлений в реальном времени
    setInterval(() => {
      const randomNotifications = [
        {
          userId: 'user1',
          title: 'Напоминание о поездке',
          message: 'Не забудьте о запланированной поездке завтра',
          type: 'trip' as const,
          isRead: false,
        },
        {
          userId: 'user1',
          title: 'Новый водитель поблизости',
          message: 'В вашем районе появился новый водитель',
          type: 'driver' as const,
          isRead: false,
        },
        {
          userId: 'user1',
          title: 'Системное обновление',
          message: 'Доступны новые функции в приложении',
          type: 'system' as const,
          isRead: false,
        },
      ];

      const randomNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
      
      if (Math.random() > 0.7) { // 30% шанс появления уведомления
        this.createNotificationAsync(randomNotification);
      }
    }, 30000); // Каждые 30 секунд
  }

  // Добавление нового уведомления
  addNotification(notificationData: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) {
    const notification: Notification = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isRead: false,
      ...notificationData
    };

    this.notifications.unshift(notification); // Добавляем в начало
    this.sortNotifications();
    this.notifyListeners();
  }

  // Сортировка уведомлений (непрочитанные сверху, затем по времени)
  private sortNotifications() {
    this.notifications.sort((a, b) => {
      if (a.isRead !== b.isRead) {
        return a.isRead ? 1 : -1; // Непрочитанные сверху
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Новые сверху
    });
  }

  // Получение всех уведомлений
  getNotifications(): Notification[] {
    return this.notifications;
  }

  // Получение количества непрочитанных уведомлений
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  // Отметить уведомление как прочитанное
  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      this.sortNotifications();
      this.notifyListeners();
    }
  }

  // Отметить все уведомления как прочитанные
  markAllAsRead() {
    this.notifications.forEach(n => n.isRead = true);
    this.notifyListeners();
  }

  // Удаление уведомления
  removeNotification(notificationId: string) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.notifyListeners();
  }

  // Подписка на изменения уведомлений
  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Уведомление всех подписчиков об изменениях
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.notifications));
  }

  // Форматирование времени для отображения
  formatTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) {
      return 'Только что';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} мин назад`;
    } else if (diffHours < 24) {
      return `${diffHours} ч назад`;
    } else if (diffDays === 1) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }

  // Асинхронные методы для API
  async getNotificationsAsync(userId: string): Promise<Notification[]> {
    return this.notifications.filter(n => n.userId === userId);
  }

  async markAsReadAsync(notificationId: string): Promise<void> {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
    }
  }

  async markAllAsReadAsync(userId: string): Promise<void> {
    this.notifications
      .filter(n => n.userId === userId && !n.isRead)
      .forEach(n => n.isRead = true);
  }

  async deleteNotificationAsync(notificationId: string): Promise<void> {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
  }

  async deleteMultipleNotificationsAsync(notificationIds: string[]): Promise<void> {
    this.notifications = this.notifications.filter(n => !notificationIds.includes(n.id));
  }

  async createNotificationAsync(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    const newNotification: Notification = {
      ...notification,
      id: `notification_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.notifications.push(newNotification);
    this.notifyListeners();
    return newNotification;
  }

  getUnreadCountByUser(userId: string): number {
    return this.notifications.filter(n => n.userId === userId && !n.isRead).length;
  }

  // Получение уведомлений с сортировкой
  getNotificationsSorted(userId: string): Notification[] {
    return this.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Фильтрация по типу
  getNotificationsByType(userId: string, type: Notification['type']): Notification[] {
    return this.notifications.filter(n => n.userId === userId && n.type === type);
  }

  // Поиск уведомлений
  searchNotifications(userId: string, query: string): Notification[] {
    const lowerQuery = query.toLowerCase();
    return this.notifications.filter(n => 
      n.userId === userId && 
      (n.title.toLowerCase().includes(lowerQuery) || 
       n.message.toLowerCase().includes(lowerQuery))
    );
  }
}

// Синглтон для использования во всем приложении
export const notificationService = NotificationService.getInstance();
export default NotificationService;
