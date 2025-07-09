import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ErrorDisplay from '../ErrorDisplay';
import { AppError } from '../../utils/errorHandler';

// Mock ThemeContext
jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({
    isDark: false,
  }),
}));

describe('ErrorDisplay Component', () => {
  const mockOnRetry = jest.fn();
  const mockOnAction = jest.fn();

  const mockError: AppError = {
    code: 'NET_001',
    message: 'Network timeout',
    details: 'Connection failed after 30 seconds',
    retryable: true,
    action: 'Check connection',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders error message correctly', () => {
    const { getByText } = render(
      <ErrorDisplay
        error={mockError}
        onRetry={mockOnRetry}
        onAction={mockOnAction}
      />
    );

    expect(getByText('Network timeout')).toBeTruthy();
  });

  it('does not render when error is null', () => {
    const { queryByTestId } = render(
      <ErrorDisplay
        error={null}
        onRetry={mockOnRetry}
        onAction={mockOnAction}
      />
    );

    expect(queryByTestId('error-display')).toBeNull();
  });

  it('calls onRetry when retry button is pressed', () => {
    const { getByText } = render(
      <ErrorDisplay
        error={mockError}
        onRetry={mockOnRetry}
        onAction={mockOnAction}
      />
    );

    const retryButton = getByText('Повторить');
    fireEvent.press(retryButton);

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('calls onAction when action button is pressed', () => {
    const { getByText } = render(
      <ErrorDisplay
        error={mockError}
        onRetry={mockOnRetry}
        onAction={mockOnAction}
      />
    );

    const actionButton = getByText('Check connection');
    fireEvent.press(actionButton);

    expect(mockOnAction).toHaveBeenCalledWith('Check connection');
  });

  it('shows retry button when error is retryable and onRetry is provided', () => {
    const { getByText } = render(
      <ErrorDisplay
        error={mockError}
        onRetry={mockOnRetry}
        onAction={mockOnAction}
      />
    );

    expect(getByText('Повторить')).toBeTruthy();
  });

  it('hides retry button when error is not retryable', () => {
    const nonRetryableError: AppError = {
      ...mockError,
      retryable: false,
    };

    const { queryByText } = render(
      <ErrorDisplay
        error={nonRetryableError}
        onRetry={mockOnRetry}
        onAction={mockOnAction}
      />
    );

    expect(queryByText('Повторить')).toBeNull();
  });

  it('hides retry button when onRetry is not provided', () => {
    const { queryByText } = render(
      <ErrorDisplay
        error={mockError}
        onAction={mockOnAction}
      />
    );

    expect(queryByText('Повторить')).toBeNull();
  });

  it('shows action button when action is available and onAction is provided', () => {
    const { getByText } = render(
      <ErrorDisplay
        error={mockError}
        onRetry={mockOnRetry}
        onAction={mockOnAction}
      />
    );

    expect(getByText('Check connection')).toBeTruthy();
  });

  it('hides action button when no action is available', () => {
    const errorWithoutAction: AppError = {
      ...mockError,
      action: undefined,
    };

    const { queryByText } = render(
      <ErrorDisplay
        error={errorWithoutAction}
        onRetry={mockOnRetry}
        onAction={mockOnAction}
      />
    );

    expect(queryByText('Check connection')).toBeNull();
  });

  it('hides action button when onAction is not provided', () => {
    const { queryByText } = render(
      <ErrorDisplay
        error={mockError}
        onRetry={mockOnRetry}
      />
    );

    expect(queryByText('Check connection')).toBeNull();
  });

  it('shows details link when showDetails is true and error has details', () => {
    const { getByText } = render(
      <ErrorDisplay
        error={mockError}
        showDetails={true}
        onRetry={mockOnRetry}
        onAction={mockOnAction}
      />
    );

    expect(getByText('Подробнее')).toBeTruthy();
  });

  it('hides details link when showDetails is false', () => {
    const { queryByText } = render(
      <ErrorDisplay
        error={mockError}
        showDetails={false}
        onRetry={mockOnRetry}
        onAction={mockOnAction}
      />
    );

    expect(queryByText('Подробнее')).toBeNull();
  });

  it('hides details link when error has no details', () => {
    const errorWithoutDetails: AppError = {
      ...mockError,
      details: undefined,
    };

    const { queryByText } = render(
      <ErrorDisplay
        error={errorWithoutDetails}
        showDetails={true}
        onRetry={mockOnRetry}
        onAction={mockOnAction}
      />
    );

    expect(queryByText('Подробнее')).toBeNull();
  });

  it('applies custom container style when provided', () => {
    const customStyle = { backgroundColor: 'red' };
    const { getByTestId } = render(
      <ErrorDisplay
        error={mockError}
        containerStyle={customStyle}
        onRetry={mockOnRetry}
        onAction={mockOnAction}
      />
    );

    const container = getByTestId('error-display');
    expect(container.props.style).toContain(customStyle);
  });

  it('renders with correct icon for auth errors', () => {
    const authError: AppError = {
      ...mockError,
      code: 'AUTH_001',
    };

    const { getByTestId } = render(
      <ErrorDisplay
        error={authError}
        onRetry={mockOnRetry}
        onAction={mockOnAction}
      />
    );

    const icon = getByTestId('error-icon');
    expect(icon.props.name).toBe('lock-closed');
  });

  it('renders with correct icon for validation errors', () => {
    const validationError: AppError = {
      ...mockError,
      code: 'VAL_001',
    };

    const { getByTestId } = render(
      <ErrorDisplay
        error={validationError}
        onRetry={mockOnRetry}
        onAction={mockOnAction}
      />
    );

    const icon = getByTestId('error-icon');
    expect(icon.props.name).toBe('alert-circle');
  });
}); 