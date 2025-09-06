import { StyleSheet } from 'react-native';
import { getCurrentColors, SIZES } from '../../../../constants/colors';

export const createAvatarStyles = (isDark: boolean, role: 'client' | 'driver' = 'client') => {
  const palette = getCurrentColors(isDark);

  return StyleSheet.create({
    avatarContainer: {
      position: 'relative',
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: palette.primary,
      ...(role === 'client' && {
        width: 56,
        height: 56,
        borderRadius: 28,
      }),
    },
    onlineIndicator: {
      position: 'absolute',
      bottom: 2,
      right: 2,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: '#10B981',
      borderWidth: 2,
      borderColor: palette.background,
    },
  });
};
