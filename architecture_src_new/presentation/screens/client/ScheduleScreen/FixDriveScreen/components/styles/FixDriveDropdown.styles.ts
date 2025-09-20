import { StyleSheet, Dimensions } from 'react-native';
import { getCurrentColors, SIZES } from '../../../../../../../shared/constants/colors';
import { SHADOWS } from '../../../../../../../shared/constants/colors';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

export const createFixDriveDropdownStyles = (isDark: boolean) => {
  const colors = getCurrentColors(isDark);

  return StyleSheet.create({
    dropdownContainer: {
      marginBottom: SIZES.lg,
      position: 'relative',
    },
    dropdownLabel: {
      fontSize: isTablet ? SIZES.fontSize.lg : SIZES.fontSize.md,
      fontWeight: '500',
      color: colors.text,
      marginBottom: SIZES.sm,
    },
    dropdownButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: SIZES.radius.md,
      padding: isTablet ? SIZES.lg : SIZES.md,
      backgroundColor: colors.surface,
    },
    dropdownButtonText: {
      fontSize: isTablet ? SIZES.fontSize.xl : SIZES.fontSize.lg,
      color: colors.text,
    },
    dropdownButtonPlaceholder: {
      fontSize: isTablet ? SIZES.fontSize.xl : SIZES.fontSize.lg,
      color: colors.textSecondary,
    },
    dropdownList: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: SIZES.radius.md,
      marginTop: SIZES.xs,
      maxHeight: isTablet ? 250 : 200,
      ...SHADOWS[isDark ? 'dark' : 'light'].large,
      zIndex: 1000,
    },
    dropdownOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: isTablet ? SIZES.lg : SIZES.md,
      paddingHorizontal: isTablet ? SIZES.xl : SIZES.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    dropdownOptionSelected: {
      backgroundColor: colors.surface,
    },
    dropdownOptionLast: {
      borderBottomWidth: 0,
    },
    dropdownOptionText: {
      fontSize: isTablet ? SIZES.fontSize.xl : SIZES.fontSize.lg,
      color: colors.text,
    },
    dropdownOptionTextSelected: {
      fontWeight: '600',
      color: colors.primary,
    },
  });
};
