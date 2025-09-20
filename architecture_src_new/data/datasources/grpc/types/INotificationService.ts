import { Notification } from '../../../shared/types';

export interface INotificationService {
  // Получение уведомлений пользователя
  getNotifications(userId: string): Promise<Notification[]>;
  
  // Получение количества непрочитанных уведомлений
  getUnreadCount(userId: string): Promise<number>;
  
  // Отметить уведомление как прочитанное
  markAsRead(notificationId: string): Promise<void>;
  
  // Отметить все уведомления как прочитанные
  markAllAsRead(userId: string): Promise<void>;
  
  // Удаление уведомления
  deleteNotification(notificationId: string): Promise<void>;
  
  // Удаление нескольких уведомлений
  deleteMultipleNotifications(notificationIds: string[]): Promise<void>;
  
  // Создание нового уведомления
  createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification>;
  
  // Получение уведомлений с сортировкой
  getNotificationsSorted(userId: string): Promise<Notification[]>;
  
  // Фильтрация по типу
  getNotificationsByType(userId: string, type: Notification['type']): Promise<Notification[]>;
  
  // Поиск уведомлений
  searchNotifications(userId: string, query: string): Promise<Notification[]>;
  
  // Подписка на изменения уведомлений (WebSocket/SSE)
  subscribeToNotifications(userId: string, callback: (notification: Notification) => void): () => void;
}
