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

export interface INotificationService {
  addNotification(notificationData: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): void;
  getNotifications(): Notification[];
  getUnreadCount(): number;
  markAsRead(notificationId: string): void;
  markAllAsRead(): void;
  removeNotification(notificationId: string): void;
  subscribe(listener: (notifications: Notification[]) => void): () => void;
  formatTime(dateString: string, language?: string): string;
  getNotificationsAsync(userId: string): Promise<Notification[]>;
  markAsReadAsync(notificationId: string): Promise<void>;
  markAllAsReadAsync(userId: string): Promise<void>;
  deleteNotificationAsync(notificationId: string): Promise<void>;
  deleteMultipleNotificationsAsync(notificationIds: string[]): Promise<void>;
  createNotificationAsync(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification>;
  getUnreadCountByUser(userId: string): number;
  getNotificationsSorted(userId: string): Notification[];
  getNotificationsByType(userId: string, type: Notification['type']): Notification[];
  searchNotifications(userId: string, query: string): Notification[];
  syncWithBackend(): Promise<boolean>;
}
