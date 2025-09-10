/**
 * 📱 OTHER MOCK DATA
 * 
 * Mock data for notifications, packages, and other miscellaneous items.
 * Clean implementation with English comments and data.
 */

import { Notification } from '../../types/notificationTypes';
import { Package } from '../../types/package';

// Mock notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif_1',
    userId: 'client_1',
    title: 'New Driver',
    message: 'Alexey Petrov joined the service',
    type: 'driver',
    isRead: false,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'notif_2',
    userId: 'client_1',
    title: 'Trip Completed',
    message: 'Trip with Dmitry Smirnov completed successfully',
    type: 'trip',
    isRead: true,
    createdAt: '2024-01-15T09:45:00Z',
  },
  {
    id: 'notif_3',
    userId: 'client_1',
    title: 'New Message',
    message: 'You have a new message from driver',
    type: 'system',
    isRead: false,
    createdAt: '2024-01-15T09:30:00Z',
  },
  {
    id: 'notif_4',
    userId: 'client_1',
    title: 'Payment Received',
    message: 'Payment of $25.50 has been processed',
    type: 'payment',
    isRead: true,
    createdAt: '2024-01-15T09:15:00Z',
  },
  {
    id: 'notif_5',
    userId: 'client_1',
    title: 'Promotion Available',
    message: 'Special discount for weekend trips',
    type: 'promo',
    isRead: false,
    createdAt: '2024-01-15T09:00:00Z',
  }
];

// Mock packages
export const mockPackages: Package[] = [
  {
    id: 'pkg_1',
    name: 'Basic Package',
    description: 'Standard transportation service',
    price: 50.00,
    duration: 30,
    features: [
      'Standard vehicle',
      'Basic insurance',
      '24/7 support'
    ],
    isPopular: false,
    isPremium: false
  },
  {
    id: 'pkg_2',
    name: 'Premium Package',
    description: 'Enhanced transportation service',
    price: 100.00,
    duration: 30,
    features: [
      'Premium vehicle',
      'Enhanced insurance',
      'Priority support',
      'Child safety seats'
    ],
    isPopular: true,
    isPremium: true
  },
  {
    id: 'pkg_3',
    name: 'VIP Package',
    description: 'Luxury transportation service',
    price: 200.00,
    duration: 30,
    features: [
      'Luxury vehicle',
      'Full insurance coverage',
      'Dedicated support',
      'Premium child safety seats',
      'Complimentary refreshments'
    ],
    isPopular: false,
    isPremium: true
  }
];

// Mock notification types
export const mockNotificationTypes = [
  { type: 'driver', name: 'Driver', icon: '🚗', color: '#2196F3' },
  { type: 'trip', name: 'Trip', icon: '🚙', color: '#4CAF50' },
  { type: 'system', name: 'System', icon: '⚙️', color: '#FF9800' },
  { type: 'payment', name: 'Payment', icon: '💳', color: '#9C27B0' },
  { type: 'promo', name: 'Promotion', icon: '🎉', color: '#E91E63' }
];

// Mock package features
export const mockPackageFeatures = [
  { feature: 'Standard vehicle', icon: '🚗' },
  { feature: 'Premium vehicle', icon: '🚙' },
  { feature: 'Luxury vehicle', icon: '🏎️' },
  { feature: 'Basic insurance', icon: '🛡️' },
  { feature: 'Enhanced insurance', icon: '🛡️' },
  { feature: 'Full insurance coverage', icon: '🛡️' },
  { feature: '24/7 support', icon: '📞' },
  { feature: 'Priority support', icon: '📞' },
  { feature: 'Dedicated support', icon: '📞' },
  { feature: 'Child safety seats', icon: '👶' },
  { feature: 'Premium child safety seats', icon: '👶' },
  { feature: 'Complimentary refreshments', icon: '🍪' }
];

// Helper functions
export const getNotificationsByUserId = (userId: string): Notification[] => {
  return mockNotifications.filter(notification => notification.userId === userId);
};

export const getUnreadNotifications = (userId: string): Notification[] => {
  return mockNotifications.filter(
    notification => notification.userId === userId && !notification.isRead
  );
};

export const markNotificationAsRead = (notificationId: string): void => {
  const notification = mockNotifications.find(n => n.id === notificationId);
  if (notification) {
    notification.isRead = true;
  }
};

export const getPackageById = (packageId: string): Package | undefined => {
  return mockPackages.find(pkg => pkg.id === packageId);
};

export const getPopularPackages = (): Package[] => {
  return mockPackages.filter(pkg => pkg.isPopular);
};

export const getPremiumPackages = (): Package[] => {
  return mockPackages.filter(pkg => pkg.isPremium);
};