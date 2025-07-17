import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClientScreenProps } from '../../types/navigation';
import { DebtsScreenStyles as styles } from '../../styles/screens/profile/DebtsScreen.styles';
import { mockDebts } from '../../mocks/debtsMock';

/**
 * Экран управления долгами
 * 
 * TODO для интеграции с бэкендом:
 * 1. Заменить useState на useDebts hook
 * 2. Подключить DebtsService для API вызовов
 * 3. Добавить обработку ошибок и загрузки
 * 4. Реализовать погашение долгов
 * 5. Подключить уведомления о долгах
 */

const DebtsScreen: React.FC<ClientScreenProps<'Debts'>> = ({ navigation }) => {
  const [debts] = useState(mockDebts);

  const handlePayDebt = (debtId: string, amount: string) => {
    Alert.alert(
      'Погасить долг',
      `Погасить долг на сумму ${amount}?`,
      [
        { text: 'Погасить', onPress: () => {} },
        { text: 'Отмена', style: 'cancel' }
      ]
    );
  };

  const getDebtStatusColor = (status: string) => {
    switch (status) {
      case 'overdue':
        return '#e53935';
      case 'due_soon':
        return '#ff9800';
      case 'active':
        return '#2196f3';
      default:
        return '#4caf50';
    }
  };

  const getDebtStatusText = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'Просрочен';
      case 'due_soon':
        return 'Скоро срок';
      case 'active':
        return 'Активный';
      default:
        return 'Погашен';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.title}>Мои долги</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {debts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle-outline" size={64} color="#4caf50" />
            <Text style={styles.emptyTitle}>Нет активных долгов</Text>
            <Text style={styles.emptyDescription}>
              У вас нет неоплаченных долгов
            </Text>
          </View>
        ) : (
          <>
            {debts.map((debt) => (
              <View key={debt.id} style={styles.debtItem}>
                <View style={styles.debtHeader}>
                  <View style={styles.debtInfo}>
                    <Text style={styles.debtTitle}>{debt.title}</Text>
                    <Text style={styles.debtDescription}>{debt.description}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getDebtStatusColor(debt.status) }]}>
                    <Text style={styles.statusText}>{getDebtStatusText(debt.status)}</Text>
                  </View>
                </View>
                <View style={styles.debtDetails}>
                  <View style={styles.debtAmount}>
                    <Text style={styles.amountLabel}>Сумма долга</Text>
                    <Text style={styles.amountValue}>{debt.amount}</Text>
                  </View>
                  <View style={styles.debtDate}>
                    <Text style={styles.dateLabel}>Срок погашения</Text>
                    <Text style={styles.dateValue}>{debt.dueDate}</Text>
                  </View>
                </View>
                {debt.status !== 'paid' && (
                  <TouchableOpacity 
                    style={styles.payButton}
                    onPress={() => handlePayDebt(debt.id, debt.amount)}
                  >
                    <Text style={styles.payButtonText}>Погасить долг</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default DebtsScreen; 