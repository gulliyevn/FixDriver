import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    height: 112,
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    padding: 15,
  },
  addressText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    marginBottom: 10,
  },
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayButton: {
    width: 45,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 12,
  },
  bottomDivider: {
    height: 1,
  },
});
