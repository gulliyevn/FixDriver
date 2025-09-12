import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../../../shared/hooks/useI18n';
import { styles } from '../styles/SupportChatScreen.styles';

/**
 * Input Area Component
 * 
 * Text input with attach and send buttons
 */

interface InputAreaProps {
  inputText: string;
  setInputText: (text: string) => void;
  attachedFiles: Array<{
    id: string;
    name: string;
    type: 'image' | 'document';
  }>;
  onAttachFile: () => void;
  onSendMessage: () => void;
  isDark: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({
  inputText,
  setInputText,
  attachedFiles,
  onAttachFile,
  onSendMessage,
  isDark
}) => {
  const { t } = useI18n();

  const canSend = inputText.trim() || attachedFiles.length > 0;

  return (
    <View style={[
      styles.inputContainer,
      isDark && styles.inputContainerDark
    ]}>
      <TouchableOpacity
        style={[
          styles.attachButton,
          isDark && styles.attachButtonDark
        ]}
        onPress={onAttachFile}
      >
        <Ionicons 
          name="attach" 
          size={20} 
          color={isDark ? '#9CA3AF' : '#6B7280'} 
        />
      </TouchableOpacity>
      
      <TextInput
        style={[
          styles.textInput,
          isDark && styles.textInputDark
        ]}
        value={inputText}
        onChangeText={setInputText}
        placeholder={t('support.messagePlaceholder')}
        placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
        multiline
        maxLength={500}
      />
      
      <TouchableOpacity
        style={[
          styles.sendButton,
          isDark && styles.sendButtonDark,
          !canSend && styles.sendButtonDisabled
        ]}
        onPress={onSendMessage}
        disabled={!canSend}
      >
        <Ionicons 
          name="send" 
          size={20} 
          color="#FFFFFF" 
        />
      </TouchableOpacity>
    </View>
  );
};
