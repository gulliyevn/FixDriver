/**
 * Package context utilities
 * Utility functions for package and subscription management
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { PACKAGE_CONSTANTS } from './constants';
import { PackageType, Subscription } from './types';

/**
 * Load package from AsyncStorage
 */
export const loadPackageFromStorage = async (): Promise<PackageType> => {
  try {
    const storedPackage = await AsyncStorage.getItem(PACKAGE_CONSTANTS.STORAGE_KEYS.PACKAGE);
    
    if (storedPackage) {
      // Handle packages with suffixes (_month, _year)
      const basePackage = storedPackage.replace(/_month$|_year$/, '');
      
      if (PACKAGE_CONSTANTS.VALID_PACKAGES.includes(basePackage as PackageType)) {
        // If saved package contains suffix, fix it
        if (storedPackage !== basePackage) {
          await AsyncStorage.setItem(PACKAGE_CONSTANTS.STORAGE_KEYS.PACKAGE, basePackage);
        }
        return basePackage as PackageType;
      } else {
        // Clear invalid data
        await AsyncStorage.removeItem(PACKAGE_CONSTANTS.STORAGE_KEYS.PACKAGE);
        return 'free';
      }
    }
    
    return 'free';
  } catch (error) {
    console.error('Error loading package:', error);
    return 'free';
  }
};

/**
 * Save package to AsyncStorage
 */
export const savePackageToStorage = async (packageType: PackageType): Promise<void> => {
  await AsyncStorage.setItem(PACKAGE_CONSTANTS.STORAGE_KEYS.PACKAGE, packageType);
};

/**
 * Load subscription from AsyncStorage
 */
export const loadSubscriptionFromStorage = async (): Promise<Subscription | null> => {
  try {
    const storedSubscription = await AsyncStorage.getItem(PACKAGE_CONSTANTS.STORAGE_KEYS.SUBSCRIPTION);
    
    if (storedSubscription) {
      const parsedSubscription = JSON.parse(storedSubscription);
      
      // Fix packageType format if it contains suffix
      if (parsedSubscription.packageType && parsedSubscription.packageType.includes('_')) {
        const basePackageType = parsedSubscription.packageType.replace(/_month$|_year$/, '');
        if (PACKAGE_CONSTANTS.VALID_PACKAGES.includes(basePackageType as PackageType)) {
          parsedSubscription.packageType = basePackageType;
          // Save corrected subscription
          await AsyncStorage.setItem(PACKAGE_CONSTANTS.STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(parsedSubscription));
        }
      }
      
      return parsedSubscription;
    }
    
    return null;
  } catch (error) {
    console.error('Error loading subscription:', error);
    return null;
  }
};

/**
 * Save subscription to AsyncStorage
 */
export const saveSubscriptionToStorage = async (subscription: Subscription): Promise<void> => {
  await AsyncStorage.setItem(PACKAGE_CONSTANTS.STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(subscription));
};

/**
 * Remove subscription from AsyncStorage
 */
export const removeSubscriptionFromStorage = async (): Promise<void> => {
  await AsyncStorage.removeItem(PACKAGE_CONSTANTS.STORAGE_KEYS.SUBSCRIPTION);
};

/**
 * Calculate next billing date
 */
export const calculateNextBillingDate = (currentDate: Date, period: 'month' | 'year'): Date => {
  const daysInPeriod = period === 'year' ? PACKAGE_CONSTANTS.PERIODS.YEAR_DAYS : PACKAGE_CONSTANTS.PERIODS.MONTH_DAYS;
  return new Date(currentDate.getTime() + daysInPeriod * 24 * 60 * 60 * 1000);
};

/**
 * Check if notification should be shown (24 hours cooldown)
 */
export const shouldShowNotification = (lastNotificationDate: string | undefined): boolean => {
  if (!lastNotificationDate) return true;
  
  const now = new Date();
  const lastNotification = new Date(lastNotificationDate);
  
  return (now.getTime() - lastNotification.getTime()) >= PACKAGE_CONSTANTS.NOTIFICATION_COOLDOWN;
};
