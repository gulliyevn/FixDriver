import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../hooks/useI18n';
import { useBalance } from '../context/BalanceContext';
import { BalanceTopUpHistoryStyles as styles, getBalanceTopUpHistoryStyles } from '../styles/components/BalanceTopUpHistory.styles';

interface BalanceTopUpHistoryProps {
  maxItems?: number;
}

const BalanceTopUpHistory: React.FC<BalanceTopUpHistoryProps> = ({ maxItems = 5 }) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const { transactions } = useBalance();
  const dynamicStyles = getBalanceTopUpHistoryStyles(isDark);

  // Фильтруем только пополнения и берем последние maxItems
  const topUpTransactions = transactions
    .filter(transaction => transaction.type === 'balance_topup')
    .slice(0, maxItems);

  // Отладочная информация
  console.log('BalanceTopUpHistory - all transactions:', transactions.length);
  console.log('BalanceTopUpHistory - topUp transactions:', topUpTransactions.length);
  console.log('BalanceTopUpHistory - transactions types:', transactions.map(t => t.type));

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
      // Используем локализованное форматирование даты
      const currentLanguage = t('common.language', { defaultValue: 'ru' });
      return date.toLocaleDateString(currentLanguage === 'ru' ? 'ru-RU' : 'en-US', {
        day: 'numeric',
        month: 'long'
      });
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
                  {(() => {
                    console.log('Transaction:', {
                      id: transaction.id,
                      translationKey: transaction.translationKey,
                      translationParams: transaction.translationParams,
                      description: transaction.description
                    });
                    
                    if (transaction.translationKey) {
                      const translated = t(transaction.translationKey, transaction.translationParams);
                      console.log('Translated text:', translated);
                      return translated;
                    } else {
                      console.log('Using description:', transaction.description);
                      return transaction.description;
                    }
                  })()}
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