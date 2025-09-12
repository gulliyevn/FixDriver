/**
 * ChangePasswordModal component
 * Modal for changing user password
 */

import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { useAuth } from '../../../../context/AuthContext';
import { PasswordForm } from './PasswordForm';
import { usePasswordValidation } from '../hooks/usePasswordValidation';
import { SettingsScreenStyles as styles } from '../styles/SettingsScreen.styles';
import { lightColors, darkColors } from '../../../../../../shared/constants/colors';

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ 
  visible, 
  onClose 
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  const currentColors = isDark ? darkColors : lightColors;
  
  const [loading, setLoading] = useState(false);
  const { validatePassword, validateForm } = usePasswordValidation();

  const handleSave = async (formData: any) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const result = await ProfileService.changePassword({
      //   currentPassword: formData.currentPassword,
      //   newPassword: formData.newPassword,
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        t('password.successTitle'), 
        t('password.changeSuccess'),
        [
          {
            text: t('password.ok'),
            onPress: onClose
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        t('password.errorTitle'), 
        t('password.changeError')
      );
    } finally {
      setLoading(false);
    }
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
                {t('password.cancel')}
              </Text>
            </TouchableOpacity>
            
            <Text style={[styles.modalTitle, { color: currentColors.text }]}>
              {t('password.changeTitle')}
            </Text>
            
            <View style={styles.placeholder} />
          </View>
          
          <PasswordForm 
            onSave={handleSave}
            onCancel={handleCancel}
            loading={loading}
          />
        </View>
      </View>
    </Modal>
  );
};
