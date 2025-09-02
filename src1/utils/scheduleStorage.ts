import AsyncStorage from '@react-native-async-storage/async-storage';

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
    console.log('🔄 scheduleStorage: Получение гибкого расписания из localStorage...');
    
    const data = await AsyncStorage.getItem('flexibleSchedule');
    
    if (!data) {
      console.log('⚠️ scheduleStorage: Гибкое расписание не найдено в localStorage');
      return null;
    }
    
    const parsedData = JSON.parse(data) as FlexibleScheduleData;
    
    console.log('✅ scheduleStorage: Гибкое расписание получено из localStorage');
    console.log('📊 Данные гибкого расписания:', JSON.stringify(parsedData, null, 2));
    
    return parsedData;
  } catch (error) {
    console.error('❌ scheduleStorage: Ошибка получения гибкого расписания:', error);
    return null;
  }
};

/**
 * Получить сохраненные кастомизированные дни
 */
export const getCustomizedSchedule = async (): Promise<CustomizedScheduleData | null> => {
  try {
    console.log('🔄 scheduleStorage: Получение кастомизированного расписания из localStorage...');
    
    const data = await AsyncStorage.getItem('customizedSchedule');
    
    if (!data) {
      console.log('⚠️ scheduleStorage: Кастомизированное расписание не найдено в localStorage');
      return null;
    }
    
    const parsedData = JSON.parse(data) as CustomizedScheduleData;
    
    console.log('✅ scheduleStorage: Кастомизированное расписание получено из localStorage');
    console.log('📊 Данные кастомизированного расписания:', JSON.stringify(parsedData, null, 2));
    
    return parsedData;
  } catch (error) {
    console.error('❌ scheduleStorage: Ошибка получения кастомизированного расписания:', error);
    return null;
  }
};

/**
 * Получить все данные расписания
 */
export const getAllScheduleData = async () => {
  console.log('🚀 scheduleStorage: Получение ВСЕХ данных расписания для следующей страницы...');
  
  const flexibleSchedule = await getFlexibleSchedule();
  const customizedSchedule = await getCustomizedSchedule();
  
  const allData = {
    flexibleSchedule,
    customizedSchedule,
    timestamp: new Date().toISOString()
  };
  
  console.log('📦 scheduleStorage: ВСЕ данные для передачи на следующую страницу:');
  console.log(JSON.stringify(allData, null, 2));
  
  return allData;
};

/**
 * Очистить сохраненные данные расписания
 */
export const clearScheduleData = async () => {
  try {
    console.log('🧹 scheduleStorage: Очистка данных расписания...');
    
    await AsyncStorage.removeItem('flexibleSchedule');
    await AsyncStorage.removeItem('customizedSchedule');
    
    console.log('✅ scheduleStorage: Данные расписания очищены');
  } catch (error) {
    console.error('❌ scheduleStorage: Ошибка очистки данных расписания:', error);
  }
};
