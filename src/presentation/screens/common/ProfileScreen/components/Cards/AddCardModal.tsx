/**
 * AddCardModal component
 * Modal for adding new cards
 */

import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { CardForm } from './CardForm';
import { CardsScreenStyles as styles } from '../styles/CardsScreen.styles';
import { lightColors, darkColors } from '../../../../../shared/constants/colors';

interface AddCardModalProps {
  visible: boolean;
  onClose: () => void;
  isDriver: boolean;
}

export const AddCardModal: React.FC<AddCardModalProps> = ({ 
  visible, 
  onClose, 
  isDriver 
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : lightColors;

  const handleSave = () => {
    // Form validation and save logic handled in CardForm
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: currentColors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: currentColors.border }]}>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <Text style={[styles.closeButtonText, { color: currentColors.primary }]}>
                {t('cards.cancel')}
              </Text>
            </TouchableOpacity>
            
            <Text style={[styles.modalTitle, { color: currentColors.text }]}>
              {isDriver ? t('cards.addTitleForDriver') : t('cards.addTitle')}
            </Text>
            
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={[styles.saveButtonText, { color: currentColors.primary }]}>
                {t('cards.save')}
              </Text>
            </TouchableOpacity>
          </View>
          
          <CardForm isDriver={isDriver} onSave={handleSave} onCancel={handleCancel} />
        </View>
      </View>
    </Modal>
  );
};
