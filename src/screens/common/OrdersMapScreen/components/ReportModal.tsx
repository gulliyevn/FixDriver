import React from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { useI18n } from '../../../../hooks/useI18n';
import { createOrdersMapScreenStyles } from '../../../../styles/screens/OrdersMapScreen.styles';

interface ReportModalProps {
  isVisible: boolean;
  reportComment: string;
  onCommentChange: (comment: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({
  isVisible,
  reportComment,
  onCommentChange,
  onSubmit,
  onCancel,
}) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const styles = createOrdersMapScreenStyles(isDark);

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.reportModalOverlay}>
        <View style={styles.reportModalContainer}>
          <View style={styles.reportModalHeader}>
            <View style={styles.reportIconContainer}>
              <Ionicons name="warning" size={32} color="#DC2626" />
            </View>
            <Text style={styles.reportModalTitle}>{t('common.report.title')}</Text>
          </View>
          
          <Text style={styles.reportModalSubtitle}>
            {t('common.report.subtitle')}
          </Text>
          
          <TextInput
            style={styles.reportCommentInput}
            placeholder={t('common.report.commentPlaceholder')}
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={reportComment}
            onChangeText={onCommentChange}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          
          <View style={styles.reportModalButtons}>
            <TouchableOpacity 
              style={styles.reportCancelButton}
              onPress={onCancel}
            >
              <Text style={styles.reportCancelButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.reportSubmitButton}
              onPress={onSubmit}
            >
              <Text style={styles.reportSubmitButtonText}>{t('common.report.submit')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ReportModal;
