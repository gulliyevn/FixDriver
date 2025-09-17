import { StyleSheet } from 'react-native';
import { getCurrentColors, SHADOWS, SIZES } from '../../../../constants/colors';

export const createCallSheetStyles = (isDark: boolean) => {
  const palette = getCurrentColors(isDark);

  return StyleSheet.create({
    callSheetOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    callSheetBackdrop: {
      flex: 1,
    },
    callSheetContainer: {
      backgroundColor: palette.background,
      borderTopLeftRadius: SIZES.radius.xl,
      borderTopRightRadius: SIZES.radius.xl,
      paddingTop: SIZES.lg,
      paddingBottom: SIZES.xl + 20,
      paddingHorizontal: SIZES.lg,
      ...(isDark ? SHADOWS.dark.large : SHADOWS.light.large),
    },
    callSheetClose: {
      position: 'absolute',
      top: SIZES.lg,
      right: SIZES.lg,
      zIndex: 1,
    },
    callSheetHandle: {
      width: 40,
      height: 4,
      backgroundColor: palette.border,
      borderRadius: 2,
      alignSelf: 'center',
      marginBottom: SIZES.lg,
    },
    callSheetTitle: {
      fontSize: SIZES.fontSize.lg,
      fontWeight: '700',
      color: palette.text,
      textAlign: 'center',
      marginBottom: SIZES.xl,
    },
    callSheetOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: SIZES.lg,
      paddingHorizontal: SIZES.md,
      borderRadius: SIZES.radius.md,
      backgroundColor: palette.surface,
      marginBottom: SIZES.md,
      borderWidth: 1,
      borderColor: palette.border,
    },
    callSheetOptionText: {
      fontSize: SIZES.fontSize.md,
      fontWeight: '600',
      color: palette.text,
      marginLeft: SIZES.md,
      flex: 1,
    },
  });
};
