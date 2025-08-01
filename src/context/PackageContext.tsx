import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBalance } from './BalanceContext';
import { useI18n } from '../hooks/useI18n';
import { Alert } from 'react-native';

export type PackageType = 'free' | 'plus' | 'premium' | 'premiumPlus';

interface Subscription {
  packageType: PackageType;
  startDate: string;
  autoRenew: boolean;
  isActive: boolean;
  nextBillingDate: string;
  period: 'month' | 'year';
  pendingExtension?: {
    packageType: PackageType;
    period: 'month' | 'year';
    activationDate: string;
    price: number;
  };
  pendingAutoRenewal?: {
    price: number;
    packageName: string;
    lastNotificationDate?: string; // Дата последнего уведомления
  };
}

interface PackageContextType {
  currentPackage: PackageType;
  subscription: Subscription | null;
  updatePackage: (newPackage: PackageType, period?: 'month' | 'year') => Promise<void>;
  extendSubscription: (packageType: PackageType, period: 'month' | 'year', price: number) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  toggleAutoRenew: () => Promise<void>;
  processAutoRenewal: () => Promise<boolean>;
  checkPendingAutoRenewal: () => Promise<boolean>;
  getPackageIcon: (packageType?: PackageType) => string;
  getPackageColor: (packageType?: PackageType) => string;
  getPackagePrice: (packageType: PackageType, period?: 'month' | 'year') => number;
}

const PackageContext = createContext<PackageContextType | undefined>(undefined);

const PACKAGE_KEY = 'user_package';
const SUBSCRIPTION_KEY = 'user_subscription';

