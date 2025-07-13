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
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { SupportChatScreenStyles } from '../../styles/screens/SupportChatScreen.styles';
import { mockSupportData } from '../../mocks';
import { supportService, SupportMessage, SupportTicket } from '../../services/SupportService';

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
  const [currentTicket, setCurrentTicket] = useState<SupportTicket | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const { quickQuestions } = mockSupportData;

  useEffect(() => {
    initializeSupportChat();
  }, [route?.params]);

  const initializeSupportChat = () => {
    setIsLoading(true);
    
    try {
      // Создаем новый тикет поддержки
      const initialMessage = route?.params?.initialMessage || 'Начало чата с поддержкой';
      const ticket = supportService.createSupportTicket('Чат с поддержкой', initialMessage);
      setCurrentTicket(ticket);
      
      // Конвертируем сообщения тикета в формат для отображения
      const displayMessages: Message[] = ticket.messages.map(msg => ({
        id: msg.id,
        text: msg.text,
        isUser: msg.sender === 'user',
        timestamp: msg.timestamp,
      }));
      
      setMessages(displayMessages);
      
      // Если есть быстрый вопрос, выбираем его
      if (route?.params?.quickQuestion) {
        selectQuickQuestion(route.params.quickQuestion);
      }
      
    } catch (error) {
      console.error('Ошибка инициализации чата поддержки:', error);
      Alert.alert('Ошибка', 'Не удалось инициализировать чат поддержки');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = () => {
    if (!inputText.trim() || !currentTicket) return;

    const messageText = inputText.trim();
    setInputText('');

    try {
      // Добавляем сообщение пользователя в тикет
      supportService.addUserMessage(currentTicket.id, messageText);
      
      // Обновляем локальное состояние
      const userMessage: Message = {
        id: Date.now().toString(),
        text: messageText,
        isUser: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Симулируем ответ поддержки
      supportService.simulateSupportResponse(currentTicket.id, messageText);
      
      // Обновляем тикет
      const updatedTicket = supportService.getCurrentTicket();
      if (updatedTicket) {
        setCurrentTicket(updatedTicket);
        
        // Добавляем ответ поддержки в UI
        setTimeout(() => {
          const lastSupportMessage = updatedTicket.messages[updatedTicket.messages.length - 1];
          if (lastSupportMessage && lastSupportMessage.sender === 'support') {
            const supportMessage: Message = {
              id: lastSupportMessage.id,
              text: lastSupportMessage.text,
              isUser: false,
              timestamp: lastSupportMessage.timestamp,
            };
            setMessages(prev => [...prev, supportMessage]);
          }
        }, 2000);
      }
      
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      Alert.alert('Ошибка', 'Не удалось отправить сообщение');
    }
  };

  const selectQuickQuestion = (question: string) => {
    if (!currentTicket) return;
    
    try {
      // Добавляем быстрый вопрос как сообщение пользователя
      supportService.addUserMessage(currentTicket.id, question);
      
      // Обновляем локальное состояние
      const userMessage: Message = {
        id: Date.now().toString(),
        text: question,
        isUser: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Симулируем ответ поддержки
      supportService.simulateSupportResponse(currentTicket.id, question);
      
      // Обновляем тикет
      const updatedTicket = supportService.getCurrentTicket();
      if (updatedTicket) {
        setCurrentTicket(updatedTicket);
        
        // Добавляем ответ поддержки в UI
        setTimeout(() => {
          const lastSupportMessage = updatedTicket.messages[updatedTicket.messages.length - 1];
          if (lastSupportMessage && lastSupportMessage.sender === 'support') {
            const supportMessage: Message = {
              id: lastSupportMessage.id,
              text: lastSupportMessage.text,
              isUser: false,
              timestamp: lastSupportMessage.timestamp,
            };
            setMessages(prev => [...prev, supportMessage]);
          }
        }, 2000);
      }
      
    } catch (error) {
      console.error('Ошибка выбора быстрого вопроса:', error);
      Alert.alert('Ошибка', 'Не удалось отправить быстрый вопрос');
    }
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
          onPress={() => selectQuickQuestion(question.question)}
        >
          <Text style={[
            SupportChatScreenStyles.quickQuestionText,
            isDark && SupportChatScreenStyles.quickQuestionTextDark
          ]}>
            {question.question}
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
    <SafeAreaView style={[
      SupportChatScreenStyles.container,
      isDark && SupportChatScreenStyles.containerDark
    ]}>
      <KeyboardAvoidingView
        style={SupportChatScreenStyles.keyboardView}
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
        {isLoading ? (
          <View style={SupportChatScreenStyles.loadingContainer}>
            <Text style={[
              SupportChatScreenStyles.loadingText,
              isDark && SupportChatScreenStyles.loadingTextDark
            ]}>
              Подключение к поддержке...
            </Text>
          </View>
        ) : (
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
        )}
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
    </SafeAreaView>
  );
};

export default SupportChatScreen; 