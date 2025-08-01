import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../hooks/useI18n';
import { useBalance } from '../context/BalanceContext';
import { useLanguage } from '../context/LanguageContext';
import { BalanceTopUpHistoryStyles as styles, getBalanceTopUpHistoryStyles } from '../styles/components/BalanceTopUpHistory.styles';
import { formatDateWithLanguage } from '../utils/formatters';

interface BalanceTopUpHistoryProps {
  maxItems?: number;
}

const BalanceTopUpHistory: React.FC<BalanceTopUpHistoryProps> = ({ maxItems = 5 }) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const { language } = useLanguage();
  const { transactions } = useBalance();
  const dynamicStyles = getBalanceTopUpHistoryStyles(isDark);

  // Фильтруем только пополнения и берем последние maxItems
  const topUpTransactions = transactions
    .filter(transaction => transaction.type === 'balance_topup')
    .slice(0, maxItems);

  // Отладочная информация


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
      // Используем язык приложения для форматирования даты
      return formatDateWithLanguage(date, language, 'short');
    }
  };

  if (topUpTransactions.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Text style={[styles.title, dynamicStyles.title]}>
        {t('client.balance.recentTopUps')}
      </Text>
      
      <ScrollView 
        style={styles.transactionsList}
        showsVerticalScrollIndicator={false}
      >
        {topUpTransactions.map((transaction) => (
          <View key={transaction.id} style={[styles.transactionItem, dynamicStyles.transactionItem]}>
            <View style={styles.transactionInfo}>
              <Ionicons 
                name="add-circle" 
                size={20} 
                color="#10B981" 
                style={styles.transactionIcon}
              />
              <View style={styles.transactionDetails}>
                <Text style={[styles.transactionTitle, dynamicStyles.transactionTitle]}>
                  {transaction.translationKey 
                    ? t(transaction.translationKey, transaction.translationParams)
                    : transaction.description
                  }
                </Text>
                <Text style={[styles.transactionDate, dynamicStyles.transactionDate]}>
                  {formatDate(transaction.date)}
                </Text>
              </View>
            </View>
            <Text style={[styles.transactionAmount, { color: '#10B981' }]}>
              +{transaction.amount} AFc
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default BalanceTopUpHistory; 