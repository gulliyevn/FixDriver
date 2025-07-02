import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { AppError, ErrorHandler } from '../utils/errorHandler';

interface ErrorDisplayProps {
  error: AppError | null;
  onRetry?: () => void;
  onAction?: (action: string) => void;
  showDetails?: boolean;
  containerStyle?: any;
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
    <View style={[
      styles.container,
      {
        backgroundColor: isDark ? '#1F2937' : '#FEF2F2',
        borderColor: getErrorColor(error.code),
      },
      containerStyle
    ]}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={getErrorIcon(error.code) as any}
            size={20}
            color={getErrorColor(error.code)}
          />
        </View>
        <View style={styles.content}>
          <Text style={[
            styles.title,
            { color: isDark ? '#F9FAFB' : '#991B1B' }
          ]}>
            {ErrorHandler.getUserFriendlyMessage(error)}
          </Text>
          {error.details && showDetails && (
            <TouchableOpacity onPress={showErrorDetails}>
              <Text style={[
                styles.detailsLink,
                { color: getErrorColor(error.code) }
              ]}>
                Подробнее
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        {ErrorHandler.isRetryable(error) && onRetry && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: getErrorColor(error.code),
                marginRight: 8,
              }
            ]}
            onPress={handleRetry}
          >
            <Ionicons name="refresh" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Повторить</Text>
          </TouchableOpacity>
        )}

        {ErrorHandler.getRecommendedAction(error) && onAction && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: getErrorColor(error.code),
              }
            ]}
            onPress={handleAction}
          >
            <Text style={[
              styles.actionButtonText,
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

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  detailsLink: {
    fontSize: 12,
    marginTop: 4,
    textDecorationLine: 'underline',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minHeight: 36,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 6,
  },
});

export default ErrorDisplay; 