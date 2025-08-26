import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    height: 45,
    marginTop: 6,
    marginBottom: 20,
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
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
});
