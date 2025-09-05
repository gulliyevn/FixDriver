import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { getCurrentTimeString } from '../utils/timeUtils';

interface StatusModalProps {
  visible: boolean;
  styles: any;
  vipCurrentHours: number;
  isOnline: boolean;
  t: (key: string) => string;
  onClose: () => void;
  onConfirm: () => void;
}

const StatusModal: React.FC<StatusModalProps> = ({
  visible,
  styles,
  vipCurrentHours,
  isOnline,
  t,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalTimerContainer}>
            <Text style={styles.modalTimerText}>
              {getCurrentTimeString(vipCurrentHours)}
            </Text>
          </View>
          <Text style={styles.modalTitle}>{t('driver.status.changeStatus')}</Text>
          <Text style={styles.modalMessage}>
            {t('driver.status.changeStatusMessage')}{'\n'}
            <Text style={styles.modalStatusText}>
              {isOnline ? t('driver.status.offline') : t('driver.status.online')}?
            </Text>
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.modalButtonCancel} 
              onPress={onClose}
            >
              <Text style={styles.modalButtonCancelText}>{t('driver.status.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalButtonConfirm} 
              onPress={onConfirm}
            >
              <Text style={styles.modalButtonConfirmText}>{t('driver.status.confirm')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default StatusModal;
