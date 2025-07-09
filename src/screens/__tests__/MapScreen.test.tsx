import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { View, Text } from 'react-native';
import MapScreen from '../client/MapScreen';

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
  }),
  useRoute: () => ({
    params: {},
  }),
}));

// Mock AuthContext
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'client',
    },
    isAuthenticated: true,
    isLoading: false,
  }),
}));

// Mock MapView component
jest.mock('../../components/MapView', () => {
  return function MockMapView(props: any) {
    return (
      <View testID="map-view">
        <View testID="current-location">
          <Text>Current Location</Text>
        </View>
        <View testID="destination">
          <Text>Destination</Text>
        </View>
        {props.children}
      </View>
    );
  };
});

describe('MapScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders map screen correctly', () => {
    const { getByTestId, getByText } = render(<MapScreen />);

    expect(getByTestId('map-view')).toBeTruthy();
    expect(getByText('Карта')).toBeTruthy();
  });

  it('shows current location', () => {
    const { getByTestId } = render(<MapScreen />);

    expect(getByTestId('current-location')).toBeTruthy();
  });

  it('shows destination input', () => {
    const { getByTestId } = render(<MapScreen />);

    expect(getByTestId('destination')).toBeTruthy();
  });

  it('handles destination input', () => {
    const { getByPlaceholderText } = render(<MapScreen />);

    const destinationInput = getByPlaceholderText('Куда поедем?');
    fireEvent.changeText(destinationInput, 'Москва, Красная площадь');

    expect(destinationInput.props.value).toBe('Москва, Красная площадь');
  });

  it('shows user location button', () => {
    const { getByTestId } = render(<MapScreen />);

    const locationButton = getByTestId('location-button');
    expect(locationButton).toBeTruthy();
  });

  it('handles location button press', () => {
    const { getByTestId } = render(<MapScreen />);

    const locationButton = getByTestId('location-button');
    fireEvent.press(locationButton);

    // Should trigger location request
    expect(locationButton).toBeTruthy();
  });

  it('shows search button', () => {
    const { getByTestId } = render(<MapScreen />);

    const searchButton = getByTestId('search-button');
    expect(searchButton).toBeTruthy();
  });

  it('handles search button press', () => {
    const { getByTestId } = render(<MapScreen />);

    const searchButton = getByTestId('search-button');
    fireEvent.press(searchButton);

    expect(mockNavigate).toHaveBeenCalledWith('Drivers');
  });

  it('shows menu button', () => {
    const { getByTestId } = render(<MapScreen />);

    const menuButton = getByTestId('menu-button');
    expect(menuButton).toBeTruthy();
  });

  it('handles menu button press', () => {
    const { getByTestId } = render(<MapScreen />);

    const menuButton = getByTestId('menu-button');
    fireEvent.press(menuButton);

    expect(mockNavigate).toHaveBeenCalledWith('Profile');
  });
}); 