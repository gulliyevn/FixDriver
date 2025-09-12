import React from 'react';
import { View, Text, TouchableOpacity, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../../../shared/hooks/useI18n';
import { styles } from '../styles/ChatScreen.styles';

/**
 * Call Sheet Component
 * 
 * Bottom sheet for call options
 * Provides internet and network call options
 */

interface CallSheetProps {
  visible: boolean;
  onClose: () => void;
  onInternetCall: () => void;
  onNetworkCall: () => void;
  isDark: boolean;
}

export const CallSheet: React.FC<CallSheetProps> = ({
  visible,
  onClose,
  onInternetCall,
  onNetworkCall,
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
          {t('chat.callOptions')}
        </Text>
        
        <TouchableOpacity style={styles.callSheetOption} onPress={onInternetCall}>
          <Ionicons name="wifi" size={20} color={isDark ? '#fff' : '#000'} />
          <Text style={[styles.callSheetOptionText, { color: isDark ? '#fff' : '#000' }]}>
            {t('chat.internetCall')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.callSheetOption} onPress={onNetworkCall}>
          <Ionicons name="call" size={20} color={isDark ? '#fff' : '#000'} />
          <Text style={[styles.callSheetOptionText, { color: isDark ? '#fff' : '#000' }]}>
            {t('chat.networkCall')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
