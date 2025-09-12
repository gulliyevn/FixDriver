/**
 * LocationControls component
 * Controls for location operations
 */

import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { lightColors, darkColors } from '../../../../../shared/constants/colors';
import { AddressPickerStyles as styles } from '../styles/AddressPicker.styles';

interface LocationControlsProps {
  onRetryLocation: () => void;
  onGetCurrentLocation: () => void;
}

export const LocationControls: React.FC<LocationControlsProps> = ({
  onRetryLocation,
  onGetCurrentLocation
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : lightColors;

  return (
    <View style={[styles.controlsContainer, { backgroundColor: currentColors.background }]}>
      <TouchableOpacity
        style={[styles.controlButton, { backgroundColor: currentColors.primary }]}
        onPress={onGetCurrentLocation}
      >
        <Ionicons name="locate" size={20} color="#fff" />
        <Text style={styles.controlButtonText}>
          {t('addressPicker.getCurrentLocation')}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.controlButton, { backgroundColor: currentColors.surface }]}
        onPress={onRetryLocation}
      >
        <Ionicons name="refresh" size={20} color={currentColors.primary} />
        <Text style={[styles.controlButtonText, { color: currentColors.primary }]}>
          {t('addressPicker.retry')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
