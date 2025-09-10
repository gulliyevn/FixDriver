export interface NotificationSettings {
  pushEnabled: boolean;
}

export interface NotificationPermissions {
  granted: boolean;
  canAskAgain: boolean;
  status: 'granted' | 'denied' | 'not-determined';
}

export interface PushNotificationService {
  getInstance(): PushNotificationService;
  getCurrentPermissions(): Promise<NotificationPermissions>;
  requestPermissions(): Promise<NotificationPermissions>;
  getExpoPushToken(): Promise<string>;
  setupNotificationListeners(onNotification: () => void, onNotificationOpened: () => void): void;
  removeNotificationListeners(): void;
  openNotificationSettings(): Promise<void>;
}