export const PackageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPackage, setCurrentPackage] = useState<PackageType>('free');
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const { t } = useI18n();


  // Загружаем сохраненный пакет и подписку при инициализации
  useEffect(() => {
    loadPackage();
    loadSubscription();
  }, []);

  // Автоматическое слежение за датой истечения подписки
  useEffect(() => {
    if (!subscription || subscription.packageType === 'free') {
      return;
    }

    // Проверяем сразу при загрузке
    processAutoRenewal();
    checkDailyNotification();

    // Устанавливаем интервал для проверки каждые 6 часов
    const interval = setInterval(() => {
      processAutoRenewal();
      checkDailyNotification();
    }, 6 * 60 * 60 * 1000); // 6 часов

    return () => clearInterval(interval);
  }, [subscription]);

  const loadPackage = async () => {
    try {
      const storedPackage = await AsyncStorage.getItem(PACKAGE_KEY);
      if (storedPackage && ['free', 'plus', 'premium', 'premiumPlus'].includes(storedPackage)) {
        setCurrentPackage(storedPackage as PackageType);
      }
    } catch (error) {
      console.log('Error loading package:', error);
    }
  };

  const loadSubscription = async () => {
    try {
      const storedSubscription = await AsyncStorage.getItem(SUBSCRIPTION_KEY);
      if (storedSubscription) {
        setSubscription(JSON.parse(storedSubscription));
      }
    } catch (error) {
      console.log('Error loading subscription:', error);
    }
  };

  const updatePackage = async (newPackage: PackageType, period: 'month' | 'year' = 'month') => {
    try {
      await AsyncStorage.setItem(PACKAGE_KEY, newPackage);
      setCurrentPackage(newPackage);
      
      // Если это платный пакет, создаем подписку
      if (newPackage !== 'free') {
        const now = new Date();
        const daysInPeriod = period === 'year' ? 365 : 30;
        const nextBilling = new Date(now.getTime() + daysInPeriod * 24 * 60 * 60 * 1000);
        
        const newSubscription: Subscription = {
          packageType: newPackage,
          startDate: now.toISOString(),
          autoRenew: true, // По умолчанию включено
          isActive: true,
          nextBillingDate: nextBilling.toISOString(),
          period: period,
        };
        
        await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(newSubscription));
        setSubscription(newSubscription);
      } else {
        // Если выбран бесплатный пакет, отменяем подписку
        await AsyncStorage.removeItem(SUBSCRIPTION_KEY);
        setSubscription(null);
      }
      
      // Принудительно обновляем UI

    } catch (error) {
      console.log('Error saving package:', error);
    }
  };

  const extendSubscription = async (packageType: PackageType, period: 'month' | 'year', price: number) => {
    try {
      if (subscription) {
        // Рассчитываем дату активации (следующий день после истечения текущей подписки)
        const currentEndDate = new Date(subscription.nextBillingDate);
        const activationDate = new Date(currentEndDate.getTime() + 24 * 60 * 60 * 1000); // +1 день
        
        const updatedSubscription: Subscription = {
          ...subscription,
          pendingExtension: {
            packageType,
            period,
            activationDate: activationDate.toISOString(),
            price,
          },
        };
        
        await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(updatedSubscription));
        setSubscription(updatedSubscription);
      }
    } catch (error) {
      console.log('Error extending subscription:', error);
    }
  };

  const cancelSubscription = async () => {
    try {
      // Отменяем подписку и переходим на бесплатный пакет
      await AsyncStorage.removeItem(SUBSCRIPTION_KEY);
      setSubscription(null);
      
      // Устанавливаем бесплатный пакет
      await AsyncStorage.setItem(PACKAGE_KEY, 'free');
      setCurrentPackage('free');
    } catch (error) {
      console.log('Error canceling subscription:', error);
    }
  };

  const toggleAutoRenew = async () => {
    try {
      if (subscription) {
        const updatedSubscription = {
          ...subscription,
          autoRenew: !subscription.autoRenew,
        };
        
        await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(updatedSubscription));
        setSubscription(updatedSubscription);
      }
    } catch (error) {
      console.log('Error toggling auto renew:', error);
    }
  };

  const processAutoRenewal = async (): Promise<boolean> => {
    try {
      if (!subscription || !subscription.autoRenew || subscription.packageType === 'free') {
        return false;
      }

      const now = new Date();
      const nextBillingDate = new Date(subscription.nextBillingDate);
      
      // Проверяем, истекла ли подписка
      if (now >= nextBillingDate) {
        const price = getPackagePrice(subscription.packageType, subscription.period);
        
        // Получаем название пакета для истории транзакций
        const packageName = t(`premium.packages.${subscription.packageType}`);
        
        // Списываем средства с баланса - временно отключено для избежания циклической зависимости
        // const success = await deductBalance(
        //   price, 
        //   t('premium.autoRenewal.transactionDescription', { packageName }), 
        //   subscription.packageType
        // );
        const success = false; // Временно всегда false
        
        if (success) {
  
          
          // Рассчитываем новую дату биллинга
          const daysInPeriod = subscription.period === 'year' ? 365 : 30;
          const newNextBillingDate = new Date(nextBillingDate.getTime() + daysInPeriod * 24 * 60 * 60 * 1000);
          
          const updatedSubscription: Subscription = {
            ...subscription,
            nextBillingDate: newNextBillingDate.toISOString(),
          };
          
          await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(updatedSubscription));
          setSubscription(updatedSubscription);
          
          // Показываем уведомление об успешном автообновлении
          Alert.alert(
            t('premium.autoRenewal.success.title'),
            t('premium.autoRenewal.success.message', { 
              packageName: t(`premium.packages.${subscription.packageType}`)
            }),
            [{ text: t('common.ok') }]
          );
          
          return true;
        } else {
          // Недостаточно средств - сохраняем информацию о pending автообновлении
          const updatedSubscription = {
            ...subscription,
            pendingAutoRenewal: {
              price,
              packageName: t(`premium.packages.${subscription.packageType}`),
              lastNotificationDate: new Date().toISOString() // Сохраняем дату первого уведомления
            }
          };
          
          await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(updatedSubscription));
          setSubscription(updatedSubscription);
          
          // Показываем уведомление пользователю
          Alert.alert(
            t('premium.autoRenewal.insufficientFunds.title'),
            t('premium.autoRenewal.insufficientFunds.message', { 
              packageName: t(`premium.packages.${subscription.packageType}`),
              price: price.toFixed(2)
            }),
            [
              {
                text: t('premium.autoRenewal.insufficientFunds.topUp'),
                onPress: () => {
                  // Здесь можно добавить навигацию к экрану пополнения баланса
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

  // Проверка pending автообновления при пополнении баланса
  const checkPendingAutoRenewal = async (): Promise<boolean> => {
    try {
      if (!subscription || !subscription.pendingAutoRenewal) {
        return false;
      }

      const { price, packageName } = subscription.pendingAutoRenewal;
      
      // Списываем средства с баланса - временно отключено для избежания циклической зависимости
      // const success = await deductBalance(
      //   price, 
      //   t('premium.autoRenewal.transactionDescription', { packageName }), 
      //   subscription.packageType
      // );
      const success = false; // Временно всегда false
      
      if (success) {
        // Рассчитываем новую дату биллинга
        const daysInPeriod = subscription.period === 'year' ? 365 : 30;
        const nextBillingDate = new Date(subscription.nextBillingDate);
        const newNextBillingDate = new Date(nextBillingDate.getTime() + daysInPeriod * 24 * 60 * 60 * 1000);
        
        const updatedSubscription: Subscription = {
          ...subscription,
          nextBillingDate: newNextBillingDate.toISOString(),
          pendingAutoRenewal: undefined, // Убираем pending
        };
        
        await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(updatedSubscription));
        setSubscription(updatedSubscription);
        
        // Показываем уведомление об успешном автообновлении
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

  // Проверка ежедневных уведомлений о недостатке средств
  const checkDailyNotification = async () => {
    try {
      if (!subscription || !subscription.pendingAutoRenewal) {
        return;
      }

      const now = new Date();
      const lastNotification = subscription.pendingAutoRenewal.lastNotificationDate 
        ? new Date(subscription.pendingAutoRenewal.lastNotificationDate)
        : null;

      // Проверяем, прошло ли 24 часа с последнего уведомления
      const shouldShowNotification = !lastNotification || 
        (now.getTime() - lastNotification.getTime()) >= 24 * 60 * 60 * 1000;

      if (shouldShowNotification) {
        const { price, packageName } = subscription.pendingAutoRenewal;
        
        // Обновляем дату последнего уведомления
        const updatedSubscription: Subscription = {
          ...subscription,
          pendingAutoRenewal: {
            ...subscription.pendingAutoRenewal,
            lastNotificationDate: now.toISOString(),
          }
        };
        
        await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(updatedSubscription));
        setSubscription(updatedSubscription);

        // Показываем ежедневное уведомление
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
                // Здесь можно добавить навигацию к экрану пополнения баланса
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
    switch (packageType) {
      case 'free': return 'leaf';
      case 'plus': return 'shield';
      case 'premium': return 'heart';
      case 'premiumPlus': return 'diamond';
      default: return 'leaf';
    }
  };

  const getPackageColor = (packageType: PackageType = currentPackage) => {
    switch (packageType) {
      case 'free': return '#10B981';
      case 'plus': return '#3B82F6';
      case 'premium': return '#8B5CF6';
      case 'premiumPlus': return '#F59E0B';
      default: return '#10B981';
    }
  };

  const getPackagePrice = (packageType: PackageType, period: 'month' | 'year' = 'month') => {
    const monthlyPrices = {
      free: 0,
      plus: 6.99,
      premium: 14.99,
      premiumPlus: 29.99,
    };
    
    const yearlyPrices = {
      free: 0,
      plus: 62.90,
      premium: 134.90,
      premiumPlus: 269.90,
    };
    
    const prices = period === 'year' ? yearlyPrices : monthlyPrices;
    
    switch (packageType) {
      case 'free': return prices.free;
      case 'plus': return prices.plus;
      case 'premium': return prices.premium;
      case 'premiumPlus': return prices.premiumPlus;
      default: return 0;
    }
  };

  return (
    <PackageContext.Provider value={{
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
    }}>
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