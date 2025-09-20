import { StyleSheet } from 'react-native';
import { getCurrentColors } from '../../../shared/constants/colors';

export const createHeaderStyles = (isDark: boolean) => {
  const colors = getCurrentColors(isDark);

  return StyleSheet.create({
    safeArea: {
      backgroundColor: colors.surface,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    leftSection: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    centerSection: {
      flex: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rightSection: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    backButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: 'transparent',
    },
    iconButton: {
      padding: 8,
      marginLeft: 8,
      borderRadius: 20,
      backgroundColor: 'transparent',
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 2,
    },
    icon: {
      color: colors.text,
    },
  });
};
