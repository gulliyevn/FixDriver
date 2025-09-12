/**
 * Profile context utilities
 * Utility functions for profile management
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../../shared/types/user';

/**
 * Load profile from AsyncStorage
 */
export const loadProfileFromStorage = async (): Promise<User | null> => {
  try {
    const profileData = await AsyncStorage.getItem('profile');
    return profileData ? JSON.parse(profileData) : null;
  } catch (error) {
    console.warn('Profile load error:', error);
    return null;
  }
};

/**
 * Save profile to AsyncStorage
 */
export const saveProfileToStorage = async (profile: User): Promise<boolean> => {
  try {
    await AsyncStorage.setItem('profile', JSON.stringify(profile));
    return true;
  } catch (error) {
    console.warn('Profile save error:', error);
    return false;
  }
};

/**
 * Create a new child with generated ID
 */
export const createChild = (childData: Omit<import('../../../shared/types/user').Child, 'id'>): import('../../../shared/types/user').Child => ({
  id: Date.now().toString(),
  ...childData,
});

/**
 * Create a new payment method with generated ID
 */
export const createPaymentMethod = (paymentData: Omit<import('../../../shared/types/user').PaymentMethod, 'id'>): import('../../../shared/types/user').PaymentMethod => ({
  id: Date.now().toString(),
  ...paymentData,
});
