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
  const { deductBalance } = useBalance();


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
      
      if (storedPackage) {
        // Обрабатываем пакеты с суффиксами (_month, _year)
        const basePackage = storedPackage.replace(/_month$|_year$/, '');
        
        if (['free', 'plus', 'premium', 'premiumPlus'].includes(basePackage)) {
          setCurrentPackage(basePackage as PackageType);
          
          // Если сохраненный пакет содержит суффикс, исправляем его
          if (storedPackage !== basePackage) {
            await AsyncStorage.setItem(PACKAGE_KEY, basePackage);
          }
        } else {
          setCurrentPackage('free');
          // Очищаем неправильные данные
          await AsyncStorage.removeItem(PACKAGE_KEY);
        }
      } else {
        setCurrentPackage('free');
      }
    } catch (error) {
      console.error('❌ Error loading package:', error);
    }
  };

  const loadSubscription = async () => {
    try {
      const storedSubscription = await AsyncStorage.getItem(SUBSCRIPTION_KEY);
      
      if (storedSubscription) {
        const parsedSubscription = JSON.parse(storedSubscription);
        
        // Исправляем формат packageType если он содержит суффикс
        if (parsedSubscription.packageType && parsedSubscription.packageType.includes('_')) {
          const basePackageType = parsedSubscription.packageType.replace(/_month$|_year$/, '');
          if (['free', 'plus', 'premium', 'premiumPlus'].includes(basePackageType)) {
            parsedSubscription.packageType = basePackageType;
            // Сохраняем исправленную подписку
            await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(parsedSubscription));
          }
        }
        
        setSubscription(parsedSubscription);
      } else {
      }
    } catch (error) {
      console.error('❌ Error loading subscription:', error);
    }
  };

  const updatePackage = async (newPackage: PackageType, period: 'month' | 'year' = 'month') => {
    // Сохраняем текущий пакет для отката при ошибке
    const previousPackage = currentPackage;
    
    try {
      // Проверяем валидность пакета
      if (!['free', 'plus', 'premium', 'premiumPlus'].includes(newPackage)) {
        console.error('❌ Invalid package type:', newPackage);
        return; // Прерываем обновление пакета
      }

      // Если это платный пакет, проверяем баланс и списываем средства
      if (newPackage !== 'free') {
        const price = getPackagePrice(newPackage, period);
        
        // Пытаемся списать средства
        const success = await deductBalance(price, `${newPackage} package purchase`, newPackage);
        
        if (!success) {
          // Если списание не удалось, показываем ошибку
          Alert.alert(
            t('package.insufficientFunds.title'),
            t('package.insufficientFunds.message'),
            [{ text: t('common.ok'), style: 'default' }]
          );
          return; // Прерываем обновление пакета
        }
        
        console.log('✅ Balance deducted successfully:', price);
      }
      
      // Сохраняем только базовое название пакета без суффикса
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
        console.log('✅ Subscription saved to AsyncStorage:', newSubscription);
        
        setSubscription(newSubscription);
        console.log('✅ Subscription state updated');
      } else {
        // Если выбран бесплатный пакет, отменяем подписку
        await AsyncStorage.removeItem(SUBSCRIPTION_KEY);
        console.log('✅ Subscription removed from AsyncStorage');
        
        setSubscription(null);
        console.log('✅ Subscription state cleared');
      }
      
      console.log('🎉 Package update completed successfully!');

    } catch (error) {
      console.error('❌ Error saving package:', error);
      Alert.alert(
        t('package.error.title'),
        t('package.error.message'),
        [{ text: t('common.ok'), style: 'default' }]
      );
      // При ошибке возвращаемся к предыдущему пакету
      setCurrentPackage(previousPackage);
      return;
    }
  };

  const extendSubscription = async (packageType: PackageType, period: 'month' | 'year', price: number) => {
    try {
      // Сначала списываем средства
      const success = await deductBalance(price, `${packageType} subscription extension`, packageType);
      
      if (!success) {
        // Если списание не удалось, показываем ошибку
        Alert.alert(
          t('package.insufficientFunds.title'),
          t('package.insufficientFunds.message'),
          [{ text: t('common.ok'), style: 'default' }]
        );
        return; // Прерываем продление подписки
      }
      
      console.log('✅ Balance deducted for subscription extension:', price);
      
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
      // Отменяем подписку и переходим на бесплатный пакет
      await AsyncStorage.removeItem(SUBSCRIPTION_KEY);
      setSubscription(null);
      
      // Устанавливаем бесплатный пакет
      await AsyncStorage.setItem(PACKAGE_KEY, 'free');
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
        
        await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(updatedSubscription));
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
      
      // Проверяем, истекла ли подписка
      if (now >= nextBillingDate) {
        const price = getPackagePrice(subscription.packageType, subscription.period);
        
        // Получаем название пакета для истории транзакций
        const packageName = t(`premium.packages.${subscription.packageType}`);
        
        // Списываем средства с баланса
        const success = await deductBalance(
          price, 
          t('premium.autoRenewal.transactionDescription', { packageName }), 
          subscription.packageType
        );
        
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
      // Загружаем актуальные данные из AsyncStorage
      const storedSubscription = await AsyncStorage.getItem(SUBSCRIPTION_KEY);
      if (!storedSubscription) {
        return false;
      }
      
      const currentSubscription = JSON.parse(storedSubscription);
      if (!currentSubscription || !currentSubscription.pendingAutoRenewal) {
        return false;
      }

      const { price, packageName } = currentSubscription.pendingAutoRenewal;
      
      // Списываем средства с баланса
      const success = await deductBalance(
        price, 
        t('premium.autoRenewal.transactionDescription', { packageName }), 
        currentSubscription.packageType
      );
      
      if (success) {
        // Рассчитываем новую дату биллинга
        const daysInPeriod = currentSubscription.period === 'year' ? 365 : 30;
        const nextBillingDate = new Date(currentSubscription.nextBillingDate);
        const newNextBillingDate = new Date(nextBillingDate.getTime() + daysInPeriod * 24 * 60 * 60 * 1000);
        
        const updatedSubscription: Subscription = {
          ...currentSubscription,
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
      case 'free': return 'person';
      case 'plus': return 'add-circle';
      case 'premium': return 'diamond';
      case 'premiumPlus': return 'star';
      default: return 'person';
    }
  };

  const getPackageColor = (packageType: PackageType = currentPackage) => {
    switch (packageType) {
      case 'free': return '#666666';
      case 'plus': return '#0066CC';
      case 'premium': return '#FFD700';
      case 'premiumPlus': return '#FF6B35';
      default: return '#666666';
    }
  };

  const getPackagePrice = (packageType: PackageType, period: 'month' | 'year' = 'month') => {
    const monthlyPrices = {
      free: 0,
      plus: 99,
      premium: 199,
      premiumPlus: 299,
    };
    
    const yearlyPrices = {
      free: 0,
      plus: 999,
      premium: 1999,
      premiumPlus: 2999,
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