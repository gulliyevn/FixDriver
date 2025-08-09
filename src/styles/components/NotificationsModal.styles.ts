import { StyleSheet } from 'react-native';
import { getCurrentColors, SIZES, SHADOWS } from '../../constants/colors';

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
    headerTitle: {
      fontSize: SIZES.fontSize.xl,
      fontWeight: '600',
      color: colors.text,
    },
    resetButton: {
      padding: SIZES.xs,
    },
    resetButtonText: {
      fontSize: SIZES.fontSize.md,
      color: colors.primary,
      fontWeight: '500',
    },
    content: {
      flex: 1,
      paddingHorizontal: SIZES.xl,
    },
    notificationSection: {
      marginVertical: SIZES.lg,
    },
    sectionTitle: {
      fontSize: SIZES.fontSize.lg,
      fontWeight: '600',
      color: colors.text,
      marginBottom: SIZES.md,
    },
    notificationOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: SIZES.md,
      paddingHorizontal: SIZES.lg,
      marginBottom: SIZES.xs,
      borderRadius: SIZES.radius.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    notificationOptionSelected: {
      backgroundColor: colors.primary + '10',
      borderColor: colors.primary,
    },
    notificationOptionText: {
      fontSize: SIZES.fontSize.md,
      color: colors.text,
      fontWeight: '500',
    },
    notificationOptionTextSelected: {
      color: colors.primary,
      fontWeight: '600',
    },
    footer: {
      flexDirection: 'row',
      paddingHorizontal: SIZES.xl,
      paddingVertical: SIZES.lg,
      gap: SIZES.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    button: {
      flex: 1,
      paddingVertical: SIZES.lg,
      borderRadius: SIZES.radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cancelButtonText: {
      fontSize: SIZES.fontSize.md,
      color: colors.text,
      fontWeight: '500',
    },
    applyButton: {
      backgroundColor: colors.primary,
      ...(isDark ? SHADOWS.dark.small : SHADOWS.light.small),
    },
    applyButtonText: {
      fontSize: SIZES.fontSize.md,
      color: colors.background,
      fontWeight: '600',
    },
  });
};
