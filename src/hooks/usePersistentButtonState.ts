import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ButtonState {
  buttonColorState: number;
  isPaused: boolean;
  emergencyActionsUsed: boolean;
  emergencyActionType: 'stop' | 'end' | null;
  pauseStartTime: number | null;
  // Новые состояния для таймера в статусе 2 (циан)
  isTripTimerActive: boolean;
  tripStartTime: number | null;
}

const BUTTON_STATE_KEY = '@driver_modal_button_state';

export const usePersistentButtonState = (driverId: string) => {
  const [buttonState, setButtonState] = useState<ButtonState>({
    buttonColorState: 0,
    isPaused: false,
    emergencyActionsUsed: false,
    emergencyActionType: null,
    pauseStartTime: null,
    isTripTimerActive: false,
    tripStartTime: null,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Загружаем состояние при инициализации
  useEffect(() => {
    loadButtonState();
  }, [driverId]);

  // Сохраняем состояние при изменении
  useEffect(() => {
    if (isLoaded) {
      saveButtonState();
    }
  }, [buttonState, isLoaded]);

  const loadButtonState = async () => {
    try {
      const key = `${BUTTON_STATE_KEY}_${driverId}`;
      const savedState = await AsyncStorage.getItem(key);
      
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        setButtonState(parsedState);
      }
    } catch (error) {
      console.error('Ошибка при загрузке состояния кнопки:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveButtonState = async () => {
    try {
      const key = `${BUTTON_STATE_KEY}_${driverId}`;
      await AsyncStorage.setItem(key, JSON.stringify(buttonState));
    } catch (error) {
      console.error('Ошибка при сохранении состояния кнопки:', error);
    }
  };

  const updateButtonState = useCallback((updates: Partial<ButtonState>) => {
    setButtonState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetButtonState = async () => {
    const newState = {
      buttonColorState: 0,
      isPaused: false,
      emergencyActionsUsed: false,
      emergencyActionType: null,
      pauseStartTime: null,
      isTripTimerActive: false,
      tripStartTime: null,
    };
    
    setButtonState(newState);
    
    try {
      const key = `${BUTTON_STATE_KEY}_${driverId}`;
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Ошибка при сбросе состояния кнопки:', error);
    }
  };

  return {
    buttonState,
    updateButtonState,
    resetButtonState,
    isLoaded,
  };
};
