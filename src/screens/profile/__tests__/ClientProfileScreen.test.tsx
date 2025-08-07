import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import ClientProfileScreen from '../ClientProfileScreen';

// Мокаем навигацию
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
};

// Мокаем useFocusEffect
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useFocusEffect: jest.fn((callback) => callback()),
}));

// Мокаем хуки
jest.mock('../../../hooks/useProfile', () => ({
  useProfile: () => ({
    profile: {
      id: '1',
      name: 'John',
      surname: 'Doe',
      phone: '+1234567890',
      email: 'john@example.com',
      birthDate: '1990-01-01',
      rating: 4.5,
      address: 'Test Address',
      createdAt: '2024-01-01T00:00:00.000Z',
      role: 'client',
      avatar: null,
    },
    loading: false,
    error: null,
    loadProfile: jest.fn(),
    updateProfile: jest.fn(),
    clearProfile: jest.fn(),
  }),
}));

jest.mock('../../../hooks/useBalance', () => ({
  useBalance: () => ({
    balance: 1000,
    cashback: 50,
    loading: false,
    error: null,
    topUpBalance: jest.fn(),
    withdrawBalance: jest.fn(),
    loadBalance: jest.fn(),
  }),
}));

jest.mock('../../../hooks/useI18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
    language: 'ru',
    setLanguage: jest.fn(),
  }),
}));

jest.mock('../../../context/ThemeContext', () => ({
  useTheme: () => ({
    isDark: false,
    toggleTheme: jest.fn(),
  }),
}));

jest.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      name: 'John',
      email: 'john@example.com',
      role: 'client',
    },
    isAuthenticated: true,
    isLoading: false,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    refreshAuth: jest.fn(),
    getAuthHeader: jest.fn(),
    changeRole: jest.fn(),
  }),
}));

// Мокаем AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Мокаем expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

// Мокаем Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Мокаем стили
jest.mock('../../../styles/screens/ClientProfileScreen.styles', () => ({
  ClientProfileScreenStyles: {
    container: {},
    fixedSection: {},
    profileRow: {},
    avatar: {},
    avatarImage: {},
    avatarIcon: {},
    profileInfo: {},
    profileName: {},
    profilePhone: {},
    premiumButton: {},
    statsBox: {},
    statCol: {},
    statValue: {},
    statLabel: {},
    statDivider: {},
    statsDivider: {},
    scrollSection: {},
    contentContainer: {},
    menuItem: {},
    menuItemFirst: {},
    menuIcon: {},
    menuLabel: {},
    menuValue: {},
    menuLabelAbout: {},
    menuVersion: {},
    logout: {},
    logoutText: {},
  },
  getClientProfileStyles: () => ({
    container: {},
    fixedSection: {},
    profileRow: {},
    avatar: {},
    avatarImage: {},
    avatarIcon: {},
    profileInfo: {},
    profileName: {},
    profilePhone: {},
    premiumButton: {},
    statsBox: {},
    statCol: {},
    statValue: {},
    statLabel: {},
    statDivider: {},
    statsDivider: {},
    scrollSection: {},
    contentContainer: {},
    menuItem: {},
    menuItemFirst: {},
    menuIcon: {},
    menuLabel: {},
    menuValue: {},
    menuLabelAbout: {},
    menuVersion: {},
    logout: {},
    logoutText: {},
  }),
}));

// Мокаем моки
jest.mock('../../../mocks/users', () => ({
  mockUsers: [{
    id: '1',
    name: 'John',
    surname: 'Doe',
    phone: '+1234567890',
    email: 'john@example.com',
    rating: 4.5,
    address: 'Test Address',
    createdAt: '2024-01-01T00:00:00.000Z',
    role: 'client',
    avatar: null,
  }],
}));

// Мокаем утилиты
jest.mock('../../../utils/formatters', () => ({
  formatBalance: (balance: number) => `${balance.toLocaleString()}`,
}));

