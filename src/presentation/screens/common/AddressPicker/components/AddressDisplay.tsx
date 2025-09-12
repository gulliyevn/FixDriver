/**
 * AddressDisplay component
 * Displays selected address information
 */

import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { lightColors, darkColors } from '../../../../../shared/constants/colors';
import { AddressPickerStyles as styles } from '../styles/AddressPicker.styles';

interface AddressDisplayProps {
  address: string;
  loading: boolean;
}

export const AddressDisplay: React.FC<AddressDisplayProps> = ({ 
  address, 
  loading 
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : lightColors;

  return (
    <View style={[styles.addressContainer, { backgroundColor: currentColors.surface }]}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={currentColors.primary} />
          <Text style={[styles.loadingText, { color: currentColors.textSecondary }]}>
            {t('addressPicker.gettingAddress')}
          </Text>
        </View>
      ) : (
        <>
          <Text style={[styles.addressLabel, { color: currentColors.text }]}>
            {t('addressPicker.selectedAddress')}:
          </Text>
          <Text style={[styles.addressText, { color: currentColors.text }]}>
            {address || t('addressPicker.tapToSelect')}
          </Text>
        </>
      )}
    </View>
  );
};
