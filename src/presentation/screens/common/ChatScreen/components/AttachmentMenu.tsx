import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../../../shared/hooks/useI18n';
import { styles } from '../styles/ChatScreen.styles';

/**
 * Attachment Menu Component
 * 
 * Menu for selecting attachment types
 * Provides options for camera, gallery, documents, and location
 */

interface AttachmentMenuProps {
  onCamera: () => void;
  onGallery: () => void;
  onDocument: () => void;
  onLocation: () => void;
  isDark: boolean;
}

export const AttachmentMenu: React.FC<AttachmentMenuProps> = ({
  onCamera,
  onGallery,
  onDocument,
  onLocation,
  isDark,
}) => {
  const { t } = useI18n();

  return (
    <View style={[styles.attachmentMenu, { backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5' }]}>
      <TouchableOpacity style={styles.attachmentOption} onPress={onCamera}>
        <Ionicons name="camera" size={20} color={isDark ? '#fff' : '#000'} />
        <Text style={[styles.attachmentOptionText, { color: isDark ? '#fff' : '#000' }]}>
          {t('chat.camera')}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.attachmentOption} onPress={onGallery}>
        <Ionicons name="images" size={20} color={isDark ? '#fff' : '#000'} />
        <Text style={[styles.attachmentOptionText, { color: isDark ? '#fff' : '#000' }]}>
          {t('chat.gallery')}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.attachmentOption} onPress={onDocument}>
        <Ionicons name="document" size={20} color={isDark ? '#fff' : '#000'} />
        <Text style={[styles.attachmentOptionText, { color: isDark ? '#fff' : '#000' }]}>
          {t('chat.document')}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.attachmentOption} onPress={onLocation}>
        <Ionicons name="location" size={20} color={isDark ? '#fff' : '#000'} />
        <Text style={[styles.attachmentOptionText, { color: isDark ? '#fff' : '#000' }]}>
          {t('chat.location')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
