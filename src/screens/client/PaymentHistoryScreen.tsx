import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../hooks/useI18n';
import { useLanguage } from '../../context/LanguageContext';
import { formatDateWithLanguage, formatTime } from '../../utils/formatters';
import { ClientScreenProps } from '../../types/navigation';
import { DriverStackParamList } from '../../types/driver/DriverNavigation';
import { PaymentHistoryScreenStyles as styles, getPaymentHistoryScreenStyles } from '../../styles/screens/profile/PaymentHistoryScreen.styles';
import PaymentHistoryFilter, { PaymentFilter } from '../../components/PaymentHistoryFilter';
import { colors } from '../../constants/colors';
import { useBalance } from '../../hooks/useBalance';
import { useAuth } from '../../context/AuthContext';

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

type PaymentHistoryScreenProps = ClientScreenProps<'PaymentHistory'> | { navigation: any };

const PaymentHistoryScreen: React.FC<PaymentHistoryScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const { language } = useLanguage();
  const { user } = useAuth();
  const currentColors = isDark ? colors.dark : colors.light;
  const dynamicStyles = getPaymentHistoryScreenStyles(isDark);
  
  const isDriver = user?.role === 'driver';
  
  // Условная логика для разных ролей
  const getScreenTitle = () => {
    return isDriver ? 'История выплат' : t('client.paymentHistory.title');
  };
  
  const getEmptyStateTitle = () => {
    return isDriver ? 'Нет выплат' : t('client.paymentHistory.noPayments');
  };
  
  const getEmptyStateDescription = () => {
    return isDriver ? 'История выплат пуста' : t('client.paymentHistory.emptyDescription');
  };
  
  const [filterVisible, setFilterVisible] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<PaymentFilter>({
    type: 'all',
    status: 'all',
    dateRange: 'all'
  });
  
  const { transactions } = useBalance();
  
  const allPayments = useMemo(() => {
    return transactions
      .filter(transaction => transaction.type !== 'balance_topup') // Исключаем пополнения
      .map(transaction => {
        const title = transaction.translationKey 
          ? (() => {
              if (transaction.translationParams?.packageName) {
                // Для транзакций с пакетами используем переведенные названия
                // Убеждаемся, что используем только название пакета без периода
                const packageName = transaction.translationParams.packageName.split('_')[0];
                const translatedPackageName = t(`premium.packages.${packageName}`, { defaultValue: packageName });
                return t(transaction.translationKey, { ...transaction.translationParams, packageName: translatedPackageName });
              }
              return t(transaction.translationKey, transaction.translationParams);
            })()
          : transaction.description;
        // Убираем описание для транзакций с пакетами, так как название уже содержит информацию о пакете
        const description = undefined;
        return {
          id: transaction.id,
          title,
          description,
          amount: `${transaction.amount > 0 ? '+' : ''}${transaction.amount} AFc`,
          type: transaction.type === 'package_purchase' ? 'fee' : 
                transaction.type === 'subscription_renewal' ? 'fee' : 'trip',
          status: 'completed' as const,
          date: formatDateWithLanguage(new Date(transaction.date), language, 'short'),
          time: formatTime(new Date(transaction.date), language)
        };
      });
  }, [transactions, t, language]);
  
  const filteredPayments = useMemo(() => {
    let filtered = allPayments;
    
    // Фильтр по типу
    if (currentFilter.type !== 'all') {
      filtered = filtered.filter(payment => payment.type === currentFilter.type);
    }
    
    // Фильтр по статусу
    if (currentFilter.status !== 'all') {
      filtered = filtered.filter(payment => payment.status === currentFilter.status);
    }
    
    // Фильтр по дате (упрощенная логика для реальных данных)
    if (currentFilter.dateRange !== 'all') {
      
      switch (currentFilter.dateRange) {
        case 'today':
          // Для демонстрации показываем только первую запись как "сегодняшнюю"
          filtered = filtered.filter((_, index) => index === 0);
          break;
        case 'week':
          // Показываем первые 2 записи как "за неделю"
          filtered = filtered.filter((_, index) => index < 2);
          break;
        case 'month':
          // Показываем первые 3 записи как "за месяц"
          filtered = filtered.filter((_, index) => index < 3);
          break;
        case 'year':
          // Показываем все записи как "за год"
          break;
      }
    }
    
    return filtered;
  }, [allPayments, currentFilter]);

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
    <View style={[styles.container, dynamicStyles.container]}>
      <View style={[styles.header, dynamicStyles.header]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={currentColors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, dynamicStyles.title]}>{getScreenTitle()}</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setFilterVisible(true)}
        >
          <Ionicons name="filter" size={24} color={currentColors.primary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={[styles.contentContainer, { paddingTop: 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {filteredPayments.length === 0 ? (
          <View style={[styles.emptyState, { alignItems: 'center', justifyContent: 'center' }]}>
            <Ionicons name="document-outline" size={64} color={currentColors.textSecondary} />
            <Text style={[styles.emptyTitle, dynamicStyles.emptyTitle]}>{getEmptyStateTitle()}</Text>
            <Text style={[styles.emptyDescription, dynamicStyles.emptyDescription]}>
              {getEmptyStateDescription()}
            </Text>
          </View>
        ) : (
          <>
            {filteredPayments.map((payment) => (
              <View key={payment.id} style={[styles.paymentItem, dynamicStyles.paymentItem]}>
                <View style={styles.paymentHeader}>
                  <View style={styles.paymentInfo}>
                    <Ionicons 
                      name={getPaymentIcon(payment.type) as keyof typeof Ionicons.glyphMap} 
                      size={24} 
                      color={getPaymentColor(payment.type)} 
                    />
                    <View style={styles.paymentDetails}>
                      <Text style={[styles.paymentTitle, dynamicStyles.paymentTitle]}>{payment.title}</Text>
                      <Text style={[styles.paymentDate, dynamicStyles.paymentDate]}>{payment.date} • {payment.time}</Text>
                    </View>
                  </View>
                  <View style={styles.paymentAmount}>
                    <Text style={[styles.amountText, { color: getPaymentColor(payment.type) }]}>
                      {payment.amount}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: getPaymentStatusColor(payment.status) }]}>
                                          <Text style={styles.statusText}>
                      {payment.status === 'completed' ? t('client.paymentHistory.status.completed') : 
                       payment.status === 'pending' ? t('client.paymentHistory.status.pending') : t('client.paymentHistory.status.failed')}
                    </Text>
                    </View>
                  </View>
                </View>
                {payment.description && (
                  <Text style={[styles.paymentDescription, dynamicStyles.paymentDescription]}>{payment.description}</Text>
                )}
              </View>
            ))}
          </>
        )}
      </ScrollView>
      
      <PaymentHistoryFilter
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={setCurrentFilter}
        currentFilter={currentFilter}
      />
    </View>
  );
};

export default PaymentHistoryScreen; 