import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    height: 52,
    marginTop: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  dayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dayButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  // New shared styles
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flex1: {
    flex: 1,
  },
  addButton: {
    marginLeft: 12,
    padding: 8,
    borderRadius: 8,
  },
});
