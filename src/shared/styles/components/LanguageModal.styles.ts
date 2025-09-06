import { StyleSheet, Dimensions } from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

export const LanguageModalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 6,
  },
  languageList: {
    maxHeight: 350,
    paddingVertical: 8,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  languageItemSelected: {
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#2196f3',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
  languageNameSelected: {
    fontWeight: '600',
    color: '#1976d2',
  },
  // Стили для иконки выбора
  checkIcon: {
    marginLeft: 6,
  },
});

// Функция для получения цветовых стилей в зависимости от темы
export const getLanguageModalColors = (isDark: boolean) => {
  const colors = isDark ? {
    background: '#1F2937',
    surface: '#374151',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    primary: '#3B82F6',
    border: '#4B5563',
    selectedBg: '#1E3A8A',
    selectedBorder: '#3B82F6',
  } : {
    background: '#ffffff',
    surface: '#f5f5f5',
    text: '#333333',
    textSecondary: '#666666',
    primary: '#2196f3',
    border: '#e0e0e0',
    selectedBg: '#e3f2fd',
    selectedBorder: '#2196f3',
  };

  return {
    modalContent: { backgroundColor: colors.background },
    modalHeader: { 
      backgroundColor: colors.surface,
      borderBottomColor: colors.border 
    },
    modalTitle: { color: colors.text },
    languageItem: { 
      backgroundColor: colors.background,
      shadowColor: isDark ? '#000' : '#000',
    },
    languageItemSelected: { 
      backgroundColor: colors.selectedBg,
      borderColor: colors.selectedBorder 
    },
    languageName: { color: colors.text },
    languageNameSelected: { color: colors.primary },
  };
}; 