import { StyleSheet } from 'react-native';
import { getCurrentColors, SIZES } from '../../../../shared/constants/colors';

export const createNotificationsModalStyles = (isDark: boolean) => {
  const colors = getCurrentColors(isDark);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: SIZES.xl,
      paddingVertical: SIZES.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    closeButton: {
      padding: SIZES.xs,
    },
    closeButtonIcon: {
      color: colors.text,
    },
    title: {
      fontSize: SIZES.fontSize.lg,
      fontWeight: '600',
      color: colors.text,
    },
    markAllButton: {
      padding: SIZES.xs,
    },
    markAllButtonIcon: {
      color: colors.text,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: SIZES.xl,
    },
    emptyStateIcon: {
      marginBottom: SIZES.lg,
      color: colors.textSecondary,
    },
    emptyStateTitle: {
      fontSize: SIZES.fontSize.lg,
      fontWeight: '600',
      color: colors.text,
      marginBottom: SIZES.sm,
      textAlign: 'center',
    },
    emptyStateMessage: {
      fontSize: SIZES.fontSize.md,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    // Стили для загрузки
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: SIZES.xl,
    },
    loadingIndicator: {
      color: colors.primary,
    },
    loadingText: {
      fontSize: SIZES.fontSize.md,
      color: colors.textSecondary,
      marginTop: SIZES.lg,
      textAlign: 'center',
    },
    // Стили для списка уведомлений
    notificationsList: {
      flex: 1,
      paddingHorizontal: SIZES.lg,
    },
    notificationItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: SIZES.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    unreadNotification: {
      backgroundColor: colors.primary + '10',
    },
    notificationIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: SIZES.lg,
    },
    notificationContent: {
      flex: 1,
      marginRight: SIZES.sm,
    },
    notificationHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: SIZES.xs,
    },
    notificationTitle: {
      fontSize: SIZES.fontSize.md,
      fontWeight: '600',
      color: colors.text,
      flex: 1,
    },
    notificationTime: {
      fontSize: SIZES.fontSize.sm,
      color: colors.textSecondary,
    },
    notificationMessage: {
      fontSize: SIZES.fontSize.sm,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: SIZES.sm,
    },
    notificationActions: {
      flexDirection: 'row',
      gap: SIZES.sm,
    },
    markReadButton: {
      paddingHorizontal: SIZES.md,
      paddingVertical: SIZES.xs,
      borderRadius: 6,
      backgroundColor: colors.secondary,
    },
    deleteButton: {
      paddingHorizontal: SIZES.md,
      paddingVertical: SIZES.xs,
      borderRadius: 6,
      backgroundColor: colors.error,
    },
    actionButtonText: {
      fontSize: SIZES.fontSize.sm,
      color: '#FFFFFF',
      fontWeight: '500',
    },
  });
};
