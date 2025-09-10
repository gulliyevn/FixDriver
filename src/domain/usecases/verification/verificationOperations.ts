import AsyncStorage from '@react-native-async-storage/async-storage';
import { VERIFICATION_CONSTANTS } from '../../../shared/constants/verificationConstants';

export interface VerificationStatus {
  email: boolean;
  phone: boolean;
}

export interface IsVerifying {
  email: boolean;
  phone: boolean;
}

/**
 * Domain usecase for verification operations
 * Abstracts data layer access from presentation layer
 */
export const verificationOperations = {
  /**
   * Save verification status to storage
   */
  async saveVerificationStatus(type: 'email' | 'phone', status: boolean): Promise<void> {
    try {
      const storageKey = type === 'email' 
        ? VERIFICATION_CONSTANTS.STORAGE_KEYS.EMAIL 
        : VERIFICATION_CONSTANTS.STORAGE_KEYS.PHONE;
      await AsyncStorage.setItem(storageKey, JSON.stringify(status));
    } catch (error) {
      console.error('Error saving verification status:', error);
      throw error;
    }
  },

  /**
   * Load verification status from storage
   */
  async loadVerificationStatus(): Promise<VerificationStatus> {
    try {
      const emailVerified = await AsyncStorage.getItem(VERIFICATION_CONSTANTS.STORAGE_KEYS.EMAIL);
      const phoneVerified = await AsyncStorage.getItem(VERIFICATION_CONSTANTS.STORAGE_KEYS.PHONE);
      
      return {
        email: emailVerified ? JSON.parse(emailVerified) : false,
        phone: phoneVerified ? JSON.parse(phoneVerified) : false,
      };
    } catch (error) {
      console.error('Error loading verification status:', error);
      return { email: false, phone: false };
    }
  },

  /**
   * Reset verification status
   */
  async resetVerificationStatus(type: 'email' | 'phone'): Promise<void> {
    try {
      const storageKey = type === 'email' 
        ? VERIFICATION_CONSTANTS.STORAGE_KEYS.EMAIL 
        : VERIFICATION_CONSTANTS.STORAGE_KEYS.PHONE;
      await AsyncStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error resetting verification status:', error);
      throw error;
    }
  },

  /**
   * Validate verification code
   */
  validateCode(code: string): boolean {
    return code === VERIFICATION_CONSTANTS.VERIFICATION.CODE;
  },

  /**
   * Get verification timeout
   */
  getVerificationTimeout(): number {
    return VERIFICATION_CONSTANTS.VERIFICATION.TIMEOUT;
  }
};
