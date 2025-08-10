import { StyleSheet } from 'react-native';
import { getCurrentColors, SHADOWS, SIZES } from '../../constants/colors';

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
    expandButton: {
      position: 'absolute',
      bottom: SIZES.lg,
      right: SIZES.lg,
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: palette.card,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: palette.border,
      ...(isDark ? SHADOWS.dark.medium : SHADOWS.light.medium),
    },
    expandButtonContainer: {
      position: 'absolute',
      bottom: SIZES.lg,
      right: SIZES.lg,
      alignItems: 'flex-end',
    },
    additionalButtonsContainer: {
      position: 'absolute',
      bottom: SIZES.lg + 70,
      right: SIZES.lg - 4,
      alignItems: 'flex-end',
    },
    additionalButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: palette.card,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: palette.border,
      marginBottom: SIZES.sm,
      marginRight: SIZES.lg + 6,
      ...(isDark ? SHADOWS.dark.medium : SHADOWS.light.medium),
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