import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const TabBarStyles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    paddingBottom: 8,
    paddingTop: 8,
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
    paddingVertical: 8,
  },
  tabIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  tabIconActive: {
    tintColor: colors.light.primary,
  },
  tabIconInactive: {
    tintColor: colors.light.textSecondary,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: colors.light.primary,
  },
  tabLabelInactive: {
    color: colors.light.textSecondary,
  },
  tabBadge: {
    position: 'absolute',
    top: 4,
    right: '50%',
    marginRight: -8,
    backgroundColor: colors.light.error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 20,
    height: 3,
    borderRadius: 1.5,
  },
}); 