import React, { useState } from 'react';
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
  Platform
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AppCard from '../../components/AppCard';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ClientStackParamList } from '../../types/navigation';

interface Message {
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
    console.log('💬 ChatScreen mounted with params:', route.params);
  }, [route.params]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Добрый день! Я буду вашим водителем сегодня.',
      sender: 'driver',
      timestamp: '14:30',
      isRead: true,
    },
    {
      id: '2',
      text: 'Здравствуйте! Спасибо, буду ждать у подъезда.',
      sender: 'client',
      timestamp: '14:31',
      isRead: true,
    },
    {
      id: '3',
      text: 'Приеду через 5 минут. Буду на белой Toyota Camry.',
      sender: 'driver',
      timestamp: '14:32',
      isRead: true,
    },
    {
      id: '4',
      text: 'Отлично, буду ждать!',
      sender: 'client',
      timestamp: '14:33',
      isRead: false,
    },
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
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
    }
  };

  const handleCallDriver = () => {
    Alert.alert(
      'Звонок водителю',
      `Позвонить водителю ${driverData.driverName}?`,
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Позвонить', 
          onPress: () => {
            Alert.alert(
              'Звонок',
              `Выполняется звонок водителю ${driverData.driverName}...`,
              [{ text: 'OK' }]
            );
          }
        }
      ]
    );
  };

  // Обработчик кнопки назад - всегда возвращаемся на главный список чатов
  const handleGoBack = () => {
    console.log('🔙 ChatScreen: пользователь нажал назад - переход на главный чат');
    
    try {
      // Всегда переходим на главный список чатов
      navigation.navigate('ChatList');
      console.log('✅ Успешный переход на главный список чатов');
    } catch (error) {
      console.error('❌ Ошибка перехода на главный чат:', error);
      // Fallback - стандартный goBack
      navigation.goBack();
    }
  };

  const formatTime = (timestamp: string) => {
    return timestamp;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111827' : '#F8FAFC' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <AppCard style={styles.header} margin={16}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color="#1E3A8A" />
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
      </AppCard>

      {/* Messages */}
      <KeyboardAvoidingView 
        style={styles.messagesContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <ScrollView 
          style={styles.messagesList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((msg) => (
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
          ))}
        </ScrollView>

        {/* Message Input */}
        <AppCard style={styles.inputContainer} margin={16}>
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
        </AppCard>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  backButton: {
    padding: 8,
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
    paddingVertical: 8,
  },
  messageContainer: {
    marginVertical: 4,
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
    marginBottom: 20,
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
});

export default ChatScreen;
