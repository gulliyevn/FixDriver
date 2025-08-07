import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { LanguageProvider } from '../../context/LanguageContext';
import { ProfileProvider } from '../../context/ProfileContext';
import { PackageProvider } from '../../context/PackageContext';
import { BalanceProvider } from '../../context/BalanceContext';

// Импортируем компоненты профиля
import ProfileHeader from '../profile/ProfileHeader';
import ProfileOption from '../profile/ProfileOption';
import ProfileChildrenSection from '../profile/ProfileChildrenSection';
import ProfileNotificationsModal from '../profile/ProfileNotificationsModal';

// Мокаем зависимости
jest.mock('../../hooks/useProfile');
jest.mock('../../hooks/useBalance');
jest.mock('../../hooks/useI18n');
jest.mock('../../context/ThemeContext');
jest.mock('../../context/AuthContext');
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Мокаем навигацию
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <NavigationContainer>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <ProfileProvider>
              <PackageProvider>
                <BalanceProvider>
                  {component}
                </BalanceProvider>
              </PackageProvider>
            </ProfileProvider>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </NavigationContainer>
  );
};

describe('Profile Components - Smart Roles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ProfileHeader Component', () => {
    it('should render client profile header correctly', async () => {
      const mockProfile = {
        profile: {
          id: '1',
          name: 'John',
          surname: 'Doe',
          phone: '+1234567890',
          email: 'john@example.com',
          birthDate: '1990-01-01',
          rating: 4.5,
          address: 'Client Address',
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
        useProfile: () => mockProfile,
      }));

      renderWithProviders(
        <ProfileHeader 
          navigation={mockNavigation as any}
          onEditPress={jest.fn()}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeTruthy();
        expect(screen.getByText('+1234567890')).toBeTruthy();
        expect(screen.getByText('4.5')).toBeTruthy();
      });
    });

    it('should render driver profile header correctly', async () => {
      const mockProfile = {
        profile: {
          id: '1',
          name: 'John',
          surname: 'Driver',
          phone: '+1234567890',
          email: 'john.driver@example.com',
          birthDate: '1990-01-01',
          rating: 4.8,
          address: 'Driver Address',
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

      jest.doMock('../../hooks/useProfile', () => ({
        useProfile: () => mockProfile,
      }));

      renderWithProviders(
        <ProfileHeader 
          navigation={mockNavigation as any}
          onEditPress={jest.fn()}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('John Driver')).toBeTruthy();
        expect(screen.getByText('+1234567890')).toBeTruthy();
        expect(screen.getByText('4.8')).toBeTruthy();
      });
    });

    it('should handle edit press for client', async () => {
      const mockOnEditPress = jest.fn();
      const mockProfile = {
        profile: {
          id: '1',
          name: 'John',
          surname: 'Doe',
          phone: '+1234567890',
          email: 'john@example.com',
          birthDate: '1990-01-01',
          rating: 4.5,
          address: 'Client Address',
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
        useProfile: () => mockProfile,
      }));

      renderWithProviders(
        <ProfileHeader 
          navigation={mockNavigation as any}
          onEditPress={mockOnEditPress}
        />
      );

      await waitFor(() => {
        const editButton = screen.getByTestId('edit-profile-button');
        fireEvent.press(editButton);
        expect(mockOnEditPress).toHaveBeenCalled();
      });
    });

    it('should handle edit press for driver', async () => {
      const mockOnEditPress = jest.fn();
      const mockProfile = {
        profile: {
          id: '1',
          name: 'John',
          surname: 'Driver',
          phone: '+1234567890',
          email: 'john.driver@example.com',
          birthDate: '1990-01-01',
          rating: 4.8,
          address: 'Driver Address',
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

      jest.doMock('../../hooks/useProfile', () => ({
        useProfile: () => mockProfile,
      }));

      renderWithProviders(
        <ProfileHeader 
          navigation={mockNavigation as any}
          onEditPress={mockOnEditPress}
        />
      );

      await waitFor(() => {
        const editButton = screen.getByTestId('edit-profile-button');
        fireEvent.press(editButton);
        expect(mockOnEditPress).toHaveBeenCalled();
      });
    });
  });

  describe('ProfileOption Component', () => {
    it('should render client-specific options', () => {
      const mockOnPress = jest.fn();

      renderWithProviders(
        <ProfileOption
          icon="card"
          title="Cards"
          subtitle="Manage your payment cards"
          onPress={mockOnPress}
          role="client"
        />
      );

      expect(screen.getByText('Cards')).toBeTruthy();
      expect(screen.getByText('Manage your payment cards')).toBeTruthy();
    });

    it('should render driver-specific options', () => {
      const mockOnPress = jest.fn();

      renderWithProviders(
        <ProfileOption
          icon="car"
          title="Vehicle"
          subtitle="Manage your vehicle information"
          onPress={mockOnPress}
          role="driver"
        />
      );

      expect(screen.getByText('Vehicle')).toBeTruthy();
      expect(screen.getByText('Manage your vehicle information')).toBeTruthy();
    });

    it('should handle press events for client options', () => {
      const mockOnPress = jest.fn();

      renderWithProviders(
        <ProfileOption
          icon="card"
          title="Cards"
          subtitle="Manage your payment cards"
          onPress={mockOnPress}
          role="client"
        />
      );

      const optionButton = screen.getByText('Cards');
      fireEvent.press(optionButton);
      expect(mockOnPress).toHaveBeenCalled();
    });

    it('should handle press events for driver options', () => {
      const mockOnPress = jest.fn();

      renderWithProviders(
        <ProfileOption
          icon="car"
          title="Vehicle"
          subtitle="Manage your vehicle information"
          onPress={mockOnPress}
          role="driver"
        />
      );

      const optionButton = screen.getByText('Vehicle');
      fireEvent.press(optionButton);
      expect(mockOnPress).toHaveBeenCalled();
    });
  });

  describe('ProfileChildrenSection Component', () => {
    it('should render client children section correctly', () => {
      const mockChildren = [
        {
          id: '1',
          name: 'Alice',
          age: 8,
          relationship: 'daughter',
        },
        {
          id: '2',
          name: 'Bob',
          age: 12,
          relationship: 'son',
        },
      ];

      renderWithProviders(
        <ProfileChildrenSection
          children={mockChildren}
          onAddChild={jest.fn()}
          onEditChild={jest.fn()}
          onDeleteChild={jest.fn()}
          role="client"
        />
      );

      expect(screen.getByText('Alice')).toBeTruthy();
      expect(screen.getByText('Bob')).toBeTruthy();
      expect(screen.getByText('daughter')).toBeTruthy();
      expect(screen.getByText('son')).toBeTruthy();
    });

    it('should render driver family section correctly', () => {
      const mockFamilyMembers = [
        {
          id: '1',
          name: 'Sarah',
          relationship: 'spouse',
          documents: ['license', 'insurance'],
        },
        {
          id: '2',
          name: 'Mike',
          relationship: 'brother',
          documents: ['license'],
        },
      ];

      renderWithProviders(
        <ProfileChildrenSection
          children={mockFamilyMembers}
          onAddChild={jest.fn()}
          onEditChild={jest.fn()}
          onDeleteChild={jest.fn()}
          role="driver"
        />
      );

      expect(screen.getByText('Sarah')).toBeTruthy();
      expect(screen.getByText('Mike')).toBeTruthy();
      expect(screen.getByText('spouse')).toBeTruthy();
      expect(screen.getByText('brother')).toBeTruthy();
    });

    it('should handle add child for client', () => {
      const mockOnAddChild = jest.fn();
      const mockChildren = [];

      renderWithProviders(
        <ProfileChildrenSection
          children={mockChildren}
          onAddChild={mockOnAddChild}
          onEditChild={jest.fn()}
          onDeleteChild={jest.fn()}
          role="client"
        />
      );

      const addButton = screen.getByText('Add Child');
      fireEvent.press(addButton);
      expect(mockOnAddChild).toHaveBeenCalled();
    });

    it('should handle add family member for driver', () => {
      const mockOnAddChild = jest.fn();
      const mockFamilyMembers = [];

      renderWithProviders(
        <ProfileChildrenSection
          children={mockFamilyMembers}
          onAddChild={mockOnAddChild}
          onEditChild={jest.fn()}
          onDeleteChild={jest.fn()}
          role="driver"
        />
      );

      const addButton = screen.getByText('Add Family Member');
      fireEvent.press(addButton);
      expect(mockOnAddChild).toHaveBeenCalled();
    });
  });

  describe('ProfileNotificationsModal Component', () => {
    it('should render client notifications correctly', () => {
      const mockNotifications = [
        { id: '1', type: 'trip', message: 'Your trip is confirmed' },
        { id: '2', type: 'payment', message: 'Payment successful' },
      ];

      renderWithProviders(
        <ProfileNotificationsModal
          visible={true}
          notifications={mockNotifications}
          onClose={jest.fn()}
          onNotificationPress={jest.fn()}
          role="client"
        />
      );

      expect(screen.getByText('Your trip is confirmed')).toBeTruthy();
      expect(screen.getByText('Payment successful')).toBeTruthy();
    });

    it('should render driver notifications correctly', () => {
      const mockNotifications = [
        { id: '1', type: 'order', message: 'New order received' },
        { id: '2', type: 'earnings', message: 'Earnings updated' },
      ];

      renderWithProviders(
        <ProfileNotificationsModal
          visible={true}
          notifications={mockNotifications}
          onClose={jest.fn()}
          onNotificationPress={jest.fn()}
          role="driver"
        />
      );

      expect(screen.getByText('New order received')).toBeTruthy();
      expect(screen.getByText('Earnings updated')).toBeTruthy();
    });

    it('should handle notification press for client', () => {
      const mockOnNotificationPress = jest.fn();
      const mockNotifications = [
        { id: '1', type: 'trip', message: 'Your trip is confirmed' },
      ];

      renderWithProviders(
        <ProfileNotificationsModal
          visible={true}
          notifications={mockNotifications}
          onClose={jest.fn()}
          onNotificationPress={mockOnNotificationPress}
          role="client"
        />
      );

      const notification = screen.getByText('Your trip is confirmed');
      fireEvent.press(notification);
      expect(mockOnNotificationPress).toHaveBeenCalledWith('1');
    });

    it('should handle notification press for driver', () => {
      const mockOnNotificationPress = jest.fn();
      const mockNotifications = [
        { id: '1', type: 'order', message: 'New order received' },
      ];

      renderWithProviders(
        <ProfileNotificationsModal
          visible={true}
          notifications={mockNotifications}
          onClose={jest.fn()}
          onNotificationPress={mockOnNotificationPress}
          role="driver"
        />
      );

      const notification = screen.getByText('New order received');
      fireEvent.press(notification);
      expect(mockOnNotificationPress).toHaveBeenCalledWith('1');
    });
  });

  describe('Role-Specific Behavior', () => {
    it('should show different options for client vs driver', () => {
      const clientOptions = [
        { title: 'Cards', role: 'client' },
        { title: 'Trips', role: 'client' },
        { title: 'Payment History', role: 'client' },
      ];

      const driverOptions = [
        { title: 'Vehicle', role: 'driver' },
        { title: 'Orders', role: 'driver' },
        { title: 'Earnings', role: 'driver' },
      ];

      // Рендерим клиентские опции
      renderWithProviders(
        <>
          {clientOptions.map((option, index) => (
            <ProfileOption
              key={index}
              icon="card"
              title={option.title}
              subtitle=""
              onPress={jest.fn()}
              role={option.role}
            />
          ))}
        </>
      );

      expect(screen.getByText('Cards')).toBeTruthy();
      expect(screen.getByText('Trips')).toBeTruthy();
      expect(screen.getByText('Payment History')).toBeTruthy();
    });

    it('should handle role switching in components', async () => {
      // Начинаем с клиентского профиля
      let mockProfile = {
        profile: {
          id: '1',
          name: 'John',
          surname: 'Doe',
          phone: '+1234567890',
          email: 'john@example.com',
          birthDate: '1990-01-01',
          rating: 4.5,
          address: 'Client Address',
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
        useProfile: () => mockProfile,
      }));

      const { rerender } = renderWithProviders(
        <ProfileHeader 
          navigation={mockNavigation as any}
          onEditPress={jest.fn()}
        />
      );

      expect(screen.getByText('John Doe')).toBeTruthy();

      // Переключаемся на водительский профиль
      mockProfile = {
        profile: {
          id: '1',
          name: 'John',
          surname: 'Driver',
          phone: '+1234567890',
          email: 'john.driver@example.com',
          birthDate: '1990-01-01',
          rating: 4.8,
          address: 'Driver Address',
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

      jest.doMock('../../hooks/useProfile', () => ({
        useProfile: () => mockProfile,
      }));

      rerender(
        <ProfileHeader 
          navigation={mockNavigation as any}
          onEditPress={jest.fn()}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('John Driver')).toBeTruthy();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle loading state in profile components', () => {
      const mockProfile = {
        profile: null,
        loading: true,
        error: null,
        loadProfile: jest.fn(),
        updateProfile: jest.fn(),
        clearProfile: jest.fn(),
      };

      jest.doMock('../../hooks/useProfile', () => ({
        useProfile: () => mockProfile,
      }));

      renderWithProviders(
        <ProfileHeader 
          navigation={mockNavigation as any}
          onEditPress={jest.fn()}
        />
      );

      expect(screen.getByTestId('loading-indicator')).toBeTruthy();
    });

    it('should handle error state in profile components', () => {
      const mockProfile = {
        profile: null,
        loading: false,
        error: 'Failed to load profile',
        loadProfile: jest.fn(),
        updateProfile: jest.fn(),
        clearProfile: jest.fn(),
      };

      jest.doMock('../../hooks/useProfile', () => ({
        useProfile: () => mockProfile,
      }));

      renderWithProviders(
        <ProfileHeader 
          navigation={mockNavigation as any}
          onEditPress={jest.fn()}
        />
      );

      expect(screen.getByText('Failed to load profile')).toBeTruthy();
    });
  });
}); 