import { StyleSheet } from 'react-native';
import { getCurrentColors, SHADOWS, SIZES } from '../../../../constants/colors';

export const createRatingStyles = (isDark: boolean) => {
  const palette = getCurrentColors(isDark);

  return StyleSheet.create({
    ratingDialogContainer: {
      backgroundColor: palette.background,
      borderRadius: SIZES.radius.lg,
      padding: SIZES.lg + 10,
      marginHorizontal: SIZES.md,
      marginVertical: SIZES.lg,
      minWidth: 320,
      minHeight: 340,
      ...(isDark ? SHADOWS.dark.large : SHADOWS.light.large),
    },
    ratingContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SIZES.md,
      gap: SIZES.sm,
    },
    starButton: {
      padding: SIZES.xs,
    },
    commentContainer: {
      marginBottom: SIZES.md,
    },
    commentLabel: {
      fontSize: SIZES.fontSize.md,
      fontWeight: '600',
      color: palette.text,
      marginBottom: SIZES.sm,
    },
    commentInput: {
      borderWidth: 1,
      borderColor: palette.border,
      borderRadius: SIZES.radius.md,
      padding: SIZES.sm,
      fontSize: SIZES.fontSize.md,
      color: palette.text,
      backgroundColor: palette.surface,
      minHeight: 80,
      textAlignVertical: 'top',
    },
  });
};
