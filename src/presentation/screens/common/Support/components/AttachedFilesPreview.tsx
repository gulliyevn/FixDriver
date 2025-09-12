import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/SupportChatScreen.styles';

/**
 * Attached Files Preview Component
 * 
 * Shows preview of attached files before sending
 */

interface AttachedFilesPreviewProps {
  files: Array<{
    id: string;
    name: string;
    type: 'image' | 'document';
  }>;
  onRemoveFile: (fileId: string) => void;
  isDark: boolean;
}

export const AttachedFilesPreview: React.FC<AttachedFilesPreviewProps> = ({
  files,
  onRemoveFile,
  isDark
}) => {
  if (files.length === 0) {
    return null;
  }

  return (
    <View style={[
      styles.attachedFilesPreview,
      isDark && styles.attachedFilesPreviewDark
    ]}>
      {files.map((file) => (
        <View key={file.id} style={[
          styles.attachedFilePreview,
          isDark && styles.attachedFilePreviewDark
        ]}>
          <Ionicons 
            name={file.type === 'image' ? 'image' : 'document'} 
            size={16} 
            color={isDark ? '#9CA3AF' : '#6B7280'} 
          />
          <Text style={[
            styles.attachedFilePreviewName,
            isDark && styles.attachedFilePreviewNameDark
          ]} numberOfLines={1}>
            {file.name}
          </Text>
          <TouchableOpacity
            style={styles.removeFileButton}
            onPress={() => onRemoveFile(file.id)}
          >
            <Ionicons name="close-circle" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};
