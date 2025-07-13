import { StyleSheet } from 'react-native';

export const RulesModalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalCloseButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
  },
  placeholder: {
    width: 40,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  rulesSection: {
    marginBottom: 24,
  },
  rulesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
    marginBottom: 8,
  },
  rulesText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
}); 