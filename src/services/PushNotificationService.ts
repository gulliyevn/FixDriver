import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";

export interface NotificationSettings {
  pushEnabled: boolean;
}

export interface NotificationPermissions {
  granted: boolean;
  canAskAgain: boolean;
  status: Notifications.PermissionStatus;
}

class PushNotificationService {
  private static instance: PushNotificationService;
  private expoPushToken: string | null = null;
  private notificationListener: Notifications.Subscription | null = null;
  private responseListener: Notifications.Subscription | null = null;

  private constructor() {
    this.setupNotificationHandler();
  }

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  // Настройка обработчика уведомлений
  private setupNotificationHandler() {
    Notifications.setNotificationHandler({
      handleNotification: async () => {
        return {
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
          shouldVibrate: false,
        } as Notifications.NotificationBehavior;
      },
    });
  }

  // Запрос разрешений на уведомления
  async requestPermissions(): Promise<NotificationPermissions> {
    if (!Device.isDevice) {
      return {
        granted: false,
        canAskAgain: false,
        status: 'denied' as any,
      };
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return {
        granted: false,
        canAskAgain: finalStatus === "denied",
        status: finalStatus,
      };
    }

    if (Platform.OS === "android") {
      await this.createNotificationChannel();
    }

    return {
      granted: true,
      canAskAgain: false,
      status: finalStatus,
    };
  }

  // Получение токена для push-уведомлений
  async getExpoPushToken(): Promise<string | null> {
    if (!Device.isDevice) {
      return null;
    }

    try {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (!projectId) {
        return null;
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      this.expoPushToken = token.data;
      return token.data;
    } catch (error) {
      return null;
    }
  }

  // Настройка слушателей уведомлений
  setupNotificationListeners(
    onNotificationReceived?: (notification: Notifications.Notification) => void,
    onNotificationResponse?: (
      response: Notifications.NotificationResponse,
    ) => void,
  ) {
    this.notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        onNotificationReceived?.(notification);
      },
    );

    this.responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        onNotificationResponse?.(response);
      });
  }

  // Удаление слушателей
  removeNotificationListeners() {
    if (this.notificationListener) {
      this.notificationListener.remove();
      this.notificationListener = null;
    }
    if (this.responseListener) {
      this.responseListener.remove();
      this.responseListener = null;
    }
  }

  // Получение текущих разрешений
  async getCurrentPermissions(): Promise<NotificationPermissions> {
    const { status, canAskAgain } = await Notifications.getPermissionsAsync();
    return {
      granted: status === "granted",
      canAskAgain,
      status,
    };
  }

  // Открытие настроек уведомлений
  async openNotificationSettings(): Promise<void> {
    try {
      const { Linking } = await import("react-native");
      if (Platform.OS === "ios") {
        await Linking.openURL("app-settings:");
      } else {
        await Linking.openSettings();
      }
    } catch (error) {}
  }

  // Создание канала уведомлений для Android
  private async createNotificationChannel() {
    if (Platform.OS !== "android") return;

    try {
      await Notifications.setNotificationChannelAsync("default", {
        name: "FixDrive Notifications",
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0],
        lightColor: "#FF231F7C",
        enableVibrate: false,
        enableLights: true,
        sound: undefined,
      });
    } catch (error) {}
  }
}

export default PushNotificationService;
