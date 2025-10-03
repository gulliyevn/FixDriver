import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PushNotificationService, {
  NotificationSettings,
  NotificationPermissions,
} from "../services/PushNotificationService";

const NOTIFICATION_SETTINGS_KEY = "@notification_settings";
const DEFAULT_SETTINGS: NotificationSettings = {
  pushEnabled: true,
};

export const useNotifications = () => {
  const [settings, setSettings] =
    useState<NotificationSettings>(DEFAULT_SETTINGS);
  const [permissions, setPermissions] =
    useState<NotificationPermissions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pushToken, setPushToken] = useState<string | null>(null);

  const notificationService = PushNotificationService.getInstance();

  // Загрузка настроек из AsyncStorage
  const loadSettings = useCallback(async () => {
    try {
      const storedSettings = await AsyncStorage.getItem(
        NOTIFICATION_SETTINGS_KEY,
      );
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
      }
    } catch (error) {}
  }, []);

  // Сохранение настроек в AsyncStorage
  const saveSettings = useCallback(
    async (newSettings: NotificationSettings) => {
      try {
        await AsyncStorage.setItem(
          NOTIFICATION_SETTINGS_KEY,
          JSON.stringify(newSettings),
        );
        setSettings(newSettings);
      } catch (error) {}
    },
    [],
  );

  // Инициализация уведомлений
  const initializeNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      // Загружаем сохраненные настройки
      await loadSettings();

      // Настройки обновляются локально

      // Проверяем разрешения
      const currentPermissions =
        await notificationService.getCurrentPermissions();

      setPermissions(currentPermissions);

      // Если разрешения есть, получаем токен
      if (currentPermissions.granted) {
        const token = await notificationService.getExpoPushToken();
        setPushToken(token);
      }

      // Настраиваем слушатели
      notificationService.setupNotificationListeners(
        () => {
          // Здесь можно добавить логику обработки уведомлений
        },
        () => {
          // Здесь можно добавить навигацию при нажатии на уведомление
        },
      );
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [loadSettings, notificationService]);

  // Запрос разрешений
  const requestPermissions = useCallback(async () => {
    try {
      const result = await notificationService.requestPermissions();
      setPermissions(result);

      if (result.granted) {
        const token = await notificationService.getExpoPushToken();
        setPushToken(token);

        // Обновляем настройки
        const newSettings = { ...settings, pushEnabled: true };
        await saveSettings(newSettings);
      }

      return result;
    } catch (error) {
      return null;
    }
  }, [settings, saveSettings, notificationService]);

  // Обновление настроек
  const updateSettings = useCallback(
    async (newSettings: Partial<NotificationSettings>) => {
      const updatedSettings = { ...settings, ...newSettings };
      await saveSettings(updatedSettings);
    },
    [settings, saveSettings],
  );

  // Включение/выключение push-уведомлений
  const togglePushNotifications = useCallback(async () => {
    if (!settings.pushEnabled) {
      // Включаем - запрашиваем разрешения
      const result = await requestPermissions();
      if (result?.granted) {
        await updateSettings({ pushEnabled: true });
      }
    } else {
      // Отключаем
      await updateSettings({ pushEnabled: false });
    }
  }, [settings.pushEnabled, requestPermissions, updateSettings]);

  // Открытие настроек уведомлений
  const openNotificationSettings = useCallback(async () => {
    await notificationService.openNotificationSettings();
  }, [notificationService]);

  // Очистка при размонтировании
  useEffect(() => {
    initializeNotifications();

    return () => {
      notificationService.removeNotificationListeners();
    };
  }, [initializeNotifications, notificationService]);

  return {
    // Состояние
    settings,
    permissions,
    isLoading,
    pushToken,

    // Методы
    requestPermissions,
    updateSettings,
    togglePushNotifications,
    openNotificationSettings,
  };
};
