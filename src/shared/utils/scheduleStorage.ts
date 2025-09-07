import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './storageKeys';

export interface FlexibleScheduleData {
  selectedDays: string[];
  selectedTime?: string;
  returnTime?: string | null;
  isReturnTrip: boolean;
  customizedDays: {[key: string]: {there: string, back: string}};
  timestamp: string;
}

export interface CustomizedScheduleData {
  [key: string]: {there: string, back: string};
}

/**
 * Получить сохраненное гибкое расписание
 */
export const getFlexibleSchedule = async (): Promise<FlexibleScheduleData | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SCHEDULE_FLEXIBLE);
    
    if (!data) {
      return null;
    }
    
    const parsedData = JSON.parse(data) as FlexibleScheduleData;
    return parsedData;
  } catch (error) {
    return null;
  }
};

/**
 * Получить сохраненные кастомизированные дни
 */
export const getCustomizedSchedule = async (): Promise<CustomizedScheduleData | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SCHEDULE_CUSTOMIZED);
    
    if (!data) {
      return null;
    }
    
    const parsedData = JSON.parse(data) as CustomizedScheduleData;
    return parsedData;
  } catch (error) {
    return null;
  }
};

/**
 * Получить все данные расписания
 */
export const getAllScheduleData = async () => {
  const flexibleSchedule = await getFlexibleSchedule();
  const customizedSchedule = await getCustomizedSchedule();
  
  const allData = {
    flexibleSchedule,
    customizedSchedule,
    timestamp: new Date().toISOString()
  };
  return allData;
};

/**
 * Очистить сохраненные данные расписания
 */
export const clearScheduleData = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.SCHEDULE_FLEXIBLE);
    await AsyncStorage.removeItem(STORAGE_KEYS.SCHEDULE_CUSTOMIZED);
  } catch (error) {
    // Silently ignore cleanup errors
  }
};
