import { StyleSheet } from 'react-native';
import { getCurrentColors, SHADOWS, SIZES } from '../../../../constants/colors';

export const createDialogsStyles = (isDark: boolean) => {
  const palette = getCurrentColors(isDark);

  return StyleSheet.create({
    dialogOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    dialogContainer: {
      backgroundColor: palette.background,
      borderRadius: SIZES.radius.lg,
      padding: SIZES.lg + 10,
      marginHorizontal: SIZES.md,
      marginVertical: SIZES.lg,
      minWidth: 340,
      minHeight: 200,
      ...(isDark ? SHADOWS.dark.large : SHADOWS.light.large),
    },
    dialogTitle: {
      fontSize: SIZES.fontSize.lg + 2,
      fontWeight: '600',
      color: palette.text,
      marginBottom: SIZES.md,
      textAlign: 'center',
    },
    dialogText: {
      fontSize: SIZES.fontSize.md + 2,
      color: palette.textSecondary,
      marginBottom: SIZES.lg + 10,
      textAlign: 'center',
      lineHeight: 24,
    },
    dialogButton: {
      backgroundColor: palette.primary,
      paddingVertical: SIZES.md,
      paddingHorizontal: SIZES.lg,
      borderRadius: SIZES.radius.md,
      alignItems: 'center',
    },
    dialogButtonText: {
      color: '#FFFFFF',
      fontSize: SIZES.fontSize.md,
      fontWeight: '600',
    },
    dialogButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: SIZES.md,
      marginBottom: 0,
    },
    dialogCancelButton: {
      flex: 1,
      backgroundColor: 'transparent',
      paddingVertical: SIZES.md + 5,
      paddingHorizontal: SIZES.lg + 10,
      borderRadius: SIZES.radius.md,
      borderWidth: 1,
      borderColor: palette.border,
      alignItems: 'center',
    },
    dialogCancelButtonText: {
      color: palette.text,
      fontSize: SIZES.fontSize.md + 2,
      fontWeight: '600',
    },
    dialogOkButton: {
      flex: 1,
      backgroundColor: palette.primary,
      paddingVertical: SIZES.md + 5,
      paddingHorizontal: SIZES.lg + 10,
      borderRadius: SIZES.radius.md,
      alignItems: 'center',
    },
    dialogOkButtonText: {
      color: '#FFFFFF',
      fontSize: SIZES.fontSize.md + 2,
      fontWeight: '600',
    },
    emergencyStopButton: {
      flex: 1,
      backgroundColor: '#EAB308',
      paddingVertical: SIZES.md + 5,
      paddingHorizontal: SIZES.lg + 10,
      borderRadius: SIZES.radius.md,
      alignItems: 'center',
      marginRight: SIZES.xs,
    },
    emergencyEndButton: {
      flex: 1,
      backgroundColor: '#DC2626',
      paddingVertical: SIZES.md + 5,
      paddingHorizontal: SIZES.lg + 10,
      borderRadius: SIZES.radius.md,
      alignItems: 'center',
      marginLeft: SIZES.xs,
    },
    emergencyButtonText: {
      color: '#FFFFFF',
      fontSize: SIZES.fontSize.sm + 1,
      fontWeight: '600',
      textAlign: 'center',
    },
  });
};
