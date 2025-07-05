import { StyleSheet } from 'react-native';
import { lightColors } from '../../constants/colors';

export const ChatListScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.background,
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
    padding: 8,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
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
  selectedChat: {
    backgroundColor: '#E0E7FF',
    borderColor: '#6366F1',
    borderWidth: 2,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  chatMessage: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
  },
  unreadMessage: {
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  unreadCount: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
});

export const SwipeStyles = StyleSheet.create({
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
    marginLeft: 72,
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