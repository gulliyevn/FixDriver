/**
 * ⚠️ DEV ONLY - TEMPORARY SERVICE ⚠️
 * 
 * Этот файл используется ТОЛЬКО для разработки!
 * Сохраняет регистрации в AsyncStorage вместо отправки на сервер.
 * 
 * TODO: УДАЛИТЬ ПЕРЕД ПРОДАКШЕНОМ!
 * 
 * Использование:
 * - Включено только когда __DEV__ === true
 * - Регистрирует пользователей локально
 * - Хранит данные в AsyncStorage
 * - НЕ отправляет данные на сервер
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const DEV_STORAGE_KEYS = {
  USERS: '@dev_registered_users',
  DRIVERS: '@dev_registered_drivers',
};

export interface DevRegisteredUser {
  id: string;
  email: string;
  phone: string;
  password: string; // В реальном приложении НИКОГДА не храним пароли в открытом виде!
  firstName: string;
  lastName: string;
  role: 'client' | 'driver';
  registeredAt: string;
  
  // Driver-specific fields
  country?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  vehicleNumber?: string;
  experience?: string;
  carBrand?: string;
  carModel?: string;
  carYear?: string;
  carMileage?: string;
  tariff?: string;
  licensePhoto?: string;
  passportPhoto?: string;
}

/**
 * Сохранить регистрацию клиента (временно)
 */
export const saveClientRegistration = async (data: {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<DevRegisteredUser> => {
  try {
    // Генерируем временный ID
    const userId = `dev_client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const user: DevRegisteredUser = {
      id: userId,
      ...data,
      role: 'client',
      registeredAt: new Date().toISOString(),
    };
    
    // Получаем существующих пользователей
    const existingUsersJson = await AsyncStorage.getItem(DEV_STORAGE_KEYS.USERS);
    const existingUsers: DevRegisteredUser[] = existingUsersJson 
      ? JSON.parse(existingUsersJson) 
      : [];
    
    // Проверяем дубликаты по email
    const duplicate = existingUsers.find(u => u.email === data.email);
    if (duplicate) {
      throw new Error('Пользователь с таким email уже зарегистрирован');
    }
    
    // Добавляем нового пользователя
    existingUsers.push(user);
    
    // Сохраняем обратно
    await AsyncStorage.setItem(DEV_STORAGE_KEYS.USERS, JSON.stringify(existingUsers));
    
    console.log(`[DEV] 👤 Client registered locally: ${user.email}`);
    console.log(`[DEV] 🆔 User ID: ${user.id}`);
    console.log(`[DEV] 🔑 Password saved: ${user.password}`);
    console.log(`[DEV] 📦 Total users in storage: ${existingUsers.length}`);
    console.log(`[DEV] 💾 Storage key: ${DEV_STORAGE_KEYS.USERS}`);
    
    // Проверяем что сохранилось
    const verifyJson = await AsyncStorage.getItem(DEV_STORAGE_KEYS.USERS);
    const verifyUsers = verifyJson ? JSON.parse(verifyJson) : [];
    console.log(`[DEV] ✅ Verification: ${verifyUsers.length} users in AsyncStorage`);
    
    return user;
  } catch (error) {
    console.error('[DEV] Error saving client registration:', error);
    throw error;
  }
};

/**
 * Сохранить регистрацию водителя (временно)
 */
export const saveDriverRegistration = async (data: {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  country: string;
  licenseNumber: string;
  licenseExpiry: string;
  vehicleNumber: string;
  experience: string;
  carBrand: string;
  carModel: string;
  carYear: string;
  carMileage: string;
  tariff: string;
  licensePhoto?: string;
  passportPhoto?: string;
}): Promise<DevRegisteredUser> => {
  try {
    // Генерируем временный ID
    const driverId = `dev_driver_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const driver: DevRegisteredUser = {
      id: driverId,
      ...data,
      role: 'driver',
      registeredAt: new Date().toISOString(),
    };
    
    // Получаем существующих водителей
    const existingDriversJson = await AsyncStorage.getItem(DEV_STORAGE_KEYS.DRIVERS);
    const existingDrivers: DevRegisteredUser[] = existingDriversJson 
      ? JSON.parse(existingDriversJson) 
      : [];
    
    // Проверяем дубликаты по email
    const duplicate = existingDrivers.find(d => d.email === data.email);
    if (duplicate) {
      throw new Error('Водитель с таким email уже зарегистрирован');
    }
    
    // Добавляем нового водителя
    existingDrivers.push(driver);
    
    // Сохраняем обратно
    await AsyncStorage.setItem(DEV_STORAGE_KEYS.DRIVERS, JSON.stringify(existingDrivers));
    
    console.log(`[DEV] 🚗 Driver registered locally: ${driver.email}`);
    console.log(`[DEV] 🆔 Driver ID: ${driver.id}`);
    console.log(`[DEV] 🔑 Password saved: ${driver.password}`);
    console.log(`[DEV] 📦 Total drivers in storage: ${existingDrivers.length}`);
    console.log(`[DEV] 💾 Storage key: ${DEV_STORAGE_KEYS.DRIVERS}`);
    
    // Проверяем что сохранилось
    const verifyJson = await AsyncStorage.getItem(DEV_STORAGE_KEYS.DRIVERS);
    const verifyDrivers = verifyJson ? JSON.parse(verifyJson) : [];
    console.log(`[DEV] ✅ Verification: ${verifyDrivers.length} drivers in AsyncStorage`);
    
    return driver;
  } catch (error) {
    console.error('[DEV] Error saving driver registration:', error);
    throw error;
  }
};

/**
 * Получить всех зарегистрированных пользователей (для отладки)
 */
export const getAllDevUsers = async (): Promise<DevRegisteredUser[]> => {
  try {
    const usersJson = await AsyncStorage.getItem(DEV_STORAGE_KEYS.USERS);
    const driversJson = await AsyncStorage.getItem(DEV_STORAGE_KEYS.DRIVERS);
    
    const users: DevRegisteredUser[] = usersJson ? JSON.parse(usersJson) : [];
    const drivers: DevRegisteredUser[] = driversJson ? JSON.parse(driversJson) : [];
    
    return [...users, ...drivers];
  } catch (error) {
    console.error('[DEV] Error getting all users:', error);
    return [];
  }
};

/**
 * Очистить все временные регистрации
 */
export const clearAllDevRegistrations = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      DEV_STORAGE_KEYS.USERS,
      DEV_STORAGE_KEYS.DRIVERS,
    ]);
    console.log('[DEV] 🗑️ All dev registrations cleared');
  } catch (error) {
    console.error('[DEV] Error clearing registrations:', error);
    throw error;
  }
};

