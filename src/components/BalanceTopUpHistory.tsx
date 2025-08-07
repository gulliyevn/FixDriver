import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../hooks/useI18n';
import { useBalance } from '../context/BalanceContext';
import { useDriverBalance } from '../hooks/driver/useDriverBalance';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  BalanceTopUpHistoryStyles as styles, 
  getBalanceTopUpHistoryStyles,
  SWITCH_COLORS
} from '../styles/components/BalanceTopUpHistory.styles';
import { formatDateWithLanguage } from '../utils/formatters';

interface BalanceTopUpHistoryProps {
  maxItems?: number;
}

const BalanceTopUpHistory: React.FC<BalanceTopUpHistoryProps> = ({ maxItems = 5 }) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const { isDark } = useTheme();
  const { t } = useI18n();
  const { language } = useLanguage();
  const { user } = useAuth();
  const isDriver = user?.role === 'driver';
  const [showWithdrawals, setShowWithdrawals] = useState(false);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: showWithdrawals ? 1 : 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7
    }).start();
  }, [showWithdrawals]);
  const clientBalanceHook = useBalance();
  const driverBalanceHook = useDriverBalance();
  const transactions = isDriver ? driverBalanceHook.transactions : clientBalanceHook.transactions;
  const dynamicStyles = getBalanceTopUpHistoryStyles(isDark);

  // Фильтруем транзакции в зависимости от роли и выбранного типа
  const filteredTransactions = transactions
    .filter(transaction => {
      if (!isDriver) return transaction.type === 'balance_topup';
      return showWithdrawals ? transaction.type === 'withdrawal' : transaction.type === 'topup';
    })
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

  if (filteredTransactions.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[styles.title, dynamicStyles.title]}>
          {t('client.balance.recentTransactions')}
        </Text>
        {isDriver && (
          <TouchableOpacity 
            onPress={() => setShowWithdrawals(!showWithdrawals)}
            style={[
              styles.switchContainer,
              { backgroundColor: showWithdrawals ? SWITCH_COLORS.active : SWITCH_COLORS.inactive }
            ]}
          >
            <Animated.View
              style={[
                styles.switchThumb,
                { 
                  transform: [{
                    translateX: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [2, 26]
                    })
                  }]
                }
              ]}
            />
            <View style={[styles.switchIcon, { opacity: showWithdrawals ? 0.5 : 1 }]}>
              <Ionicons 
                name="add-circle"
                style={styles.switchIconImage}
              />
            </View>
            <View style={[styles.switchIcon, { opacity: showWithdrawals ? 1 : 0.5 }]}>
              <Ionicons 
                name="card"
                style={styles.switchIconImage}
              />
            </View>
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView 
        style={styles.transactionsList}
        showsVerticalScrollIndicator={false}
      >
        {filteredTransactions.map((transaction) => {
          const isWithdraw = transaction.type === 'withdrawal';
          const amountColor = isWithdraw ? '#EF4444' : '#10B981';
          const iconName = isWithdraw ? 'remove-circle' : 'add-circle';
          
          return (
            <View key={transaction.id} style={[styles.transactionItem, dynamicStyles.transactionItem]}>
              <View style={styles.transactionInfo}>
                <Ionicons 
                  name={iconName}
                  size={20} 
                  color={amountColor}
                  style={styles.transactionIcon}
                />
                <View style={styles.transactionDetails}>
                  <Text style={[styles.transactionTitle, dynamicStyles.transactionTitle]}>
                    {t(isWithdraw ? 'client.balance.withdrawal' : 'client.balance.balanceTopUp')}
                  </Text>
                  <Text style={[styles.transactionDate, dynamicStyles.transactionDate]}>
                    {formatDate(transaction.date)} • {new Date(transaction.date).toTimeString().split(' ')[0].substring(0, 5)}
                  </Text>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <Text style={[styles.transactionAmount, { color: amountColor }]}>
                  {isWithdraw ? '-' : '+'}{Math.abs(transaction.amount)} AFc
                </Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>
                    {t('client.paymentHistory.status.completed')}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default BalanceTopUpHistory; 