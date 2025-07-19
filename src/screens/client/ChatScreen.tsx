import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Linking
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getCurrentColors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { ChatScreenStyles } from '../../styles/screens/ChatScreen.styles';
import { ChatService } from '../../services/ChatService';
import { useNavigation, useRoute } from '@react-navigation/native';

interface DisplayMessage {
  id: string;
  text: string;
  sender: 'client' | 'driver';
  timestamp: string;
  isRead: boolean;
}

const ChatScreen: React.FC = () => {
  const { isDark } = useTheme();
  const currentColors = getCurrentColors(isDark);
  const navigation = useNavigation();
  const route = useRoute();
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Моковые данные водителя
  const driverData = {
    driverName: 'Александр Петров',
    driverCar: 'Toyota Camry',
    driverNumber: '+7 (999) 123-45-67',
    driverStatus: 'online' as 'online' | 'offline'
  };

  useEffect(() => {
    // Загружаем историю сообщений
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      // Здесь будет загрузка сообщений с сервера
      const mockMessages: DisplayMessage[] = [
        {
          id: '1',
          text: 'Здравствуйте! Я подъеду через 5 минут.',
          sender: 'driver',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          isRead: true
        },
        {
          id: '2',
          text: 'Спасибо, буду ждать у подъезда.',
          sender: 'client',
          timestamp: new Date(Date.now() - 240000).toISOString(),
          isRead: true
        },
        {
          id: '3',
          text: 'Я уже на месте. Белая Toyota Camry.',
          sender: 'driver',
          timestamp: new Date(Date.now() - 120000).toISOString(),
          isRead: true
        }
      ];
      setMessages(mockMessages);
    } catch (error) {
      
      Alert.alert('Ошибка', 'Не удалось загрузить сообщения');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newMessage: DisplayMessage = {
      id: Date.now().toString(),
      text: message.trim(),
      sender: 'client',
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Прокручиваем к последнему сообщению
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      // Здесь будет отправка сообщения на сервер
      await ChatService.sendMessage('chat_1', newMessage.text);
    } catch (error) {
      
      Alert.alert('Ошибка', 'Не удалось отправить сообщение');
    }
  };

  const handleCallDriver = () => {
    Alert.alert(
      'Позвонить водителю',
      `Позвонить ${driverData.driverName}?`,
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Позвонить', 
          onPress: () => {
            Linking.openURL(`tel:${driverData.driverNumber}`);
          }
        }
      ]
    );
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <SafeAreaView style={[ChatScreenStyles.container, { backgroundColor: currentColors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[ChatScreenStyles.header, { backgroundColor: currentColors.surface }]}>
        <View style={ChatScreenStyles.headerContent}>
          <TouchableOpacity 
            style={ChatScreenStyles.backButton} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="chevron-back" 
              size={20} 
              color={currentColors.primary} 
            />
          </TouchableOpacity>
          <View style={ChatScreenStyles.driverInfo}>
            <View style={[ChatScreenStyles.driverAvatar, { backgroundColor: currentColors.surface }]}>
              <Text style={{ fontSize: 20 }}>👨‍💼</Text>
            </View>
            <View style={ChatScreenStyles.driverDetails}>
              <Text style={[ChatScreenStyles.driverName, { color: currentColors.text }]}>{driverData.driverName}</Text>
              <Text style={[ChatScreenStyles.carInfo, { color: currentColors.textSecondary }]}>{driverData.driverCar} • {driverData.driverNumber}</Text>
              <View style={ChatScreenStyles.statusContainer}>
                <View style={[ChatScreenStyles.statusDot, { backgroundColor: driverData.driverStatus === 'online' ? currentColors.success : currentColors.textSecondary }]} />
                <Text style={[ChatScreenStyles.statusText, { color: currentColors.textSecondary }]}>{driverData.driverStatus === 'online' ? 'В сети' : 'Не в сети'}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={ChatScreenStyles.callButton} onPress={handleCallDriver}>
            <Ionicons name="call" size={24} color={currentColors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView 
        style={ChatScreenStyles.messagesContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={ChatScreenStyles.messagesList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={ChatScreenStyles.messagesContent}
        >
          {messages.length === 0 ? (
            <View style={ChatScreenStyles.emptyChat}>
              <Text style={[ChatScreenStyles.emptyChatText, { color: currentColors.textSecondary }]}>
                Напишите первое сообщение
              </Text>
            </View>
          ) : (
            messages.map((msg) => (
              <View 
                key={msg.id} 
                style={[
                  ChatScreenStyles.messageContainer,
                  msg.sender === 'client' ? ChatScreenStyles.clientMessage : ChatScreenStyles.userMessage
                ]}
              >
                <View style={[
                  ChatScreenStyles.messageBubble,
                  msg.sender === 'client' 
                    ? { backgroundColor: currentColors.primary } 
                    : { backgroundColor: currentColors.surface }
                ]}>
                  <Text style={[
                    ChatScreenStyles.messageText,
                    { color: msg.sender === 'client' ? '#FFFFFF' : currentColors.text }
                  ]}>
                    {msg.text}
                  </Text>
                  <View style={ChatScreenStyles.messageFooter}>
                    <Text style={[
                      ChatScreenStyles.messageTime,
                      { color: msg.sender === 'client' ? 'rgba(255, 255, 255, 0.7)' : currentColors.textSecondary }
                    ]}>
                      {formatTime(msg.timestamp)}
                    </Text>
                    {msg.sender === 'client' && (
                      <Ionicons 
                        name={msg.isRead ? "checkmark-done" : "checkmark"} 
                        size={14} 
                        color={msg.isRead ? currentColors.success : "rgba(255, 255, 255, 0.7)"} 
                      />
                    )}
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {/* Message Input */}
        <View style={[ChatScreenStyles.inputContainer, { backgroundColor: currentColors.surface }]}>
          <View style={[ChatScreenStyles.inputRow, { backgroundColor: currentColors.surface, borderTopColor: currentColors.border }]}>
            <TextInput
              style={[ChatScreenStyles.messageInput, { 
                backgroundColor: currentColors.background,
                color: currentColors.text,
                borderColor: currentColors.border
              }]}
              placeholder="Введите сообщение..."
              placeholderTextColor={currentColors.textSecondary}
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity 
              style={[
                ChatScreenStyles.sendButton,
                { backgroundColor: message.trim() ? currentColors.primary : currentColors.border }
              ]}
              onPress={handleSendMessage}
              disabled={!message.trim()}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={message.trim() ? '#FFFFFF' : currentColors.textSecondary} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
