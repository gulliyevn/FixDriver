/**
 * QuickTopUpModal component
 * Modal with quick amount selection for balance top-up
 */

import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { lightColors, darkColors } from '../../../../../shared/constants/colors';
import { BalanceScreenStyles as styles } from '../styles/BalanceScreen.styles';

interface QuickTopUpModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectAmount: (amount: string) => void;
}

export const QuickTopUpModal: React.FC<QuickTopUpModalProps> = ({ 
  visible, 
  onClose, 
  onSelectAmount 
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : lightColors;
  
  // Quick amount options
  const quickAmounts = ['50', '100', '200', '500', '1000', '2000'];
  
  const getModalTitle = () => {
    return t('balance.quickTopUp');
  };
  
  const handleAmountSelect = (amount: string) => {
    onSelectAmount(amount);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, isDark && styles.modalOverlayDark]}>
        <View style={[styles.modalContainer, { backgroundColor: currentColors.background }]}>
          <Text style={[styles.modalTitle, { color: currentColors.text }]}>
            {getModalTitle()}
          </Text>
          
          <View style={styles.quickAmountsContainer}>
            {quickAmounts.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.quickAmountButton,
                  { 
                    backgroundColor: currentColors.surface,
                    borderColor: currentColors.border
                  }
                ]}
                onPress={() => handleAmountSelect(amount)}
                activeOpacity={0.8}
              >
                <Text style={[styles.quickAmountText, { color: currentColors.text }]}>
                  {amount} AFc
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity onPress={onClose} style={styles.modalCancelBtn}>
            <Text style={[styles.modalCancelBtnText, { color: currentColors.textSecondary }]}>
              {t('balance.cancel')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
