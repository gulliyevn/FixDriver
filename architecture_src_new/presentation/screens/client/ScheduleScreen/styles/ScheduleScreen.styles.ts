import { StyleSheet } from 'react-native';
import { getCurrentColors, SIZES, SHADOWS } from '../../../../../shared/constants/colors';

export const createScheduleScreenStyles = (isDark: boolean) => {
  const colors = getCurrentColors(isDark);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: SIZES.xl,
      paddingVertical: SIZES.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: SIZES.fontSize.xl,
      fontWeight: '700',
      color: colors.text,
      marginBottom: SIZES.lg,
      textAlign: 'center',
    },
    typeSelector: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: SIZES.radius.lg,
      padding: SIZES.xs,
      ...SHADOWS[isDark ? 'dark' : 'light'].small,
    },
    typeButton: {
      flex: 1,
      paddingVertical: SIZES.md,
      paddingHorizontal: SIZES.lg,
      borderRadius: SIZES.radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    typeButtonActive: {
      backgroundColor: colors.primary,
      ...SHADOWS[isDark ? 'dark' : 'light'].small,
    },
    typeButtonText: {
      fontSize: SIZES.fontSize.md,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    typeButtonTextActive: {
      color: '#FFFFFF',
    },
    content: {
      flex: 1,
    },
  });
};
