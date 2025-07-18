import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';

export const DebtsScreenStyles = StyleSheet.create({
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#003366',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  debtItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  debtHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  debtInfo: {
    flex: 1,
    marginRight: 12,
  },
  debtTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003366',
    marginBottom: 4,
  },
  debtDescription: {
    fontSize: 14,
    color: '#888',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  debtDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  debtAmount: {
    flex: 1,
  },
  amountLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#003366',
  },
  debtDate: {
    flex: 1,
    alignItems: 'flex-end',
  },
  dateLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003366',
  },
  payButton: {
    backgroundColor: '#003366',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

// Функция для получения динамических стилей в зависимости от темы
export const getDebtsScreenStyles = (isDark: boolean) => {
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
    emptyTitle: {
      color: currentColors.text,
    },
    emptyDescription: {
      color: currentColors.textSecondary,
    },
    debtItem: {
      backgroundColor: currentColors.surface,
    },
    debtTitle: {
      color: currentColors.text,
    },
    debtDescription: {
      color: currentColors.textSecondary,
    },
    amountValue: {
      color: currentColors.text,
    },
    amountLabel: {
      color: currentColors.textSecondary,
    },
    dateValue: {
      color: currentColors.text,
    },
    dateLabel: {
      color: currentColors.textSecondary,
    },
  };
}; 