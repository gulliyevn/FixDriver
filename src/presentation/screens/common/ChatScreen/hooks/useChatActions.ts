import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useI18n } from '../../../../../shared/hooks/useI18n';
import { ChatService } from '../../../../../data/datasources/chat/ChatService';

/**
 * Chat Actions Hook
 * 
 * Manages chat-related actions and modal states
 * Handles attachments, calls, and chat management
 */

export const useChatActions = (navigationOrChatId: any) => {
  const { t } = useI18n();
  const chatService = new ChatService();

  // Modal states
  const [showAttachments, setShowAttachments] = useState(false);
  const [showCallSheet, setShowCallSheet] = useState(false);
  const [showProfileSheet, setShowProfileSheet] = useState(false);
  const [showActionsSheet, setShowActionsSheet] = useState(false);

  // Selection states (for chat list)
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const isNavigation = typeof navigationOrChatId?.navigate === 'function';
  const chatId = isNavigation ? null : navigationOrChatId;
  const navigation = isNavigation ? navigationOrChatId : null;

  // Chat list actions
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = (totalCount: number) => {
    if (selectedIds.size === totalCount) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(Array.from({ length: totalCount }, (_, i) => `chat_${i}`)));
    }
  };

  const markAsRead = () => {
    if (selectedIds.size === 0) return;
    Alert.alert(
      t('chat.markAsRead'),
      t('chat.markAsReadConfirm', { count: selectedIds.size }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('chat.read'), onPress: () => {
          setSelectionMode(false);
          setSelectedIds(new Set());
        }}
      ]
    );
  };

  const deleteSelected = () => {
    if (selectedIds.size === 0) return;
    Alert.alert(
      t('chat.deleteSelected'),
      t('chat.deleteSelectedConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.delete'), style: 'destructive', onPress: () => {
          setSelectionMode(false);
          setSelectedIds(new Set());
        }}
      ]
    );
  };

  const openChat = (chat: any) => {
    if (selectionMode) {
      toggleSelect(chat.id);
      return;
    }
    navigation?.navigate('ChatConversation', {
      driverId: chat.participant?.id || chat.id,
      driverName: chat.participant?.name || t('chat.unknownUser'),
      driverCar: chat.participant?.car || 'Toyota Camry',
      driverNumber: chat.participant?.phone || 'A123БВ777',
      driverRating: chat.participant?.rating || '4.8',
      driverStatus: chat.online ? 'online' : 'offline',
      driverPhoto: chat.participant?.avatar,
    });
  };

  // Attachment actions
  const attachFromCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('errors.permissionDenied'));
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const msg = await chatService.sendMessage(
          chatId,
          t('chat.camera'),
          'image',
          { imageUrl: asset.uri, fileSize: (asset as any).fileSize }
        );
        setShowAttachments(false);
      }
    } catch (e) {
      Alert.alert(t('errors.error'));
    }
  };

  const attachFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('errors.permissionDenied'));
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const msg = await chatService.sendMessage(
          chatId,
          t('chat.gallery'),
          'image',
          { imageUrl: asset.uri, fileSize: (asset as any).fileSize }
        );
        setShowAttachments(false);
      }
    } catch (e) {
      Alert.alert(t('errors.error'));
    }
  };

  const attachDocument = async () => {
    Alert.alert(t('common.featureSoon'));
  };

  const attachLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('errors.permissionDenied'));
        return;
      }
      const pos = await Location.getCurrentPositionAsync({});
      const msg = await chatService.sendMessage(
        chatId,
        t('chat.location'),
        'location',
        {
          location: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          },
        }
      );
      setShowAttachments(false);
    } catch (e) {
      Alert.alert(t('errors.locationError'));
    }
  };

  // Chat management actions
  const handleClearChat = async () => {
    await chatService.clearChat(chatId);
    setShowActionsSheet(false);
  };

  const handleExportChat = async () => {
    try {
      const msgs = await chatService.getMessages(chatId);
      const text = msgs.map(m => `${m.formattedTime}: ${m.content}`).join('\n');
      Alert.alert(t('chat.title'), t('common.success'));
    } catch {
      Alert.alert(t('errors.error'));
    } finally {
      setShowActionsSheet(false);
    }
  };

  const handleDeleteChat = async () => {
    await chatService.deleteChat(chatId);
    setShowActionsSheet(false);
  };

  const handleReport = () => {
    Alert.alert(t('chat.title'), t('common.success'));
    setShowActionsSheet(false);
  };

  const handleBlock = () => {
    Alert.alert(t('chat.title'), t('common.success'));
    setShowActionsSheet(false);
  };

  // Call actions
  const handleInternetCall = () => {
    Alert.alert(t('chat.internetCall'));
    setShowCallSheet(false);
  };

  const handleNetworkCall = () => {
    Alert.alert(t('chat.networkCall'));
    setShowCallSheet(false);
  };

  return {
    // Modal states
    showAttachments,
    setShowAttachments,
    showCallSheet,
    setShowCallSheet,
    showProfileSheet,
    setShowProfileSheet,
    showActionsSheet,
    setShowActionsSheet,
    
    // Selection states
    selectionMode,
    setSelectionMode,
    selectedIds,
    setSelectedIds,
    
    // Chat list actions
    toggleSelect,
    selectAll,
    markAsRead,
    deleteSelected,
    openChat,
    
    // Attachment actions
    attachFromCamera,
    attachFromGallery,
    attachDocument,
    attachLocation,
    
    // Chat management actions
    handleClearChat,
    handleExportChat,
    handleDeleteChat,
    handleReport,
    handleBlock,
    
    // Call actions
    handleInternetCall,
    handleNetworkCall,
  };
};
