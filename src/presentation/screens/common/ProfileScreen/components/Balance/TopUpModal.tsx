/**
 * TopUpModal component
 * Modal for balance top-up operations
 */

import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { lightColors, darkColors } from '../../../../../shared/constants/colors';
import { useBalanceActions } from '../hooks/useBalanceActions';
import { BalanceScreenStyles as styles } from '../styles/BalanceScreen.styles';

interface TopUpModalProps {
  visible: boolean;
  onClose: () => void;
  isDriver: boolean;
  initialAmount?: string;
}

export const TopUpModal: React.FC<TopUpModalProps> = ({ 
  visible, 
  onClose, 
  isDriver,
  initialAmount = ''
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : lightColors;
  
  const [topUpAmount, setTopUpAmount] = useState(initialAmount);
  const { handleTopUp } = useBalanceActions(isDriver);
  
  const getModalTitle = () => {
    return t('balance.topUp');
  };
  
  const handleConfirm = () => {
    Alert.alert(
      t('balance.confirm'),
      t('balance.confirmTopUp', { amount: topUpAmount }),
      [
        { text: t('balance.cancel'), style: 'cancel' },
        { 
          text: t('balance.topUpBalance'), 
          onPress: () => {
            handleTopUp(topUpAmount);
            onClose();
          }
        }
      ]
    );
  };
  
  const handleClose = () => {
    setTopUpAmount('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleClose}
    >
      <View style={[styles.modalOverlay, isDark && styles.modalOverlayDark]}>
        <View style={[styles.modalContainer, { backgroundColor: currentColors.background }]}>
          <Text style={[styles.modalTitle, { color: currentColors.text }]}>
            {getModalTitle()}
          </Text>
          
          <Text style={[styles.modalLabel, { color: currentColors.textSecondary }]}>
            {t('balance.amountInAFc')}
          </Text>
          
          <TextInput
            value={topUpAmount}
            onChangeText={setTopUpAmount}
            placeholder={t('balance.enterAmount')}
            placeholderTextColor={currentColors.textSecondary}
            keyboardType="numeric"
            style={[
              styles.modalInput, 
              { 
                backgroundColor: currentColors.surface,
                color: currentColors.text,
                borderColor: currentColors.border
              }
            ]}
          />
          
          <TouchableOpacity
            style={[styles.modalPayBtn, { backgroundColor: currentColors.primary }]}
            onPress={handleConfirm}
          >
            <Text style={styles.modalPayBtnText}>
              {t('balance.payButton')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleClose} style={styles.modalCancelBtn}>
            <Text style={[styles.modalCancelBtnText, { color: currentColors.textSecondary }]}>
              {t('balance.cancel')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
