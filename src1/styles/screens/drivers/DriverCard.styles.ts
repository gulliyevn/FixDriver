import { StyleSheet } from 'react-native';
import { lightColors, darkColors } from '../../../constants/colors';

export const DriverCardStyles = StyleSheet.create({
  container: {
    backgroundColor: lightColors.surface,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  driverContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverCompactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: lightColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nameRatingRow: {
    flex: 1,
    marginRight: 12,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: lightColors.text,
    marginBottom: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: lightColors.textSecondary,
    marginLeft: 4,
  },
  carInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  carInfoText: {
    fontSize: 14,
    color: lightColors.textSecondary,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: lightColors.textSecondary,
  },
  memberTagRowSpaced: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  memberTagCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  memberIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  memberName: {
    fontSize: 12,
    color: lightColors.textSecondary,
  },
  expandArrow: {
    padding: 8,
  },
  driverExpanded: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: lightColors.border,
  },
  routeSection: {
    marginBottom: 16,
  },
  routeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: lightColors.text,
    marginBottom: 12,
  },
  routePointWithTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeLeftSide: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  routePinContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: lightColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  routePin: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  routeText: {
    fontSize: 14,
    color: lightColors.text,
    flex: 1,
  },
  routeTime: {
    fontSize: 12,
    color: lightColors.textSecondary,
    marginLeft: 8,
  },
  tripDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  tripDetailItem: {
    alignItems: 'center',
  },
  tripDetailText: {
    fontSize: 12,
    color: lightColors.textSecondary,
    marginTop: 4,
  },
  expandedActions: {
    flexDirection: 'row',
    gap: 12,
  },
  callButtonExpanded: {
    flex: 1,
    backgroundColor: lightColors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  callButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  chatButtonExpanded: {
    flex: 1,
    backgroundColor: lightColors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  chatButtonDisabled: {
    backgroundColor: lightColors.border,
  },
  chatButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  chatButtonTextDisabled: {
    color: lightColors.textSecondary,
  },
});

// Темные стили
export const DriverCardDarkStyles = StyleSheet.create({
  container: {
    backgroundColor: darkColors.surface,
  },
  driverName: {
    color: darkColors.text,
  },
  ratingText: {
    color: darkColors.textSecondary,
  },
  carInfoText: {
    color: darkColors.textSecondary,
  },
  statusText: {
    color: darkColors.textSecondary,
  },
  memberTagCompact: {
    backgroundColor: darkColors.border,
  },
  memberName: {
    color: darkColors.textSecondary,
  },
  driverExpanded: {
    borderTopColor: darkColors.border,
  },
  routeTitle: {
    color: darkColors.text,
  },
  routeText: {
    color: darkColors.text,
  },
  routeTime: {
    color: darkColors.textSecondary,
  },
  tripDetailText: {
    color: darkColors.textSecondary,
  },
}); 