import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CustomizedMap {
  [key: string]: { there: string; back: string };
}

export interface ValidationError {
  message: string;
  field: string;
}

export const useCustomizedDays = (initial: CustomizedMap = {}) => {
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [customizedDays, setCustomizedDays] = useState<CustomizedMap>(initial);
  const [selectedCustomDays, setSelectedCustomDays] = useState<string[]>([]);
  const [tempCustomizedDays, setTempCustomizedDays] = useState<CustomizedMap>({});
  const [validationError, setValidationError] = useState<ValidationError | null>(null);

  const openModal = () => {
    setTempCustomizedDays({ ...customizedDays });
    setValidationError(null);
    setShowCustomizationModal(true);
  };

  const validateSchedule = (isReturnTrip: boolean): ValidationError | null => {
    // Проверяем каждый выбранный день
    for (const dayKey of selectedCustomDays) {
      const dayData = tempCustomizedDays[dayKey];
      
      if (!dayData || !dayData.there.trim()) {
        return {
          message: 'Выберите время "туда"',
          field: `${dayKey}-there`
        };
      }
      
      if (isReturnTrip && (!dayData.back || !dayData.back.trim())) {
        return {
          message: 'Выберите время "обратно"',
          field: `${dayKey}-back`
        };
      }
    }
    
    return null;
  };

  const saveToLocalStorage = async (data: CustomizedMap) => {
    try {
      console.log('🔄 useCustomizedDays: Сохранение кастомизированных дней...');
      console.log('📊 Кастомизированные дни:', JSON.stringify(data, null, 2));
      
      await AsyncStorage.setItem('customizedSchedule', JSON.stringify(data));
      
      console.log('✅ useCustomizedDays: Кастомизированные дни сохранены в localStorage');
    } catch (error) {
      console.error('❌ useCustomizedDays: Ошибка сохранения в localStorage:', error);
    }
  };

  const saveModal = async (isReturnTrip: boolean = false) => {
    console.log('🔄 useCustomizedDays: Начинаем валидацию модального окна...');
    console.log('📋 Выбранные дни для кастомизации:', selectedCustomDays);
    console.log('📊 Временные данные:', JSON.stringify(tempCustomizedDays, null, 2));
    console.log('🔄 Обратная поездка:', isReturnTrip);
    
    const error = validateSchedule(isReturnTrip);
    
    if (error) {
      console.log('❌ useCustomizedDays: Ошибка валидации:', error);
      setValidationError(error);
      return false;
    }
    
    console.log('✅ useCustomizedDays: Валидация пройдена успешно');
    
    const newCustomizedDays = { ...tempCustomizedDays };
    setCustomizedDays(newCustomizedDays);
    setSelectedCustomDays([]);
    setValidationError(null);
    setShowCustomizationModal(false);
    
    console.log('💾 useCustomizedDays: Применяем кастомизацию к основному состоянию');
    
    // Сохраняем в localStorage
    await saveToLocalStorage(newCustomizedDays);
    
    return true;
  };

  const closeModal = () => {
    setValidationError(null);
    setShowCustomizationModal(false);
  };

  return {
    showCustomizationModal,
    customizedDays,
    setCustomizedDays,
    selectedCustomDays,
    setSelectedCustomDays,
    tempCustomizedDays,
    setTempCustomizedDays,
    validationError,
    openModal,
    saveModal,
    closeModal,
  };
};
