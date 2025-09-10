export const getPermissionsAsync = jest.fn(() => 
  Promise.resolve({ status: 'granted' })
);

export const requestPermissionsAsync = jest.fn(() => 
  Promise.resolve({ status: 'granted' })
);

export const getExpoPushTokenAsync = jest.fn(() => 
  Promise.resolve({ data: 'mock-expo-push-token' })
);

export const scheduleNotificationAsync = jest.fn(() => 
  Promise.resolve('mock-notification-id')
);

export const cancelScheduledNotificationAsync = jest.fn(() => 
  Promise.resolve()
);

export const cancelAllScheduledNotificationsAsync = jest.fn(() => 
  Promise.resolve()
);

export const getBadgeCountAsync = jest.fn(() => 
  Promise.resolve(0)
);

export const setBadgeCountAsync = jest.fn(() => 
  Promise.resolve()
);

export const NotificationPermissionsStatus = {
  UNDETERMINED: 'undetermined',
  GRANTED: 'granted',
  DENIED: 'denied',
}; 