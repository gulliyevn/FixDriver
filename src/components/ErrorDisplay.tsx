import React from 'react';
import { View, Text, TouchableOpacity, Alert, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { AppError, ErrorHandler } from '../utils/errorHandler';
import { ErrorDisplayStyles } from '../styles/components/ErrorDisplay.styles';

interface ErrorDisplayProps {
  error: AppError | null;
  onRetry?: () => void;
  onAction?: (action: string) => void;
  showDetails?: boolean;
  containerStyle?: ViewStyle;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onAction,
  showDetails = false,
  containerStyle
}) => {
  const { isDark } = useTheme();

  if (!error) return null;

  const getErrorIcon = (code: string) => {
    if (code.startsWith('AUTH_')) return 'lock-closed';
    if (code.startsWith('NET_')) return 'wifi';
    if (code.startsWith('VAL_')) return 'alert-circle';
    return 'warning';
  };

  const getErrorColor = (code: string) => {
    if (code.startsWith('AUTH_')) return '#DC2626';
    if (code.startsWith('NET_')) return '#F59E0B';
    if (code.startsWith('VAL_')) return '#EF4444';
    return '#6B7280';
  };

  const handleRetry = () => {
    if (onRetry && ErrorHandler.isRetryable(error)) {
      onRetry();
    }
  };

  const handleAction = () => {
    const action = ErrorHandler.getRecommendedAction(error);
    if (action && onAction) {
      onAction(action);
    }
  };

  const showErrorDetails = () => {
    if (showDetails && error.details) {
      Alert.alert(
        'Детали ошибки',
        error.details,
        [{ text: 'Понятно', style: 'default' }]
      );
    }
  };

  return (
    <View testID="error-display" style={[
      ErrorDisplayStyles.container,
      {
        backgroundColor: isDark ? '#1F2937' : '#FEF2F2',
        borderColor: getErrorColor(error.code),
      },
      containerStyle
    ]}>
      <View style={ErrorDisplayStyles.header}>
        <View style={ErrorDisplayStyles.iconContainer}>
          <Ionicons
            testID="error-icon"
            name={getErrorIcon(error.code) as keyof typeof Ionicons.glyphMap}
            size={24}
            color={getErrorColor(error.code)}
          />
        </View>
        <View style={ErrorDisplayStyles.content}>
          <Text style={[
            ErrorDisplayStyles.title,
            { color: isDark ? '#F9FAFB' : '#991B1B' }
          ]}>
            {ErrorHandler.getUserFriendlyMessage(error)}
          </Text>
          {error.details && showDetails && (
            <TouchableOpacity onPress={showErrorDetails}>
              <Text style={[
                ErrorDisplayStyles.detailsLink,
                { color: getErrorColor(error.code) }
              ]}>
                Подробнее
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={ErrorDisplayStyles.actions}>
        {ErrorHandler.isRetryable(error) && onRetry && (
          <TouchableOpacity
            style={[
              ErrorDisplayStyles.actionButton,
              {
                backgroundColor: getErrorColor(error.code),
                marginRight: 8,
              }
            ]}
            onPress={handleRetry}
          >
            <Ionicons name="refresh" size={16} color="#FFFFFF" />
            <Text style={ErrorDisplayStyles.actionButtonText}>Повторить</Text>
          </TouchableOpacity>
        )}

        {ErrorHandler.getRecommendedAction(error) && onAction && (
          <TouchableOpacity
            style={[
              ErrorDisplayStyles.actionButton,
              {
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: getErrorColor(error.code),
              }
            ]}
            onPress={handleAction}
          >
            <Text style={[
              ErrorDisplayStyles.actionButtonText,
              { color: getErrorColor(error.code) }
            ]}>
              {ErrorHandler.getRecommendedAction(error)}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ErrorDisplay; 