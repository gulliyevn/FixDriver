import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  StatusBar,
  Modal,
  Alert,
  Animated,
  PanResponder,
  Dimensions
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AppCard from '../../components/AppCard';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ClientStackParamList } from '../../types/navigation';
import { notificationService, Notification } from '../../services/NotificationService';
import { chatService } from '../../services/ChatService';
import { Chat } from '../../types/chat';

type NavigationProp = StackNavigationProp<ClientStackParamList, 'ChatList'>;

interface ChatPreview {
  driverId: string;
  driverName: string;
  driverCar: string;
  driverNumber: string;
  driverRating: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  driverStatus: 'online' | 'offline' | 'busy';
}

interface SwipeableChatProps {
  chat: Chat;
  isDark: boolean;
  isChatSelectionMode: boolean;
  selectedChats: string[];
  pinnedChats: string[];
  onPress: () => void;
  onToggleSelection: () => void;
  onTogglePin: () => void;
  onDelete: () => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  chatService: typeof chatService;
}



const SwipeableChat: React.FC<SwipeableChatProps> = ({
  chat,
  isDark,
  isChatSelectionMode,
  selectedChats,
  pinnedChats,
  onPress,
  onToggleSelection,
  onTogglePin,
  onDelete,
  getStatusColor,
  getStatusText,
  chatService
}) => {
  const translateX = React.useRef(new Animated.Value(0)).current;
  const [isSwipeActive, setIsSwipeActive] = React.useState(false);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Активируем только при горизонтальном свайпе
        const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        const isSignificant = Math.abs(gestureState.dx) > 15;
        return isHorizontal && isSignificant && !isChatSelectionMode;
      },
      
      onPanResponderGrant: () => {
        setIsSwipeActive(true);
      },
      
      onPanResponderMove: (evt, gestureState) => {
        let value = gestureState.dx;
        
        // Ограничиваем движение с эластичностью
        if (value > 90) {
          value = 90 + (value - 90) * 0.2;
        } else if (value < -90) {
          value = -90 + (value + 90) * 0.2;
        }
        
        translateX.setValue(value);
      },
      
      onPanResponderRelease: (evt, gestureState) => {
        setIsSwipeActive(false);
        
        const { dx, vx } = gestureState;
        
        if (dx > 60 || (dx > 30 && vx > 0.8)) {
          // PIN - свайп вправо
          Animated.sequence([
            Animated.timing(translateX, {
              toValue: 120,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(translateX, {
              toValue: 0,
              duration: 250,
              useNativeDriver: true,
            })
          ]).start();
          onTogglePin();
          
        } else if (dx < -60 || (dx < -30 && vx < -0.8)) {
          // DELETE - свайп влево
          Animated.timing(translateX, {
            toValue: -400,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            onDelete();
          });
          
        } else {
          // Возврат в центр
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 200,
            friction: 8,
          }).start();
        }
      },
      
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  // Интерполяция для кнопок
  const leftActionOpacity = translateX.interpolate({
    inputRange: [0, 30, 90],
    outputRange: [0, 0.7, 1],
    extrapolate: 'clamp',
  });

  const rightActionOpacity = translateX.interpolate({
    inputRange: [-90, -30, 0],
    outputRange: [1, 0.7, 0],
    extrapolate: 'clamp',
  });

  const leftActionScale = translateX.interpolate({
    inputRange: [0, 90],
    outputRange: [0.5, 1.1],
    extrapolate: 'clamp',
  });

  const rightActionScale = translateX.interpolate({
    inputRange: [-90, 0],
    outputRange: [1.1, 0.5],
    extrapolate: 'clamp',
  });

  return (
    <View style={swipeStyles.container}>
      {/* Кнопка закрепления - левая */}
      <Animated.View style={[
        swipeStyles.leftAction,
        { 
          opacity: leftActionOpacity,
          transform: [{ scale: leftActionScale }]
        }
      ]}>
        <Ionicons name="bookmark" size={24} color="#FFFFFF" />
      </Animated.View>
      
      {/* Кнопка удаления - правая */}
      <Animated.View style={[
        swipeStyles.rightAction,
        { 
          opacity: rightActionOpacity,
          transform: [{ scale: rightActionScale }]
        }
      ]}>
        <Ionicons name="trash" size={24} color="#FFFFFF" />
      </Animated.View>
      
      {/* Основной чат */}
      <View
        {...panResponder.panHandlers}
        style={swipeStyles.chatContainer}
      >
        <Animated.View
          style={[
            { 
              backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
              transform: [{ translateX: translateX }],
            },
            // Явно убираем все границы для выбранных чатов
            isChatSelectionMode && selectedChats.includes(chat.id) && {
              borderWidth: 0,
              borderColor: 'transparent',
            }
          ]}
        >
          <TouchableOpacity 
            onPress={!isSwipeActive ? onPress : undefined} 
            activeOpacity={0.8}
            disabled={isSwipeActive}
            style={[
              swipeStyles.chatItem,
              // Явно убираем все границы для выбранных чатов
              isChatSelectionMode && selectedChats.includes(chat.id) && {
                borderWidth: 0,
                borderColor: 'transparent',
              }
            ]}
          >
            <View style={[
              swipeStyles.chatContent,
              // Явно убираем все границы для выбранных чатов
              isChatSelectionMode && selectedChats.includes(chat.id) && {
                borderWidth: 0,
                borderColor: 'transparent',
              }
            ]}>
              <View style={swipeStyles.leftSection}>
                {isChatSelectionMode && (
                  <TouchableOpacity
                    style={swipeStyles.checkbox}
                    onPress={onToggleSelection}
                  >
                    <Ionicons
                      name={selectedChats.includes(chat.id) ? "checkbox" : "square-outline"}
                      size={24}
                      color={selectedChats.includes(chat.id) ? "#1E3A8A" : "#9CA3AF"}
                    />
                  </TouchableOpacity>
                )}
                <View style={swipeStyles.driverAvatar}>
                  <Text style={{ fontSize: 20 }}>👨‍💼</Text>
                  <View style={[swipeStyles.statusDot, { backgroundColor: getStatusColor(chat.isOnline ? 'online' : 'offline') }]} />
                </View>
              </View>
              <View style={swipeStyles.chatDetails}>
                <View style={swipeStyles.chatHeader}>
                  <View style={swipeStyles.driverNameContainer}>
                    <Text style={[swipeStyles.driverName, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
                      {chat.participantName}
                    </Text>
                    {pinnedChats.includes(chat.id) && !isChatSelectionMode && (
                      <Ionicons 
                        name="bookmark" 
                        size={14} 
                        color="#F59E0B" 
                        style={swipeStyles.pinIndicator}
                      />
                    )}
                  </View>
                </View>
                <Text style={swipeStyles.carInfo}>Toyota Camry • А123БВ777</Text>
                <View style={swipeStyles.statusContainer}>
                  <Text style={[swipeStyles.statusText, { color: getStatusColor(chat.isOnline ? 'online' : 'offline') }]}>
                    {getStatusText(chat.isOnline ? 'online' : 'offline')}
                  </Text>
                </View>
                <Text style={[swipeStyles.lastMessage, { color: isDark ? '#D1D5DB' : '#6B7280' }]} numberOfLines={1}>
                  {chat.lastMessage || 'Напишите первое сообщение'}
                </Text>
              </View>
              <View style={swipeStyles.rightSection}>
                <Text style={swipeStyles.timestamp}>
                  {chatService.formatMessageTime(chat.lastMessageTime)}
                </Text>
                {chat.unreadCount > 0 && (
                  <View style={swipeStyles.unreadBadge}>
                    <Text style={swipeStyles.unreadText}>{chat.unreadCount}</Text>
                  </View>
                )}
                {isChatSelectionMode && (
                  <TouchableOpacity 
                    style={swipeStyles.pinButtonSelection}
                    onPress={onTogglePin}
                  >
                    <Ionicons 
                      name={pinnedChats.includes(chat.id) ? "bookmark" : "bookmark-outline"} 
                      size={20} 
                      color={pinnedChats.includes(chat.id) ? "#F59E0B" : "#6B7280"} 
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {/* Разделитель */}
            <View style={[
              swipeStyles.separator,
              { backgroundColor: isDark ? '#374151' : '#F3F4F6' }
            ]} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const ChatListScreen: React.FC = () => {
  const { isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  
  // Состояние для режима выбора чатов
  const [isChatSelectionMode, setIsChatSelectionMode] = useState(false);
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const [pinnedChats, setPinnedChats] = useState<string[]>([]);
  
  // Состояние для свайпов
  const [swipingChatId, setSwipingChatId] = useState<string | null>(null);

  const [chats, setChats] = useState<Chat[]>([]);
  const [hasNavigated, setHasNavigated] = React.useState(false);
  const [hasNavigatedToChat, setHasNavigatedToChat] = React.useState(false);

  useEffect(() => {
    setNotifications(notificationService.getNotifications());
    loadChats();
  }, []);

  // Обновляем список чатов при возврате на экран
  useFocusEffect(
    React.useCallback(() => {
      loadChats();
      // Сбрасываем флаг при возврате на главный экран чатов
      setHasNavigated(false);
    }, [])
  );

  // Автоматический переход в чат, если пришли с параметрами
  React.useEffect(() => {
    const params = route.params as any;
    if (params?.driverId && !hasNavigatedToChat) {
      // Небольшая задержка для корректной навигации
      setTimeout(() => {
        navigation.navigate('ChatConversation', {
          driverId: params.driverId,
          driverName: params.driverName,
          driverCar: params.driverCar,
          driverNumber: params.driverNumber,
          driverRating: params.driverRating,
          driverStatus: params.driverStatus,
        });
        setHasNavigatedToChat(true);
      }, 100);
    }
  }, [route.params, navigation, hasNavigatedToChat]);

  const loadChats = async () => {
    try {
      const userChats = await chatService.getChats('me');
      setChats(userChats);
    } catch (error) {
      // Ошибка загрузки чатов
    }
  };

  const restoreChats = async () => {
    chatService.resetToMockData();
    await loadChats();
  };

  const handleChatPress = (chat: Chat) => {
    // Если режим выбора активен, добавляем/убираем чат из выбранных
    if (isChatSelectionMode) {
      toggleChatSelection(chat.id);
      return;
    }
    
    try {
      navigation.navigate('ChatConversation', {
        driverId: chat.participantId,
        driverName: chat.participantName,
        driverCar: 'Toyota Camry', // Можно добавить в Chat тип машины
        driverNumber: 'А123БВ777', // Можно добавить в Chat номер машины
        driverRating: '4.8', // Можно добавить в Chat рейтинг
        driverStatus: chat.isOnline ? 'online' : 'offline'
      });
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось открыть чат. Попробуйте еще раз.');
    }
  };

  const handleNotifications = () => {
    setNotifications(notificationService.getNotifications());
    setShowNotificationsModal(true);
    setIsSelectionMode(false);
    setSelectedNotifications([]);
  };

  const handleDeleteNotification = (notificationId: string) => {
    Alert.alert(
      'Удалить уведомление',
      'Вы уверены, что хотите удалить это уведомление?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            notificationService.removeNotification(notificationId);
            setNotifications(notificationService.getNotifications());
          },
        },
      ]
    );
  };

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead();
    setNotifications(notificationService.getNotifications());
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'trip':
        return 'car';
      case 'payment':
        return 'card';
      case 'driver':
        return 'person';
      case 'system':
        return 'settings';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'trip':
        return '#10B981';
      case 'payment':
        return '#F59E0B';
      case 'driver':
        return '#3B82F6';
      case 'system':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedNotifications([]);
  };

  const toggleNotificationSelection = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const selectAllNotifications = () => {
    if (selectedNotifications.length === notifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map(n => n.id));
    }
  };

  const deleteSelectedNotifications = () => {
    if (selectedNotifications.length === 0) return;
    
    Alert.alert(
      'Удалить уведомления',
      `Вы уверены, что хотите удалить ${selectedNotifications.length} уведомлений?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            selectedNotifications.forEach(id => {
              notificationService.removeNotification(id);
            });
            setNotifications(notificationService.getNotifications());
            setSelectedNotifications([]);
            setIsSelectionMode(false);
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#10B981';
      case 'busy': return '#F59E0B';
      case 'offline': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'В сети';
      case 'busy': return 'Занят';
      case 'offline': return 'Не в сети';
      default: return 'Не в сети';
    }
  };

  // Функции для работы с чатами
  const toggleChatSelectionMode = () => {
    setIsChatSelectionMode(!isChatSelectionMode);
    setSelectedChats([]);
  };

  const toggleChatSelection = (chatId: string) => {
    setSelectedChats(prev => 
      prev.includes(chatId)
        ? prev.filter(id => id !== chatId)
        : [...prev, chatId]
    );
  };

  const selectAllChats = () => {
    if (selectedChats.length === sortedChats.length) {
      setSelectedChats([]);
    } else {
      setSelectedChats(sortedChats.map(chat => chat.id));
    }
  };

  const deleteSelectedChats = async () => {
    if (selectedChats.length === 0) return;
    
    Alert.alert(
      'Удалить чаты',
      `Вы уверены, что хотите удалить ${selectedChats.length} чатов?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              // Удаляем все выбранные чаты через сервис
              for (const chatId of selectedChats) {
                await chatService.deleteChat(chatId);
              }
              
              // Обновляем локальное состояние
              setChats(prevChats => prevChats.filter(chat => !selectedChats.includes(chat.id)));
              
              setSelectedChats([]);
              setIsChatSelectionMode(false);
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось удалить некоторые чаты. Попробуйте еще раз.');
            }
          },
        },
      ]
    );
  };

  const togglePinChat = (chatId: string) => {
    setPinnedChats(prev => {
      const newPinned = prev.includes(chatId)
        ? prev.filter(id => id !== chatId)
        : [...prev, chatId];
      
      return newPinned;
    });
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      // Удаляем чат через сервис
      await chatService.deleteChat(chatId);
      
      // Обновляем локальное состояние
      setChats(prevChats => prevChats.filter(c => c.id !== chatId));
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось удалить чат. Попробуйте еще раз.');
    }
  };

  // Сортировка чатов: закрепленные сверху, как в Telegram
  const sortedChats = React.useMemo(() => {
    const pinned = chats.filter(chat => pinnedChats.includes(chat.id));
    const unpinned = chats.filter(chat => !pinnedChats.includes(chat.id));
    
    // Возвращаем закрепленные сверху, затем обычные
    return [...pinned, ...unpinned];
  }, [chats, pinnedChats]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111827' : '#F8FAFC' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={handleNotifications}
          style={styles.notificationBtn}
        >
          <Ionicons name="notifications-outline" size={24} color={isDark ? '#F9FAFB' : '#1F2937'} />
          {notificationService.getUnreadCount() > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{notificationService.getUnreadCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
          Чаты
        </Text>
        
        <TouchableOpacity 
          onPress={toggleChatSelectionMode}
          style={styles.selectBtn}
        >
          <Text style={[styles.selectBtnText, { color: isDark ? '#F9FAFB' : '#1E3A8A' }]}>
            {isChatSelectionMode ? 'Отмена' : 'Выбрать'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chat List */}
      <ScrollView style={styles.chatList} showsVerticalScrollIndicator={false}>
        {sortedChats.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons 
              name="chatbox-outline" 
              size={64} 
              color={isDark ? '#6B7280' : '#9CA3AF'} 
            />
            <Text style={[styles.emptyStateText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              Нет чатов
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              Все чаты отображаются здесь
            </Text>
            <TouchableOpacity 
              style={[styles.restoreButton, { backgroundColor: isDark ? '#1F2937' : '#F3F4F6' }]}
              onPress={restoreChats}
            >
              <Text style={[styles.restoreButtonText, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                Восстановить чаты
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          sortedChats.map((chat) => (
            <SwipeableChat
              key={chat.id}
              chat={chat}
              isDark={isDark}
              isChatSelectionMode={isChatSelectionMode}
              selectedChats={selectedChats}
              pinnedChats={pinnedChats}
              onPress={() => handleChatPress(chat)}
              onToggleSelection={() => toggleChatSelection(chat.id)}
              onTogglePin={() => togglePinChat(chat.id)}
              onDelete={() => handleDeleteChat(chat.id)}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              chatService={chatService}
            />
          ))
        )}
      </ScrollView>

      {/* Нижняя панель для режима выбора чатов */}
      {isChatSelectionMode && (
        <View style={[styles.bottomActions, { borderTopColor: isDark ? '#333333' : '#E5E5EA' }]}>
          <TouchableOpacity 
            style={[styles.bottomButton, styles.selectAllButton]} 
            onPress={selectAllChats}
          >
            <Text style={[styles.bottomButtonText, { color: '#1E3A8A' }]}>
              {selectedChats.length === sortedChats.length ? 'Снять все' : 'Выбрать все'}
            </Text>
          </TouchableOpacity>
          
          {selectedChats.length > 0 && (
            <TouchableOpacity 
              style={[styles.bottomButton, styles.deleteAllButton]} 
              onPress={deleteSelectedChats}
            >
              <Text style={[styles.bottomButtonText, { color: '#FFFFFF' }]}>
                Удалить ({selectedChats.length})
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Модал центра уведомлений */}
      <Modal
        visible={showNotificationsModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { backgroundColor: isDark ? '#000000' : '#F2F2F7' }]}>
          <View style={[styles.modalHeader, { borderBottomColor: isDark ? '#333333' : '#E5E5EA' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              Центр уведомлений
            </Text>
            <View style={styles.modalHeaderActions}>
              {!isSelectionMode ? (
                <>
                  <TouchableOpacity onPress={toggleSelectionMode} style={styles.modalSelectButton}>
                    <Text style={[styles.modalSelectButtonText, { color: isDark ? '#FFFFFF' : '#1E3A8A' }]}>
                      Выбрать
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowNotificationsModal(false)} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity onPress={toggleSelectionMode} style={styles.cancelButton}>
                  <Text style={[styles.cancelButtonText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                    Отмена
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {!isSelectionMode && notifications.filter(n => !n.isRead).length > 0 && (
            <TouchableOpacity style={styles.markAllButton} onPress={handleMarkAllAsRead}>
              <Text style={styles.markAllButtonText}>
                Прочитать все ({notifications.filter(n => !n.isRead).length})
              </Text>
            </TouchableOpacity>
          )}

          <ScrollView style={styles.notificationsList} showsVerticalScrollIndicator={false}>
            {notifications.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons 
                  name="notifications-off" 
                  size={64} 
                  color={isDark ? '#6B7280' : '#9CA3AF'} 
                />
                <Text style={[styles.emptyStateText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                  Нет уведомлений
                </Text>
                <Text style={[styles.emptyStateSubtext, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  Все уведомления будут отображаться здесь
                </Text>
              </View>
            ) : (
              notifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  style={[
                    styles.notificationItem,
                    { 
                      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                      borderColor: isDark ? '#374151' : '#E5E5EA'
                    },
                    !notification.isRead && styles.unreadNotification,
                    isSelectionMode && selectedNotifications.includes(notification.id) && styles.selectedNotification,
                  ]}
                  onPress={() => isSelectionMode ? toggleNotificationSelection(notification.id) : null}
                  disabled={!isSelectionMode}
                >
                  <View style={styles.notificationContent}>
                    {isSelectionMode && (
                      <TouchableOpacity
                        style={styles.checkbox}
                        onPress={() => toggleNotificationSelection(notification.id)}
                      >
                        <Ionicons
                          name={selectedNotifications.includes(notification.id) ? "checkbox" : "square-outline"}
                          size={24}
                          color={selectedNotifications.includes(notification.id) ? "#1E3A8A" : "#9CA3AF"}
                        />
                      </TouchableOpacity>
                    )}

                    <View
                      style={[
                        styles.notificationIcon,
                        { backgroundColor: getNotificationColor(notification.type) + '20' },
                      ]}
                    >
                      <Ionicons
                        name={getNotificationIcon(notification.type)}
                        size={20}
                        color={getNotificationColor(notification.type)}
                      />
                    </View>

                    <View style={styles.notificationTextContainer}>
                      <Text
                        style={[
                          styles.notificationTitle,
                          { color: isDark ? '#FFFFFF' : '#000000' },
                          !notification.isRead && styles.unreadTitle,
                        ]}
                      >
                        {notification.title}
                      </Text>
                      <Text
                        style={[
                          styles.notificationMessage,
                          { color: isDark ? '#9CA3AF' : '#6B7280' }
                        ]}
                      >
                        {notification.message}
                      </Text>
                      <Text
                        style={[
                          styles.notificationTime,
                          { color: isDark ? '#6B7280' : '#9CA3AF' }
                        ]}
                      >
                        {notification.time.toLocaleString('ru-RU')}
                      </Text>
                    </View>

                    {!isSelectionMode && (
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteNotification(notification.id)}
                      >
                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

          {/* Кнопки снизу модала */}
          {isSelectionMode && (
            <View style={[styles.bottomActions, { borderTopColor: isDark ? '#333333' : '#E5E5EA' }]}>
              <TouchableOpacity 
                style={[styles.bottomButton, styles.selectAllButton]} 
                onPress={selectAllNotifications}
              >
                <Text style={[styles.bottomButtonText, { color: '#1E3A8A' }]}>
                  {selectedNotifications.length === notifications.length ? 'Снять все' : 'Выбрать все'}
                </Text>
              </TouchableOpacity>
              
              {selectedNotifications.length > 0 && (
                <TouchableOpacity 
                  style={[styles.bottomButton, styles.deleteAllButton]} 
                  onPress={deleteSelectedNotifications}
                >
                  <Text style={[styles.bottomButtonText, { color: '#FFFFFF' }]}>
                    Удалить ({selectedNotifications.length})
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'transparent',
  },
  notificationBtn: {
    padding: 8,
    position: 'relative',
  },
  selectBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    flex: 1,
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    marginBottom: 8,
  },
  chatContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  pinButton: {
    marginTop: 8,
    padding: 4,
  },
  driverInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  driverAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatDetails: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 60,
  },
  selectBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },

  driverNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  pinIndicator: {
    marginLeft: 4,
  },
  timestamp: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 8,
  },
  carInfo: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 13,
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#1E3A8A',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },

  modalContainer: {
    flex: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalSelectButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  modalSelectButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  markAllButton: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  markAllButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  notificationsList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  restoreButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  restoreButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  notificationItem: {
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#1E3A8A',
  },
  selectedNotification: {
    borderColor: '#1E3A8A',
    borderWidth: 2,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 8,
    padding: 4,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  unreadTitle: {
    fontWeight: '700',
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 4,
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  bottomButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectAllButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#1E3A8A',
  },
  deleteAllButton: {
    backgroundColor: '#EF4444',
  },
  bottomButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

const swipeStyles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  leftAction: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  rightAction: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  pinButtonSelection: {
    padding: 8,
  },

  chatContainer: {
    backgroundColor: 'transparent',
    zIndex: 2,
    position: 'relative',
  },
  chatItem: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  separator: {
    height: 0.5,
    marginLeft: 72, // Отступ от аватара
    opacity: 0.3,
  },
  chatContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  checkbox: {
    marginRight: 8,
    padding: 4,
  },
  driverAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatDetails: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  driverNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  pinIndicator: {
    marginLeft: 4,
  },
  carInfo: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  lastMessage: {
    fontSize: 13,
    marginBottom: 4,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 60,
  },
  timestamp: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 8,
  },
  unreadBadge: {
    backgroundColor: '#1E3A8A',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
});

export default ChatListScreen; 