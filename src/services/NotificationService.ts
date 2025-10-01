import APIClient from './APIClient';

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

export interface NotificationSettings {
  userId: string;
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  tripNotifications: boolean;
  paymentNotifications: boolean;
  driverNotifications: boolean;
  systemNotifications: boolean;
  orderNotifications: boolean;
}

class NotificationService {
  private static instance: NotificationService;
  private listeners: ((notifications: Notification[]) => void)[] = [];

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async getNotifications(userId: string, page: number = 1, limit: number = 20): Promise<Notification[]> {
    try {
      const response = await APIClient.get<Notification[]>(`/notifications/user/${userId}`, { page, limit });
      return response.success && response.data ? response.data : [];
    } catch (error) {
      console.error('Get notifications error:', error);
      return [];
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const response = await APIClient.get<{ count: number }>(`/notifications/user/${userId}/unread-count`);
      return response.success && response.data?.count || 0;
    } catch (error) {
      console.error('Get unread count error:', error);
      return 0;
    }
  }

  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const response = await APIClient.post<{ success: boolean }>(`/notifications/${notificationId}/read`, {});
      return response.success && response.data?.success || false;
    } catch (error) {
      console.error('Mark notification as read error:', error);
      return false;
    }
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const response = await APIClient.post<{ success: boolean }>(`/notifications/user/${userId}/mark-all-read`, {});
      return response.success && response.data?.success || false;
    } catch (error) {
      console.error('Mark all notifications as read error:', error);
      return false;
    }
  }

  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const response = await APIClient.delete<{ success: boolean }>(`/notifications/${notificationId}`);
      return response.success && response.data?.success || false;
    } catch (error) {
      console.error('Delete notification error:', error);
      return false;
    }
  }

  async clearAll(userId: string): Promise<boolean> {
    try {
      const response = await APIClient.delete<{ success: boolean }>(`/notifications/user/${userId}/clear-all`);
      return response.success && response.data?.success || false;
    } catch (error) {
      console.error('Clear all notifications error:', error);
      return false;
    }
  }

  async getNotificationSettings(userId: string): Promise<NotificationSettings | null> {
    try {
      const response = await APIClient.get<NotificationSettings>(`/notifications/settings/${userId}`);
      return response.success && response.data ? response.data : null;
    } catch (error) {
      console.error('Get notification settings error:', error);
      return null;
    }
  }

  async updateNotificationSettings(userId: string, settings: Partial<NotificationSettings>): Promise<boolean> {
    try {
      const response = await APIClient.put<{ success: boolean }>(`/notifications/settings/${userId}`, settings);
      return response.success && response.data?.success || false;
    } catch (error) {
      console.error('Update notification settings error:', error);
      return false;
    }
  }

  async sendPushNotification(userId: string, payload: PushNotificationPayload): Promise<boolean> {
    try {
      const response = await APIClient.post<{ success: boolean }>(`/notifications/push/${userId}`, payload);
      return response.success && response.data?.success || false;
    } catch (error) {
      console.error('Send push notification error:', error);
      return false;
    }
  }

  async registerPushToken(userId: string, token: string, platform: 'ios' | 'android'): Promise<boolean> {
    try {
      const response = await APIClient.post<{ success: boolean }>(`/notifications/register-token`, {
        userId,
        token,
        platform
      });
      return response.success && response.data?.success || false;
    } catch (error) {
      console.error('Register push token error:', error);
      return false;
    }
  }

  async unregisterPushToken(userId: string, token: string): Promise<boolean> {
    try {
      const response = await APIClient.post<{ success: boolean }>(`/notifications/unregister-token`, {
        userId,
        token
      });
      return response.success && response.data?.success || false;
    } catch (error) {
      console.error('Unregister push token error:', error);
      return false;
    }
  }

  // Подписка на обновления уведомлений
  subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Уведомление подписчиков об изменениях
  private notifyListeners(notifications: Notification[]): void {
    this.listeners.forEach(listener => listener(notifications));
  }

  // Метод для обновления уведомлений (вызывается извне при получении новых уведомлений)
  updateNotifications(notifications: Notification[]): void {
    this.notifyListeners(notifications);
  }
}

export default NotificationService;