import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RulesModalStyles as styles } from '../styles/components/RulesModal.styles';
import { useI18n } from '../hooks/useI18n';

interface PolicyModalProps {
  visible: boolean;
  onClose: () => void;
}

const PolicyModal: React.FC<PolicyModalProps> = ({ visible, onClose }) => {
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
          <Text style={styles.modalTitle}>{t('policy.title')}</Text>
          <View style={styles.placeholder} />
        </View>
        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.rulesText}>{t('policy.text')}</Text>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default PolicyModal; 