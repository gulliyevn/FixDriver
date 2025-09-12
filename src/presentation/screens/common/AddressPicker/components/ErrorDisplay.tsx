/**
 * ErrorDisplay component
 * Displays location errors and retry options
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { lightColors, darkColors } from '../../../../../shared/constants/colors';
import { AddressPickerStyles as styles } from '../styles/AddressPicker.styles';

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  error, 
  onRetry 
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : lightColors;

  return (
    <View style={[styles.errorContainer, { backgroundColor: currentColors.surface }]}>
      <Ionicons name="warning-outline" size={20} color={currentColors.error} />
      <Text style={[styles.errorText, { color: currentColors.error }]}>
        {error}
      </Text>
      <TouchableOpacity 
        onPress={onRetry} 
        style={[styles.retryButton, { backgroundColor: currentColors.primary }]}
      >
        <Text style={styles.retryButtonText}>
          {t('addressPicker.retry')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
