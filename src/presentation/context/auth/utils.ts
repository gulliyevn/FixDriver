/**
 * Auth context utilities
 * Utility functions for authentication
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../../shared/types/user';

/**
 * Load user data from AsyncStorage
 */
export const loadUserFromStorage = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.warn('Error loading user from storage:', error);
    return null;
  }
};

/**
 * Save user data to AsyncStorage
 */
export const saveUserToStorage = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.warn('Error saving user to storage:', error);
  }
};

/**
 * Clear user data from AsyncStorage
 */
export const clearUserFromStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.warn('Error clearing user from storage:', error);
  }
};

/**
 * Update user role in storage
 */
export const updateUserRoleInStorage = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.warn('Error updating user role in storage:', error);
  }
};
