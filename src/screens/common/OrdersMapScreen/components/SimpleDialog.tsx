import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { createOrdersMapScreenStyles } from '../../../../styles/screens/OrdersMapScreen.styles';

interface SimpleDialogProps {
  isVisible: boolean;
  title: string;
  message: string;
  onYes: () => void;
  onNo: () => void;
}

const SimpleDialog: React.FC<SimpleDialogProps> = ({
  isVisible,
  title,
  message,
  onYes,
  onNo,
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const styles = createOrdersMapScreenStyles(isDark);

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onNo}
    >
      <View style={styles.simpleDialogOverlay}>
        <View style={styles.simpleDialogContainer}>
          <Text style={styles.simpleDialogTitle}>{title}</Text>
          <Text style={styles.simpleDialogMessage}>{message}</Text>
          <View style={styles.simpleDialogButtons}>
            <TouchableOpacity
              style={styles.simpleDialogNoButton}
              onPress={onNo}
            >
              <Text style={styles.simpleDialogNoButtonText}>{t('common.emergency.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.simpleDialogYesButton, { backgroundColor: '#DC2626' }]}
              onPress={onYes}
            >
              <Text style={styles.simpleDialogYesButtonText}>{t('common.emergency.call')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SimpleDialog;
