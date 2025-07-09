import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import InputField from '../InputField';

describe('InputField Component', () => {
  const mockOnChangeText = jest.fn();
  const mockOnBlur = jest.fn();
  const mockOnFocus = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with label', () => {
    const { getByText, getByPlaceholderText } = render(
      <InputField
        label="Email"
        placeholder="Enter your email"
        value=""
        onChangeText={mockOnChangeText}
      />
    );
    
    expect(getByText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
  });

  it('calls onChangeText when text is entered', () => {
    const { getByPlaceholderText } = render(
      <InputField
        label="Email"
        placeholder="Enter your email"
        value=""
        onChangeText={mockOnChangeText}
      />
    );
    
    const input = getByPlaceholderText('Enter your email');
    fireEvent.changeText(input, 'test@example.com');
    
    expect(mockOnChangeText).toHaveBeenCalledWith('test@example.com');
  });

  it('calls onFocus when input is focused', () => {
    const { getByPlaceholderText } = render(
      <InputField
        label="Email"
        placeholder="Enter your email"
        value=""
        onChangeText={mockOnChangeText}
        onFocus={mockOnFocus}
      />
    );
    
    const input = getByPlaceholderText('Enter your email');
    fireEvent(input, 'focus');
    
    expect(mockOnFocus).toHaveBeenCalled();
  });

  it('calls onBlur when input loses focus', () => {
    const { getByPlaceholderText } = render(
      <InputField
        label="Email"
        placeholder="Enter your email"
        value=""
        onChangeText={mockOnChangeText}
        onBlur={mockOnBlur}
      />
    );
    
    const input = getByPlaceholderText('Enter your email');
    fireEvent(input, 'blur');
    
    expect(mockOnBlur).toHaveBeenCalled();
  });

  it('shows error message when error prop is provided', () => {
    const { getByText } = render(
      <InputField
        label="Email"
        placeholder="Enter your email"
        value=""
        onChangeText={mockOnChangeText}
        error="Invalid email format"
      />
    );
    
    expect(getByText('Invalid email format')).toBeTruthy();
  });

  it('renders with secure text entry for passwords', () => {
    const { getByPlaceholderText } = render(
      <InputField
        label="Password"
        placeholder="Enter your password"
        value=""
        onChangeText={mockOnChangeText}
        secureTextEntry={true}
      />
    );
    
    const input = getByPlaceholderText('Enter your password');
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('renders with different input types', () => {
    const { getByPlaceholderText, rerender } = render(
      <InputField
        label="Email"
        placeholder="Enter your email"
        value=""
        onChangeText={mockOnChangeText}
        keyboardType="email-address"
      />
    );
    
    const input = getByPlaceholderText('Enter your email');
    expect(input.props.keyboardType).toBe('email-address');
    
    rerender(
      <InputField
        label="Phone"
        placeholder="Enter your phone"
        value=""
        onChangeText={mockOnChangeText}
        keyboardType="phone-pad"
      />
    );
    
    const phoneInput = getByPlaceholderText('Enter your phone');
    expect(phoneInput.props.keyboardType).toBe('phone-pad');
  });

  it('renders with disabled state', () => {
    const { getByPlaceholderText } = render(
      <InputField
        label="Email"
        placeholder="Enter your email"
        value=""
        onChangeText={mockOnChangeText}
        editable={false}
      />
    );
    
    const input = getByPlaceholderText('Enter your email');
    expect(input.props.editable).toBe(false);
  });

  it('renders with autoCapitalize settings', () => {
    const { getByPlaceholderText } = render(
      <InputField
        label="Name"
        placeholder="Enter your name"
        value=""
        onChangeText={mockOnChangeText}
        autoCapitalize="words"
      />
    );
    
    const input = getByPlaceholderText('Enter your name');
    expect(input.props.autoCapitalize).toBe('words');
  });
}); 