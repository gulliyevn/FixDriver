/**
 * Package context
 * Main package and subscription management context
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useBalance } from '../../../shared/hooks/useBalance';
import { useI18n } from '../../../shared/hooks/useI18n';
import { PackageContextType, PackageProviderProps, PackageType, Subscription } from './types';
import { PACKAGE_CONSTANTS, PACKAGE_PRICES, PACKAGE_ICONS, PACKAGE_COLORS } from './constants';
import { 
  loadPackageFromStorage, 
  savePackageToStorage, 
  loadSubscriptionFromStorage, 
  saveSubscriptionToStorage, 
  removeSubscriptionFromStorage,
  calculateNextBillingDate,
  shouldShowNotification
} from './utils';

export const PackageContext = createContext<PackageContextType | undefined>(undefined);

export const PackageProvider: React.FC<PackageProviderProps> = ({ children }) => {
  const [currentPackage, setCurrentPackage] = useState<PackageType>('free');
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const { t } = useI18n();
  const balanceHook = useBalance();
  const deductBalance = balanceHook.withdrawBalance;

  // Load saved package and subscription on initialization
  useEffect(() => {
    loadPackage();
    loadSubscription();
  }, []);

  // Automatic subscription expiration monitoring
  useEffect(() => {
    if (!subscription || subscription.packageType === 'free') {
      return;
    }

    // Check immediately on load
    processAutoRenewal();
    checkDailyNotification();

    // Set interval to check every 6 hours
    const interval = setInterval(() => {
      processAutoRenewal();
      checkDailyNotification();
    }, PACKAGE_CONSTANTS.AUTO_RENEWAL_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [subscription]);

  const loadPackage = async () => {
    const packageType = await loadPackageFromStorage();
    setCurrentPackage(packageType);
  };

  const loadSubscription = async () => {
    const subscriptionData = await loadSubscriptionFromStorage();
    setSubscription(subscriptionData);
  };

  const updatePackage = async (newPackage: PackageType, period: 'month' | 'year' = 'month') => {
    // Save current package for rollback on error
    const previousPackage = currentPackage;
    
    try {
      // Validate package
      if (!PACKAGE_CONSTANTS.VALID_PACKAGES.includes(newPackage)) {
        console.error('Invalid package type:', newPackage);
        return;
      }

      // If this is a paid package, check balance and deduct funds
      if (newPackage !== 'free') {
        const price = getPackagePrice(newPackage, period);
        
        // Try to deduct funds
        const result = await deductBalance(price);
        
        if (!result.success) {
          // If deduction failed, show error
          Alert.alert(
            t('package.insufficientFunds.title'),
            t('package.insufficientFunds.message'),
            [{ text: t('common.ok'), style: 'default' }]
          );
          return;
        }
        
        console.log('Balance deducted successfully:', price);
      }
      
      // Save only base package name without suffix
      await savePackageToStorage(newPackage);
      setCurrentPackage(newPackage);
      
      // If this is a paid package, create subscription
      if (newPackage !== 'free') {
        const now = new Date();
        const newSubscription: Subscription = {
          packageType: newPackage,
          startDate: now.toISOString(),
          autoRenew: true, // Enabled by default
          isActive: true,
          nextBillingDate: calculateNextBillingDate(now, period).toISOString(),
          period: period,
        };
        
        await saveSubscriptionToStorage(newSubscription);
        setSubscription(newSubscription);
        console.log('Subscription saved and state updated');
      } else {
        // If free package selected, cancel subscription
        await removeSubscriptionFromStorage();
        setSubscription(null);
        console.log('Subscription removed and state cleared');
      }
      
      console.log('Package update completed successfully!');

    } catch (error) {
      console.error('Error saving package:', error);
      Alert.alert(
        t('package.error.title'),
        t('package.error.message'),
        [{ text: t('common.ok'), style: 'default' }]
      );
      // On error, return to previous package
      setCurrentPackage(previousPackage);
    }
  };

  const extendSubscription = async (packageType: PackageType, period: 'month' | 'year', price: number) => {
    try {
      // First deduct funds
      const result = await deductBalance(price);
      
      if (!result.success) {
        Alert.alert(
          t('package.insufficientFunds.title'),
          t('package.insufficientFunds.message'),
          [{ text: t('common.ok'), style: 'default' }]
        );
        return;
      }
      
      console.log('Balance deducted for subscription extension:', price);
      
      if (subscription) {
        // Calculate activation date (next day after current subscription expires)
        const currentEndDate = new Date(subscription.nextBillingDate);
        const activationDate = new Date(currentEndDate.getTime() + 24 * 60 * 60 * 1000); // +1 day
        
        const updatedSubscription: Subscription = {
          ...subscription,
          pendingExtension: {
            packageType,
            period,
            activationDate: activationDate.toISOString(),
            price,
          },
        };
        
        await saveSubscriptionToStorage(updatedSubscription);
        setSubscription(updatedSubscription);
      }
    } catch (error) {
      console.error('Error extending subscription:', error);
      Alert.alert(
        t('package.error.title'),
        t('package.error.message'),
        [{ text: t('common.ok'), style: 'default' }]
      );
    }
  };

  const cancelSubscription = async () => {
    try {
      // Cancel subscription and switch to free package
      await removeSubscriptionFromStorage();
      setSubscription(null);
      
      // Set free package
      await savePackageToStorage('free');
      setCurrentPackage('free');
    } catch (error) {
      console.error('Error canceling subscription:', error);
    }
  };

  const toggleAutoRenew = async () => {
    try {
      if (subscription) {
        const updatedSubscription = {
          ...subscription,
          autoRenew: !subscription.autoRenew,
        };
        
        await saveSubscriptionToStorage(updatedSubscription);
        setSubscription(updatedSubscription);
      }
    } catch (error) {
      console.error('Error toggling auto renew:', error);
    }
  };

  const processAutoRenewal = async (): Promise<boolean> => {
    try {
      if (!subscription || !subscription.autoRenew || subscription.packageType === 'free') {
        return false;
      }

      const now = new Date();
      const nextBillingDate = new Date(subscription.nextBillingDate);
      
      // Check if subscription has expired
      if (now >= nextBillingDate) {
        const price = getPackagePrice(subscription.packageType, subscription.period);
        const packageName = t(`premium.packages.${subscription.packageType}`);
        
        // Deduct funds from balance
        const result = await deductBalance(price);
        
        if (result.success) {
          const updatedSubscription: Subscription = {
            ...subscription,
            nextBillingDate: calculateNextBillingDate(nextBillingDate, subscription.period).toISOString(),
          };
          
          await saveSubscriptionToStorage(updatedSubscription);
          setSubscription(updatedSubscription);
          
          // Show successful auto-renewal notification
          Alert.alert(
            t('premium.autoRenewal.success.title'),
            t('premium.autoRenewal.success.message', { packageName }),
            [{ text: t('common.ok') }]
          );
          
          return true;
        } else {
          // Insufficient funds - save pending auto-renewal info
          const updatedSubscription = {
            ...subscription,
            pendingAutoRenewal: {
              price,
              packageName: t(`premium.packages.${subscription.packageType}`),
              lastNotificationDate: new Date().toISOString()
            }
          };
          
          await saveSubscriptionToStorage(updatedSubscription);
          setSubscription(updatedSubscription);
          
          // Show notification to user
          Alert.alert(
            t('premium.autoRenewal.insufficientFunds.title'),
            t('premium.autoRenewal.insufficientFunds.message', { 
              packageName,
              price: price.toFixed(2)
            }),
            [
              {
                text: t('premium.autoRenewal.insufficientFunds.topUp'),
                onPress: () => {
                  // Navigation to balance top-up screen can be added here
                }
              },
              {
                text: t('common.ok'),
                style: 'cancel'
              }
            ]
          );
          
          return false;
        }
      }
      
      return false;
    } catch (error) {
      console.log('Error processing auto renewal:', error);
      return false;
    }
  };

  const checkPendingAutoRenewal = async (): Promise<boolean> => {
    try {
      // Load current data from AsyncStorage
      const currentSubscription = await loadSubscriptionFromStorage();
      if (!currentSubscription || !currentSubscription.pendingAutoRenewal) {
        return false;
      }

      const { price, packageName } = currentSubscription.pendingAutoRenewal;
      
      // Deduct funds from balance
      const result = await deductBalance(price);
      
      if (result.success) {
        const updatedSubscription: Subscription = {
          ...currentSubscription,
          nextBillingDate: calculateNextBillingDate(
            new Date(currentSubscription.nextBillingDate), 
            currentSubscription.period
          ).toISOString(),
          pendingAutoRenewal: undefined, // Remove pending
        };
        
        await saveSubscriptionToStorage(updatedSubscription);
        setSubscription(updatedSubscription);
        
        // Show successful auto-renewal notification
        Alert.alert(
          t('premium.autoRenewal.success.title'),
          t('premium.autoRenewal.success.message', { packageName }),
          [{ text: t('common.ok') }]
        );
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.log('Error checking pending auto renewal:', error);
      return false;
    }
  };

  const checkDailyNotification = async () => {
    try {
      if (!subscription || !subscription.pendingAutoRenewal) {
        return;
      }

      if (shouldShowNotification(subscription.pendingAutoRenewal.lastNotificationDate)) {
        const { price, packageName } = subscription.pendingAutoRenewal;
        
        // Update last notification date
        const updatedSubscription: Subscription = {
          ...subscription,
          pendingAutoRenewal: {
            ...subscription.pendingAutoRenewal,
            lastNotificationDate: new Date().toISOString(),
          }
        };
        
        await saveSubscriptionToStorage(updatedSubscription);
        setSubscription(updatedSubscription);

        // Show daily notification
        Alert.alert(
          t('premium.autoRenewal.dailyReminder.title'),
          t('premium.autoRenewal.dailyReminder.message', { 
            packageName,
            price: price.toFixed(2)
          }),
          [
            {
              text: t('premium.autoRenewal.dailyReminder.topUp'),
              onPress: () => {
                // Navigation to balance top-up screen can be added here
              }
            },
            {
              text: t('premium.autoRenewal.dailyReminder.remindLater'),
              style: 'cancel'
            }
          ]
        );
      }
    } catch (error) {
      console.log('Error checking daily notification:', error);
    }
  };

  const getPackageIcon = (packageType: PackageType = currentPackage) => {
    return PACKAGE_ICONS[packageType] || 'person';
  };

  const getPackageColor = (packageType: PackageType = currentPackage) => {
    return PACKAGE_COLORS[packageType] || '#666666';
  };

  const getPackagePrice = (packageType: PackageType, period: 'month' | 'year' = 'month') => {
    const prices = period === 'year' ? PACKAGE_PRICES.YEARLY : PACKAGE_PRICES.MONTHLY;
    return prices[packageType] || 0;
  };

  const value: PackageContextType = {
    currentPackage,
    subscription,
    updatePackage,
    extendSubscription,
    cancelSubscription,
    toggleAutoRenew,
    processAutoRenewal,
    checkPendingAutoRenewal,
    getPackageIcon,
    getPackageColor,
    getPackagePrice,
  };

  return (
    <PackageContext.Provider value={value}>
      {children}
    </PackageContext.Provider>
  );
};

export const usePackage = (): PackageContextType => {
  const context = useContext(PackageContext);
  if (context === undefined) {
    throw new Error('usePackage must be used within a PackageProvider');
  }
  return context;
};
