import { StyleSheet } from 'react-native';

// Базовые стили без цветов
export const ChatListScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  selectButton: {
    padding: 8,
  },
  searchContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
  },
  listContainer: {
    flexGrow: 1,
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  selectedChatItem: {
    borderLeftWidth: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxSelected: {
    // Цвета будут добавлены динамически
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatInfo: {
    flex: 1,
    marginRight: 12,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
  },
  chatTime: {
    fontSize: 12,
  },
  messagePreview: {
    flex: 1,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 18,
  },
  lastMessage: {
    fontSize: 14,
    lineHeight: 18,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  unreadBadge: {
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  // Стили для режима выбора
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cancelButton: {
    fontSize: 16,
    fontWeight: '500',
  },
  selectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  selectAllButton: {
    fontSize: 16,
    fontWeight: '500',
  },
  selectionActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  deleteButtonText: {
    color: '#EF4444',
  },
});

// Функция для получения только цветовых стилей
export const getChatListColors = (isDark: boolean) => {
  const colors = isDark ? {
    // Темная тема
    background: '#111827',
    surface: '#1F2937',
    card: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    primary: '#3B82F6',
    border: '#374151',
    error: '#F87171',
  } : {
    // Светлая тема
    background: '#fffeff',
    surface: '#f1f1f0',
    card: '#ffffff',
    text: '#030304',
    textSecondary: '#6d6565',
    primary: '#083198',
    border: '#E5E7EB',
    error: '#EF4444',
  };

  return {
    container: { backgroundColor: colors.background },
    header: { 
      backgroundColor: colors.surface,
      borderBottomColor: colors.border 
    },
    headerTitle: { color: colors.text },
    title: { color: colors.text },
    searchContainer: { 
      backgroundColor: colors.background,
      borderColor: colors.border 
    },
    searchIcon: { color: colors.textSecondary },
    searchInput: { color: colors.text },
    chatItem: { 
      backgroundColor: colors.surface,
      borderBottomColor: colors.border 
    },
    selectedChatItem: { 
      backgroundColor: colors.primary + '10',
      borderLeftColor: colors.primary 
    },
    checkbox: { borderColor: colors.border },
    checkboxSelected: { 
      backgroundColor: colors.primary,
      borderColor: colors.primary 
    },
    avatar: { backgroundColor: colors.primary },
    badge: { backgroundColor: colors.primary },
    participantName: { color: colors.text },
    messageTime: { color: colors.textSecondary },
    chatName: { color: colors.text },
    chatTime: { color: colors.textSecondary },
    messageText: { color: colors.textSecondary },
    lastMessage: { color: colors.textSecondary },
    unreadIndicator: { backgroundColor: colors.primary },
    unreadBadge: { backgroundColor: colors.primary },
    emptyStateTitle: { color: colors.text },
    emptyStateSubtitle: { color: colors.textSecondary },
    loadingText: { color: colors.textSecondary },
    cancelButton: { color: colors.primary },
    selectionTitle: { color: colors.text },
    selectAllButton: { color: colors.primary },
    selectionActions: { 
      backgroundColor: colors.surface,
      borderBottomColor: colors.border 
    },
    actionButton: { 
      backgroundColor: colors.background,
      borderColor: colors.border 
    },
    actionButtonText: { color: colors.text },
  };
}; 