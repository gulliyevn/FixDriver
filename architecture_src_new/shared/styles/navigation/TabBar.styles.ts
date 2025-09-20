import { StyleSheet } from 'react-native';
import { getCurrentColors } from '../../constants/colors';

export const createTabBarStyles = (isDark: boolean) => {
  const colors = getCurrentColors(isDark);
  
  return StyleSheet.create({
    tabBar: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingBottom: 8,
      paddingTop: 0,
      height: 88,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
    marginTop: -6,
    position: 'relative',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
    tabIndicator: {
      position: 'absolute',
      bottom: 14,
      width: 20,
      height: 3,
      borderRadius: 1.5,
      backgroundColor: colors.primary,
    },
  specialTabContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
    specialTabCircle: {
      width: 70,
      height: 70,
      borderRadius: 35,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: -20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 3,
      borderColor: colors.card,
    },
  });
};