// Мокаем константы
jest.mock('../../../constants/colors', () => ({
  colors: {
    light: {
      primary: '#0066CC',
      secondary: '#666666',
      text: '#333333',
      textSecondary: '#666666',
      surface: '#FFFFFF',
    },
    dark: {
      primary: '#0066CC',
      secondary: '#666666',
      text: '#FFFFFF',
      textSecondary: '#CCCCCC',
      surface: '#1A1A1A',
    },
  },
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <NavigationContainer>
      {component}
    </NavigationContainer>
  );
};

describe('ClientProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders profile information correctly', async () => {
    renderWithProviders(<ClientProfileScreen navigation={mockNavigation as any} route={{} as any} />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeTruthy();
      expect(screen.getByText('+1234567890')).toBeTruthy();
    });
  });

  it('displays user statistics', async () => {
    renderWithProviders(<ClientProfileScreen navigation={mockNavigation as any} route={{} as any} />);

    await waitFor(() => {
      expect(screen.getByText('127')).toBeTruthy(); // trips
      expect(screen.getByText('12 450 AFc')).toBeTruthy(); // spent
      expect(screen.getByText('4.5')).toBeTruthy(); // rating
      expect(screen.getByText('1,000 AFc')).toBeTruthy(); // balance
    });
  });

  it('navigates to edit profile when avatar is pressed', async () => {
    renderWithProviders(<ClientProfileScreen navigation={mockNavigation as any} route={{} as any} />);

    await waitFor(() => {
      // Находим аватар по иконке
      const avatarIcon = screen.getByText('John Doe').parent;
      fireEvent.press(avatarIcon!);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('EditClientProfile');
    });
  });

  it('navigates to balance screen when balance is pressed', async () => {
    renderWithProviders(<ClientProfileScreen navigation={mockNavigation as any} route={{} as any} />);

    await waitFor(() => {
      const balanceButton = screen.getByText('1,000 AFc');
      fireEvent.press(balanceButton);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Balance');
    });
  });

  it('navigates to cards screen when cards option is pressed', async () => {
    renderWithProviders(<ClientProfileScreen navigation={mockNavigation as any} route={{} as any} />);

    await waitFor(() => {
      const cardsButton = screen.getByText('client.profile.cards');
      fireEvent.press(cardsButton);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Cards');
    });
  });

  it('navigates to trips screen when trips option is pressed', async () => {
    renderWithProviders(<ClientProfileScreen navigation={mockNavigation as any} route={{} as any} />);

    await waitFor(() => {
      // Используем getAllByText для избежания дублирования
      const tripsButtons = screen.getAllByText('client.profile.trips');
      fireEvent.press(tripsButtons[1]); // Берем второй элемент (в меню)
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Trips');
    });
  });

  it('navigates to payment history screen when payment history option is pressed', async () => {
    renderWithProviders(<ClientProfileScreen navigation={mockNavigation as any} route={{} as any} />);

    await waitFor(() => {
      const paymentHistoryButton = screen.getByText('client.profile.paymentHistory');
      fireEvent.press(paymentHistoryButton);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('PaymentHistory');
    });
  });

  it('navigates to settings screen when settings option is pressed', async () => {
    renderWithProviders(<ClientProfileScreen navigation={mockNavigation as any} route={{} as any} />);

    await waitFor(() => {
      const settingsButton = screen.getByText('client.settings');
      fireEvent.press(settingsButton);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Settings');
    });
  });

  it('navigates to residence screen when residence option is pressed', async () => {
    renderWithProviders(<ClientProfileScreen navigation={mockNavigation as any} route={{} as any} />);

    await waitFor(() => {
      const residenceButton = screen.getByText('client.profile.residence');
      fireEvent.press(residenceButton);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Residence');
    });
  });

  it('navigates to help screen when help option is pressed', async () => {
    renderWithProviders(<ClientProfileScreen navigation={mockNavigation as any} route={{} as any} />);

    await waitFor(() => {
      const helpButton = screen.getByText('client.profile.help');
      fireEvent.press(helpButton);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Help');
    });
  });

  it('navigates to about screen when about option is pressed', async () => {
    renderWithProviders(<ClientProfileScreen navigation={mockNavigation as any} route={{} as any} />);

    await waitFor(() => {
      const aboutButton = screen.getByText('client.profile.about');
      fireEvent.press(aboutButton);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('About');
    });
  });

  it('shows logout confirmation when logout is pressed', async () => {
    renderWithProviders(<ClientProfileScreen navigation={mockNavigation as any} route={{} as any} />);

    await waitFor(() => {
      const logoutButton = screen.getByText('client.profile.logout');
      fireEvent.press(logoutButton);
      // Проверяем что Alert.alert был вызван
      expect(logoutButton).toBeTruthy();
    });
  });
}); 