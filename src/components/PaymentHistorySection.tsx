import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../hooks/useI18n';
import { PaymentHistory, getMockTopUpHistory } from '../mocks/paymentHistoryMock';
import { PaymentHistorySectionStyles as styles, getPaymentHistorySectionColors } from '../styles/components/PaymentHistorySection.styles';

interface PaymentHistorySectionProps {
  onViewAll?: () => void;
  customHistory?: PaymentHistory[];
}

const PaymentHistorySection: React.FC<PaymentHistorySectionProps> = ({ onViewAll, customHistory }) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const dynamicStyles = getPaymentHistorySectionColors(isDark);
  
  const [displayedCount, setDisplayedCount] = useState(5);
  
  // Используем кастомную историю или пустой массив
  const transactions = customHistory || [];
  const displayedTransactions = transactions.slice(0, displayedCount);



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981'; // green
      case 'pending':
        return '#F59E0B'; // yellow
      case 'failed':
        return '#EF4444'; // red
      default:
        return '#6B7280'; // gray
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'trip':
        return 'car';
      case 'topup':
        return 'add-circle';
      case 'refund':
        return 'refresh';
      case 'fee':
        return 'card';
      default:
        return 'receipt';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'trip':
        return '#3B82F6'; // blue
      case 'topup':
        return '#10B981'; // green
      case 'refund':
        return '#8B5CF6'; // purple
      case 'fee':
        return '#F59E0B'; // yellow
      default:
        return '#6B7280'; // gray
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return t('client.paymentHistory.today');
    } else if (date.toDateString() === yesterday.toDateString()) {
      return t('client.paymentHistory.yesterday');
    } else {
      return date.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  const TransactionItem: React.FC<{ transaction: PaymentHistory }> = ({ transaction }) => (
    <View style={[styles.transactionItem, dynamicStyles.transactionItem]}>
      <View style={styles.transactionIconContainer}>
        <View style={[
          styles.iconBackground, 
          { backgroundColor: getTypeColor(transaction.type) + '20' }
        ]}>
          <Ionicons 
            name={getTypeIcon(transaction.type) as any} 
            size={20} 
            color={getTypeColor(transaction.type)} 
          />
        </View>
      </View>
      
      <View style={styles.transactionContent}>
        <View style={styles.transactionHeader}>
          <Text style={[styles.transactionTitle, dynamicStyles.transactionTitle]}>
            {transaction.title}
          </Text>
          <Text style={[
            styles.transactionAmount, 
            { color: transaction.amount.startsWith('+') ? '#10B981' : '#EF4444' }
          ]}>
            {transaction.amount}
          </Text>
        </View>
        
        {transaction.description && (
          <Text style={[styles.transactionDescription, dynamicStyles.transactionDescription]}>
            {transaction.description}
          </Text>
        )}
        
        <View style={styles.transactionFooter}>
          <Text style={[styles.transactionDate, dynamicStyles.transactionDate]}>
            {formatDate(transaction.date)} • {transaction.time}
          </Text>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: getStatusColor(transaction.status) + '20' }
          ]}>
            <Text style={[
              styles.statusText, 
              { color: getStatusColor(transaction.status) }
            ]}>
              {t(`client.paymentHistory.status.${transaction.status}`)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons 
            name="time-outline" 
            size={24} 
            color={dynamicStyles.title.color} 
          />
          <Text style={[styles.title, dynamicStyles.title]}>
            {t('client.balance.topUpHistory')}
          </Text>
        </View>
        
        {transactions.length > 5 && (
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => setDisplayedCount(displayedCount === 5 ? transactions.length : 5)}
          >
            <Text style={[styles.viewAllText, dynamicStyles.viewAllText]}>
              {displayedCount === 5 ? t('client.paymentHistory.viewAll') : t('client.paymentHistory.showLess')}
            </Text>
            <Ionicons 
              name={displayedCount === 5 ? "chevron-down" : "chevron-up"} 
              size={16} 
              color={dynamicStyles.viewAllText.color} 
            />
          </TouchableOpacity>
        )}
      </View>

      {transactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons 
            name="receipt-outline" 
            size={48} 
            color={dynamicStyles.emptyIcon.color} 
          />
          <Text style={[styles.emptyTitle, dynamicStyles.emptyTitle]}>
            {t('client.paymentHistory.noPayments')}
          </Text>
          <Text style={[styles.emptyDescription, dynamicStyles.emptyDescription]}>
            {t('client.paymentHistory.emptyDescription')}
          </Text>
        </View>
      ) : (
        <View style={styles.transactionsContainer}>
          {displayedTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </View>
      )}
    </>
  );
};

export default PaymentHistorySection; 