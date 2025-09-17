import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';

export const ResidenceScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 45,
    paddingBottom: 6,
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
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#003366',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  addressItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  addressInfo: {
    flex: 1,
    marginRight: 12,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003366',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  addressDescription: {
    fontSize: 12,
    color: '#aaa',
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  editButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#2196f3',
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#ffebee',
    borderWidth: 1,
    borderColor: '#f44336',
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff8e1',
    borderWidth: 1,
    borderColor: '#ffc107',
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultBadge: {
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  defaultText: {
    fontSize: 12,
    color: '#4caf50',
    fontWeight: '600',
  },
  floatingAddButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#003366',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

// Функция для получения динамических стилей в зависимости от темы
export const getResidenceScreenStyles = (isDark: boolean) => {
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
    emptyStateText: {
      color: currentColors.textSecondary,
    },
    addressItem: {
      backgroundColor: currentColors.surface,
    },
    addressTitle: {
      color: currentColors.text,
    },
    addressText: {
      color: currentColors.textSecondary,
    },
    addressDescription: {
      color: currentColors.textSecondary,
    },
    editButton: {
      backgroundColor: currentColors.surface,
      borderColor: currentColors.primary,
    },
    deleteButton: {
      backgroundColor: currentColors.surface,
      borderColor: '#f44336',
    },
    defaultButton: {
      backgroundColor: currentColors.surface,
      borderColor: '#ffc107',
    },
  };
}; 