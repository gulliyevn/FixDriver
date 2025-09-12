import React from 'react';
import { SafeAreaView, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { useI18n } from '../../../../shared/hooks/useI18n';
import { useAuth } from '../../../../context/AuthContext';
import { useSupportChat } from './hooks/useSupportChat';
import { useSupportMessages } from './hooks/useSupportMessages';
import { useSupportActions } from './hooks/useSupportActions';
import { MessageBubble } from './components/MessageBubble';
import { QuickQuestions } from './components/QuickQuestions';
import { AttachedFilesPreview } from './components/AttachedFilesPreview';
import { InputArea } from './components/InputArea';
import { SupportHeader } from './components/SupportHeader';
import { LoadingState } from './components/LoadingState';
import { styles } from './styles/SupportChatScreen.styles';

/**
 * Support Chat Screen
 * 
 * Main screen for support chat functionality
 * Modular structure with separated components and hooks
 */

interface SupportChatScreenProps {
  navigation: { goBack: () => void };
  route?: {
    params?: {
      initialMessage?: string;
      quickQuestion?: string;
    };
  };
}

const SupportChatScreen: React.FC<SupportChatScreenProps> = ({ navigation, route }) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const { user } = useAuth();
  
  const {
    messages,
    isLoading,
    currentTicket,
    attachedFiles,
    setAttachedFiles,
    initializeChat,
    sendMessage,
    selectQuickQuestion,
    removeAttachedFile,
    handleClose
  } = useSupportChat(route?.params);

  const {
    inputText,
    setInputText,
    handleAttachFile,
    handleSendMessage
  } = useSupportMessages({
    sendMessage,
    attachedFiles,
    setAttachedFiles
  });

  const {
    handleCloseChat
  } = useSupportActions({
    handleClose,
    navigation
  });

  const isDriver = user?.role === 'driver';
  const screenTitle = isDriver ? t('support.title') : t('support.title');

  const renderMessage = ({ item }: { item: any }) => (
    <MessageBubble 
      message={item} 
      isDark={isDark}
      formatTime={formatTime}
    />
  );

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
        <LoadingState isDark={isDark} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <KeyboardAvoidingView
        style={[styles.keyboardView, { backgroundColor: isDark ? '#1F2937' : '#F5F5F5' }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <SupportHeader 
          title={screenTitle}
          isDark={isDark}
          onBack={() => navigation.goBack()}
          onClose={handleCloseChat}
        />

        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContent}
          style={{ backgroundColor: isDark ? '#1F2937' : '#F5F5F5' }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => (
            messages.length === 1 && (
              <QuickQuestions 
                onSelectQuestion={selectQuickQuestion}
                isDark={isDark}
              />
            )
          )}
        />

        <AttachedFilesPreview 
          files={attachedFiles}
          onRemoveFile={removeAttachedFile}
          isDark={isDark}
        />

        <InputArea
          inputText={inputText}
          setInputText={setInputText}
          attachedFiles={attachedFiles}
          onAttachFile={handleAttachFile}
          onSendMessage={handleSendMessage}
          isDark={isDark}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SupportChatScreen;
