/**
 * PrivacyModal component
 * Privacy policy modal dialog
 */

import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { lightColors, darkColors } from '../../../../../shared/constants/colors';
import { AboutScreenStyles as styles } from '../styles/AboutScreen.styles';

interface PrivacyModalProps {
  visible: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ visible, onClose }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : lightColors;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: currentColors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: currentColors.surface }]}>
            <Text style={[styles.modalTitle, { color: currentColors.text }]}>
              {t('about.privacy')}
            </Text>
            <TouchableOpacity 
              onPress={onClose}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color={currentColors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScrollView}>
            <Text style={[styles.modalText, { color: currentColors.text }]}>
              {t('about.privacyText')}
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
