/**
 * BalanceHistory component
 * Transaction history display
 */

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { lightColors, darkColors } from '../../../../../shared/constants/colors';
import { BalanceScreenStyles as styles } from '../styles/BalanceScreen.styles';

interface BalanceHistoryProps {
  maxItems?: number;
}

interface Transaction {
  id: string;
  type: 'topup' | 'withdraw' | 'payment';
  amount: number;
  date: string;
  description: string;
}

export const BalanceHistory: React.FC<BalanceHistoryProps> = ({ maxItems = 5 }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : lightColors;
  
  // Mock transaction data - TODO: Replace with real data from context/API
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      type: 'topup',
      amount: 100,
      date: '2025-01-10',
      description: t('balance.topUp')
    },
    {
      id: '2',
      type: 'payment',
      amount: -25,
      date: '2025-01-09',
      description: t('balance.payment')
    },
    {
      id: '3',
      type: 'withdraw',
      amount: -50,
      date: '2025-01-08',
      description: t('balance.withdraw')
    }
  ];
  
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'topup':
        return 'add-circle';
      case 'withdraw':
        return 'card';
      case 'payment':
        return 'receipt';
      default:
        return 'cash';
    }
  };
  
  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'topup':
        return currentColors.success;
      case 'withdraw':
        return currentColors.warning;
      case 'payment':
        return currentColors.error;
      default:
        return currentColors.textSecondary;
    }
  };
  
  const formatAmount = (amount: number) => {
    const sign = amount > 0 ? '+' : '';
    return `${sign}${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} AFc`;
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <View style={styles.historyContainer}>
      <View style={styles.historyHeader}>
        <Text style={[styles.historyTitle, { color: currentColors.text }]}>
          {t('balance.history')}
        </Text>
        <TouchableOpacity>
          <Text style={[styles.historyViewAll, { color: currentColors.primary }]}>
            {t('balance.viewAll')}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.historyList}>
        {mockTransactions.slice(0, maxItems).map((transaction) => (
          <View 
            key={transaction.id}
            style={[
              styles.historyItem,
              { backgroundColor: currentColors.surface }
            ]}
          >
            <View style={styles.historyItemLeft}>
              <View style={[
                styles.historyIconContainer,
                { backgroundColor: getTransactionColor(transaction.type) + '20' }
              ]}>
                <Ionicons 
                  name={getTransactionIcon(transaction.type) as any}
                  size={20} 
                  color={getTransactionColor(transaction.type)}
                />
              </View>
              <View style={styles.historyItemInfo}>
                <Text style={[styles.historyItemDescription, { color: currentColors.text }]}>
                  {transaction.description}
                </Text>
                <Text style={[styles.historyItemDate, { color: currentColors.textSecondary }]}>
                  {formatDate(transaction.date)}
                </Text>
              </View>
            </View>
            <Text style={[
              styles.historyItemAmount,
              { color: transaction.amount > 0 ? currentColors.success : currentColors.error }
            ]}>
              {formatAmount(transaction.amount)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
