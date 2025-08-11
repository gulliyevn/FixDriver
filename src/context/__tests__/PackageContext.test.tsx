import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { PackageProvider, usePackage } from '../PackageContext';

import { LanguageProvider } from '../LanguageContext';
import { useBalance } from '../../hooks/useBalance';

// Мокаем зависимости
jest.mock('../../hooks/useBalance', () => ({
  useBalance: jest.fn(() => ({
    balance: 1000,
    transactions: [],
    topUpBalance: jest.fn(),
    deductBalance: jest.fn().mockResolvedValue(true),
    addTransaction: jest.fn(),
  })),
}));
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
}));

const mockUseBalance = useBalance as jest.MockedFunction<typeof useBalance>;

const renderWithProviders = (hook: () => any) => {
  return renderHook(hook, {
    wrapper: ({ children }) => (
      <LanguageProvider>
        <PackageProvider>
          {children}
        </PackageProvider>
      </LanguageProvider>
    ),
  });
};

describe('PackageContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Package Management', () => {
    it('should initialize with free package by default', () => {
      const { result } = renderWithProviders(() => usePackage());

      expect(result.current.currentPackage).toBe('free');
      expect(result.current.subscription).toBeNull();
    });

    it('should update package correctly', async () => {
      const { result } = renderWithProviders(() => usePackage());
      
      console.log('🔍 usePackage result:', result.current);
      console.log('🔍 updatePackage function:', typeof result.current.updatePackage);

      await act(async () => {
        await result.current.updatePackage('premium', 'month');
      });

      expect(result.current.currentPackage).toBe('premium');
      expect(result.current.subscription).toBeTruthy();
      expect(result.current.subscription?.packageType).toBe('premium');
      expect(result.current.subscription?.period).toBe('month');
    });

    it('should handle package extension', async () => {
      const { result } = renderWithProviders(() => usePackage());

      // Сначала обновляем пакет
      await act(async () => {
        await result.current.updatePackage('premium', 'month');
      });

      // Затем продлеваем
      await act(async () => {
        await result.current.extendSubscription('premiumPlus', 'year', 299);
      });

      expect(result.current.subscription?.pendingExtension).toBeTruthy();
      expect(result.current.subscription?.pendingExtension?.packageType).toBe('premiumPlus');
      expect(result.current.subscription?.pendingExtension?.period).toBe('year');
      expect(result.current.subscription?.pendingExtension?.price).toBe(299);
    });

    it('should cancel subscription correctly', async () => {
      const { result } = renderWithProviders(() => usePackage());

      // Сначала обновляем пакет
      await act(async () => {
        await result.current.updatePackage('premium', 'month');
      });

      expect(result.current.currentPackage).toBe('premium');

      // Отменяем подписку
      await act(async () => {
        await result.current.cancelSubscription();
      });

      expect(result.current.currentPackage).toBe('free');
      expect(result.current.subscription).toBeNull();
    });

    it('should toggle auto renew', async () => {
      const { result } = renderWithProviders(() => usePackage());

      // Сначала обновляем пакет
      await act(async () => {
        await result.current.updatePackage('premium', 'month');
      });

      expect(result.current.subscription?.autoRenew).toBe(true);

      // Отключаем автообновление
      await act(async () => {
        await result.current.toggleAutoRenew();
      });

      expect(result.current.subscription?.autoRenew).toBe(false);
    });
  });

  describe('Package Pricing', () => {
    it('should return correct prices for different packages', () => {
      const { result } = renderWithProviders(() => usePackage());

      expect(result.current.getPackagePrice('free')).toBe(0);
      expect(result.current.getPackagePrice('plus', 'month')).toBe(99);
      expect(result.current.getPackagePrice('plus', 'year')).toBe(999);
      expect(result.current.getPackagePrice('premium', 'month')).toBe(199);
      expect(result.current.getPackagePrice('premium', 'year')).toBe(1999);
      expect(result.current.getPackagePrice('premiumPlus', 'month')).toBe(299);
      expect(result.current.getPackagePrice('premiumPlus', 'year')).toBe(2999);
    });

    it('should return correct icons for different packages', () => {
      const { result } = renderWithProviders(() => usePackage());

      expect(result.current.getPackageIcon('free')).toBe('person');
      expect(result.current.getPackageIcon('plus')).toBe('add-circle');
      expect(result.current.getPackageIcon('premium')).toBe('diamond');
      expect(result.current.getPackageIcon('premiumPlus')).toBe('star');
    });

    it('should return correct colors for different packages', () => {
      const { result } = renderWithProviders(() => usePackage());

      expect(result.current.getPackageColor('free')).toBe('#666666');
      expect(result.current.getPackageColor('plus')).toBe('#0066CC');
      expect(result.current.getPackageColor('premium')).toBe('#FFD700');
      expect(result.current.getPackageColor('premiumPlus')).toBe('#FF6B35');
    });
  });

  describe('Auto Renewal', () => {
    it('should process auto renewal correctly', async () => {
      const { result } = renderWithProviders(() => usePackage());

      // Создаем подписку с истекшей датой
      await act(async () => {
        await result.current.updatePackage('premium', 'month');
      });

      // Устанавливаем прошедшую дату
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      
      await act(async () => {
        // Мокаем дату истечения
        if (result.current.subscription) {
          result.current.subscription.nextBillingDate = pastDate.toISOString();
        }
      });

      // Проверяем автообновление
      const renewed = await act(async () => {
        return await result.current.processAutoRenewal();
      });

      expect(renewed).toBe(true);
    });

    it('should not auto renew free package', async () => {
      const { result } = renderWithProviders(() => usePackage());

      const renewed = await act(async () => {
        return await result.current.processAutoRenewal();
      });

      expect(renewed).toBe(false);
    });

    it('should check pending auto renewal', async () => {
      const { result } = renderWithProviders(() => usePackage());

      // Создаем подписку с pending auto renewal
      await act(async () => {
        await result.current.updatePackage('premium', 'month');
      });

      // Создаем pending auto renewal через AsyncStorage
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      const subscription = result.current.subscription;
      if (subscription) {
        const updatedSubscription = {
          ...subscription,
          pendingAutoRenewal: {
            price: 199,
            packageName: 'Premium',
            lastNotificationDate: new Date().toISOString(),
          }
        };
        
        await AsyncStorage.setItem('user_subscription', JSON.stringify(updatedSubscription));
      }

      // Проверяем, что pending auto renewal существует
      const hasPending = await act(async () => {
        return await result.current.checkPendingAutoRenewal();
      });

            // Простая проверка - если есть subscription с pendingAutoRenewal, то должно быть true
      expect(hasPending).toBe(true);
    });
  });

  describe('Integration with Balance', () => {
    it('should deduct balance when purchasing package', async () => {
      const mockDeductBalance = jest.fn().mockResolvedValue(true);
      
      // Обновляем мок для этого теста
      mockUseBalance.mockReturnValue({
        balance: 1000,
        transactions: [],
        topUpBalance: jest.fn(),
        deductBalance: mockDeductBalance,
        addTransaction: jest.fn(),
      });

      const { result } = renderWithProviders(() => usePackage());

      await act(async () => {
        await result.current.updatePackage('premium', 'month');
      });

      expect(mockDeductBalance).toHaveBeenCalledWith(199, 'premium package purchase', 'premium');
    });

    // Простой тест для проверки
    it('SIMPLE: should check if premium package triggers balance deduction', async () => {
      const mockDeductBalance = jest.fn().mockResolvedValue(true);
      
      // Обновляем глобальный мок
      mockUseBalance.mockReturnValue({
        balance: 1000,
        transactions: [],
        topUpBalance: jest.fn(),
        deductBalance: mockDeductBalance,
        addTransaction: jest.fn(),
      });

      const { result } = renderWithProviders(() => usePackage());

      // Проверяем, что пакет изначально free
      expect(result.current.currentPackage).toBe('free');

      // Обновляем на premium
      await act(async () => {
        await result.current.updatePackage('premium', 'month');
      });

      // Проверяем, что пакет изменился
      expect(result.current.currentPackage).toBe('premium');
      
      // Проверяем, что deductBalance был вызван
      expect(mockDeductBalance).toHaveBeenCalled();
    });

    // Отладочный тест
    it('DEBUG: should check if deductBalance is called', async () => {
      console.log('🔍 Starting debug test...');
      
      const mockDeductBalance = jest.fn().mockResolvedValue(true);
      console.log('🔍 Mock deductBalance created:', mockDeductBalance);
      
      // Обновляем мок для этого теста
      mockUseBalance.mockReturnValue({
        balance: 1000,
        transactions: [],
        topUpBalance: jest.fn(),
        deductBalance: mockDeductBalance,
        addTransaction: jest.fn(),
      });

      const { result } = renderWithProviders(() => usePackage());
      console.log('🔍 Package context rendered');

      await act(async () => {
        console.log('🔍 Calling updatePackage...');
        await result.current.updatePackage('premium', 'month');
        console.log('🔍 updatePackage completed');
      });

      console.log('🔍 Mock calls:', mockDeductBalance.mock.calls);
      console.log('🔍 Mock call count:', mockDeductBalance.mock.calls.length);
      
      expect(mockDeductBalance).toHaveBeenCalled();
    });

    it('should fail package purchase if insufficient balance', async () => {
      const mockDeductBalance = jest.fn().mockResolvedValue(false);
      
      // Обновляем мок для этого теста
      mockUseBalance.mockReturnValue({
        balance: 50, // Недостаточно средств
        transactions: [],
        topUpBalance: jest.fn(),
        deductBalance: mockDeductBalance,
        addTransaction: jest.fn(),
      });

      const { result } = renderWithProviders(() => usePackage());

      await act(async () => {
        await result.current.updatePackage('premium', 'month');
      });

      expect(mockDeductBalance).toHaveBeenCalledWith(199, 'premium package purchase', 'premium');
      // Пакет должен остаться free, так как покупка не удалась
      expect(result.current.currentPackage).toBe('free');
    });

    it('should handle balance errors gracefully', async () => {
      const mockDeductBalance = jest.fn().mockRejectedValue(new Error('Balance error'));
      
      // Обновляем мок для этого теста
      mockUseBalance.mockReturnValue({
        balance: 1000,
        transactions: [],
        topUpBalance: jest.fn(),
        deductBalance: mockDeductBalance,
        addTransaction: jest.fn(),
      });

      const { result } = renderWithProviders(() => usePackage());

      await act(async () => {
        await result.current.updatePackage('premium', 'month');
      });

      expect(mockDeductBalance).toHaveBeenCalled();
      // Пакет должен остаться free при ошибке
      expect(result.current.currentPackage).toBe('free');
    });
  });

  describe('Data Persistence', () => {
    it('should load saved package on initialization', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      
      // Мокаем сохраненный пакет
      AsyncStorage.getItem.mockImplementation((key: string) => {
        if (key === 'user_package') return Promise.resolve('premium');
        if (key === 'user_subscription') return Promise.resolve(JSON.stringify({
          packageType: 'premium',
          startDate: new Date().toISOString(),
          autoRenew: true,
          isActive: true,
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          period: 'month'
        }));
        return Promise.resolve(null);
      });

      const { result } = renderWithProviders(() => usePackage());

      // Ждем загрузки данных
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.currentPackage).toBe('premium');
      expect(result.current.subscription).toBeTruthy();
    });

    it('should save package changes to storage', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      const mockSetItem = jest.fn().mockResolvedValue(undefined);
      
      // Сбрасываем мок перед тестом
      AsyncStorage.setItem.mockClear();
      AsyncStorage.setItem.mockImplementation(mockSetItem);

      const { result } = renderWithProviders(() => usePackage());

      await act(async () => {
        await result.current.updatePackage('premium', 'month');
      });

      expect(mockSetItem).toHaveBeenCalledWith('user_package', 'premium');
      expect(mockSetItem).toHaveBeenCalledWith('user_subscription', expect.any(String));
    });
  });

  describe('Error Handling', () => {
    it('should handle storage errors gracefully', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.setItem.mockRejectedValue(new Error('Storage error'));

      const { result } = renderWithProviders(() => usePackage());

      await act(async () => {
        await result.current.updatePackage('premium', 'month');
      });

      // Должен остаться в состоянии free при ошибке
      expect(result.current.currentPackage).toBe('free');
    });

    it('should handle invalid package types', async () => {
      const { result } = renderWithProviders(() => usePackage());

      // Сначала обновляем на валидный пакет
      await act(async () => {
        await result.current.updatePackage('premium', 'month');
      });

      expect(result.current.currentPackage).toBe('premium');

      // Затем пытаемся обновить на невалидный пакет
      await act(async () => {
        // @ts-ignore - тестируем невалидный тип
        await result.current.updatePackage('invalid_package', 'month');
      });

      // Должен остаться в состоянии premium (не изменился)
      expect(result.current.currentPackage).toBe('premium');
    });
  });

  describe('Role-Specific Behavior', () => {
    it('should work correctly with client balance hook', async () => {
      const mockClientBalance = {
        balance: 1000,
        transactions: [],
        topUpBalance: jest.fn(),
        deductBalance: jest.fn().mockResolvedValue(true),
        addTransaction: jest.fn(),
      };

      mockUseBalance.mockReturnValue(mockClientBalance);

      const { result } = renderWithProviders(() => usePackage());

      await act(async () => {
        await result.current.updatePackage('premium', 'month');
      });

      expect(mockClientBalance.deductBalance).toHaveBeenCalledWith(199, 'premium package purchase', 'premium');
    });

    it('should work correctly with driver balance hook', async () => {
      const mockDriverBalance = {
        balance: 2500,
        transactions: [],
        topUpBalance: jest.fn(),
        deductBalance: jest.fn().mockResolvedValue(true),
        addTransaction: jest.fn(),
      };

      mockUseBalance.mockReturnValue(mockDriverBalance);

      const { result } = renderWithProviders(() => usePackage());

      await act(async () => {
        await result.current.updatePackage('premium', 'month');
      });

      // Водители тоже могут покупать пакеты
      expect(mockDriverBalance.deductBalance).toHaveBeenCalledWith(199, 'premium package purchase', 'premium');
    });
  });
}); 