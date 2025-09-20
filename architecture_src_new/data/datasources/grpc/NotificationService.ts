import { INotificationService } from './types/INotificationService';
import { Notification } from '../../shared/types';
import { NotificationServiceStub } from './stubs/NotificationServiceStub';

class NotificationService implements INotificationService {
  private static instance: NotificationService;
  private stub: NotificationServiceStub;

  private constructor() {
    this.stub = new NotificationServiceStub();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    try {
      return await this.stub.getNotifications(userId);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw new Error('Failed to fetch notifications');
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      return await this.stub.getUnreadCount(userId);
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw new Error('Failed to fetch unread count');
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await this.stub.markAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new Error('Failed to mark notification as read');
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    try {
      await this.stub.markAllAsRead(userId);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw new Error('Failed to mark all notifications as read');
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await this.stub.deleteNotification(notificationId);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw new Error('Failed to delete notification');
    }
  }

  async deleteMultipleNotifications(notificationIds: string[]): Promise<void> {
    try {
      await this.stub.deleteMultipleNotifications(notificationIds);
    } catch (error) {
      console.error('Error deleting multiple notifications:', error);
      throw new Error('Failed to delete multiple notifications');
    }
  }

  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    try {
      return await this.stub.createNotification(notification);
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error('Failed to create notification');
    }
  }

  async getNotificationsSorted(userId: string): Promise<Notification[]> {
    try {
      return await this.stub.getNotificationsSorted(userId);
    } catch (error) {
      console.error('Error fetching sorted notifications:', error);
      throw new Error('Failed to fetch sorted notifications');
    }
  }

  async getNotificationsByType(userId: string, type: Notification['type']): Promise<Notification[]> {
    try {
      return await this.stub.getNotificationsByType(userId, type);
    } catch (error) {
      console.error('Error fetching notifications by type:', error);
      throw new Error('Failed to fetch notifications by type');
    }
  }

  async searchNotifications(userId: string, query: string): Promise<Notification[]> {
    try {
      return await this.stub.searchNotifications(userId, query);
    } catch (error) {
      console.error('Error searching notifications:', error);
      throw new Error('Failed to search notifications');
    }
  }

  subscribeToNotifications(userId: string, callback: (notification: Notification) => void): () => void {
    try {
      return this.stub.subscribeToNotifications(userId, callback);
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      throw new Error('Failed to subscribe to notifications');
    }
  }
}

export default NotificationService;
