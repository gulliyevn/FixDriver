import { StyleSheet } from 'react-native';
import { getCurrentColors, SIZES } from '../../../../constants/colors';

export const createTripsStyles = (isDark: boolean) => {
  const palette = getCurrentColors(isDark);

  return StyleSheet.create({
    expandableContent: {
      overflow: 'hidden',
    },
    expandableTouchArea: {
      width: '100%',
    },
    tripsContainer: {
      marginVertical: SIZES.xs + 6,
    },
    tripItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: SIZES.xs + 6,
    },
    tripDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#10B981',
      marginRight: SIZES.md,
    },
    tripDotBlue: {
      backgroundColor: '#3B82F6',
    },
    tripDotLocation: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: '#6B7280',
    },
    tripText: {
      flex: 1,
      fontSize: SIZES.fontSize.md,
      color: palette.text,
      fontWeight: '500',
    },
    tripTime: {
      fontSize: SIZES.fontSize.md,
      color: palette.textSecondary,
      fontWeight: '500',
    },
    bottomBorder: {
      marginTop: SIZES.xs + 6,
      paddingTop: SIZES.xs + 6,
      borderTopWidth: 1,
      borderTopColor: palette.border,
    },
    vehiclePhotoContainer: {
      width: 120,
      height: 100,
      borderRadius: 8,
      backgroundColor: palette.surface,
      marginLeft: SIZES.sm,
    },
    vehiclePhoto: {
      width: '70%',
      height: '70%',
      alignSelf: 'center',
      marginTop: '15%',
    },
    vehiclePhotoPlaceholder: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: palette.surface,
    },
  });
};
