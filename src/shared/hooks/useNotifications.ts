import { useState, useEffect, useCallback } from 'react';
import { notificationOperations } from '../../domain/usecases/notification/notificationOperations';
import { NotificationSettings, NotificationPermissions } from '../types/notificationTypes';
import { NOTIFICATION_CONSTANTS } from '../constants/notificationConstants';

/**
 * Hook for managing notifications
 * Provides comprehensive notification management functionality
 */
export const useNotifications = () => {
  const [settings, setSettings] = useState<NotificationSettings>(NOTIFICATION_CONSTANTS.DEFAULTS.SETTINGS);
  const [permissions, setPermissions] = useState<NotificationPermissions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pushToken, setPushToken] = useState<string | null>(null);

  /**
   * Load settings from storage
   */
  const loadSettings = useCallback(async () => {
    try {
      const storedSettings = await notificationOperations.loadSettings();
      setSettings(storedSettings);
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  }, []);

  /**
   * Save settings to storage
   */
  const saveSettings = useCallback(async (newSettings: NotificationSettings) => {
    try {
      await notificationOperations.saveSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  }, []);

  /**
   * Initialize notifications
   */
  const initializeNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      // Load saved settings
      await loadSettings();

      // Check permissions
      const currentPermissions = await notificationOperations.getCurrentPermissions();
      setPermissions(currentPermissions);

      // If permissions exist, get token
      if (currentPermissions.granted) {
        const token = await notificationOperations.getExpoPushToken();
        setPushToken(token);
      }

      // Setup listeners
      notificationOperations.setupNotificationListeners(
        () => {
          // Here you can add notification handling logic
        },
        () => {
          // Here you can add navigation logic when notification is tapped
        }
      );
    } catch (error) {
      console.error('Error initializing notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [loadSettings]);

  /**
   * Request permissions
   */
  const requestPermissions = useCallback(async () => {
    try {
      const result = await notificationOperations.requestPermissions();
      setPermissions(result);

      if (result.granted) {
        const token = await notificationOperations.getExpoPushToken();
        setPushToken(token);
        
        // Update settings
        const newSettings = { ...settings, pushEnabled: true };
        await saveSettings(newSettings);
      }

      return result;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return null;
    }
  }, [settings, saveSettings]);

  /**
   * Update settings
   */
  const updateSettings = useCallback(async (newSettings: Partial<NotificationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    await saveSettings(updatedSettings);
  }, [settings, saveSettings]);

  /**
   * Toggle push notifications
   */
  const togglePushNotifications = useCallback(async () => {
    if (!settings.pushEnabled) {
      // Enable - request permissions
      const result = await requestPermissions();
      if (result?.granted) {
        await updateSettings({ pushEnabled: true });
      }
    } else {
      // Disable
      await updateSettings({ pushEnabled: false });
    }
  }, [settings.pushEnabled, requestPermissions, updateSettings]);

  /**
   * Open notification settings
   */
  const openNotificationSettings = useCallback(async () => {
    await notificationOperations.openNotificationSettings();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    initializeNotifications();

    return () => {
      notificationOperations.removeNotificationListeners();
    };
  }, [initializeNotifications]);

  return {
    // State
    settings,
    permissions,
    isLoading,
    pushToken,
    
    // Methods
    requestPermissions,
    updateSettings,
    togglePushNotifications,
    openNotificationSettings,
  };
};