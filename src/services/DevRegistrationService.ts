import AsyncStorage from "@react-native-async-storage/async-storage";
import { isDevModeEnabled } from "../config/devMode";

const DEV_STORAGE_KEYS = {
  USERS: "@dev_registered_users",
  DRIVERS: "@dev_registered_drivers",
};

export interface DevRegisteredUser {
  id?: string;
  email?: string;
  phone?: string;
  password?: string; // В реальном приложении НИКОГДА не храним пароли в открытом виде!
  firstName?: string;
  lastName?: string;
  role?: "client" | "driver";
  registeredAt?: string;
  success?: boolean;
  message?: string;

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
  // Генерируем временный ID
  const userId = `dev_client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const user: DevRegisteredUser = {
    id: userId,
    ...data,
    role: "client",
    registeredAt: new Date().toISOString(),
  };

  // Получаем существующих пользователей
  const existingUsersJson = await AsyncStorage.getItem(
    DEV_STORAGE_KEYS.USERS,
  );
  const existingUsers: DevRegisteredUser[] = existingUsersJson
    ? JSON.parse(existingUsersJson)
    : [];

  // Проверяем дубликаты по email
  const duplicate = existingUsers.find((u) => u.email === data.email);
  if (duplicate) {
    console.error("Пользователь с таким email уже зарегистрирован");
    return {
      success: false,
      message: "Пользователь с таким email уже зарегистрирован",
    };
  }

  // Добавляем нового пользователя
  existingUsers.push(user);

  // Сохраняем обратно
  await AsyncStorage.setItem(
    DEV_STORAGE_KEYS.USERS,
    JSON.stringify(existingUsers),
  );

  // Проверяем что сохранилось
  const savedUsersJson = await AsyncStorage.getItem(DEV_STORAGE_KEYS.USERS);
  console.log('✅ DEV: Клиент зарегистрирован:', {
    email: user.email,
    totalUsers: existingUsers.length,
    saved: !!savedUsersJson
  });

  return user;
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
  // Генерируем временный ID
  const driverId = `dev_driver_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const driver: DevRegisteredUser = {
    id: driverId,
    ...data,
    role: "driver",
    registeredAt: new Date().toISOString(),
  };

  // Получаем существующих водителей
  const existingDriversJson = await AsyncStorage.getItem(
    DEV_STORAGE_KEYS.DRIVERS,
  );
  const existingDrivers: DevRegisteredUser[] = existingDriversJson
    ? JSON.parse(existingDriversJson)
    : [];

  // Проверяем дубликаты по email
  const duplicate = existingDrivers.find((d) => d.email === data.email);
  if (duplicate) {
    console.error("Водитель с таким email уже зарегистрирован");
    return {
      success: false,
      message: "Водитель с таким email уже зарегистрирован",
    };
  }

  // Добавляем нового водителя
  existingDrivers.push(driver);

  // Сохраняем обратно
  await AsyncStorage.setItem(
    DEV_STORAGE_KEYS.DRIVERS,
    JSON.stringify(existingDrivers),
  );

  // Проверяем что сохранилось
  const savedDriversJson = await AsyncStorage.getItem(DEV_STORAGE_KEYS.DRIVERS);
  console.log('✅ DEV: Водитель зарегистрирован:', {
    email: driver.email,
    totalDrivers: existingDrivers.length,
    saved: !!savedDriversJson
  });

  return driver;
};

/**
 * Получить всех зарегистрированных пользователей (для отладки)
 */
export const getAllDevUsers = async (): Promise<DevRegisteredUser[]> => {
  try {
    const usersJson = await AsyncStorage.getItem(DEV_STORAGE_KEYS.USERS);
    const driversJson = await AsyncStorage.getItem(DEV_STORAGE_KEYS.DRIVERS);

    const users: DevRegisteredUser[] = usersJson ? JSON.parse(usersJson) : [];
    const drivers: DevRegisteredUser[] = driversJson
      ? JSON.parse(driversJson)
      : [];

    return [...users, ...drivers];
  } catch (error) {
    return [];
  }
};

/**
 * Очистить все временные регистрации
 */
export const clearAllDevRegistrations = async (): Promise<void> => {
  await AsyncStorage.multiRemove([
    DEV_STORAGE_KEYS.USERS,
    DEV_STORAGE_KEYS.DRIVERS,
  ]);
};

/**
 * Проверить, включен ли Dev режим
 */
export const isDevModeEnabledService = (): boolean => {
  return isDevModeEnabled();
};

/**
 * Вывести статистику регистраций в консоль
 */
export const logDevRegistrationStats = async (): Promise<void> => {
  if (!isDevModeEnabled()) return;

  try {
    const users = await getAllDevUsers();

    if (users.length > 0) {
      users.slice(-5).forEach(() => {});
    }
  } catch (error) {
    console.warn('Failed to log dev registration stats:', error);
  }
};

// Экспорт для удобства
export const DevRegistrationService = {
  saveClientRegistration,
  saveDriverRegistration,
  getAllDevUsers,
  clearAllDevRegistrations,
  isDevModeEnabledService,
  logDevRegistrationStats,
};

export default DevRegistrationService;
