import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';

export const DriverExpandedStyles = StyleSheet.create({
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  scheduleContainer: {
    marginBottom: 12,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
    marginBottom: 8,
  },
  scheduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  scheduleItem: {
    backgroundColor: colors.light.surface,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  scheduleItemActive: {
    backgroundColor: colors.light.primary,
  },
  scheduleText: {
    fontSize: 12,
    color: colors.light.textSecondary,
  },
  scheduleTextActive: {
    color: '#FFFFFF',
  },
  tripDetails: {
    marginBottom: 12,
  },
  tripDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  tripDetailText: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginLeft: 8,
  },
  expandedActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  callButtonExpanded: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.light.success,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  callButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  chatButtonExpanded: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  driverExpanded: {
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    marginTop: 8,
    padding: 12,
  },
  routeSection: {
    marginBottom: 12,
  },
  routePointWithTime: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  routeText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  routeTime: {
    fontSize: 12,
    color: colors.light.textSecondary,
  },
}); 