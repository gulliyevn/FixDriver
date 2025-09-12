import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../../../shared/hooks/useI18n';
import { CancelModalStyles as styles } from '../styles/CancelModal.styles';

/**
 * Cancel Modal Component
 * 
 * Modal for subscription cancellation confirmation
 */

interface CancelModalProps {
  visible: boolean;
  packageName: string;
  onClose: () => void;
  onConfirm: () => void;
  isDark: boolean;
}

export const CancelModal: React.FC<CancelModalProps> = ({
  visible,
  packageName,
  onClose,
  onConfirm,
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
        <View style={[styles.modalContainer, styles.cancelModalContainer, isDark && styles.modalContainerDark]}>
          <View style={[styles.modalIconContainer, styles.errorIconContainer]}>
            <Ionicons name="warning" size={32} color="#FFFFFF" />
          </View>
          
          <Text style={[styles.modalTitle, isDark && styles.modalTitleDark]}>
            {t('premium.subscription.cancelTitle')}
          </Text>
          
          <Text style={[styles.modalMessage, isDark && styles.modalMessageDark]}>
            {t('premium.subscription.cancelMessage', { packageName })}
          </Text>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.secondaryButton, isDark && styles.secondaryButtonDark]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={[styles.modalButtonText, isDark && styles.secondaryButtonTextDark]}>
                {t('premium.subscription.keepButton')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.dangerButton]}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text style={[styles.modalButtonText, styles.whiteText]}>
                {t('premium.subscription.cancelButton')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
