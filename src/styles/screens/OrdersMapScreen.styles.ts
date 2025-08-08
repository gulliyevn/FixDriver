import { StyleSheet } from 'react-native';
import { getCurrentColors, SIZES, SHADOWS } from '../../constants/colors';

export const createOrdersMapScreenStyles = (isDark: boolean) => {
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
      paddingHorizontal: SIZES.lg,
      paddingVertical: SIZES.md,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      ...(isDark ? SHADOWS.dark.small : SHADOWS.light.small),
    },
    headerTitle: {
      fontSize: SIZES.fontSize.xl,
      fontWeight: '600',
      color: colors.text,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SIZES.sm,
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      ...(isDark ? SHADOWS.dark.small : SHADOWS.light.small),
    },
    iconButtonPrimary: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    iconButtonText: {
      color: colors.background,
      fontWeight: '600',
    },
    mapContainer: {
      flex: 1,
    },
    bottomBar: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      padding: SIZES.md,
      backgroundColor: colors.background + 'DD',
      borderTopWidth: 1,
      borderTopColor: colors.border,
      gap: SIZES.sm,
    },
    primaryButton: {
      height: SIZES.buttonHeight.lg,
      borderRadius: SIZES.radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
    },
    primaryButtonText: {
      color: colors.background,
      fontSize: SIZES.fontSize.md,
      fontWeight: '600',
    },
  });
};


