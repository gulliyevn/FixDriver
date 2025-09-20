import { INotificationService } from '../types/INotificationService';
import { Notification } from '../../../../shared/types';
import { mockNotifications } from '../../../../shared/mocks/notifications';

export class NotificationServiceStub implements INotificationService {
  private notifications: Notification[] = [];
  private listeners: Map<string, ((notification: Notification) => void)[]> = new Map();

  constructor() {
    this.notifications = [...mockNotifications];
    this.initializeMockNotifications();
    this.startTimeBasedNotifications();
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
        this.createNotification(randomNotification);
      }
    }, 30000); // Каждые 30 секунд
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return this.notifications.filter(n => n.userId === userId);
  }

  async getUnreadCount(userId: string): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return this.notifications.filter(n => n.userId === userId && !n.isRead).length;
  }

  async markAsRead(notificationId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      this.sortNotifications();
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    this.notifications
      .filter(n => n.userId === userId && !n.isRead)
      .forEach(n => n.isRead = true);
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
  }

  async deleteMultipleNotifications(notificationIds: string[]): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    this.notifications = this.notifications.filter(n => !notificationIds.includes(n.id));
  }

  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newNotification: Notification = {
      ...notification,
      id: `notification_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    this.notifications.unshift(newNotification);
    this.sortNotifications();
    
    // Уведомляем подписчиков
    this.notifySubscribers(notification.userId, newNotification);
    
    return newNotification;
  }

  async getNotificationsSorted(userId: string): Promise<Notification[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return this.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => {
        if (a.isRead !== b.isRead) {
          return a.isRead ? 1 : -1; // Непрочитанные сверху
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Новые сверху
      });
  }

  async getNotificationsByType(userId: string, type: Notification['type']): Promise<Notification[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return this.notifications.filter(n => n.userId === userId && n.type === type);
  }

  async searchNotifications(userId: string, query: string): Promise<Notification[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const lowerQuery = query.toLowerCase();
    return this.notifications.filter(n => 
      n.userId === userId && 
      (n.title.toLowerCase().includes(lowerQuery) || 
       n.message.toLowerCase().includes(lowerQuery))
    );
  }

  subscribeToNotifications(userId: string, callback: (notification: Notification) => void): () => void {
    if (!this.listeners.has(userId)) {
      this.listeners.set(userId, []);
    }
    
    this.listeners.get(userId)!.push(callback);
    
    // Возвращаем функцию отписки
    return () => {
      const userListeners = this.listeners.get(userId);
      if (userListeners) {
        const index = userListeners.indexOf(callback);
        if (index > -1) {
          userListeners.splice(index, 1);
        }
      }
    };
  }

  private sortNotifications() {
    this.notifications.sort((a, b) => {
      if (a.isRead !== b.isRead) {
        return a.isRead ? 1 : -1; // Непрочитанные сверху
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Новые сверху
    });
  }

  private notifySubscribers(userId: string, notification: Notification) {
    const userListeners = this.listeners.get(userId);
    if (userListeners) {
      userListeners.forEach(callback => callback(notification));
    }
  }
}
