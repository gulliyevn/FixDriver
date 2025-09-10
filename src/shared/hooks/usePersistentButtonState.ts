import { useState, useEffect, useCallback } from 'react';
import { buttonStateOperations, ButtonState } from '../../domain/usecases/button/buttonStateOperations';

/**
 * Hook for managing persistent button state
 * Provides button state management with AsyncStorage persistence
 */
export const usePersistentButtonState = (driverId: string) => {
  const [buttonState, setButtonState] = useState<ButtonState>(
    buttonStateOperations.getDefaultButtonState()
  );
  const [isLoaded, setIsLoaded] = useState(false);

  /**
   * Load state from storage
   */
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedState = await buttonStateOperations.loadButtonState(driverId);
        setButtonState(savedState);
      } catch (error) {
        console.error('Error loading button state:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadState();
  }, [driverId]);

  /**
   * Update button state
   */
  const updateButtonState = useCallback(async (newState: Partial<ButtonState>) => {
    try {
      const updatedState = await buttonStateOperations.updateButtonState(driverId, buttonState, newState);
      setButtonState(updatedState);
    } catch (error) {
      console.error('Error updating button state:', error);
    }
  }, [buttonState, driverId]);

  /**
   * Reset button state to default
   */
  const resetButtonState = useCallback(async () => {
    try {
      const defaultState = await buttonStateOperations.resetButtonState(driverId);
      setButtonState(defaultState);
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