import { Notification } from './NotificationTypes';
import { mockNotifications, createTimeBasedNotifications } from '../../../shared/mocks/notificationMock';
import { NOTIFICATION_CONSTANTS } from '../../../shared/constants/adaptiveConstants';

export class NotificationMockService {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];

  constructor() {
    this.notifications = [...mockNotifications];
    this.initializeMockNotifications();
    this.startTimeBasedNotifications();
  }

  // Initialize with mock notifications
  private initializeMockNotifications() {
    this.notifications = [...this.notifications, ...mockNotifications];
  }

  // Start time-based notifications
  private startTimeBasedNotifications() {
    // Simulate real-time notifications
    setInterval(() => {
      const randomNotifications = createTimeBasedNotifications();
      const randomNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
      
      if (Math.random() > NOTIFICATION_CONSTANTS.MOCK.PROBABILITY_THRESHOLD) {
        this.createNotificationAsync(randomNotification);
      }
    }, NOTIFICATION_CONSTANTS.MOCK.INTERVAL);
  }

  // Add new notification
  addNotification(notificationData: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) {
    const notification: Notification = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isRead: false,
      ...notificationData
    };

    this.notifications.unshift(notification); // Add to beginning
    this.sortNotifications();
    this.notifyListeners();
  }

  // Sort notifications (unread first, then by time)
  private sortNotifications() {
    this.notifications.sort((a, b) => {
      if (a.isRead !== b.isRead) {
        return a.isRead ? 1 : -1; // Unread first
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Newest first
    });
  }

  // Get all notifications
  getNotifications(): Notification[] {
    return this.notifications;
  }

  // Get unread count
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  // Mark notification as read
  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      this.sortNotifications();
      this.notifyListeners();
    }
  }

  // Mark all notifications as read
  markAllAsRead() {
    this.notifications.forEach(n => n.isRead = true);
    this.notifyListeners();
  }

  // Remove notification
  removeNotification(notificationId: string) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.notifyListeners();
  }

  // Subscribe to notification changes
  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners about changes
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.notifications));
  }

  // Async methods for API
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

  // Get notifications with sorting
  getNotificationsSorted(userId: string): Notification[] {
    return this.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Filter by type
  getNotificationsByType(userId: string, type: Notification['type']): Notification[] {
    return this.notifications.filter(n => n.userId === userId && n.type === type);
  }

  // Search notifications
  searchNotifications(userId: string, query: string): Notification[] {
    const lowerQuery = query.toLowerCase();
    return this.notifications.filter(n => 
      n.userId === userId && 
      (n.title.toLowerCase().includes(lowerQuery) || 
       n.message.toLowerCase().includes(lowerQuery))
    );
  }
}
