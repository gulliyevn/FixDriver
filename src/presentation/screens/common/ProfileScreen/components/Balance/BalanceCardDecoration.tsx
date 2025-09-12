/**
 * BalanceCardDecoration component
 * Decorative elements for balance card
 */

import React from 'react';
import { View } from 'react-native';
import { lightColors, darkColors } from '../../../../../shared/constants/colors';
import { BalanceScreenStyles as styles } from '../styles/BalanceScreen.styles';

interface BalanceCardDecorationProps {
  isDark: boolean;
  packageType: string;
  isBackSide?: boolean;
}

export const BalanceCardDecoration: React.FC<BalanceCardDecorationProps> = ({ 
  isDark, 
  packageType, 
  isBackSide = false 
}) => {
  const currentColors = isDark ? darkColors : lightColors;
  
  const getPackageColor = () => {
    // TODO: Implement package color logic based on packageType
    return currentColors.primary;
  };
  
  const getPackageAccent = () => {
    // TODO: Implement package accent color logic
    return currentColors.secondary;
  };

  if (isBackSide) {
    return (
      <View style={styles.cardBackDecoration}>
        <View style={[
          styles.cardBackPattern,
          { backgroundColor: getPackageColor() + '20' }
        ]} />
        <View style={[
          styles.cardBackAccent,
          { backgroundColor: getPackageAccent() + '40' }
        ]} />
      </View>
    );
  }

  return (
    <View style={styles.cardFrontDecoration}>
      <View style={[
        styles.cardFrontPattern,
        { backgroundColor: getPackageColor() + '20' }
      ]} />
      <View style={[
        styles.cardFrontAccent,
        { backgroundColor: getPackageAccent() + '40' }
      ]} />
    </View>
  );
};
