import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../auth/LoginScreen';

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
const mockLogin = jest.fn();
const mockRegister = jest.fn();
const mockLogout = jest.fn();

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: mockLogin,
    register: mockRegister,
    logout: mockLogout,
  }),
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    expect(getByPlaceholderText('Введите ваш email')).toBeTruthy();
    expect(getByPlaceholderText('Введите пароль')).toBeTruthy();
    expect(getByText('Войти')).toBeTruthy();
    expect(getByText('Забыли пароль?')).toBeTruthy();
  });

  it('handles email input', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);

    const emailInput = getByPlaceholderText('Введите ваш email');
    fireEvent.changeText(emailInput, 'test@example.com');

    expect(emailInput.props.value).toBe('test@example.com');
  });

  it('handles password input', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);

    const passwordInput = getByPlaceholderText('Введите пароль');
    fireEvent.changeText(passwordInput, 'password123');

    expect(passwordInput.props.value).toBe('password123');
  });

  it('calls login function when form is submitted', async () => {
    mockLogin.mockResolvedValue(true);

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    const emailInput = getByPlaceholderText('Введите ваш email');
    const passwordInput = getByPlaceholderText('Введите пароль');
    const loginButton = getByText('Войти');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('shows validation error for invalid email', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    const emailInput = getByPlaceholderText('Введите ваш email');
    const loginButton = getByText('Войти');

    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.press(loginButton);

    // Should show validation error
    expect(getByText('Введите корректный email')).toBeTruthy();
  });

  it('shows validation error for empty password', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    const emailInput = getByPlaceholderText('Введите ваш email');
    const loginButton = getByText('Войти');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(loginButton);

    // Should show validation error
    expect(getByText('Пароль обязателен')).toBeTruthy();
  });

  it('navigates to forgot password screen', () => {
    const { getByText } = render(<LoginScreen />);

    const forgotPasswordLink = getByText('Забыли пароль?');
    fireEvent.press(forgotPasswordLink);

    expect(mockNavigate).toHaveBeenCalledWith('ForgotPassword');
  });

  it('navigates to registration screen', () => {
    const { getByText } = render(<LoginScreen />);

    const registerLink = getByText('Зарегистрироваться');
    fireEvent.press(registerLink);

    expect(mockNavigate).toHaveBeenCalledWith('RoleSelect');
  });

  it('toggles password visibility', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    const passwordInput = getByPlaceholderText('Введите пароль');
    const toggleButton = getByText('👁️');

    // Initially password should be hidden
    expect(passwordInput.props.secureTextEntry).toBe(true);

    // Toggle password visibility
    fireEvent.press(toggleButton);

    // Password should now be visible
    expect(passwordInput.props.secureTextEntry).toBe(false);
  });

  it('shows loading state during login', async () => {
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(true), 100)));

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    const emailInput = getByPlaceholderText('Введите ваш email');
    const passwordInput = getByPlaceholderText('Введите пароль');
    const loginButton = getByText('Войти');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    // Should show loading state
    expect(getByText('Вход...')).toBeTruthy();
  });
}); 