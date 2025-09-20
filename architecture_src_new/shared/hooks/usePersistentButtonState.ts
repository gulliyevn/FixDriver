import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ButtonState {
  colorState: number;
  isExpanded: boolean;
  isOnline: boolean;
  isPaused?: boolean;
  emergencyActionsUsed?: boolean;
  emergencyActionType?: string;
  pauseStartTime?: number;
  isTripTimerActive?: boolean;
  tripStartTime?: number;
}

export const usePersistentButtonState = (driverId: string) => {
  const [buttonState, setButtonState] = useState<ButtonState>({
    colorState: 0,
    isExpanded: false,
    isOnline: false
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from storage
  useEffect(() => {
    const loadState = async () => {
      try {
        const saved = await AsyncStorage.getItem(`@driver_button_state_${driverId}`);
        if (saved) {
          setButtonState(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading button state:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadState();
  }, [driverId]);

  // Save state to storage
  const updateButtonState = useCallback(async (newState: Partial<ButtonState>) => {
    const updatedState = { ...buttonState, ...newState };
    setButtonState(updatedState);
    
    try {
      await AsyncStorage.setItem(`@driver_button_state_${driverId}`, JSON.stringify(updatedState));
    } catch (error) {
      console.error('Error saving button state:', error);
    }
  }, [buttonState, driverId]);

  const resetButtonState = useCallback(async () => {
    const defaultState = {
      colorState: 0,
      isExpanded: false,
      isOnline: false
    };
    setButtonState(defaultState);
    
    try {
      await AsyncStorage.setItem(`@driver_button_state_${driverId}`, JSON.stringify(defaultState));
    } catch (error) {
      console.error('Error resetting button state:', error);
    }
  }, [driverId]);

  return {
    buttonState,
    updateButtonState,
    resetButtonState,
    isLoaded
  };
};
