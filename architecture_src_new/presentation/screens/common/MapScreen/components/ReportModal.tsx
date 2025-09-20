import React from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../../core/context/ThemeContext';
import { useI18n } from '../../../../../shared/i18n';
import { createMapScreenStyles } from '../styles/MapScreen.styles';

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
  const styles = createMapScreenStyles(isDark);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.reportModalContainer}>
          <View style={styles.reportModalHeader}>
            <Text style={styles.reportModalTitle}>
              {t('map.report.title')}
            </Text>
            <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={isDark ? '#fff' : '#000'} />
            </TouchableOpacity>
          </View>

          <View style={styles.reportModalContent}>
            <Text style={styles.reportModalDescription}>
              {t('map.report.description')}
            </Text>
            
            <TextInput
              style={styles.reportTextInput}
              placeholder={t('map.report.placeholder')}
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
              value={reportComment}
              onChangeText={onCommentChange}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.reportModalActions}>
            <TouchableOpacity 
              style={[styles.reportButton, styles.cancelButton]} 
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>
                {t('common.cancel')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.reportButton, styles.submitButton]} 
              onPress={onSubmit}
            >
              <Text style={styles.submitButtonText}>
                {t('common.submit')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ReportModal;
