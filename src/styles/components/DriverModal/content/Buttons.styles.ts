import { StyleSheet } from 'react-native';
import { getCurrentColors, SIZES } from '../../../../constants/colors';

export const createButtonsStyles = (isDark: boolean) => {
  const palette = getCurrentColors(isDark);

  return StyleSheet.create({
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: SIZES.sm,
      marginBottom: SIZES.lg,
      gap: SIZES.md,
    },
    leftButton: {
      flex: 1,
      backgroundColor: palette.primary,
      paddingVertical: SIZES.md,
      paddingHorizontal: SIZES.md,
      borderRadius: SIZES.radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: SIZES.xs,
    },
    leftButtonText: {
      color: '#FFFFFF',
      fontSize: SIZES.fontSize.md,
      fontWeight: '600',
    },
    rightButton: {
      flex: 1,
      backgroundColor: 'transparent',
      paddingVertical: SIZES.md,
      paddingHorizontal: SIZES.md,
      borderRadius: SIZES.radius.md,
      borderWidth: 1,
      borderColor: palette.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rightButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: SIZES.xs,
    },
    rightButtonText: {
      color: palette.text,
      fontSize: SIZES.fontSize.md,
      fontWeight: '600',
    },
  });
};
