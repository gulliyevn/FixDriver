import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RulesModalStyles as styles } from '../styles/components/RulesModal.styles';
import { useI18n } from '../hooks/useI18n';

interface ConditionsModalProps {
  visible: boolean;
  onClose: () => void;
}

const ConditionsModal: React.FC<ConditionsModalProps> = ({ visible, onClose }) => {
  const { t } = useI18n();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity 
            onPress={onClose} 
            style={styles.modalCloseButton}
          >
            <Ionicons name="close" size={24} color="#003366" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{t('conditions.title')}</Text>
          <View style={styles.placeholder} />
        </View>
        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.rulesText}>{t('conditions.text')}</Text>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default ConditionsModal; 