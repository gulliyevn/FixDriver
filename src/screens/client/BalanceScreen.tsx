import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClientScreenProps } from '../../types/navigation';
import { BalanceScreenStyles as styles } from '../../styles/screens/profile/BalanceScreen.styles';
import { Transaction, TopUpMethod, WithdrawalMethod } from '../../types/balance';
import { 
  mockTransactions, 
  mockTopUpMethods, 
  mockWithdrawalMethods, 
  mockBalance, 
  mockQuickAmounts 
} from '../../mocks/balanceMock';

/**
 * Экран баланса пользователя
 * 
 * TODO для интеграции с бэкендом:
 * 1. Заменить useState на useBalance hook
 * 2. Подключить BalanceService для API вызовов
 * 3. Добавить обработку ошибок и загрузки
 * 4. Реализовать реальные платежные методы
 * 5. Добавить валидацию сумм
 * 6. Подключить уведомления о транзакциях
 */

const BalanceScreen: React.FC<ClientScreenProps<'Balance'>> = ({ navigation }) => {
  const [balance] = useState(mockBalance);
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [topUpMethods] = useState<TopUpMethod[]>(mockTopUpMethods);
  const [withdrawalMethods] = useState<WithdrawalMethod[]>(mockWithdrawalMethods);

  const handleTopUp = () => {
    const options = topUpMethods.map(method => ({
      text: method.name,
      onPress: () => console.log(`Пополнение: ${method.name}`)
    }));
    
    Alert.alert(
      'Пополнение баланса',
      'Выберите способ пополнения',
      [...options, { text: 'Отмена', style: 'cancel' }]
    );
  };

  const handleWithdraw = () => {
    const options = withdrawalMethods.map(method => ({
      text: method.name,
      onPress: () => console.log(`Вывод: ${method.name}`)
    }));
    
    Alert.alert(
      'Вывод средств',
      'Выберите способ вывода',
      [...options, { text: 'Отмена', style: 'cancel' }]
    );
  };

  const handleQuickTopUp = (amount: string) => {
    Alert.alert(
      'Быстрое пополнение',
      `Пополнить баланс на ${amount}?`,
      [
        { text: 'Пополнить', onPress: () => console.log(`Пополнение на ${amount}`) },
        { text: 'Отмена', style: 'cancel' }
      ]
    );
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return 'car';
      case 'topup':
        return 'add-circle';
      case 'refund':
        return 'refresh-circle';
      default:
        return 'card';
    }
  };

  const getTransactionAmountStyle = (type: string) => {
    switch (type) {
      case 'payment':
        return styles.transactionAmountPayment;
      case 'topup':
        return styles.transactionAmountTopUp;
      case 'refund':
        return styles.transactionAmountRefund;
      default:
        return {};
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    return status === 'completed' ? styles.statusBadgeCompleted : styles.statusBadgePending;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.title}>Мой баланс</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Основной баланс */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Текущий баланс</Text>
          <Text style={styles.balanceAmount}>{balance}</Text>
          <View style={styles.balanceActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleTopUp}>
              <Ionicons name="add-circle" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Пополнить</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.withdrawButton]} onPress={handleWithdraw}>
              <Ionicons name="remove-circle" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Вывести</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Быстрые суммы пополнения */}
        <View style={styles.quickTopUp}>
          <Text style={styles.sectionTitle}>Быстрое пополнение</Text>
          <View style={styles.quickAmounts}>
            {mockQuickAmounts.map((amount, index) => (
              <TouchableOpacity key={index} style={styles.quickAmountButton} onPress={() => handleQuickTopUp(amount)}>
                <Text style={styles.quickAmountText}>{amount}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* История операций */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>История операций</Text>
            <TouchableOpacity onPress={() => console.log('Показать все')}>
              <Text style={styles.showAllText}>Показать все</Text>
            </TouchableOpacity>
          </View>
          
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <Ionicons 
                  name={getTransactionIcon(transaction.type) as any} 
                  size={24} 
                  color="#003366" 
                />
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionDescription}>{transaction.description}</Text>
                <Text style={styles.transactionDate}>{transaction.date} • {transaction.time}</Text>
              </View>
              <View style={styles.transactionAmount}>
                <Text style={[styles.transactionAmountText, getTransactionAmountStyle(transaction.type)]}>
                  {transaction.amount}
                </Text>
                <View style={[styles.statusBadge, getStatusBadgeStyle(transaction.status)]}>
                  <Text style={styles.statusText}>
                    {transaction.status === 'completed' ? 'Выполнено' : 'В обработке'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default BalanceScreen; 