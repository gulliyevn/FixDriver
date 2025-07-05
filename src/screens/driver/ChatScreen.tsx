import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import mockData from '../../utils/mockData';
import { ChatScreenStyles } from '../../styles/screens/ChatScreen.styles';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isFromUser: boolean;
  senderName: string;
  senderAvatar?: string;
}

interface Chat {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isActive: boolean;
}

const DriverChatScreen: React.FC = () => {
  const { logout } = useAuth();
  const { isDark } = useTheme();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Используем централизованные мок-данные
  useEffect(() => {
    const mockChats: Chat[] = mockData.chats.map(chat => {
      const client = mockData.users.find(user => user.id === chat.clientId);
      return {
        id: chat.id,
        clientId: chat.clientId,
        clientName: client ? `${client.name} ${client.surname}` : 'Неизвестный клиент',
        clientAvatar: client?.avatar || undefined,
        lastMessage: chat.lastMessage.content,
        lastMessageTime: new Date(chat.lastMessage.timestamp),
        unreadCount: chat.unreadCount,
        isActive: chat.unreadCount > 0,
      };
    });
    setChats(mockChats);
  }, []);

  // Используем централизованные мок-данные для сообщений
  useEffect(() => {
    if (selectedChat) {
      const chatMessages = mockData.messages.filter(msg => msg.chatId === selectedChat.id);
      const mockMessages: Message[] = chatMessages.map(msg => ({
        id: msg.id,
        text: msg.content,
        timestamp: new Date(msg.timestamp),
        isFromUser: msg.senderType === 'driver',
        senderName: msg.senderType === 'driver' ? 'Вы' : selectedChat.clientName,
        senderAvatar: msg.senderType === 'driver' ? undefined : selectedChat.clientAvatar,
      }));
      setMessages(mockMessages);
    }
  }, [selectedChat]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      timestamp: new Date(),
      isFromUser: true,
      senderName: 'Вы',
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Обновляем последнее сообщение в чате
    setChats(prev => prev.map(chat => 
      chat.id === selectedChat.id 
        ? { ...chat, lastMessage: newMessage.trim(), lastMessageTime: new Date(), unreadCount: 0 }
        : chat
    ));
  };

  const handleLogout = () => {
    Alert.alert(
      'Выход',
      'Вы уверены, что хотите выйти?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Выйти', onPress: logout, style: 'destructive' }
      ]
    );
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Сейчас';
    if (minutes < 60) return `${minutes} мин`;
    if (hours < 24) return `${hours} ч`;
    if (days < 7) return `${days} дн`;
    return date.toLocaleDateString();
  };

  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity 
      style={[ChatScreenStyles.chatItem, { backgroundColor: isDark ? '#333' : '#fff' }]}
      onPress={() => setSelectedChat(item)}
    >
      <Image 
        source={{ uri: item.clientAvatar }} 
        style={ChatScreenStyles.avatar}
        defaultSource={{ uri: 'https://randomuser.me/api/portraits/women/1.jpg' }}
      />
      <View style={ChatScreenStyles.chatInfo}>
        <View style={ChatScreenStyles.chatHeader}>
          <Text style={[ChatScreenStyles.clientName, { color: isDark ? '#fff' : '#000' }]}>
            {item.clientName}
          </Text>
          <Text style={[ChatScreenStyles.timeText, { color: isDark ? '#ccc' : '#666' }]}>
            {formatTime(item.lastMessageTime)}
          </Text>
        </View>
        <View style={ChatScreenStyles.chatFooter}>
          <Text 
            style={[ChatScreenStyles.lastMessage, { color: isDark ? '#ccc' : '#666' }]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={ChatScreenStyles.unreadBadge}>
              <Text style={ChatScreenStyles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      ChatScreenStyles.messageContainer,
      item.isFromUser ? ChatScreenStyles.userMessage : ChatScreenStyles.clientMessage
    ]}>
      {!item.isFromUser && (
        <Image 
          source={{ uri: item.senderAvatar }} 
          style={ChatScreenStyles.messageAvatar}
          defaultSource={{ uri: 'https://randomuser.me/api/portraits/women/1.jpg' }}
        />
      )}
      <View style={[
        ChatScreenStyles.messageBubble,
        { backgroundColor: item.isFromUser ? '#007AFF' : (isDark ? '#555' : '#f0f0f0') }
      ]}>
        <Text style={[
          ChatScreenStyles.messageText,
          { color: item.isFromUser ? '#fff' : (isDark ? '#fff' : '#000') }
        ]}>
          {item.text}
        </Text>
        <Text style={[
          ChatScreenStyles.messageTime,
          { color: item.isFromUser ? '#rgba(255,255,255,0.7)' : (isDark ? '#ccc' : '#666') }
        ]}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  if (selectedChat) {
    return (
      <KeyboardAvoidingView 
        style={[ChatScreenStyles.container, { backgroundColor: isDark ? '#333' : '#fff' }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={ChatScreenStyles.header}>
          <TouchableOpacity 
            style={ChatScreenStyles.backButton}
            onPress={() => setSelectedChat(null)}
          >
            <Text style={ChatScreenStyles.backButtonText}>← Назад</Text>
          </TouchableOpacity>
          <Text style={ChatScreenStyles.headerTitle}>{selectedChat.clientName}</Text>
          <TouchableOpacity 
            style={ChatScreenStyles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={ChatScreenStyles.logoutButtonText}>Выйти</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          style={{ flex: 1 }}
          inverted
        />

        <View style={ChatScreenStyles.inputContainer}>
          <TextInput
            style={ChatScreenStyles.textInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Введите сообщение..."
            placeholderTextColor="#999"
            multiline
          />
          <TouchableOpacity 
            style={ChatScreenStyles.sendButton}
            onPress={handleSendMessage}
          >
            <Text style={ChatScreenStyles.sendButtonText}>→</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={[ChatScreenStyles.container, { backgroundColor: isDark ? '#333' : '#fff' }]}>
      <View style={ChatScreenStyles.header}>
        <Text style={ChatScreenStyles.headerTitle}>Чаты</Text>
        <TouchableOpacity 
          style={ChatScreenStyles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={ChatScreenStyles.logoutButtonText}>Выйти</Text>
        </TouchableOpacity>
      </View>

      {chats.length === 0 ? (
        <View style={ChatScreenStyles.emptyState}>
          <Text style={ChatScreenStyles.emptyStateText}>
            У вас пока нет активных чатов
          </Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={item => item.id}
          style={{ flex: 1 }}
        />
      )}
    </View>
  );
};

export default DriverChatScreen;
