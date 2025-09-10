import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationSettings, NotificationPermissions, PushNotificationService } from '../../../shared/types/notificationTypes';
import { NOTIFICATION_CONSTANTS } from '../../../shared/constants/notificationConstants';

/**
 * Domain usecase for notification operations
 * Abstracts data layer access from presentation layer
 */
export const notificationOperations = {
  /**
   * Load notification settings from storage
   */
  async loadSettings(): Promise<NotificationSettings> {
    try {
      const storedSettings = await AsyncStorage.getItem(NOTIFICATION_CONSTANTS.STORAGE_KEYS.NOTIFICATION_SETTINGS);
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        return { ...NOTIFICATION_CONSTANTS.DEFAULTS.SETTINGS, ...parsedSettings };
      }
      return NOTIFICATION_CONSTANTS.DEFAULTS.SETTINGS;
    } catch (error) {
      console.error('Error loading notification settings:', error);
      return NOTIFICATION_CONSTANTS.DEFAULTS.SETTINGS;
    }
  },

  /**
   * Save notification settings to storage
   */
  async saveSettings(settings: NotificationSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(
        NOTIFICATION_CONSTANTS.STORAGE_KEYS.NOTIFICATION_SETTINGS, 
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error('Error saving notification settings:', error);
      throw error;
    }
  },

  /**
   * Get notification service instance
   */
  getNotificationService(): any {
    // TODO: Implement actual PushNotificationService
    return {
      getCurrentPermissions: async () => ({ granted: false, canAskAgain: true, status: 'not-determined' }),
      requestPermissions: async () => ({ granted: false, canAskAgain: true, status: 'denied' }),
      getExpoPushToken: async () => 'mock-token',
      setupNotificationListeners: () => {},
      removeNotificationListeners: () => {},
      openNotificationSettings: async () => {},
    };
  },

  /**
   * Get current permissions
   */
  async getCurrentPermissions(): Promise<NotificationPermissions> {
    try {
      const service = this.getNotificationService();
      return await service.getCurrentPermissions();
    } catch (error) {
      console.error('Error getting current permissions:', error);
      throw error;
    }
  },

  /**
   * Request permissions
   */
  async requestPermissions(): Promise<NotificationPermissions> {
    try {
      const service = this.getNotificationService();
      return await service.requestPermissions();
    } catch (error) {
      console.error('Error requesting permissions:', error);
      throw error;
    }
  },

  /**
   * Get Expo push token
   */
  async getExpoPushToken(): Promise<string> {
    try {
      const service = this.getNotificationService();
      return await service.getExpoPushToken();
    } catch (error) {
      console.error('Error getting Expo push token:', error);
      throw error;
    }
  },

  /**
   * Setup notification listeners
   */
  setupNotificationListeners(
    onNotification: () => void,
    onNotificationOpened: () => void
  ): void {
    try {
      const service = this.getNotificationService();
      service.setupNotificationListeners(onNotification, onNotificationOpened);
    } catch (error) {
      console.error('Error setting up notification listeners:', error);
    }
  },

  /**
   * Remove notification listeners
   */
  removeNotificationListeners(): void {
    try {
      const service = this.getNotificationService();
      service.removeNotificationListeners();
    } catch (error) {
      console.error('Error removing notification listeners:', error);
    }
  },

  /**
   * Open notification settings
   */
  async openNotificationSettings(): Promise<void> {
    try {
      const service = this.getNotificationService();
      await service.openNotificationSettings();
    } catch (error) {
      console.error('Error opening notification settings:', error);
      throw error;
    }
  }
};
