import { NotificationGrpcService } from './NotificationGrpcService';
import { NotificationMockService } from './NotificationMockService';

/**
 * Notification Service
 * 
 * Main service for managing notifications
 * Integrates gRPC with mock fallback for development
 */

export class NotificationService {
  private grpcService: NotificationGrpcService;
  private mockService: NotificationMockService;

  constructor() {
    this.grpcService = new NotificationGrpcService();
    this.mockService = new NotificationMockService();
  }

  /**
   * Get all user notifications
   */
  async getNotifications(): Promise<any[]> {
    try {
      return await this.grpcService.getNotifications();
    } catch (error) {
      console.warn('gRPC service failed, falling back to mock:', error);
      return await this.mockService.getNotifications();
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await this.grpcService.markAsRead(notificationId);
    } catch (error) {
      console.warn('gRPC service failed, falling back to mock:', error);
      await this.mockService.markAsRead(notificationId);
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    try {
      await this.grpcService.markAllAsRead();
    } catch (error) {
      console.warn('gRPC service failed, falling back to mock:', error);
      await this.mockService.markAllAsRead();
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await this.grpcService.deleteNotification(notificationId);
    } catch (error) {
      console.warn('gRPC service failed, falling back to mock:', error);
      await this.mockService.deleteNotification(notificationId);
    }
  }

  /**
   * Delete multiple notifications
   */
  async deleteNotifications(notificationIds: string[]): Promise<void> {
    try {
      await this.grpcService.deleteNotifications(notificationIds);
    } catch (error) {
      console.warn('gRPC service failed, falling back to mock:', error);
      await this.mockService.deleteNotifications(notificationIds);
    }
  }

  /**
   * Get unread notifications count
   */
  async getUnreadCount(): Promise<number> {
    try {
      return await this.grpcService.getUnreadCount();
    } catch (error) {
      console.warn('gRPC service failed, falling back to mock:', error);
      return await this.mockService.getUnreadCount();
    }
  }

  /**
   * Create a new notification
   */
  async createNotification(notification: any): Promise<any> {
    try {
      return await this.grpcService.createNotification(notification);
    } catch (error) {
      console.warn('gRPC service failed, falling back to mock:', error);
      return await this.mockService.createNotification(notification);
    }
  }
}