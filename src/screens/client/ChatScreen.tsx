import React, { useState, useEffect, useRef } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { ChatScreenStyles } from '../../styles/screens/ChatScreen.styles';

interface DisplayMessage {
  id: string;
  text: string;
  sender: 'client' | 'driver';
  timestamp: string;
  isRead: boolean;
}

const ChatScreen: React.FC = () => {
  const { isDark } = useTheme();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  // Загрузка сообщений чата при монтировании компонента
  useEffect(() => {
    loadChatMessages();
  }, []);

  const loadChatMessages = async () => {
    try {
      // Ищем существующий чат с водителем
      const chats = await ChatService.getChats('me');
      const existingChat = chats.find(chat => chat.driverId === driverData.driverId);
      
      let chatId: string;
      
      if (existingChat) {
        // Если чат существует, загружаем его сообщения
        chatId = existingChat.id;
      } else {
        // Если чата нет, создаем новый
        const newChat = await ChatService.createChat(
          driverData.driverId,
          route.params.driverName || 'Водитель'
        );
        chatId = newChat.id;
      }
      
      // Загружаем сообщения
      const chatMessages = await ChatService.getMessages(chatId);
      
      // Конвертируем сообщения в формат для отображения
      const displayMessages: DisplayMessage[] = chatMessages.map(msg => ({
        id: msg.id,
        text: msg.content,
        sender: msg.senderId === 'me' ? 'client' : 'driver',
        timestamp: new Date(msg.timestamp).toLocaleTimeString('ru-RU', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        isRead: msg.isRead,
      }));
      
      setMessages(displayMessages);
      
      // Отмечаем сообщения как прочитанные
      await ChatService.markMessagesAsRead(chatId);
      
      // Автопрокрутка вниз после загрузки сообщений
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
    } catch (error) {
      console.error('❌ Ошибка загрузки чата:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    try {
      // Находим чат с водителем
      const chats = await ChatService.getChats('me');
      const chat = chats.find(chat => chat.driverId === driverData.driverId);
      
      if (!chat) {
        Alert.alert('Ошибка', 'Чат не найден');
        return;
      }

      // Отправляем сообщение
      await ChatService.sendMessage(chat.id, message.trim(), 'me');
      
      // Обновляем локальное состояние
      const newMessage: DisplayMessage = {
        id: Date.now().toString(),
        text: message.trim(),
        sender: 'client',
        timestamp: new Date().toLocaleTimeString('ru-RU', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        isRead: false,
      };
      
      setMessages([...messages, newMessage]);
      setMessage('');
      
      // Автопрокрутка вниз после отправки сообщения
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось отправить сообщение');
    }
  };

  const handleCallDriver = () => {
    const phoneNumber = '+994501234567'; // Номер телефона водителя
    
    Alert.alert(
      'Звонок водителю',
      `Позвонить водителю ${driverData.driverName}?`,
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Позвонить', 
          onPress: () => {
            try {
              const url = `tel:${phoneNumber}`;
              Linking.openURL(url).catch((err) => {
                Alert.alert('Ошибка', 'Не удалось совершить звонок');
              });
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось совершить звонок');
            }
          }
        }
      ]
    );
  };

  const formatTime = (timestamp: string) => {
    return timestamp;
  };

  return (
    <SafeAreaView style={[ChatScreenStyles.container, { backgroundColor: isDark ? '#111827' : '#F8FAFC' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={ChatScreenStyles.header}>
        <View style={ChatScreenStyles.headerContent}>
          <TouchableOpacity 
            style={ChatScreenStyles.backButton} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="chevron-back" 
              size={20} 
              color={isDark ? '#F9FAFB' : '#1F2937'} 
            />
          </TouchableOpacity>
          <View style={ChatScreenStyles.driverInfo}>
            <View style={ChatScreenStyles.driverAvatar}>
              <Text style={{ fontSize: 20 }}>👨‍💼</Text>
            </View>
            <View style={ChatScreenStyles.driverDetails}>
              <Text style={ChatScreenStyles.driverName}>{driverData.driverName}</Text>
              <Text style={ChatScreenStyles.carInfo}>{driverData.driverCar} • {driverData.driverNumber}</Text>
              <View style={ChatScreenStyles.statusContainer}>
                <View style={[ChatScreenStyles.statusDot, { backgroundColor: driverData.driverStatus === 'online' ? '#10B981' : '#6B7280' }]} />
                <Text style={ChatScreenStyles.statusText}>{driverData.driverStatus === 'online' ? 'В сети' : 'Не в сети'}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={ChatScreenStyles.callButton} onPress={handleCallDriver}>
            <Ionicons name="call" size={24} color="#1E3A8A" />
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
              <Text style={[ChatScreenStyles.emptyChatText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                Напишите первое сообщение
              </Text>
            </View>
          ) : (
            messages.map((msg) => (
              <View 
                key={msg.id} 
                style={[
                  ChatScreenStyles.messageContainer,
                  msg.sender === 'client' ? ChatScreenStyles.clientMessage : ChatScreenStyles.driverMessage
                ]}
              >
                <View style={[
                  ChatScreenStyles.messageBubble,
                  msg.sender === 'client' 
                    ? { backgroundColor: '#1E3A8A' } 
                    : { backgroundColor: isDark ? '#374151' : '#F3F4F6' }
                ]}>
                  <Text style={[
                    ChatScreenStyles.messageText,
                    { color: msg.sender === 'client' ? '#FFFFFF' : (isDark ? '#F9FAFB' : '#1F2937') }
                  ]}>
                    {msg.text}
                  </Text>
                  <View style={ChatScreenStyles.messageFooter}>
                    <Text style={[
                      ChatScreenStyles.messageTime,
                      { color: msg.sender === 'client' ? '#E5E7EB' : '#6B7280' }
                    ]}>
                      {formatTime(msg.timestamp)}
                    </Text>
                    {msg.sender === 'client' && (
                      <Ionicons 
                        name={msg.isRead ? "checkmark-done" : "checkmark"} 
                        size={14} 
                        color={msg.isRead ? "#10B981" : "#E5E7EB"} 
                      />
                    )}
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {/* Message Input */}
        <View style={ChatScreenStyles.inputContainer}>
          <View style={ChatScreenStyles.inputRow}>
            <TextInput
              style={ChatScreenStyles.messageInput}
              placeholder="Введите сообщение..."
              value={message}
              onChangeText={setMessage}
              placeholderTextColor="#6B7280"
              multiline
            />
            <TouchableOpacity 
              style={[
                ChatScreenStyles.sendButton,
                { backgroundColor: message.trim() ? '#1E3A8A' : '#E5E7EB' }
              ]}
              onPress={handleSendMessage}
              disabled={!message.trim()}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={message.trim() ? '#FFFFFF' : '#6B7280'} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
