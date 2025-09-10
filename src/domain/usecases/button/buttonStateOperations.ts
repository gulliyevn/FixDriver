import AsyncStorage from '@react-native-async-storage/async-storage';
import { BUTTON_STATE_CONSTANTS } from '../../../shared/constants/buttonStateConstants';

export interface ButtonState {
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

/**
 * Domain usecase for button state operations
 * Abstracts data layer access from presentation layer
 */
export const buttonStateOperations = {
  /**
   * Get storage key for driver button state
   */
  getStorageKey(driverId: string): string {
    return `${BUTTON_STATE_CONSTANTS.STORAGE_KEYS.DRIVER_BUTTON_STATE}${driverId}`;
  },

  /**
   * Load button state from storage
   */
  async loadButtonState(driverId: string): Promise<ButtonState> {
    try {
      const storageKey = this.getStorageKey(driverId);
      const saved = await AsyncStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
      return BUTTON_STATE_CONSTANTS.DEFAULTS.BUTTON_STATE;
    } catch (error) {
      console.error('Error loading button state:', error);
      return BUTTON_STATE_CONSTANTS.DEFAULTS.BUTTON_STATE;
    }
  },

  /**
   * Save button state to storage
   */
  async saveButtonState(driverId: string, state: ButtonState): Promise<void> {
    try {
      const storageKey = this.getStorageKey(driverId);
      await AsyncStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving button state:', error);
      throw error;
    }
  },

  /**
   * Update button state (merge with existing)
   */
  async updateButtonState(driverId: string, currentState: ButtonState, updates: Partial<ButtonState>): Promise<ButtonState> {
    const updatedState = { ...currentState, ...updates };
    await this.saveButtonState(driverId, updatedState);
    return updatedState;
  },

  /**
   * Reset button state to default
   */
  async resetButtonState(driverId: string): Promise<ButtonState> {
    const defaultState = BUTTON_STATE_CONSTANTS.DEFAULTS.BUTTON_STATE;
    await this.saveButtonState(driverId, defaultState);
    return defaultState;
  },

  /**
   * Get default button state
   */
  getDefaultButtonState(): ButtonState {
    return BUTTON_STATE_CONSTANTS.DEFAULTS.BUTTON_STATE;
  }
};
