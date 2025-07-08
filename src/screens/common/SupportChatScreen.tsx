import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { SupportChatScreenStyles } from '../../styles/screens/SupportChatScreen.styles';
import { mockSupportData } from '../../mocks';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const { quickQuestions } = mockSupportData.supportData;

  useEffect(() => {
    // Добавляем приветственное сообщение
    const welcomeMessage: Message = {
      id: '1',
      text: 'Здравствуйте! Чем могу помочь?',
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);

    // Если есть начальное сообщение, добавляем его
    if (route?.params?.initialMessage) {
      const userMessage: Message = {
        id: '2',
        text: route.params.initialMessage,
        isUser: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
    }

    // Если есть быстрый вопрос, выбираем его
    if (route?.params?.quickQuestion) {
      selectQuickQuestion(route.params.quickQuestion);
    }
  }, [route?.params]);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Имитация ответа поддержки
    setTimeout(() => {
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Спасибо за ваше сообщение. Наш специалист скоро свяжется с вами.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, supportMessage]);
    }, 2000);
  };

  const selectQuickQuestion = (question: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: question,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Имитация ответа поддержки
    setTimeout(() => {
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `По вопросу "${question}" - давайте разберем это подробнее. Можете описать ситуацию детальнее?`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, supportMessage]);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleClose = () => {
    Alert.alert(
      'Закрыть чат',
      'Вы уверены, что хотите закрыть чат?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Закрыть', onPress: () => navigation.goBack(), style: 'destructive' }
      ]
    );
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      SupportChatScreenStyles.messageContainer,
      item.isUser ? SupportChatScreenStyles.userMessage : SupportChatScreenStyles.supportMessage
    ]}>
      <View style={[
        SupportChatScreenStyles.messageBubble,
        item.isUser 
          ? [SupportChatScreenStyles.userBubble, isDark && SupportChatScreenStyles.userBubbleDark]
          : [SupportChatScreenStyles.supportBubble, isDark && SupportChatScreenStyles.supportBubbleDark]
      ]}>
        {!item.isUser && (
          <View style={SupportChatScreenStyles.supportHeader}>
            <Ionicons name="person-circle" size={16} color="#1E3A8A" />
            <Text style={SupportChatScreenStyles.supportName}>Поддержка</Text>
          </View>
        )}
        <Text style={[
          SupportChatScreenStyles.messageText,
          item.isUser 
            ? SupportChatScreenStyles.userMessageText
            : [SupportChatScreenStyles.supportMessageText, isDark && SupportChatScreenStyles.supportMessageTextDark]
        ]}>
          {item.text}
        </Text>
        <Text style={[
          SupportChatScreenStyles.messageTime,
          item.isUser 
            ? SupportChatScreenStyles.userMessageTime
            : [SupportChatScreenStyles.supportMessageTime, isDark && SupportChatScreenStyles.supportMessageTimeDark]
        ]}>
          {formatTime(item.timestamp)}
        </Text>
      </View>
    </View>
  );

  const renderQuickQuestions = () => (
    <View style={SupportChatScreenStyles.quickQuestionsContainer}>
      <Text style={[
        SupportChatScreenStyles.quickQuestionsTitle,
        isDark && SupportChatScreenStyles.quickQuestionsTitleDark
      ]}>
        Быстрые вопросы:
      </Text>
      {quickQuestions.map((question, index) => (
        <TouchableOpacity
          key={index}
          style={[
            SupportChatScreenStyles.quickQuestionButton,
            isDark && SupportChatScreenStyles.quickQuestionButtonDark
          ]}
          onPress={() => selectQuickQuestion(question)}
        >
          <Text style={[
            SupportChatScreenStyles.quickQuestionText,
            isDark && SupportChatScreenStyles.quickQuestionTextDark
          ]}>
            {question}
          </Text>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={isDark ? '#9CA3AF' : '#6B7280'} 
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[
        SupportChatScreenStyles.container,
        isDark && SupportChatScreenStyles.containerDark
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={[
        SupportChatScreenStyles.header,
        isDark && SupportChatScreenStyles.headerDark
      ]}>
        <TouchableOpacity 
          style={SupportChatScreenStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? '#F9FAFB' : '#111827'} />
        </TouchableOpacity>
        
        <View style={SupportChatScreenStyles.headerInfo}>
          <Text style={[
            SupportChatScreenStyles.headerTitle,
            isDark && SupportChatScreenStyles.headerTitleDark
          ]}>
            Поддержка
          </Text>
          <View style={SupportChatScreenStyles.statusContainer}>
            <View style={SupportChatScreenStyles.onlineIndicator} />
            <Text style={[
              SupportChatScreenStyles.statusText,
              isDark && SupportChatScreenStyles.statusTextDark
            ]}>
              Онлайн
            </Text>
          </View>
        </View>
        
        <TouchableOpacity style={SupportChatScreenStyles.closeButton} onPress={handleClose}>
          <Ionicons name="close" size={24} color={isDark ? '#F9FAFB' : '#111827'} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <View style={SupportChatScreenStyles.messagesContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={SupportChatScreenStyles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={() => (
            <>
              {messages.length === 1 && renderQuickQuestions()}
            </>
          )}
        />
      </View>

      {/* Input */}
      <View style={[
        SupportChatScreenStyles.inputContainer,
        isDark && SupportChatScreenStyles.inputContainerDark
      ]}>
        <TextInput
          style={[
            SupportChatScreenStyles.textInput,
            isDark && SupportChatScreenStyles.textInputDark
          ]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Введите сообщение..."
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            SupportChatScreenStyles.sendButton,
            isDark && SupportChatScreenStyles.sendButtonDark,
            !inputText.trim() && SupportChatScreenStyles.sendButtonDisabled
          ]}
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SupportChatScreen; 