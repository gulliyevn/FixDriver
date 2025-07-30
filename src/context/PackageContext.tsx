import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type PackageType = 'free' | 'basic' | 'premium' | 'family';

interface Subscription {
  packageType: PackageType;
  startDate: string;
  autoRenew: boolean;
  isActive: boolean;
  nextBillingDate: string;
}

interface PackageContextType {
  currentPackage: PackageType;
  subscription: Subscription | null;
  updatePackage: (newPackage: PackageType) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  toggleAutoRenew: () => Promise<void>;
  getPackageIcon: (packageType?: PackageType) => string;
  getPackageColor: (packageType?: PackageType) => string;
  getPackagePrice: (packageType: PackageType) => number;
}

const PackageContext = createContext<PackageContextType | undefined>(undefined);

const PACKAGE_KEY = 'user_package';
const SUBSCRIPTION_KEY = 'user_subscription';

export const PackageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPackage, setCurrentPackage] = useState<PackageType>('free');
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  // Загружаем сохраненный пакет и подписку при инициализации
  useEffect(() => {
    loadPackage();
    loadSubscription();
  }, []);

  const loadPackage = async () => {
    try {
      const storedPackage = await AsyncStorage.getItem(PACKAGE_KEY);
      if (storedPackage && ['free', 'basic', 'premium', 'family'].includes(storedPackage)) {
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

  const updatePackage = async (newPackage: PackageType) => {
    try {
      await AsyncStorage.setItem(PACKAGE_KEY, newPackage);
      setCurrentPackage(newPackage);
      
      // Если это платный пакет, создаем подписку
      if (newPackage !== 'free') {
        const now = new Date();
        const nextBilling = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 дней
        
        const newSubscription: Subscription = {
          packageType: newPackage,
          startDate: now.toISOString(),
          autoRenew: true, // По умолчанию включено
          isActive: true,
          nextBillingDate: nextBilling.toISOString(),
        };
        
        await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(newSubscription));
        setSubscription(newSubscription);
      } else {
        // Если выбран бесплатный пакет, отменяем подписку
        await AsyncStorage.removeItem(SUBSCRIPTION_KEY);
        setSubscription(null);
      }
    } catch (error) {
      console.log('Error saving package:', error);
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

  const getPackageIcon = (packageType: PackageType = currentPackage) => {
    switch (packageType) {
      case 'free': return 'leaf';
      case 'basic': return 'shield';
      case 'premium': return 'heart';
      case 'family': return 'diamond';
      default: return 'leaf';
    }
  };

  const getPackageColor = (packageType: PackageType = currentPackage) => {
    switch (packageType) {
      case 'free': return '#10B981';
      case 'basic': return '#3B82F6';
      case 'premium': return '#8B5CF6';
      case 'family': return '#F59E0B';
      default: return '#10B981';
    }
  };

  const getPackagePrice = (packageType: PackageType) => {
    switch (packageType) {
      case 'free': return 0;
      case 'basic': return 6.99;
      case 'premium': return 14.99;
      case 'family': return 29.99;
      default: return 0;
    }
  };

  return (
    <PackageContext.Provider value={{
      currentPackage,
      subscription,
      updatePackage,
      cancelSubscription,
      toggleAutoRenew,
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