/**
 * Проверить, включен ли Dev режим
 */
export const isDevModeEnabled = (): boolean => {
  return __DEV__;
};

/**
 * Вывести статистику регистраций в консоль
 */
export const logDevRegistrationStats = async (): Promise<void> => {
  if (!__DEV__) return;
  
  try {
    const users = await getAllDevUsers();
    const clients = users.filter(u => u.role === 'client');
    const drivers = users.filter(u => u.role === 'driver');
    
    console.log('╔════════════════════════════════════════╗');
    console.log('║   DEV REGISTRATION STATS               ║');
    console.log('╠════════════════════════════════════════╣');
    console.log(`║ 👥 Total Users:    ${users.length.toString().padEnd(20)}║`);
    console.log(`║ 👤 Clients:        ${clients.length.toString().padEnd(20)}║`);
    console.log(`║ 🚗 Drivers:        ${drivers.length.toString().padEnd(20)}║`);
    console.log('╚════════════════════════════════════════╝');
    
    if (users.length > 0) {
      console.log('\nRecent registrations:');
      users.slice(-5).forEach((user, index) => {
        console.log(`${index + 1}. [${user.role.toUpperCase()}] ${user.email} (${user.firstName} ${user.lastName})`);
      });
    }
  } catch (error) {
    console.error('[DEV] Error logging stats:', error);
  }
};

// Экспорт для удобства
export const DevRegistrationService = {
  saveClientRegistration,
  saveDriverRegistration,
  getAllDevUsers,
  clearAllDevRegistrations,
  isDevModeEnabled,
  logDevRegistrationStats,
};

export default DevRegistrationService;

