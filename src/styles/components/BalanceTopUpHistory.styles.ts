import { StyleSheet } from 'react-native';

export const BalanceTopUpHistoryStyles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  transactionsList: {
    maxHeight: 200,
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
  transactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
    minWidth: 80,
    textAlign: 'right',
  },
});

export const getBalanceTopUpHistoryStyles = (isDark: boolean) => {
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
    container: { backgroundColor: colors.background },
    title: { color: colors.text },
    transactionItem: { 
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    transactionTitle: { color: colors.text },
    transactionDate: { color: colors.textTertiary },
  };
}; 