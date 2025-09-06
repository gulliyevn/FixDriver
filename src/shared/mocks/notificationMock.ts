import { Notification } from '../../data/datasources/notification/NotificationTypes';

export const createMockNotification = (
  data: Partial<Notification> = {},
  userId: string = 'user1'
): Notification => ({
  id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  userId,
  title: data.title || 'Test Notification',
  message: data.message || 'This is a test notification message',
  type: data.type || 'system',
  isRead: data.isRead || false,
  createdAt: data.createdAt || new Date().toISOString(),
  data: data.data || {},
});

export const createMockNotifications = (count: number = 5, userId: string = 'user1'): Notification[] => {
  const types: Notification['type'][] = ['trip', 'payment', 'driver', 'system', 'order'];
  const titles = [
    'Trip Reminder',
    'Payment Confirmation',
    'New Driver Available',
    'System Update',
    'Order Status Update'
  ];
  const messages = [
    'Don\'t forget about your scheduled trip tomorrow',
    'Your payment has been processed successfully',
    'A new driver is available in your area',
    'New features are available in the app',
    'Your order status has been updated'
  ];

  return Array.from({ length: count }, (_, index) => 
    createMockNotification({
      title: titles[index % titles.length],
      message: messages[index % messages.length],
      type: types[index % types.length],
      isRead: index % 3 === 0, // Some notifications are read
      createdAt: new Date(Date.now() - index * 60000).toISOString(), // Staggered times
    }, userId)
  );
};

export const mockNotifications: Notification[] = createMockNotifications(10);

export const createTimeBasedNotifications = (): Array<Omit<Notification, 'id' | 'createdAt'>> => [
  {
    userId: 'user1',
    title: 'Trip Reminder',
    message: 'Don\'t forget about your scheduled trip tomorrow',
    type: 'trip',
    isRead: false,
  },
  {
    userId: 'user1',
    title: 'New Driver Nearby',
    message: 'A new driver is available in your area',
    type: 'driver',
    isRead: false,
  },
  {
    userId: 'user1',
    title: 'System Update',
    message: 'New features are available in the app',
    type: 'system',
    isRead: false,
  },
];
