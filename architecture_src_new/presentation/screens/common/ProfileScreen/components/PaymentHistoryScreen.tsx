import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronLeft, Filter } from '../../../../../shared/components/IconLibrary';
import { useTheme } from '../../../../../core/context/ThemeContext';
import { useAuth } from '../../../../../core/context/AuthContext';
import { useI18n } from '../../../../../shared/i18n';
import { getMockPaymentHistory } from '../../../../../shared/mocks/paymentHistoryMock';
import PaymentHistoryFilter, { PaymentFilter } from './PaymentHistoryFilter';
import { createPaymentHistoryScreenStyles } from './styles/PaymentHistoryScreen.styles';

interface PaymentHistoryScreenProps {
  onBack: () => void;
}

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

const PaymentHistoryScreen: React.FC<PaymentHistoryScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { t } = useI18n();
  const styles = createPaymentHistoryScreenStyles(colors);
  
  // Определяем роль пользователя
  const isDriver = user?.role === 'driver';
  
  // Состояние для фильтрации
  const [filter, setFilter] = useState<PaymentFilter>({
    type: 'all',
    status: 'all',
    dateRange: 'all'
  });
  
  // Состояние для модального окна фильтра
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  
  // Получаем моковые данные истории платежей
  const allPayments = useMemo(() => getMockPaymentHistory(t), [t]);
  
  // Условная логика для разных ролей
  const getScreenTitle = () => {
    return isDriver ? 'История выплат' : 'История платежей';
  };
  
  const getEmptyStateTitle = () => {
    return isDriver ? 'Нет выплат' : 'Нет платежей';
  };
  
  const getEmptyStateDescription = () => {
    return isDriver ? 'История выплат пуста' : 'История платежей пуста';
  };
  
  // Фильтрация платежей
  const filteredPayments = useMemo(() => {
    return allPayments.filter(payment => {
      // Фильтр по типу
      if (filter.type !== 'all' && payment.type !== filter.type) {
        return false;
      }
      
      // Фильтр по статусу
      if (filter.status !== 'all' && payment.status !== filter.status) {
        return false;
      }
      
      // Фильтр по дате (базовая реализация)
      if (filter.dateRange !== 'all') {
        const paymentDate = new Date(payment.date);
        const now = new Date();
        
        switch (filter.dateRange) {
          case 'today':
            return paymentDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return paymentDate >= weekAgo;
          case 'month':
            return paymentDate.getMonth() === now.getMonth() && 
                   paymentDate.getFullYear() === now.getFullYear();
          case 'year':
            return paymentDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      }
      
      return true;
    });
  }, [allPayments, filter]);
  
  // Обработчик применения фильтра
  const handleFilterApply = (newFilter: PaymentFilter) => {
    setFilter(newFilter);
  };
  
  // Получение цвета статуса
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'failed':
        return '#EF4444';
      default:
        return colors.textSecondary;
    }
  };
  
  // Получение текста статуса
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Завершено';
      case 'pending':
        return 'В обработке';
      case 'failed':
        return 'Ошибка';
      default:
        return status;
    }
  };
  
  // Получение цвета суммы
  const getAmountColor = (amount: string) => {
    return amount.startsWith('+') ? '#10B981' : '#EF4444';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{getScreenTitle()}</Text>
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => setIsFilterVisible(true)}
        >
          <Filter size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredPayments.length === 0 ? (
          // Empty State
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>{getEmptyStateTitle()}</Text>
            <Text style={styles.emptyDescription}>{getEmptyStateDescription()}</Text>
          </View>
        ) : (
          // Payments List
          filteredPayments.map((payment, index) => (
            <View key={index} style={styles.paymentItem}>
              <View style={styles.paymentHeader}>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentTitle}>
                    {payment.title}
                  </Text>
                  <Text style={styles.paymentDate}>
                    {payment.date} в {payment.time}
                  </Text>
                </View>
                <View style={styles.paymentAmount}>
                  <Text style={[
                    styles.amountText,
                    { color: getAmountColor(payment.amount) }
                  ]}>
                    {payment.amount}
                  </Text>
                  <View style={[
                    styles.statusBadge, 
                    { backgroundColor: getStatusColor(payment.status) }
                  ]}>
                    <Text style={styles.statusText}>
                      {getStatusText(payment.status)}
                    </Text>
                  </View>
                </View>
              </View>
              
              {payment.description && (
                <Text style={styles.paymentDescription}>
                  {payment.description}
                </Text>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Filter Modal */}
      <PaymentHistoryFilter
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApply={handleFilterApply}
        currentFilter={filter}
      />
    </View>
  );
};

export default PaymentHistoryScreen;
