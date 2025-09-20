import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { createLevelModalStyles } from '../styles/LevelModal.styles';

interface LevelModalProps {
  visible: boolean;
  isDark: boolean;
  levelTranslations?: any;
  t: (key: string) => string;
  onClose: () => void;
}

const LevelModal: React.FC<LevelModalProps> = ({
  visible,
  isDark,
  levelTranslations,
  t,
  onClose,
}) => {
  const styles = createLevelModalStyles(isDark);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { maxHeight: '80%', width: '90%', minHeight: 500 }]}>
          <Text style={styles.modalTitle}>Level Information</Text>
          <Text style={{ fontSize: 14, color: isDark ? '#D1D5DB' : '#6B7280', textAlign: 'left', marginBottom: 15 }}>
            Information about your current level and progress
          </Text>
          <ScrollView style={{ flex: 1, marginVertical: 10 }}>
            <Text style={styles.modalMessage}>
              Level system information will be displayed here.
            </Text>
          </ScrollView>
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.modalButtonCancel} 
              onPress={onClose}
            >
              <Text style={styles.modalButtonCancelText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LevelModal;
