import { StyleSheet } from 'react-native';
import { getCurrentColors, SIZES, SHADOWS } from '../../constants/colors';

export const createAddOrderScreenStyles = (isDark: boolean) => {
  const colors = getCurrentColors(isDark);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: SIZES.lg,
      gap: SIZES.lg,
    },
    title: {
      fontSize: SIZES.fontSize.xxl,
      lineHeight: SIZES.lineHeight.xxxl,
      fontWeight: '600',
      color: colors.text,
    },
    field: {
      gap: SIZES.xs,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SIZES.sm,
    },
    label: {
      color: colors.text,
      fontSize: SIZES.fontSize.md,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: SIZES.radius.md,
      padding: SIZES.md,
      color: colors.text,
      backgroundColor: colors.card,
      ...(isDark ? SHADOWS.dark.small : SHADOWS.light.small),
    },
    inputMultiline: {
      minHeight: 88,
      textAlignVertical: 'top',
    },
    chipsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SIZES.sm,
    },
    chip: {
      paddingHorizontal: SIZES.md,
      paddingVertical: SIZES.sm,
      borderRadius: SIZES.radius.round,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    chipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    chipText: {
      fontSize: SIZES.fontSize.md,
      color: colors.text,
    },
    chipTextActive: {
      color: colors.background,
      fontWeight: '600',
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: SIZES.lg,
    },
    sectionTitle: {
      fontSize: SIZES.fontSize.xl,
      color: colors.text,
      fontWeight: '600',
      marginBottom: SIZES.sm,
    },
    helperText: {
      fontSize: SIZES.fontSize.sm,
      color: colors.textSecondary,
    },
    addButton: {
      borderRadius: SIZES.radius.md,
      paddingVertical: SIZES.sm,
      paddingHorizontal: SIZES.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignSelf: 'flex-start',
    },
    addButtonText: {
      color: colors.primary,
      fontWeight: '600',
    },
    stepper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SIZES.sm,
    },
    stepperBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    stepperValue: {
      minWidth: 32,
      textAlign: 'center',
      color: colors.text,
      fontSize: SIZES.fontSize.lg,
      fontWeight: '600',
    },
    submitButton: {
      backgroundColor: colors.primary,
      borderRadius: SIZES.radius.lg,
      paddingVertical: SIZES.md,
      alignItems: 'center',
      justifyContent: 'center',
      ...(isDark ? SHADOWS.dark.medium : SHADOWS.light.medium),
    },
    submitText: {
      color: colors.background,
      fontWeight: '600',
      fontSize: SIZES.fontSize.md,
    },
  });
};


