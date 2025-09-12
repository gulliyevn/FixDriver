import { mockNotifications } from '../../../shared/mocks/data/notificationMock';

/**
 * Notification Mock Service
 * 
 * Mock implementation for notification operations
 * Provides fallback data for development and testing
 */

export class NotificationMockService {
  private notifications: any[] = [...mockNotifications];

  /**
   * Get all user notifications from mock data
   */
  async getNotifications(): Promise<any[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.notifications];
  }

  /**
   * Mark notification as read in mock data
   */
  async markAsRead(notificationId: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      notification.updatedAt = new Date();
    }
  }

  /**
   * Mark all notifications as read in mock data
   */
  async markAllAsRead(): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    this.notifications.forEach(notification => {
      notification.isRead = true;
      notification.updatedAt = new Date();
    });
  }

  /**
   * Delete a notification from mock data
   */
  async deleteNotification(notificationId: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
  }

  /**
   * Delete multiple notifications from mock data
   */
  async deleteNotifications(notificationIds: string[]): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    this.notifications = this.notifications.filter(n => !notificationIds.includes(n.id));
  }

  /**
   * Get unread notifications count from mock data
   */
  async getUnreadCount(): Promise<number> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.notifications.filter(n => !n.isRead).length;
  }

  /**
   * Create a new notification in mock data
   */
  async createNotification(notification: any): Promise<any> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const newNotification = {
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: 'current_user',
      title: notification.title,
      message: notification.message,
      type: notification.type || 'system',
      isRead: false,
      data: notification.data || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.notifications.unshift(newNotification);
    return newNotification;
  }
}