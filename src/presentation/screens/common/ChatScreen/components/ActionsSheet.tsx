import React from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../../../shared/hooks/useI18n';
import { styles } from '../styles/ChatScreen.styles';

/**
 * Actions Sheet Component
 * 
 * Bottom sheet for chat actions
 * Provides options for clearing, exporting, deleting, reporting, and blocking
 */

interface ActionsSheetProps {
  visible: boolean;
  onClose: () => void;
  onClearChat: () => void;
  onExportChat: () => void;
  onDeleteChat: () => void;
  onReport: () => void;
  onBlock: () => void;
  isDark: boolean;
}

export const ActionsSheet: React.FC<ActionsSheetProps> = ({
  visible,
  onClose,
  onClearChat,
  onExportChat,
  onDeleteChat,
  onReport,
  onBlock,
  isDark,
}) => {
  const { t } = useI18n();

  if (!visible) return null;

  return (
    <View style={styles.callSheetOverlay}>
      <Pressable style={styles.callSheetBackdrop} onPress={onClose} />
      <View style={[styles.callSheetContainer, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
        <TouchableOpacity 
          style={styles.callSheetClose} 
          onPress={onClose} 
          accessibilityLabel={t('common.close')}
        >
          <Ionicons name="close" size={22} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
        <View style={[styles.callSheetHandle, { backgroundColor: isDark ? '#333' : '#ccc' }]} />
        <Text style={[styles.callSheetTitle, { color: isDark ? '#fff' : '#000' }]}>
          {t('chat.title')}
        </Text>
        
        <TouchableOpacity style={styles.callSheetOption} onPress={onClearChat}>
          <Ionicons name="trash-outline" size={20} color={isDark ? '#fff' : '#000'} />
          <Text style={[styles.callSheetOptionText, { color: isDark ? '#fff' : '#000' }]}>
            {t('chat.clearChat')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.callSheetOption} onPress={onExportChat}>
          <Ionicons name="download-outline" size={20} color={isDark ? '#fff' : '#000'} />
          <Text style={[styles.callSheetOptionText, { color: isDark ? '#fff' : '#000' }]}>
            {t('chat.exportChat')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.callSheetOption} onPress={onDeleteChat}>
          <Ionicons name="trash" size={20} color="#f44336" />
          <Text style={[styles.callSheetOptionText, { color: '#f44336' }]}>
            {t('chat.deleteChat')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.callSheetOption} onPress={onReport}>
          <Ionicons name="alert-circle-outline" size={20} color={isDark ? '#fff' : '#000'} />
          <Text style={[styles.callSheetOptionText, { color: isDark ? '#fff' : '#000' }]}>
            {t('chat.report')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.callSheetOption} onPress={onBlock}>
          <Ionicons name="hand-left-outline" size={20} color={isDark ? '#fff' : '#000'} />
          <Text style={[styles.callSheetOptionText, { color: isDark ? '#fff' : '#000' }]}>
            {t('chat.block')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
