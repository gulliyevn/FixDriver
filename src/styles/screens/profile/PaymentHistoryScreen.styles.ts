import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';

export const PaymentHistoryScreenStyles = StyleSheet.create({
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
  filterButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  emptyState: {
    flex: 1,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#003366',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  paymentItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  paymentDetails: {
    marginLeft: 12,
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003366',
    marginBottom: 4,
  },
  paymentDate: {
    fontSize: 14,
    color: '#888',
  },
  paymentAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
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
  paymentDescription: {
    fontSize: 14,
    color: '#888',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  loadingMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  loadingMoreText: {
    fontSize: 14,
    textAlign: 'center',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#e53935',
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: '#e53935',
  },
  errorCloseButton: {
    padding: 4,
  },
});

// Функция для получения динамических стилей в зависимости от темы
export const getPaymentHistoryScreenStyles = (isDark: boolean) => {
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
    paymentItem: {
      backgroundColor: currentColors.surface,
    },
    paymentTitle: {
      color: currentColors.text,
    },
    paymentDate: {
      color: currentColors.textSecondary,
    },
    paymentDescription: {
      color: currentColors.textSecondary,
      borderTopColor: currentColors.border,
    },
    loadingText: {
      color: currentColors.textSecondary,
    },
    loadingMoreText: {
      color: currentColors.textSecondary,
    },
    errorBox: {
      backgroundColor: isDark ? '#2d1b1b' : '#ffebee',
    },
    errorText: {
      color: '#e53935',
    },
  };
}; 