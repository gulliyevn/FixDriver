import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';

export const DriverCardStyles = StyleSheet.create({
  driverCard: {
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.light.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  driverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  driverInfo: {
    flex: 1,
    marginLeft: 12,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.light.text,
    marginBottom: 4,
  },
  driverDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  driverDetailText: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginLeft: 4,
  },
  driverStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusOnline: {
    backgroundColor: colors.light.success,
  },
  statusOffline: {
    backgroundColor: colors.light.textSecondary,
  },
  statusText: {
    fontSize: 12,
    color: colors.light.textSecondary,
  },
  driverActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  callButton: {
    backgroundColor: colors.light.success,
  },
  chatButton: {
    backgroundColor: colors.light.primary,
  },
  chatButtonDisabled: {
    backgroundColor: colors.light.border,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  chatButtonText: {
    color: '#FFFFFF',
  },
  chatButtonTextDisabled: {
    color: colors.light.textSecondary,
  },
  driverContent: {
    backgroundColor: colors.light.card,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: colors.light.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  driverCompactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameRatingRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    color: colors.light.textSecondary,
  },
  carInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  carInfoText: {
    fontSize: 14,
    color: colors.light.textSecondary,
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
  memberTagRowSpaced: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  memberTagCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
  },
  memberIcon: {
    marginRight: 4,
  },
  memberName: {
    fontSize: 13,
    color: colors.light.textSecondary,
  },
  expandArrow: {
    marginLeft: 8,
  },
}); 