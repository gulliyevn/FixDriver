/**
 * Mock Notification Data
 * 
 * Sample notifications for development and testing
 */

export const mockNotifications = [
  {
    id: 'notification_1',
    userId: 'current_user',
    title: 'Trip Completed',
    message: 'Your trip with John Smith has been completed successfully. Thank you for using FixDrive!',
    type: 'trip',
    isRead: false,
    data: {
      tripId: 'trip_123',
      driverId: 'driver_1',
      amount: 15.50
    },
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'notification_2',
    userId: 'current_user',
    title: 'Payment Received',
    message: 'Payment of $15.50 has been processed for your recent trip.',
    type: 'payment',
    isRead: false,
    data: {
      amount: 15.50,
      paymentMethod: 'card',
      transactionId: 'txn_456'
    },
    createdAt: '2024-01-15T10:25:00Z',
    updatedAt: '2024-01-15T10:25:00Z',
  },
  {
    id: 'notification_3',
    userId: 'current_user',
    title: 'Driver Assigned',
    message: 'Your driver Sarah Johnson is on the way. ETA: 5 minutes.',
    type: 'driver',
    isRead: true,
    data: {
      driverId: 'driver_2',
      driverName: 'Sarah Johnson',
      eta: 5,
      carModel: 'Honda Civic'
    },
    createdAt: '2024-01-15T09:45:00Z',
    updatedAt: '2024-01-15T09:45:00Z',
  },
  {
    id: 'notification_4',
    userId: 'current_user',
    title: 'System Update',
    message: 'FixDrive app has been updated with new features and improvements.',
    type: 'system',
    isRead: true,
    data: {
      version: '2.1.0',
      features: ['New UI', 'Better performance', 'Bug fixes']
    },
    createdAt: '2024-01-14T16:20:00Z',
    updatedAt: '2024-01-14T16:20:00Z',
  },
  {
    id: 'notification_5',
    userId: 'current_user',
    title: 'Trip Cancelled',
    message: 'Your scheduled trip has been cancelled. No charges applied.',
    type: 'trip',
    isRead: true,
    data: {
      tripId: 'trip_789',
      reason: 'Driver unavailable',
      refundAmount: 0
    },
    createdAt: '2024-01-14T14:15:00Z',
    updatedAt: '2024-01-14T14:15:00Z',
  },
  {
    id: 'notification_6',
    userId: 'current_user',
    title: 'Promotion Available',
    message: 'Get 20% off your next ride! Use code SAVE20 at checkout.',
    type: 'promotion',
    isRead: true,
    data: {
      discountCode: 'SAVE20',
      discountPercent: 20,
      expiryDate: '2024-01-31'
    },
    createdAt: '2024-01-13T12:00:00Z',
    updatedAt: '2024-01-13T12:00:00Z',
  },
];
