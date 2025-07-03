import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
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
import AppCard from '../../components/AppCard';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ClientStackParamList } from '../../types/navigation';
import { chatService } from '../../services/ChatService';
import { Message as ChatMessage } from '../../types/chat';

interface DisplayMessage {
  id: string;
  text: string;
  sender: 'client' | 'driver';
  timestamp: string;
  isRead: boolean;
}

type ChatScreenRouteProp = RouteProp<ClientStackParamList, 'ChatConversation'>;
type ChatScreenNavigationProp = StackNavigationProp<ClientStackParamList, 'ChatConversation'>;

  const ChatScreen: React.FC = () => {
  const { isDark } = useTheme();
  const route = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation<ChatScreenNavigationProp>();
  
  // Получаем данные водителя из параметров навигации
  const driverData = route.params || {
    driverId: 'default',
    driverName: 'Александр Петров',
    driverCar: 'Toyota Camry',
    driverNumber: 'А123БВ777',
    driverRating: '4.8',
    driverStatus: 'online'
  };

  // Логируем параметры для отладки
  React.useEffect(() => {
    console.log('💬 ChatScreen: получены параметры водителя:', {
      driverId: driverData.driverId,
      driverName: driverData.driverName,
      driverStatus: driverData.driverStatus
    });
  }, [route.params]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  // Загрузка сообщений чата при монтировании компонента
  useEffect(() => {
    loadChatMessages();
  }, [route.params.driverId]);

  const loadChatMessages = async () => {
    try {
      const driverId = route.params.driverId;
      if (!driverId) return;
      
      // Ищем существующий чат с водителем
      const chats = await chatService.getChats('me');
      const existingChat = chats.find(chat => chat.participantId === driverId);
      
      let chatId: string;
      
      if (existingChat) {
        // Если чат существует, загружаем его сообщения
        chatId = existingChat.id;
      } else {
        // Если чата нет, создаем новый
        const newChat = await chatService.createChat(
          driverId,
          route.params.driverName || 'Водитель'
        );
        chatId = newChat.id;
      }
      
      // Загружаем сообщения
      const chatMessages = await chatService.getMessages(chatId);
      
      // Конвертируем сообщения в формат для отображения
      const displayMessages: DisplayMessage[] = chatMessages.map(msg => ({
        id: msg.id,
        text: msg.content,
        sender: msg.senderId === 'me' ? 'client' : 'driver',
        timestamp: msg.timestamp.toLocaleTimeString('ru-RU', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        isRead: msg.isRead,
      }));
      
      setMessages(displayMessages);
      
      // Отмечаем сообщения как прочитанные
      await chatService.markMessagesAsRead(chatId);
      
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
      const driverId = route.params.driverId;
      if (!driverId) {
        Alert.alert('Ошибка', 'Не найден идентификатор водителя');
        return;
      }

      // Находим чат с водителем
      const chats = await chatService.getChats('me');
      const chat = chats.find(chat => chat.participantId === driverId);
      
      if (!chat) {
        Alert.alert('Ошибка', 'Чат не найден');
        return;
      }

      // Отправляем сообщение
      await chatService.sendMessage(chat.id, message.trim(), 'me');
      
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
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111827' : '#F8FAFC' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Chat', { screen: 'ChatList' })}>
            <Ionicons name="chevron-back-outline" size={28} color="#1E3A8A" />
          </TouchableOpacity>
          <View style={styles.driverInfo}>
            <View style={styles.driverAvatar}>
              <Text style={{ fontSize: 20 }}>👨‍💼</Text>
            </View>
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{driverData.driverName}</Text>
              <Text style={styles.carInfo}>{driverData.driverCar} • {driverData.driverNumber}</Text>
              <View style={styles.statusContainer}>
                <View style={[styles.statusDot, { backgroundColor: driverData.driverStatus === 'online' ? '#10B981' : '#6B7280' }]} />
                <Text style={styles.statusText}>{driverData.driverStatus === 'online' ? 'В сети' : 'Не в сети'}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.callButton} onPress={handleCallDriver}>
            <Ionicons name="call" size={24} color="#1E3A8A" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView 
        style={styles.messagesContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyChat}>
              <Text style={[styles.emptyChatText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                Напишите первое сообщение
              </Text>
            </View>
          ) : (
            messages.map((msg) => (
              <View 
                key={msg.id} 
                style={[
                  styles.messageContainer,
                  msg.sender === 'client' ? styles.clientMessage : styles.driverMessage
                ]}
              >
                <View style={[
                  styles.messageBubble,
                  msg.sender === 'client' 
                    ? { backgroundColor: '#1E3A8A' } 
                    : { backgroundColor: isDark ? '#374151' : '#F3F4F6' }
                ]}>
                  <Text style={[
                    styles.messageText,
                    { color: msg.sender === 'client' ? '#FFFFFF' : (isDark ? '#F9FAFB' : '#1F2937') }
                  ]}>
                    {msg.text}
                  </Text>
                  <View style={styles.messageFooter}>
                    <Text style={[
                      styles.messageTime,
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
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.messageInput}
              placeholder="Введите сообщение..."
              value={message}
              onChangeText={setMessage}
              placeholderTextColor="#6B7280"
              multiline
            />
            <TouchableOpacity 
              style={[
                styles.sendButton,
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  carInfo: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
  },
  callButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageContainer: {
    marginVertical: 8,
  },
  clientMessage: {
    alignItems: 'flex-end',
  },
  driverMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  messageTime: {
    fontSize: 12,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
    backgroundColor: 'transparent',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    maxHeight: 100,
    minHeight: 44,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyChat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyChatText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ChatScreen;
