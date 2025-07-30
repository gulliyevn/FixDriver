import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type PackageType = 'free' | 'basic' | 'premium' | 'family';

interface PackageContextType {
  currentPackage: PackageType;
  updatePackage: (newPackage: PackageType) => Promise<void>;
  getPackageIcon: (packageType?: PackageType) => string;
  getPackageColor: (packageType?: PackageType) => string;
}

const PackageContext = createContext<PackageContextType | undefined>(undefined);

const PACKAGE_KEY = 'user_package';

export const PackageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPackage, setCurrentPackage] = useState<PackageType>('free');

  // Загружаем сохраненный пакет при инициализации
  useEffect(() => {
    loadPackage();
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

  const updatePackage = async (newPackage: PackageType) => {
    try {
      await AsyncStorage.setItem(PACKAGE_KEY, newPackage);
      setCurrentPackage(newPackage);
    } catch (error) {
      console.log('Error saving package:', error);
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

  return (
    <PackageContext.Provider value={{
      currentPackage,
      updatePackage,
      getPackageIcon,
      getPackageColor,
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