import { StyleSheet } from 'react-native';
import { getCurrentColors, SIZES } from '../../../../../shared/constants/colors';

export const createOrdersHeaderStyles = (isDark: boolean) => {
  const colors = getCurrentColors(isDark);

  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: SIZES.xl,
      paddingVertical: SIZES.lg,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTop: {
      flexDirection: 'column',
      width: '100%',
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    headerContent: {
      flex: 1,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SIZES.md,
    },
    title: {
      fontSize: SIZES.fontSize.xl,
      fontWeight: '700',
      color: colors.text,
      marginBottom: SIZES.xs,
    },
    subtitle: {
      fontSize: SIZES.fontSize.sm,
      color: colors.textSecondary,
      fontWeight: '400',
    },
    filterIconContainer: {
      padding: SIZES.xs,
    },
    filterButton: {
      padding: SIZES.xs,
    },
    // Стили для фильтров
    filtersWrapper: {
      zIndex: 1,
    },
    filtersContainer: {
      height: 40,
    },
    filtersContent: {
      paddingHorizontal: SIZES.sm,
      gap: SIZES.xs,
      alignItems: 'center',
    },
    filterChip: {
      backgroundColor: colors.primary + '15',
      borderRadius: 24,
      paddingHorizontal: SIZES.lg,
      paddingVertical: SIZES.sm,
      marginHorizontal: SIZES.xs / 2,
      borderWidth: 1.5,
      borderColor: colors.primary + '30',
      flexDirection: 'row',
      alignItems: 'center',
      gap: SIZES.xs,
    },
    filterChipActive: {
      backgroundColor: colors.primary + '25',
      borderColor: colors.primary,
    },
    filterChipText: {
      fontSize: SIZES.fontSize.md,
      color: colors.primary,
      fontWeight: '600',
    },
    filterChipTextActive: {
      color: isDark ? '#FFFFFF' : '#083198',
    },
  });
};
