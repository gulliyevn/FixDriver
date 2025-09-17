import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';

export const AboutScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 45, // Устанавливаем отступ сверху
    paddingBottom: 6, // Отступ снизу
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingVertical: 16,
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
    marginLeft: 16,
    marginRight: 16,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 24,
  },
  appTextContainer: {
    flex: 1,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#003366',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 18,
    color: '#888',
  },
  appDescription: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#003366',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#888',
  },
  linksSection: {
    marginBottom: 24,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 8,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#003366',
    marginLeft: 12,
    flex: 1,
  },
  // Стили для модального окна
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
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
    flex: 1,
  },
  modalCloseButton: {
    padding: 8,
    marginLeft: 8,
  },
  modalScrollView: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    maxHeight: 400,
  },
  modalText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

// Функции для динамических стилей с поддержкой темной темы
export const getAboutScreenStyles = (isDark: boolean) => {
  const currentColors = isDark ? colors.dark : colors.light;
  
  return {
    container: {
      backgroundColor: currentColors.background,
    },
    header: {
      borderBottomColor: currentColors.border,
    },
    title: {
      color: currentColors.text,
    },
    appIcon: {
      backgroundColor: currentColors.surface,
    },
    appName: {
      color: currentColors.text,
    },
    appVersion: {
      color: currentColors.textSecondary,
    },
    appDescription: {
      color: currentColors.textSecondary,
    },
    sectionTitle: {
      color: currentColors.text,
    },
    infoItem: {
      backgroundColor: currentColors.surface,
    },
    infoLabel: {
      color: currentColors.text,
    },
    infoValue: {
      color: currentColors.textSecondary,
    },
    linkItem: {
      backgroundColor: currentColors.surface,
    },
    linkText: {
      color: currentColors.text,
    },
    modalContent: {
      backgroundColor: currentColors.card,
    },
    modalHeader: {
      borderBottomColor: currentColors.border,
    },
    modalTitle: {
      color: currentColors.text,
    },
    modalText: {
      color: currentColors.text,
    },
  };
}; 