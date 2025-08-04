import React from 'react';
import { render, act, waitFor, fireEvent } from '@testing-library/react-native';
import { View, Text, TouchableOpacity } from 'react-native';
import { ThemeProvider, useTheme } from '../ThemeContext';

// Mock AsyncStorage directly
const mockAsyncStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
};

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

const TestComponent = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  return (
    <View>
      <Text testID="theme">{theme}</Text>
      <Text testID="is-dark">{isDark.toString()}</Text>
      <TouchableOpacity testID="toggle-btn" onPress={toggleTheme}>
        <Text>Toggle</Text>
      </TouchableOpacity>
    </View>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear AsyncStorage before each test
    mockAsyncStorage.clear.mockResolvedValue(undefined);
  });

  describe('ThemeProvider', () => {
    it('provides default light theme', () => {
      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(getByTestId('theme').props.children).toBe('light');
      expect(getByTestId('is-dark').props.children).toBe('false');
    });

    it('handles invalid saved theme gracefully', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('invalid-theme');

      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(getByTestId('theme').props.children).toBe('light');
        expect(getByTestId('is-dark').props.children).toBe('false');
      });
    });

    it('handles AsyncStorage errors gracefully', async () => {
      mockAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(getByTestId('theme').props.children).toBe('light');
        expect(getByTestId('is-dark').props.children).toBe('false');
      });
    });

    it('handles null value from AsyncStorage', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(getByTestId('theme').props.children).toBe('light');
        expect(getByTestId('is-dark').props.children).toBe('false');
      });
    });
  });

  describe('toggleTheme', () => {
    it('toggles from light to dark theme', async () => {
      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Should start with light theme
      expect(getByTestId('theme').props.children).toBe('light');

      // Toggle theme
      await act(async () => {
        fireEvent.press(getByTestId('toggle-btn'));
      });

      // Should be dark now
      await waitFor(() => {
        expect(getByTestId('theme').props.children).toBe('dark');
        expect(getByTestId('is-dark').props.children).toBe('true');
      });
    });

    it('handles AsyncStorage error during toggle', async () => {
      mockAsyncStorage.setItem.mockRejectedValue(new Error('Storage error'));

      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Toggle theme
      await act(async () => {
        fireEvent.press(getByTestId('toggle-btn'));
      });

      // Theme should still toggle even if storage fails
      await waitFor(() => {
        expect(getByTestId('theme').props.children).toBe('dark');
        expect(getByTestId('is-dark').props.children).toBe('true');
      });
    });
  });

  describe('useTheme hook', () => {
    it('throws error when used outside ThemeProvider', () => {
      const TestComponentWithoutProvider = () => {
        useTheme();
        return <View />;
      };

      expect(() => {
        render(<TestComponentWithoutProvider />);
      }).toThrow('useTheme must be used within a ThemeProvider');
    });

    it('provides correct theme state', () => {
      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(getByTestId('theme').props.children).toBe('light');
      expect(getByTestId('is-dark').props.children).toBe('false');
    });

    it('provides working toggle function', async () => {
      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const toggleButton = getByTestId('toggle-btn');
      expect(toggleButton).toBeTruthy();

      await act(async () => {
        fireEvent.press(toggleButton);
      });

      await waitFor(() => {
        expect(getByTestId('theme').props.children).toBe('dark');
      });
    });
  });

  describe('isDark computed property', () => {
    it('returns false for light theme', () => {
      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(getByTestId('is-dark').props.children).toBe('false');
    });
  });

  describe('Error handling', () => {
    it('handles AsyncStorage.getItem error silently', async () => {
      mockAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(getByTestId('theme').props.children).toBe('light');
      });
    });

    it('handles AsyncStorage.setItem error silently', async () => {
      mockAsyncStorage.setItem.mockRejectedValue(new Error('Storage error'));

      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        fireEvent.press(getByTestId('toggle-btn'));
      });

      // Theme should still toggle even if storage fails
      await waitFor(() => {
        expect(getByTestId('theme').props.children).toBe('dark');
      });
    });
  });
}); 