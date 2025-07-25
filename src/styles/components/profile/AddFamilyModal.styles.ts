import { StyleSheet } from 'react-native';

export const AddFamilyModalStyles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 5,
    paddingTop: 80,
  },
  modalScrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    margin: 40,
    width: '98%',
    maxHeight: '120%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInputContainer: {
    marginBottom: 16,
  },
  typeInputContainer: {
    position: 'relative',
  },
  modalInputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#003366',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  modalSelectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  modalSelectText: {
    fontSize: 16,
    color: '#003366',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 0,
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: '#003366',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalSaveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  typeDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    zIndex: 1000,
  },
  typeDropdownScroll: {
    maxHeight: 200,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  typeOptionSelected: {
    backgroundColor: '#f8f9fa',
  },
  typeOptionLast: {
    borderBottomWidth: 0,
  },
  typeOptionText: {
    fontSize: 16,
    color: '#003366',
  },
  typeOptionTextSelected: {
    fontWeight: '600',
  },
});

export const getAddFamilyModalColors = (isDark: boolean) => {
  const colors = isDark ? {
    background: '#111827',
    surface: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    primary: '#3B82F6',
    border: '#374151',
  } : {
    background: '#ffffff',
    surface: '#f9f9f9',
    text: '#003366',
    textSecondary: '#666666',
    primary: '#083198',
    border: '#f0f0f0',
  };

  return {
    modalContent: { backgroundColor: colors.background },
    modalTitle: { color: colors.text },
    modalInputLabel: { color: colors.text },
    modalInput: { 
      backgroundColor: colors.surface,
      borderColor: colors.border,
      color: colors.text 
    },
    modalSelectButton: { 
      backgroundColor: colors.surface,
      borderColor: colors.border 
    },
    modalSelectText: { color: colors.text },
    modalCancelButton: { backgroundColor: colors.surface },
    modalCancelButtonText: { color: colors.textSecondary },
    modalSaveButton: { backgroundColor: colors.primary },
    modalSaveButtonText: { color: colors.background },
    typeDropdown: { 
      backgroundColor: colors.background,
      borderColor: colors.border 
    },
    typeOption: { borderBottomColor: colors.border },
    typeOptionSelected: { backgroundColor: colors.surface },
    typeOptionText: { color: colors.text },
    typeOptionTextSelected: { color: colors.primary },
  };
}; 