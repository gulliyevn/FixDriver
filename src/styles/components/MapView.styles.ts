import { StyleSheet } from 'react-native';
import { getCurrentColors, SHADOWS } from '../../constants/colors';

export const createMapViewStyles = (isDark: boolean) => {
  const palette = getCurrentColors(isDark);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    map: {
      flex: 1,
      backgroundColor: palette.surface,
    },
    markerAContainer: {
      backgroundColor: palette.card,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: isDark ? palette.borderLight : '#222',
      padding: 2,
      alignItems: 'center',
      justifyContent: 'center',
      ...(isDark ? SHADOWS.dark.small : SHADOWS.light.small),
    },
    markerBContainer: {
      backgroundColor: palette.card,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: palette.success,
      padding: 2,
      alignItems: 'center',
      justifyContent: 'center',
      ...(isDark ? SHADOWS.dark.small : SHADOWS.light.small),
    },
    driverMarkerContainer: {
      backgroundColor: palette.primary,
      borderRadius: 20,
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 3,
      borderColor: '#FFFFFF',
      ...(isDark ? SHADOWS.dark.medium : SHADOWS.light.medium),
    },
    durationMarkerContainer: {
      backgroundColor: palette.text,
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderWidth: 2,
      borderColor: '#fff',
      ...(isDark ? SHADOWS.dark.medium : SHADOWS.light.medium),
    },
    durationMarkerText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '600',
    },
  });
};

// Backward-compatible default (light theme)
export const MapViewStyles = createMapViewStyles(false);