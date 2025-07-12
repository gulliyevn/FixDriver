import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClientScreenProps } from '../../types/navigation';
import { PaymentHistoryScreenStyles as styles } from '../../styles/screens/profile/PaymentHistoryScreen.styles';
import { mockPaymentHistory } from '../../mocks/paymentHistoryMock';

/**
 * Экран истории платежей
 * 
 * TODO для интеграции с бэкендом:
 * 1. Заменить useState на usePaymentHistory hook
 * 2. Подключить PaymentHistoryService для API вызовов
 * 3. Добавить обработку ошибок и загрузки
 * 4. Реализовать фильтрацию и поиск
 * 5. Добавить экспорт данных
 * 6. Подключить пагинацию
 */

const PaymentHistoryScreen: React.FC<ClientScreenProps<'PaymentHistory'>> = ({ navigation }) => {
  const [payments] = useState(mockPaymentHistory);

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'trip':
        return 'car';
      case 'topup':
        return 'add-circle';
      case 'refund':
        return 'refresh-circle';
      case 'fee':
        return 'card';
      default:
        return 'card';
    }
  };

  const getPaymentColor = (type: string) => {
    switch (type) {
      case 'trip':
        return '#e53935';
      case 'topup':
        return '#4caf50';
      case 'refund':
        return '#2196f3';
      case 'fee':
        return '#ff9800';
      default:
        return '#003366';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4caf50';
      case 'pending':
        return '#ff9800';
      case 'failed':
        return '#e53935';
      default:
        return '#888';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.title}>История платежей</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={24} color="#003366" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {payments.length === 0 ? (
          <View style={[styles.emptyState, { alignItems: 'center', justifyContent: 'center' }]}>
            <Ionicons name="document-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Нет платежей</Text>
            <Text style={styles.emptyDescription}>
              История платежей пуста
            </Text>
          </View>
        ) : (
          <>
            {payments.map((payment) => (
              <View key={payment.id} style={styles.paymentItem}>
                <View style={styles.paymentHeader}>
                  <View style={styles.paymentInfo}>
                    <Ionicons 
                      name={getPaymentIcon(payment.type) as any} 
                      size={24} 
                      color={getPaymentColor(payment.type)} 
                    />
                    <View style={styles.paymentDetails}>
                      <Text style={styles.paymentTitle}>{payment.title}</Text>
                      <Text style={styles.paymentDate}>{payment.date} • {payment.time}</Text>
                    </View>
                  </View>
                  <View style={styles.paymentAmount}>
                    <Text style={[styles.amountText, { color: getPaymentColor(payment.type) }]}>
                      {payment.amount}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: getPaymentStatusColor(payment.status) }]}>
                      <Text style={styles.statusText}>
                        {payment.status === 'completed' ? 'Выполнено' : 
                         payment.status === 'pending' ? 'В обработке' : 'Ошибка'}
                      </Text>
                    </View>
                  </View>
                </View>
                {payment.description && (
                  <Text style={styles.paymentDescription}>{payment.description}</Text>
                )}
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default PaymentHistoryScreen; 