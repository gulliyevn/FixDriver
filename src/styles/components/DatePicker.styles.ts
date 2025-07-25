import { StyleSheet } from 'react-native';

export const DatePickerStyles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 10,
  },
  pickerButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerText: {
    fontSize: 16,
    flex: 1,
  },
  pickerIcon: {
    marginLeft: 8,
  },
  inlinePickerButton: {
    borderWidth: 0,
    borderRadius: 0,
    padding: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    flex: 1,
    gap: 8,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    margin: 0,
  },
  inlinePickerText: {
    fontSize: 16,
    textAlign: 'right',
    minWidth: 80,
  },
  readOnlyText: {
    fontSize: 16,
    textAlign: 'right',
    minWidth: 80,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 20,
    marginHorizontal: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  datePickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 200,
    flex: 1,
    marginLeft: 0,
    paddingLeft: 0,
  },
});

export const getDatePickerColors = (isDark: boolean) => {
  const colors = isDark ? {
    background: '#1F2937',
    surface: '#374151',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    primary: '#3B82F6',
    border: '#4B5563',
  } : {
    background: '#ffffff',
    surface: '#f9f9f9',
    text: '#003366',
    textSecondary: '#666666',
    primary: '#083198',
    border: '#f0f0f0',
  };

  return {
    label: { color: colors.text },
    pickerButton: { 
      backgroundColor: colors.surface,
      borderColor: colors.border 
    },
    pickerText: { color: colors.text },
    pickerTextPlaceholder: { color: colors.textSecondary },
    pickerIcon: { color: colors.primary },
    modalContent: { backgroundColor: colors.background },
    modalButtonText: { color: colors.primary },
    modalTitle: { color: colors.text },
    datePickerContainer: { 
      backgroundColor: colors.surface,
      width: '100%',
      marginLeft: 0,
      paddingLeft: 0,
    },
  };
}; 