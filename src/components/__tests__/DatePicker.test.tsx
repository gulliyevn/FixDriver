import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import DatePicker from '../DatePicker';
import { ThemeProvider } from '../../context/ThemeContext';

// Mock DateTimePicker
jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  
  return function MockDateTimePicker({ value, onChange, mode, display }: any) {
    const handlePress = () => {
      const newDate = new Date(value);
      newDate.setDate(newDate.getDate() + 1);
      onChange({ type: 'set' }, newDate);
    };
    
    return (
      <View>
        <Text>Mock DateTimePicker</Text>
        <TouchableOpacity onPress={handlePress}>
          <Text>Change Date</Text>
        </TouchableOpacity>
      </View>
    );
  };
});

// Mock expo-vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

const mockThemeContext = {
  isDark: false,
  toggleTheme: jest.fn(),
};

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider value={mockThemeContext}>
      {component}
    </ThemeProvider>
  );
};

describe('DatePicker', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByText } = renderWithTheme(
      <DatePicker value="" onChange={mockOnChange} />
    );

    expect(getByText('Выберите дату')).toBeTruthy();
  });

  it('renders with label when provided', () => {
    const { getByText } = renderWithTheme(
      <DatePicker 
        value="" 
        onChange={mockOnChange} 
        label="Дата рождения" 
      />
    );

    expect(getByText('Дата рождения')).toBeTruthy();
  });

  it('displays formatted date when value is provided', () => {
    const testDate = '1990-01-15';
    const { getByText } = renderWithTheme(
      <DatePicker value={testDate} onChange={mockOnChange} />
    );

    expect(getByText('15.01.1990')).toBeTruthy();
  });

  it('shows placeholder when no value is provided', () => {
    const { getByText } = renderWithTheme(
      <DatePicker value="" onChange={mockOnChange} placeholder="Выберите дату" />
    );

    expect(getByText('Выберите дату')).toBeTruthy();
  });

  it('calls onChange when date is selected', async () => {
    const { getByText } = renderWithTheme(
      <DatePicker value="1990-01-15" onChange={mockOnChange} />
    );

    const pickerButton = getByText('15.01.1990');
    fireEvent.press(pickerButton);

    await waitFor(() => {
      const changeDateButton = getByText('Change Date');
      fireEvent.press(changeDateButton);
    });

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    const { getByText } = renderWithTheme(
      <DatePicker value="" onChange={mockOnChange} disabled={true} />
    );

    expect(getByText('Выберите дату')).toBeTruthy();
  });

  it('handles empty date value gracefully', () => {
    const { getByText } = renderWithTheme(
      <DatePicker value="" onChange={mockOnChange} />
    );

    expect(getByText('Выберите дату')).toBeTruthy();
  });

  it('handles invalid date value gracefully', () => {
    const { getByText } = renderWithTheme(
      <DatePicker value="invalid-date" onChange={mockOnChange} />
    );

    // Should show placeholder for invalid dates
    expect(getByText('Выберите дату')).toBeTruthy();
  });

  it('renders in inline mode correctly', () => {
    const { getByText } = renderWithTheme(
      <DatePicker value="1990-01-15" onChange={mockOnChange} inline={true} />
    );

    // В inline режиме должна быть дата и иконка календаря
    expect(getByText('15.01.1990')).toBeTruthy();
  });
}); 