import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { LanguageProvider } from '../../context/LanguageContext';
import { ProfileProvider } from '../../context/ProfileContext';

// Импортируем экраны профиля
import ClientProfileScreen from '../../screens/profile/ClientProfileScreen';
import DriverProfileScreen from '../../screens/driver/DriverProfileScreen';

// Мокаем зависимости
jest.mock('../../hooks/useProfile');
jest.mock('../../hooks/useBalance');
jest.mock('../../hooks/useI18n');
jest.mock('../../hooks/useAvatar');
jest.mock('../../hooks/driver/DriverUseAvatar');
jest.mock('../../context/ThemeContext');
jest.mock('../../context/AuthContext');
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Мокаем стили
jest.mock('../../styles/screens/ClientProfileScreen.styles', () => ({
  container: {},
  header: {},
  content: {},
  section: {},
  title: {},
  text: {},
}));

jest.mock('../../styles/screens/driver/DriverProfileScreen.styles', () => ({
  container: {},
  header: {},
  content: {},
  section: {},
  title: {},
  text: {},
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <NavigationContainer>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <ProfileProvider>
              {component}
            </ProfileProvider>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </NavigationContainer>
  );
};

describe('Address/Residence Visibility Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Client Profile Address Visibility', () => {
    const mockClientProfile = {
      profile: {
        id: '1',
        name: 'John',
        surname: 'Doe',
        phone: '+1234567890',
        email: 'john@example.com',
        birthDate: '1990-01-01',
        rating: 4.5,
        address: 'Client Home Address, 123 Main St, City',
        residence: 'Client Residence Info',
        createdAt: '2024-01-01T00:00:00.000Z',
        role: 'client',
        avatar: null,
      },
      loading: false,
      error: null,
      loadProfile: jest.fn(),
      updateProfile: jest.fn(),
      clearProfile: jest.fn(),
    };

    const mockClientBalance = {
      balance: 1000,
      transactions: [],
      cashback: 50,
      topUpBalance: jest.fn(),
      deductBalance: jest.fn(),
      addTransaction: jest.fn(),
      getCashback: jest.fn(),
    };

    beforeEach(() => {
      jest.doMock('../../hooks/useProfile', () => ({
        useProfile: () => mockClientProfile,
      }));

      jest.doMock('../../hooks/useBalance', () => ({
        useBalance: () => mockClientBalance,
      }));

      jest.doMock('../../hooks/useAvatar', () => ({
        useAvatar: () => ({
          avatar: null,
          uploadAvatar: jest.fn(),
          deleteAvatar: jest.fn(),
        }),
      }));
    });

    it('should show address field for client profile', () => {
      renderWithProviders(<ClientProfileScreen />);

      // Проверяем, что адрес отображается для клиента
      expect(screen.getByText('Client Home Address, 123 Main St, City')).toBeTruthy();
      expect(screen.getByText('Address')).toBeTruthy();
    });

    it('should show residence field for client profile', () => {
      renderWithProviders(<ClientProfileScreen />);

      // Проверяем, что резиденция отображается для клиента
      expect(screen.getByText('Client Residence Info')).toBeTruthy();
      expect(screen.getByText('Residence')).toBeTruthy();
    });

    it('should allow client to edit address', () => {
      renderWithProviders(<ClientProfileScreen />);

      // Проверяем, что есть кнопка редактирования адреса
      const editAddressButton = screen.getByTestId('edit-address-button');
      expect(editAddressButton).toBeTruthy();
    });

    it('should allow client to edit residence', () => {
      renderWithProviders(<ClientProfileScreen />);

      // Проверяем, что есть кнопка редактирования резиденции
      const editResidenceButton = screen.getByTestId('edit-residence-button');
      expect(editResidenceButton).toBeTruthy();
    });
  });

  describe('Driver Profile Address Visibility', () => {
    const mockDriverProfile = {
      profile: {
        id: '1',
        name: 'John',
        surname: 'Driver',
        phone: '+1234567890',
        email: 'john.driver@example.com',
        birthDate: '1990-01-01',
        rating: 4.8,
        address: 'Driver Work Address, 456 Business Ave, City',
        residence: null, // У водителя НЕТ резиденции
        createdAt: '2024-01-01T00:00:00.000Z',
        role: 'driver',
        avatar: null,
      },
      loading: false,
      error: null,
      loadProfile: jest.fn(),
      updateProfile: jest.fn(),
      clearProfile: jest.fn(),
    };

    const mockDriverBalance = {
      balance: 2500,
      transactions: [],
      earnings: 1500,
      topUpBalance: jest.fn(),
      withdrawBalance: jest.fn(),
      addTransaction: jest.fn(),
      getEarnings: jest.fn(),
    };

    beforeEach(() => {
      jest.doMock('../../hooks/driver/DriverUseProfile', () => ({
        useDriverProfile: () => mockDriverProfile,
      }));

      jest.doMock('../../hooks/useBalance', () => ({
        useBalance: () => mockDriverBalance,
      }));

      jest.doMock('../../hooks/driver/DriverUseAvatar', () => ({
        useDriverAvatar: () => ({
          avatar: null,
          uploadAvatar: jest.fn(),
          deleteAvatar: jest.fn(),
        }),
      }));
    });

    it('should show address field for driver profile', () => {
      renderWithProviders(<DriverProfileScreen />);

      // Проверяем, что адрес отображается для водителя
      expect(screen.getByText('Driver Work Address, 456 Business Ave, City')).toBeTruthy();
      expect(screen.getByText('Address')).toBeTruthy();
    });

    it('should NOT show residence field for driver profile', () => {
      renderWithProviders(<DriverProfileScreen />);

      // Проверяем, что резиденция НЕ отображается для водителя
      expect(screen.queryByText('Residence')).toBeNull();
      expect(screen.queryByText('Client Residence Info')).toBeNull();
    });

    it('should allow driver to edit address', () => {
      renderWithProviders(<DriverProfileScreen />);

      // Проверяем, что есть кнопка редактирования адреса
      const editAddressButton = screen.getByTestId('edit-address-button');
      expect(editAddressButton).toBeTruthy();
    });

    it('should NOT allow driver to edit residence', () => {
      renderWithProviders(<DriverProfileScreen />);

      // Проверяем, что НЕТ кнопки редактирования резиденции
      expect(screen.queryByTestId('edit-residence-button')).toBeNull();
    });
  });

  describe('Role-Specific Address Behavior', () => {
    it('should show different address types for different roles', () => {
      // Клиентский профиль
      const mockClientProfile = {
        profile: {
          id: '1',
          name: 'John',
          surname: 'Doe',
          phone: '+1234567890',
          email: 'john@example.com',
          birthDate: '1990-01-01',
          rating: 4.5,
          address: 'Home Address',
          residence: 'Residence Info',
          createdAt: '2024-01-01T00:00:00.000Z',
          role: 'client',
          avatar: null,
        },
        loading: false,
        error: null,
        loadProfile: jest.fn(),
        updateProfile: jest.fn(),
        clearProfile: jest.fn(),
      };

      jest.doMock('../../hooks/useProfile', () => ({
        useProfile: () => mockClientProfile,
      }));

      const { rerender } = renderWithProviders(<ClientProfileScreen />);

      // Проверяем клиентский адрес
      expect(screen.getByText('Home Address')).toBeTruthy();
      expect(screen.getByText('Residence Info')).toBeTruthy();

      // Водительский профиль
      const mockDriverProfile = {
        profile: {
          id: '1',
          name: 'John',
          surname: 'Driver',
          phone: '+1234567890',
          email: 'john.driver@example.com',
          birthDate: '1990-01-01',
          rating: 4.8,
          address: 'Work Address',
          residence: null,
          createdAt: '2024-01-01T00:00:00.000Z',
          role: 'driver',
          avatar: null,
        },
        loading: false,
        error: null,
        loadProfile: jest.fn(),
        updateProfile: jest.fn(),
        clearProfile: jest.fn(),
      };

      jest.doMock('../../hooks/driver/DriverUseProfile', () => ({
        useDriverProfile: () => mockDriverProfile,
      }));

      rerender(<DriverProfileScreen />);

      // Проверяем водительский адрес
      expect(screen.getByText('Work Address')).toBeTruthy();
      expect(screen.queryByText('Residence Info')).toBeNull();
    });

    it('should handle address field validation for different roles', () => {
      // Клиент - адрес обязателен
      const mockClientProfile = {
        profile: {
          id: '1',
          name: 'John',
          surname: 'Doe',
          phone: '+1234567890',
          email: 'john@example.com',
          birthDate: '1990-01-01',
          rating: 4.5,
          address: '', // Пустой адрес
          residence: 'Residence Info',
          createdAt: '2024-01-01T00:00:00.000Z',
          role: 'client',
          avatar: null,
        },
        loading: false,
        error: null,
        loadProfile: jest.fn(),
        updateProfile: jest.fn(),
        clearProfile: jest.fn(),
      };

      jest.doMock('../../hooks/useProfile', () => ({
        useProfile: () => mockClientProfile,
      }));

      renderWithProviders(<ClientProfileScreen />);

      // Проверяем, что показывается предупреждение о пустом адресе
      expect(screen.getByText('Address is required')).toBeTruthy();
    });
  });

  describe('Address Data Persistence', () => {
    it('should persist address changes for client', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      const mockSetItem = jest.fn();
      AsyncStorage.setItem.mockImplementation(mockSetItem);

      const mockClientProfile = {
        profile: {
          id: '1',
          name: 'John',
          surname: 'Doe',
          phone: '+1234567890',
          email: 'john@example.com',
          birthDate: '1990-01-01',
          rating: 4.5,
          address: 'Old Address',
          residence: 'Old Residence',
          createdAt: '2024-01-01T00:00:00.000Z',
          role: 'client',
          avatar: null,
        },
        loading: false,
        error: null,
        loadProfile: jest.fn(),
        updateProfile: jest.fn().mockImplementation(async (data) => {
          await AsyncStorage.setItem('client_profile', JSON.stringify(data));
        }),
        clearProfile: jest.fn(),
      };

      jest.doMock('../../hooks/useProfile', () => ({
        useProfile: () => mockClientProfile,
      }));

      renderWithProviders(<ClientProfileScreen />);

      // Симулируем изменение адреса
      const editButton = screen.getByTestId('edit-address-button');
      // fireEvent.press(editButton);

      // Проверяем, что данные сохраняются
      expect(mockSetItem).toHaveBeenCalled();
    });

    it('should persist address changes for driver', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      const mockSetItem = jest.fn();
      AsyncStorage.setItem.mockImplementation(mockSetItem);

      const mockDriverProfile = {
        profile: {
          id: '1',
          name: 'John',
          surname: 'Driver',
          phone: '+1234567890',
          email: 'john.driver@example.com',
          birthDate: '1990-01-01',
          rating: 4.8,
          address: 'Old Work Address',
          residence: null,
          createdAt: '2024-01-01T00:00:00.000Z',
          role: 'driver',
          avatar: null,
        },
        loading: false,
        error: null,
        loadProfile: jest.fn(),
        updateProfile: jest.fn().mockImplementation(async (data) => {
          await AsyncStorage.setItem('driver_profile', JSON.stringify(data));
        }),
        clearProfile: jest.fn(),
      };

      jest.doMock('../../hooks/driver/DriverUseProfile', () => ({
        useDriverProfile: () => mockDriverProfile,
      }));

      renderWithProviders(<DriverProfileScreen />);

      // Симулируем изменение адреса
      const editButton = screen.getByTestId('edit-address-button');
      // fireEvent.press(editButton);

      // Проверяем, что данные сохраняются
      expect(mockSetItem).toHaveBeenCalled();
    });
  });

  describe('Address Field Validation', () => {
    it('should validate address format for client', () => {
      const mockClientProfile = {
        profile: {
          id: '1',
          name: 'John',
          surname: 'Doe',
          phone: '+1234567890',
          email: 'john@example.com',
          birthDate: '1990-01-01',
          rating: 4.5,
          address: 'Invalid Address', // Невалидный адрес
          residence: 'Residence Info',
          createdAt: '2024-01-01T00:00:00.000Z',
          role: 'client',
          avatar: null,
        },
        loading: false,
        error: null,
        loadProfile: jest.fn(),
        updateProfile: jest.fn(),
        clearProfile: jest.fn(),
      };

      jest.doMock('../../hooks/useProfile', () => ({
        useProfile: () => mockClientProfile,
      }));

      renderWithProviders(<ClientProfileScreen />);

      // Проверяем, что показывается предупреждение о невалидном адресе
      expect(screen.getByText('Please enter a valid address')).toBeTruthy();
    });

    it('should validate address format for driver', () => {
      const mockDriverProfile = {
        profile: {
          id: '1',
          name: 'John',
          surname: 'Driver',
          phone: '+1234567890',
          email: 'john.driver@example.com',
          birthDate: '1990-01-01',
          rating: 4.8,
          address: 'Invalid Work Address', // Невалидный адрес
          residence: null,
          createdAt: '2024-01-01T00:00:00.000Z',
          role: 'driver',
          avatar: null,
        },
        loading: false,
        error: null,
        loadProfile: jest.fn(),
        updateProfile: jest.fn(),
        clearProfile: jest.fn(),
      };

      jest.doMock('../../hooks/driver/DriverUseProfile', () => ({
        useDriverProfile: () => mockDriverProfile,
      }));

      renderWithProviders(<DriverProfileScreen />);

      // Проверяем, что показывается предупреждение о невалидном адресе
      expect(screen.getByText('Please enter a valid work address')).toBeTruthy();
    });
  });
}); 