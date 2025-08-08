import { StyleSheet, Platform } from 'react-native';
import { getCurrentColors, SHADOWS, SIZES } from '../../constants/colors';

export const createChatScreenStyles = (isDark: boolean) => {
  const colors = getCurrentColors(isDark);
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SIZES.lg,
      paddingVertical: SIZES.md,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      ...(isDark ? SHADOWS.dark.small : SHADOWS.light.small),
    },
    headerAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: SIZES.md,
    },
    headerInfo: {
      flex: 1,
    },
    headerName: {
      fontSize: SIZES.fontSize.lg,
      fontWeight: '600',
      color: colors.text,
    },
    headerStatus: {
      fontSize: SIZES.fontSize.sm,
      color: colors.textSecondary,
      marginTop: 2,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SIZES.sm,
    },
    headerButton: {
      padding: SIZES.sm,
      borderRadius: SIZES.radius.md,
    },
    messagesContent: {
      paddingHorizontal: SIZES.lg,
      paddingVertical: SIZES.md,
      flexGrow: 1,
    },
    messageContainer: {
      marginVertical: SIZES.sm,
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    userMessage: {
      justifyContent: 'flex-end',
    },
    clientMessage: {
      justifyContent: 'flex-start',
    },
    messageAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: SIZES.sm,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    messageBubble: {
      maxWidth: '80%',
      borderRadius: SIZES.radius.lg,
      paddingHorizontal: SIZES.lg,
      paddingVertical: SIZES.md,
      backgroundColor: colors.primary,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    messageText: {
      fontSize: SIZES.fontSize.md,
      lineHeight: SIZES.lineHeight.lg,
      color: colors.background,
    },
    otherMessage: {
      backgroundColor: isDark ? '#374151' : '#F3F4F6',
      borderWidth: 1,
      borderColor: colors.border,
    },
    otherMessageText: {
      color: colors.text,
    },
    messageTime: {
      fontSize: SIZES.fontSize.xs,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginTop: SIZES.xs,
      alignSelf: 'flex-end',
    },
    messageStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: SIZES.xs,
      alignSelf: 'flex-end',
    },
    statusIcon: {
      marginLeft: SIZES.xs,
    },
    typingIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SIZES.lg,
      paddingVertical: SIZES.sm,
    },
    typingText: {
      fontSize: SIZES.fontSize.sm,
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
    inputContainer: {
      paddingHorizontal: SIZES.lg,
      paddingTop: SIZES.sm,
      paddingBottom: Platform.OS === 'ios' ? SIZES.lg : SIZES.sm,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: SIZES.sm,
    },
    toolbarButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    textInput: {
      flex: 1,
      borderRadius: 22,
      paddingHorizontal: SIZES.lg,
      paddingVertical: SIZES.md,
      fontSize: SIZES.fontSize.md,
      maxHeight: 120,
      minHeight: 44,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
      color: colors.text,
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      ...(isDark ? SHADOWS.dark.small : SHADOWS.light.small),
    },
    sendIcon: {
      color: colors.background,
    },
    attachmentMenu: {
      position: 'absolute',
      bottom: 80,
      left: SIZES.lg,
      backgroundColor: colors.surface,
      borderRadius: SIZES.radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: SIZES.sm,
      ...(isDark ? SHADOWS.dark.medium : SHADOWS.light.medium),
    },
    attachmentOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: SIZES.sm,
      paddingHorizontal: SIZES.md,
      borderRadius: SIZES.radius.md,
    },
    attachmentOptionText: {
      marginLeft: SIZES.sm,
      fontSize: SIZES.fontSize.md,
      color: colors.text,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: SIZES.xxl * 2,
    },
    emptyStateIcon: {
      marginBottom: SIZES.lg,
    },
    emptyStateTitle: {
      fontSize: SIZES.fontSize.xl,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
    },
    emptyStateSubtitle: {
      fontSize: SIZES.fontSize.md,
      color: colors.textSecondary,
      marginTop: SIZES.sm,
      textAlign: 'center',
    },
  });
};