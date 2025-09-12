/**
 * HelpModal component
 * Generic modal for help content
 */

import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../../../../context/LanguageContext';
import { HelpScreenStyles as styles } from '../styles/HelpScreen.styles';

interface HelpModalProps {
  visible: boolean;
  modalType: string | null;
  onClose: () => void;
  colors: any;
}

export const HelpModal: React.FC<HelpModalProps> = ({ 
  visible, 
  modalType, 
  onClose, 
  colors 
}) => {
  const { t } = useLanguage();

  const getModalContent = () => {
    switch (modalType) {
      case 'booking':
        return {
          title: t('help.modals.booking.title'),
          content: t('help.modals.booking.content')
        };
      case 'payment':
        return {
          title: t('help.modals.payment.title'),
          content: t('help.modals.payment.content')
        };
      case 'safety':
        return {
          title: t('help.modals.safety.title'),
          content: t('help.modals.safety.content')
        };
      case 'rules':
        return {
          title: t('help.modals.rules.title'),
          content: t('help.modals.rules.content')
        };
      default:
        return {
          title: '',
          content: ''
        };
    }
  };

  const modalContent = getModalContent();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.modalHeader, { backgroundColor: colors.surface }]}>
          <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            {modalContent.title}
          </Text>
          <View style={styles.placeholder} />
        </View>
        
        <ScrollView 
          style={styles.modalContent}
          contentContainerStyle={styles.modalContentContainer}
        >
          <Text style={[styles.modalText, { color: colors.text }]}>
            {modalContent.content}
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
};
