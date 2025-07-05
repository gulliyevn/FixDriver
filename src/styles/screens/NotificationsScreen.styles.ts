import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const NotificationsScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  containerDark: {
    backgroundColor: colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  headerDark: {
    backgroundColor: colors.dark.background,
    borderBottomColor: colors.dark.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.light.text,
  },
  headerTitleDark: {
    color: colors.dark.text,
  },
  markAllButton: {
    padding: 8,
    backgroundColor: colors.light.primary,
    borderRadius: 8,
  },
  markAllButtonText: {
    color: colors.light.background,
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyStateText: {
    fontSize: 18,
    color: colors.light.textSecondary,
    marginTop: 16,
    fontWeight: '600',
  },
  emptyStateTextDark: {
    color: colors.dark.textSecondary,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyStateSubtextDark: {
    color: colors.dark.textSecondary,
  },
  notificationItem: {
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.light.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  notificationItemDark: {
    backgroundColor: colors.dark.surface,
    shadowColor: colors.dark.cardShadow,
  },
  unreadNotification: {
    borderWidth: 2,
    borderColor: colors.light.primary,
  },
  notificationContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
  },
  notificationTitleDark: {
    color: colors.dark.text,
  },
  unreadTitle: {
    color: colors.light.primary,
  },
  notificationMessage: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: colors.light.textSecondary,
  },
  deleteButton: {
    marginLeft: 12,
    padding: 4,
  },
}); 