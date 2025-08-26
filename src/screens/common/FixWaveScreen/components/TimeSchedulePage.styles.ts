import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  switchesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  switchLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  switchLabel: {
    fontSize: 12,
    textAlign: 'center',
    width: 100,
  },
  saveButton: {
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 20,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
