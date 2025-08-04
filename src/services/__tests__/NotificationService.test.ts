import NotificationService, { notificationService, Notification } from '../NotificationService';
import { mockNotifications } from '../../mocks';

// Мокаем моки уведомлений
jest.mock('../../mocks', () => ({
  mockNotifications: [
    {
      id: '1',
      userId: 'user1',
      title: 'Тестовое уведомление',
      message: 'Это тестовое уведомление',
      type: 'system' as const,
      isRead: false,
      createdAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      userId: 'user1',
      title: 'Прочитанное уведомление',
      message: 'Это прочитанное уведомление',
      type: 'trip' as const,
      isRead: true,
      createdAt: '2024-01-01T01:00:00.000Z',
    },
  ],
}));

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    // Создаем новый экземпляр для каждого теста
    service = new NotificationService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Singleton pattern', () => {
    it('returns the same instance', () => {
      const instance1 = NotificationService.getInstance();
      const instance2 = NotificationService.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('notificationService is the singleton instance', () => {
      const instance = NotificationService.getInstance();
      expect(notificationService).toBe(instance);
    });
  });

  describe('addNotification', () => {
    it('adds a new notification to the beginning of the list', () => {
      const initialCount = service.getNotifications().length;
      
      service.addNotification({
        userId: 'user1',
        title: 'Новое уведомление',
        message: 'Сообщение',
        type: 'payment',
      });

      const notifications = service.getNotifications();
      expect(notifications.length).toBe(initialCount + 1);
      expect(notifications[0].title).toBe('Новое уведомление');
      expect(notifications[0].isRead).toBe(false);
      expect(notifications[0].id).toBeDefined();
      expect(notifications[0].createdAt).toBeDefined();
    });

    it('sorts notifications with unread first', () => {
      service.addNotification({
        userId: 'user1',
        title: 'Прочитанное',
        message: 'Сообщение',
        type: 'system',
      });

      service.addNotification({
        userId: 'user1',
        title: 'Непрочитанное',
        message: 'Сообщение',
        type: 'trip',
      });

      const notifications = service.getNotifications();
      expect(notifications[0].title).toBe('Непрочитанное');
      expect(notifications[0].isRead).toBe(false);
    });
  });

  describe('getNotifications', () => {
    it('returns all notifications', () => {
      const notifications = service.getNotifications();
      expect(Array.isArray(notifications)).toBe(true);
      expect(notifications.length).toBeGreaterThan(0);
    });
  });

  describe('getUnreadCount', () => {
    it('returns correct count of unread notifications', () => {
      const unreadCount = service.getUnreadCount();
      expect(typeof unreadCount).toBe('number');
      expect(unreadCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('markAsRead', () => {
    it('marks a specific notification as read', () => {
      const notifications = service.getNotifications();
      const unreadNotification = notifications.find(n => !n.isRead);
      
      if (unreadNotification) {
        const initialUnreadCount = service.getUnreadCount();
        service.markAsRead(unreadNotification.id);
        const newUnreadCount = service.getUnreadCount();
        
        expect(newUnreadCount).toBe(initialUnreadCount - 1);
        
        const updatedNotification = service.getNotifications().find(n => n.id === unreadNotification.id);
        expect(updatedNotification?.isRead).toBe(true);
      }
    });

    it('does nothing for non-existent notification', () => {
      const initialUnreadCount = service.getUnreadCount();
      service.markAsRead('non-existent-id');
      const newUnreadCount = service.getUnreadCount();
      
      expect(newUnreadCount).toBe(initialUnreadCount);
    });
  });

  describe('markAllAsRead', () => {
    it('marks all notifications as read', () => {
      service.markAllAsRead();
      const unreadCount = service.getUnreadCount();
      expect(unreadCount).toBe(0);
    });
  });

  describe('removeNotification', () => {
    it('removes a specific notification', () => {
      const notifications = service.getNotifications();
      const notificationToRemove = notifications[0];
      const initialCount = notifications.length;
      
      service.removeNotification(notificationToRemove.id);
      
      const newNotifications = service.getNotifications();
      expect(newNotifications.length).toBe(initialCount - 1);
      expect(newNotifications.find(n => n.id === notificationToRemove.id)).toBeUndefined();
    });
  });

  describe('subscribe', () => {
    it('adds a listener and returns unsubscribe function', () => {
      const mockListener = jest.fn();
      const unsubscribe = service.subscribe(mockListener);
      
      expect(typeof unsubscribe).toBe('function');
      
      // Trigger a change
      service.addNotification({
        userId: 'user1',
        title: 'Test',
        message: 'Test',
        type: 'system',
      });
      
      expect(mockListener).toHaveBeenCalled();
    });

    it('removes listener when unsubscribe is called', () => {
      const mockListener = jest.fn();
      const unsubscribe = service.subscribe(mockListener);
      
      unsubscribe();
      
      // Trigger a change
      service.addNotification({
        userId: 'user1',
        title: 'Test',
        message: 'Test',
        type: 'system',
      });
      
      expect(mockListener).not.toHaveBeenCalled();
    });
  });

  describe('formatTime', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-01T12:00:00.000Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('formats time correctly for different time differences', () => {
      const now = new Date('2024-01-01T12:00:00.000Z');
      
      // Just now
      const justNow = new Date(now.getTime() - 30 * 1000); // 30 seconds ago
      expect(service.formatTime(justNow.toISOString())).toBe('Только что');
      
      // Minutes ago
      const minutesAgo = new Date(now.getTime() - 30 * 60 * 1000); // 30 minutes ago
      expect(service.formatTime(minutesAgo.toISOString())).toBe('30 мин назад');
      
      // Hours ago
      const hoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 hours ago
      expect(service.formatTime(hoursAgo.toISOString())).toBe('2 ч назад');
      
      // Yesterday
      const yesterday = new Date(now.getTime() - 25 * 60 * 60 * 1000); // 25 hours ago
      expect(service.formatTime(yesterday.toISOString())).toBe('Вчера');
    });

    it('formats date for older notifications', () => {
      const oldDate = new Date('2023-12-30T10:30:00.000Z');
      const formatted = service.formatTime(oldDate.toISOString());
      
      // Should return a formatted date string
      expect(formatted).toMatch(/\d{2}\/\d{2}/);
    });

    it('supports different languages', () => {
      const oldDate = new Date('2023-12-30T10:30:00.000Z');
      
      const ruFormatted = service.formatTime(oldDate.toISOString(), 'ru');
      const enFormatted = service.formatTime(oldDate.toISOString(), 'en');
      
      expect(ruFormatted).toBeDefined();
      expect(enFormatted).toBeDefined();
    });
  });

  describe('Async methods', () => {
    describe('getNotificationsAsync', () => {
      it('returns notifications for specific user', async () => {
        const notifications = await service.getNotificationsAsync('user1');
        expect(Array.isArray(notifications)).toBe(true);
        notifications.forEach(n => {
          expect(n.userId).toBe('user1');
        });
      });
    });

    describe('markAsReadAsync', () => {
      it('marks notification as read asynchronously', async () => {
        const notifications = service.getNotifications();
        const unreadNotification = notifications.find(n => !n.isRead);
        
        if (unreadNotification) {
          await service.markAsReadAsync(unreadNotification.id);
          const updatedNotification = service.getNotifications().find(n => n.id === unreadNotification.id);
          expect(updatedNotification?.isRead).toBe(true);
        }
      });
    });

    describe('markAllAsReadAsync', () => {
      it('marks all notifications as read for specific user', async () => {
        await service.markAllAsReadAsync('user1');
        const userNotifications = service.getNotifications().filter(n => n.userId === 'user1');
        userNotifications.forEach(n => {
          expect(n.isRead).toBe(true);
        });
      });
    });

    describe('deleteNotificationAsync', () => {
      it('deletes notification asynchronously', async () => {
        const notifications = service.getNotifications();
        const notificationToDelete = notifications[0];
        const initialCount = notifications.length;
        
        await service.deleteNotificationAsync(notificationToDelete.id);
        
        const newNotifications = service.getNotifications();
        expect(newNotifications.length).toBe(initialCount - 1);
      });
    });

    describe('deleteMultipleNotificationsAsync', () => {
      it('deletes multiple notifications', async () => {
        const notifications = service.getNotifications();
        const idsToDelete = notifications.slice(0, 2).map(n => n.id);
        const initialCount = notifications.length;
        
        await service.deleteMultipleNotificationsAsync(idsToDelete);
        
        const newNotifications = service.getNotifications();
        expect(newNotifications.length).toBe(initialCount - 2);
      });
    });

    describe('createNotificationAsync', () => {
      it('creates new notification asynchronously', async () => {
        const notificationData = {
          userId: 'user1',
          title: 'Async notification',
          message: 'Created asynchronously',
          type: 'payment' as const,
          isRead: false,
        };
        
        const newNotification = await service.createNotificationAsync(notificationData);
        
        expect(newNotification.id).toBeDefined();
        expect(newNotification.createdAt).toBeDefined();
        expect(newNotification.title).toBe('Async notification');
        
        const notifications = service.getNotifications();
        expect(notifications.find(n => n.id === newNotification.id)).toBeDefined();
      });
    });
  });

  describe('getUnreadCountByUser', () => {
    it('returns unread count for specific user', () => {
      const unreadCount = service.getUnreadCountByUser('user1');
      expect(typeof unreadCount).toBe('number');
      expect(unreadCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getNotificationsSorted', () => {
    it('returns notifications sorted by date for specific user', () => {
      const sortedNotifications = service.getNotificationsSorted('user1');
      expect(Array.isArray(sortedNotifications)).toBe(true);
      
      // Check if sorted by date (newest first)
      for (let i = 0; i < sortedNotifications.length - 1; i++) {
        const current = new Date(sortedNotifications[i].createdAt);
        const next = new Date(sortedNotifications[i + 1].createdAt);
        expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
      }
    });
  });

  describe('getNotificationsByType', () => {
    it('returns notifications filtered by type', () => {
      const systemNotifications = service.getNotificationsByType('user1', 'system');
      expect(Array.isArray(systemNotifications)).toBe(true);
      
      systemNotifications.forEach(n => {
        expect(n.type).toBe('system');
        expect(n.userId).toBe('user1');
      });
    });
  });

  describe('searchNotifications', () => {
    it('searches notifications by title and message', () => {
      const searchResults = service.searchNotifications('user1', 'тестовое');
      expect(Array.isArray(searchResults)).toBe(true);
      
      searchResults.forEach(n => {
        expect(n.userId).toBe('user1');
        expect(
          n.title.toLowerCase().includes('тестовое') || 
          n.message.toLowerCase().includes('тестовое')
        ).toBe(true);
      });
    });

    it('returns empty array for no matches', () => {
      const searchResults = service.searchNotifications('user1', 'nonexistent');
      expect(searchResults).toEqual([]);
    });

    it('is case insensitive', () => {
      const searchResults = service.searchNotifications('user1', 'ТЕСТОВОЕ');
      expect(searchResults.length).toBeGreaterThan(0);
    });
  });
}); 