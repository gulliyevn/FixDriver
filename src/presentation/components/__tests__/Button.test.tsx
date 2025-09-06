import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../Button';
import { ThemeProvider } from '../../context/ThemeContext';

describe('Button', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider>
        {component}
      </ThemeProvider>
    );
  };

  it('renders correctly with default props', () => {
    const { getByText } = renderWithTheme(
      <Button title="Test Button" onPress={mockOnPress} />
    );

    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByText } = renderWithTheme(
      <Button title="Test Button" onPress={mockOnPress} />
    );

    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const { getByText } = renderWithTheme(
      <Button title="Test Button" onPress={mockOnPress} disabled={true} />
    );

    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('renders with primary variant', () => {
    const { getByText } = renderWithTheme(
      <Button title="Primary Button" onPress={mockOnPress} variant="primary" />
    );

    expect(getByText('Primary Button')).toBeTruthy();
  });

  it('renders with secondary variant', () => {
    const { getByText } = renderWithTheme(
      <Button title="Secondary Button" onPress={mockOnPress} variant="secondary" />
    );

    expect(getByText('Secondary Button')).toBeTruthy();
  });

  it('renders with small size', () => {
    const { getByText } = renderWithTheme(
      <Button title="Small Button" onPress={mockOnPress} size="small" />
    );

    expect(getByText('Small Button')).toBeTruthy();
  });

  it('renders with large size', () => {
    const { getByText } = renderWithTheme(
      <Button title="Large Button" onPress={mockOnPress} size="large" />
    );

    expect(getByText('Large Button')).toBeTruthy();
  });
}); 