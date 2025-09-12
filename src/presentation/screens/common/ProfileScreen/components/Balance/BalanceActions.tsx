/**
 * BalanceActions component
 * Action buttons for balance operations
 */

import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { lightColors, darkColors } from '../../../../../shared/constants/colors';
import { useBalanceActions } from '../hooks/useBalanceActions';
import { BalanceScreenStyles as styles } from '../styles/BalanceScreen.styles';

interface BalanceActionsProps {
  isDriver: boolean;
  onTopUp: () => void;
}

export const BalanceActions: React.FC<BalanceActionsProps> = ({ 
  isDriver, 
  onTopUp 
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : lightColors;
  
  const { handleWithdraw, handleUseCashback } = useBalanceActions(isDriver);
  
  const getTopUpButtonText = () => {
    return t('balance.topUp');
  };
  
  const getWithdrawButtonText = () => {
    return isDriver ? t('balance.withdraw') : t('balance.fixCash');
  };
  
  const getWithdrawIcon = () => {
    return isDriver ? 'card' : 'gift';
  };
  
  const getWithdrawColor = () => {
    return isDriver ? currentColors.warning : currentColors.success;
  };

  return (
    <View style={styles.actionsContainer}>
      <TouchableOpacity
        style={[
          styles.actionButton,
          styles.topUpButton,
          { backgroundColor: currentColors.primary }
        ]}
        onPress={onTopUp}
      >
        <Ionicons name="add-circle" size={24} color="#fff" />
        <Text style={styles.actionButtonText}>
          {getTopUpButtonText()}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.actionButton,
          styles.withdrawButton,
          { backgroundColor: getWithdrawColor() }
        ]}
        onPress={isDriver ? handleWithdraw : handleUseCashback}
      >
        <Ionicons name={getWithdrawIcon() as any} size={24} color="#fff" />
        <Text style={styles.actionButtonText}>
          {getWithdrawButtonText()}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
