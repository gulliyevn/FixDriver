import { StyleSheet } from 'react-native';

export const PaymentHistorySectionStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
    marginTop: 16,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
    marginLeft: 8,
  },

  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },

  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
    marginRight: 4,
  },

  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },

  emptyIcon: {
    color: '#9CA3AF',
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 4,
  },

  emptyDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },

  transactionsContainer: {
    gap: 12,
    maxHeight: 400,
  },

  transactionItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 8,
    marginHorizontal: 8,
  },

  transactionIconContainer: {
    marginRight: 12,
  },

  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  transactionContent: {
    flex: 1,
  },

  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },

  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
    minWidth: 80,
    textAlign: 'right',
  },

  transactionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },

  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  transactionDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },

  loadingMore: {
    alignItems: 'center',
    paddingVertical: 16,
  },

  loadingMoreText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});

export const getPaymentHistorySectionColors = (isDark: boolean) => {
  const colors = isDark ? {
    background: '#1F2937',
    surface: '#374151',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    textTertiary: '#6B7280',
    border: '#4B5563',
    card: '#374151',
  } : {
    background: '#ffffff',
    surface: '#F9FAFB',
    text: '#1F2937',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    border: '#F3F4F6',
    card: '#ffffff',
  };

  return {
    title: { color: colors.text },
    viewAllText: { color: '#3B82F6' },
    emptyIcon: { color: colors.textTertiary },
    emptyTitle: { color: colors.textSecondary },
    emptyDescription: { color: colors.textTertiary },
    transactionItem: { 
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    transactionTitle: { color: colors.text },
    transactionDescription: { color: colors.textSecondary },
    transactionDate: { color: colors.textTertiary },
    loadingMoreText: { color: colors.textTertiary },
  };
}; 