import { 
  INotificationService, 
  Notification 
} from './NotificationTypes';
import { NotificationMockService } from './NotificationMockService';
import { NotificationUtils } from './NotificationUtils';
import { NotificationGrpcService } from './NotificationGrpcService';

export class NotificationService implements INotificationService {
  private static instance: NotificationService;
  private mockService: NotificationMockService;
  private grpcService: NotificationGrpcService;

  private constructor() {
    this.mockService = new NotificationMockService();
    this.grpcService = new NotificationGrpcService();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Add new notification
  addNotification(notificationData: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) {
    return this.mockService.addNotification(notificationData);
  }

  // Get all notifications
  getNotifications(): Notification[] {
    return this.mockService.getNotifications();
  }

  // Get unread count
  getUnreadCount(): number {
    return this.mockService.getUnreadCount();
  }

  // Mark notification as read
  markAsRead(notificationId: string) {
    return this.mockService.markAsRead(notificationId);
  }

  // Mark all notifications as read
  markAllAsRead() {
    return this.mockService.markAllAsRead();
  }

  // Remove notification
  removeNotification(notificationId: string) {
    return this.mockService.removeNotification(notificationId);
  }

  // Subscribe to notification changes
  subscribe(listener: (notifications: Notification[]) => void) {
    return this.mockService.subscribe(listener);
  }

  // Format time for display
  formatTime(dateString: string, language: string = 'en'): string {
    return NotificationUtils.formatTime(dateString, language);
  }

  // Async methods for API
  async getNotificationsAsync(userId: string): Promise<Notification[]> {
    return this.mockService.getNotificationsAsync(userId);
  }

  async markAsReadAsync(notificationId: string): Promise<void> {
    return this.mockService.markAsReadAsync(notificationId);
  }

  async markAllAsReadAsync(userId: string): Promise<void> {
    return this.mockService.markAllAsReadAsync(userId);
  }

  async deleteNotificationAsync(notificationId: string): Promise<void> {
    return this.mockService.deleteNotificationAsync(notificationId);
  }

  async deleteMultipleNotificationsAsync(notificationIds: string[]): Promise<void> {
    return this.mockService.deleteMultipleNotificationsAsync(notificationIds);
  }

  async createNotificationAsync(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    return this.mockService.createNotificationAsync(notification);
  }

  getUnreadCountByUser(userId: string): number {
    return this.mockService.getUnreadCountByUser(userId);
  }

  // Get notifications with sorting
  getNotificationsSorted(userId: string): Notification[] {
    return this.mockService.getNotificationsSorted(userId);
  }

  // Filter by type
  getNotificationsByType(userId: string, type: Notification['type']): Notification[] {
    return this.mockService.getNotificationsByType(userId, type);
  }

  // Search notifications
  searchNotifications(userId: string, query: string): Notification[] {
    return this.mockService.searchNotifications(userId, query);
  }

  // Sync with backend
  async syncWithBackend(): Promise<boolean> {
    return this.grpcService.syncWithBackend();
  }
}

// Singleton for use throughout the app
export const notificationService = NotificationService.getInstance();
export default NotificationService;
