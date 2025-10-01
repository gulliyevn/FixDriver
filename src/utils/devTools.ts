/**
 * ⚠️ DEV ONLY - DEVELOPMENT TOOLS ⚠️
 * 
 * Утилиты для работы с DEV-режимом
 * TODO: УДАЛИТЬ ПЕРЕД ПРОДАКШЕНОМ!
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import DevRegistrationService from '../services/DevRegistrationService';

/**
 * Показать все данные в AsyncStorage (только DEV ключи)
 */
export const showDevStorage = async (): Promise<void> => {
  if (!__DEV__) return;

  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   DEV STORAGE INSPECTOR                ║');
  console.log('╠════════════════════════════════════════╣');

  try {
    // Получаем все ключи
    const allKeys = await AsyncStorage.getAllKeys();
    const devKeys = allKeys.filter(key => key.startsWith('@dev_'));

    console.log(`║ 🔑 Total DEV keys: ${devKeys.length.toString().padEnd(20)}║`);
    console.log('╠════════════════════════════════════════╣');

    for (const key of devKeys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        try {
          const parsed = JSON.parse(value);
          const count = Array.isArray(parsed) ? parsed.length : 1;
          console.log(`║ ${key.padEnd(38)}║`);
          console.log(`║   Items: ${count.toString().padEnd(30)}║`);
        } catch {
          console.log(`║ ${key.padEnd(38)}║`);
          console.log(`║   Value: ${value.substring(0, 26).padEnd(30)}║`);
        }
      }
    }

    console.log('╚════════════════════════════════════════╝\n');

    // Показываем пользователей
    await DevRegistrationService.logDevRegistrationStats();
  } catch (error) {
    console.error('[DEV] Error showing storage:', error);
  }
};

/**
 * Очистить ТОЛЬКО DEV данные (безопасно)
 */
export const clearDevStorage = async (): Promise<void> => {
  if (!__DEV__) return;

  try {
    console.log('[DEV] 🗑️ Clearing DEV storage...');

    // Получаем все ключи
    const allKeys = await AsyncStorage.getAllKeys();
    const devKeys = allKeys.filter(key => key.startsWith('@dev_'));

    if (devKeys.length === 0) {
      console.log('[DEV] ℹ️ No DEV keys to clear');
      return;
    }

    // Удаляем только DEV ключи
    await AsyncStorage.multiRemove(devKeys);

    console.log(`[DEV] ✅ Cleared ${devKeys.length} DEV keys`);
    console.log('[DEV] 🔑 Removed keys:', devKeys.join(', '));
  } catch (error) {
    console.error('[DEV] Error clearing storage:', error);
    throw error;
  }
};

/**
 * Экспорт всех DEV данных в JSON
 */
export const exportDevData = async (): Promise<string> => {
  if (!__DEV__) return '{}';

  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const devKeys = allKeys.filter(key => key.startsWith('@dev_'));

    const data: Record<string, any> = {};

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
    console.log('[DEV] 📤 Exported data:');
    console.log(json);

    return json;
  } catch (error) {
    console.error('[DEV] Error exporting data:', error);
    return '{}';
  }
};

/**
 * Импорт DEV данных из JSON
 */
export const importDevData = async (jsonString: string): Promise<void> => {
  if (!__DEV__) return;

  try {
    const data = JSON.parse(jsonString);

    for (const [key, value] of Object.entries(data)) {
      if (key.startsWith('@dev_')) {
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        await AsyncStorage.setItem(key, stringValue);
        console.log(`[DEV] ✅ Imported: ${key}`);
      }
    }

    console.log('[DEV] 🎉 Import completed!');
  } catch (error) {
    console.error('[DEV] Error importing data:', error);
    throw error;
  }
};

/**
 * Проверить состояние AsyncStorage
 */
export const checkStorageHealth = async (): Promise<void> => {
  if (!__DEV__) return;

  console.log('[DEV] 🏥 Checking AsyncStorage health...');

  try {
    // Тестовая запись
    const testKey = '@dev_health_check';
    const testValue = { timestamp: Date.now(), test: true };

    await AsyncStorage.setItem(testKey, JSON.stringify(testValue));
    const retrieved = await AsyncStorage.getItem(testKey);
    await AsyncStorage.removeItem(testKey);

    if (retrieved) {
      const parsed = JSON.parse(retrieved);
      if (parsed.test === true) {
        console.log('[DEV] ✅ AsyncStorage is healthy');
        return;
      }
    }

    console.log('[DEV] ⚠️ AsyncStorage may have issues');
  } catch (error) {
    console.error('[DEV] ❌ AsyncStorage error:', error);
  }
};

/**
 * Проверить профили пользователей
 */
export const checkProfiles = async (): Promise<void> => {
  if (!__DEV__) return;

  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   PROFILE CHECK                        ║');
  console.log('╠════════════════════════════════════════╣');

  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const profileKeys = allKeys.filter(key => key.startsWith('@profile_'));

    console.log(`║ 🔑 Total profile keys: ${profileKeys.length.toString().padEnd(17)}║`);
    console.log('╚════════════════════════════════════════╝\n');

    for (const key of profileKeys) {
      const profile = await AsyncStorage.getItem(key);
      if (profile) {
        const parsed = JSON.parse(profile);
        console.log(`📋 ${key}`);
        console.log(`   Email: ${parsed.email}`);
        console.log(`   Name: ${parsed.firstName} ${parsed.lastName}`);
        console.log(`   Role: ${parsed.role}`);
        console.log('');
      }
    }

    // Проверяем user в 'user' ключе
    const currentUser = await AsyncStorage.getItem('user');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      console.log('👤 Current logged user:');
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Profile key should be: @profile_${user.id}`);
      
      // Проверяем существует ли профиль
      const profileExists = await AsyncStorage.getItem(`@profile_${user.id}`);
      console.log(`   Profile exists: ${profileExists ? '✅ YES' : '❌ NO'}`);
    } else {
      console.log('👤 No user logged in');
    }
  } catch (error) {
    console.error('[DEV] Error checking profiles:', error);
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
if (__DEV__ && typeof global !== 'undefined') {
  (global as any).DevCommands = DevCommands;
  console.log('\n✅ DevCommands доступны в консоли!');
  console.log('Используй: DevCommands.show() / .clear() / .users() и т.д.\n');
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

