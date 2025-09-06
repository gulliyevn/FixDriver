import { StyleSheet } from 'react-native';

export const createDriverInfoBarStyles = (theme: any) => StyleSheet.create({
  driverInfoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  scheduleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  priceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  distanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  scheduleText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500',
    marginLeft: 4,
  },
  priceText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  distanceText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500',
    marginLeft: 4,
  },
  timeText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500',
    marginLeft: 4,
  },
});
