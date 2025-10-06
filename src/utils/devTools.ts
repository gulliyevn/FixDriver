import AsyncStorage from "@react-native-async-storage/async-storage";
import DevRegistrationService from "../services/DevRegistrationService";

/**
 * Показать все данные в AsyncStorage (только DEV ключи)
 */
export const showDevStorage = async (): Promise<void> => {
  if (!__DEV__) return;

  try {
    // Получаем все ключи
    const allKeys = await AsyncStorage.getAllKeys();
    const devKeys = allKeys.filter((key) => key.startsWith("@dev_"));

    for (const key of devKeys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        try {
          JSON.parse(value);
        } catch (error) {
          console.warn('Failed to parse dev data:', error);
        }
      }
    }

    // Показываем пользователей
    await DevRegistrationService.logDevRegistrationStats();
  } catch (error) {
    console.warn('Failed to log dev registration stats:', error);
  }
};

/**
 * Очистить ТОЛЬКО DEV данные (безопасно)
 */
export const clearDevStorage = async (): Promise<void> => {
  if (!__DEV__) return;

  // Получаем все ключи
  const allKeys = await AsyncStorage.getAllKeys();
  const devKeys = allKeys.filter((key) => key.startsWith("@dev_"));

  if (devKeys.length === 0) {
    return;
  }

  // Удаляем только DEV ключи
  await AsyncStorage.multiRemove(devKeys);
};

/**
 * Экспорт всех DEV данных в JSON
 */
export const exportDevData = async (): Promise<string> => {
  if (!__DEV__) return "{}";

  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const devKeys = allKeys.filter((key) => key.startsWith("@dev_"));

    const data: Record<string, unknown> = {};

    for (const key of devKeys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        try {
          data[key] = JSON.parse(value);
        } catch {
          data[key] = value;
        }
      }
    }

    const json = JSON.stringify(data, null, 2);

    return json;
  } catch (error) {
    return "{}";
  }
};

/**
 * Импорт DEV данных из JSON
 */
export const importDevData = async (jsonString: string): Promise<void> => {
  if (!__DEV__) return;

  const data = JSON.parse(jsonString);

  for (const [key, value] of Object.entries(data)) {
    if (key.startsWith("@dev_")) {
      const stringValue =
        typeof value === "string" ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, stringValue);
    }
  }
};

/**
 * Проверить состояние AsyncStorage
 */
export const checkStorageHealth = async (): Promise<void> => {
  if (!__DEV__) return;

  try {
    // Тестовая запись
    const testKey = "@dev_health_check";
    const testValue = { timestamp: Date.now(), test: true };

    await AsyncStorage.setItem(testKey, JSON.stringify(testValue));
    const retrieved = await AsyncStorage.getItem(testKey);
    await AsyncStorage.removeItem(testKey);

    if (retrieved) {
      const parsed = JSON.parse(retrieved);
      if (parsed.test === true) {
        return;
      }
    }
  } catch (error) {
    console.warn('Failed to clear dev data:', error);
  }
};

/**
 * Проверить профили пользователей
 */
export const checkProfiles = async (): Promise<void> => {
  if (!__DEV__) return;

  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const profileKeys = allKeys.filter((key) => key.startsWith("@profile_"));

    for (const key of profileKeys) {
      const profile = await AsyncStorage.getItem(key);
      if (profile) {
        JSON.parse(profile);
      }
    }

    // Проверяем user в 'user' ключе
    const currentUser = await AsyncStorage.getItem("user");
    if (currentUser) {
      const user = JSON.parse(currentUser);

      // Проверяем существует ли профиль
      await AsyncStorage.getItem(`@profile_${user.id}`);
    } else {
      console.log('No current user found');
    }
  } catch (error) {
    console.warn('Failed to check user profiles:', error);
  }
};

/**
 * Быстрые команды для консоли
 */
export const DevCommands = {
  show: showDevStorage,
  clear: clearDevStorage,
  export: exportDevData,
  import: importDevData,
  health: checkStorageHealth,
  users: DevRegistrationService.logDevRegistrationStats,
  profiles: checkProfiles,
};

// Экспортируем в глобальный объект для удобства (только в DEV)
if (__DEV__ && typeof global !== "undefined") {
  (global as unknown as { DevCommands?: unknown }).DevCommands = DevCommands;
}

export default {
  showDevStorage,
  clearDevStorage,
  exportDevData,
  importDevData,
  checkStorageHealth,
  checkProfiles,
  DevCommands,
};
