import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../../../shared/hooks/useI18n';
import { SuccessModalStyles as styles } from '../styles/SuccessModal.styles';

/**
 * Success Modal Component
 * 
 * Modal for successful package purchase
 */

interface SuccessModalProps {
  visible: boolean;
  packageName: string;
  onClose: () => void;
  isDark: boolean;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  packageName,
  onClose,
  isDark
}) => {
  const { t } = useI18n();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, isDark && styles.modalContainerDark]}>
          <View style={[styles.modalIconContainer, styles.successIconContainer]}>
            <Ionicons name="checkmark" size={32} color="#FFFFFF" />
          </View>
          
          <Text style={[styles.modalTitle, isDark && styles.modalTitleDark]}>
            {t('premium.success.title')}
          </Text>
          
          <Text style={[styles.modalMessage, isDark && styles.modalMessageDark]}>
            {t('premium.success.message', { packageName })}
          </Text>
          
          <TouchableOpacity
            style={[styles.modalButton, styles.primaryButton]}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={[styles.modalButtonText, styles.whiteText]}>
              {t('common.ok')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
