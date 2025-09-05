import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from '../../../../../../core/context/ThemeContext';
import { useI18n } from '../../../../../../shared/i18n';
import { createMapScreenStyles } from '../../styles/MapScreen.styles';

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
  const { t } = useI18n();
  const styles = createMapScreenStyles(isDark);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onNo}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.simpleDialogContainer}>
          <View style={styles.simpleDialogHeader}>
            <Text style={styles.simpleDialogTitle}>
              {title}
            </Text>
          </View>

          <View style={styles.simpleDialogContent}>
            <Text style={styles.simpleDialogMessage}>
              {message}
            </Text>
          </View>

          <View style={styles.simpleDialogActions}>
            <TouchableOpacity 
              style={[styles.dialogButton, styles.noButton]} 
              onPress={onNo}
            >
              <Text style={styles.noButtonText}>
                {t('common.no')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.dialogButton, styles.yesButton]} 
              onPress={onYes}
            >
              <Text style={styles.yesButtonText}>
                {t('common.yes')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SimpleDialog;
