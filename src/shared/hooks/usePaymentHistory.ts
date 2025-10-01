import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PaymentHistoryService, PaymentTransaction, PaymentFilter, PaymentStats } from '../../services/PaymentHistoryService';

export interface UsePaymentHistoryResult {
  // Данные
  transactions: PaymentTransaction[];
  stats: PaymentStats;
  filteredTransactions: PaymentTransaction[];
  
  // Состояние
  loading: boolean;
  refreshing: boolean;
  errorKey: string | null;
  hasMore: boolean;
  
  // Фильтры
  currentFilter: PaymentFilter;
  availableFilters: {
    types: Array<{ key: string; label: string; icon: string }>;
    statuses: Array<{ key: string; label: string; icon: string }>;
    dateRanges: Array<{ key: string; label: string; icon: string }>;
  };
  
  // Действия
  setFilter: (filter: PaymentFilter) => void;
  resetFilter: () => void;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  clearError: () => void;
  
  // Утилиты
  getTransactionIcon: (type: string) => string;
  getTransactionColor: (type: string) => string;
  getStatusColor: (status: string) => string;
  formatAmount: (amount: number, type: string) => string;
}

export const usePaymentHistory = (): UsePaymentHistoryResult => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [stats, setStats] = useState<PaymentStats>(PaymentHistoryService.getEmptyStats());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilter, setCurrentFilter] = useState<PaymentFilter>({
    type: 'all',
    status: 'all',
    dateRange: 'all',
  });

  const userRole = user?.role === 'driver' ? 'driver' : 'client';

  // Доступные фильтры
  const availableFilters = useMemo(() => ({
    types: [
      { key: 'all', label: 'client.paymentHistory.filter.allTypes', icon: 'list' },
      { key: 'trip', label: 'client.paymentHistory.filter.trips', icon: 'car' },
      { key: 'topup', label: 'client.paymentHistory.filter.topups', icon: 'add-circle' },
      { key: 'refund', label: 'client.paymentHistory.filter.refunds', icon: 'refresh-circle' },
      { key: 'fee', label: 'client.paymentHistory.filter.fees', icon: 'card' },
      { key: 'package_purchase', label: 'client.paymentHistory.filter.packages', icon: 'cube' },
      { key: 'subscription_renewal', label: 'client.paymentHistory.filter.subscriptions', icon: 'refresh' },
      ...(userRole === 'driver' ? [
        { key: 'withdrawal', label: 'driver.balance.transactions.withdrawal', icon: 'cash' },
        { key: 'earnings', label: 'driver.balance.transactions.earnings', icon: 'trending-up' },
      ] : []),
    ],
    statuses: [
      { key: 'all', label: 'client.paymentHistory.filter.allStatuses', icon: 'checkmark-circle' },
      { key: 'completed', label: 'client.paymentHistory.status.completed', icon: 'checkmark-circle' },
      { key: 'pending', label: 'client.paymentHistory.status.pending', icon: 'time' },
      { key: 'failed', label: 'client.paymentHistory.status.failed', icon: 'close-circle' },
    ],
    dateRanges: [
      { key: 'all', label: 'client.paymentHistory.filter.allTime', icon: 'calendar' },
      { key: 'today', label: 'client.paymentHistory.filter.today', icon: 'today' },
      { key: 'week', label: 'client.paymentHistory.filter.thisWeek', icon: 'calendar-outline' },
      { key: 'month', label: 'client.paymentHistory.filter.thisMonth', icon: 'calendar' },
      { key: 'year', label: 'client.paymentHistory.filter.thisYear', icon: 'calendar' },
    ],
  }), [userRole]);

  // Отфильтрованные транзакции
  const filteredTransactions = useMemo(() => {
    return PaymentHistoryService.applyFilters(transactions, currentFilter);
  }, [transactions, currentFilter]);

  // Загрузка данных
  const loadData = useCallback(async (page: number = 1, isRefresh: boolean = false) => {
    if (!user?.id) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (page === 1) {
        setLoading(true);
      }

      setErrorKey(null);

      const response = await PaymentHistoryService.getPaymentHistory(
        user.id,
        userRole,
        currentFilter,
        page,
        20
      );

      if (page === 1) {
        setTransactions(response.transactions);
      } else {
        setTransactions(prev => [...prev, ...response.transactions]);
      }

      setStats(response.stats);
      setHasMore(response.hasMore);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading payment history:', error);
      setErrorKey('errors.paymentHistoryLoadFailed');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id, userRole, currentFilter]);

  // Обновление статистики
  const loadStats = useCallback(async () => {
    if (!user?.id) return;

    try {
      const newStats = await PaymentHistoryService.getPaymentStats(user.id, userRole);
      setStats(newStats);
    } catch (error) {
      console.error('Error loading payment stats:', error);
    }
  }, [user?.id, userRole]);

  // Загрузка при изменении фильтра
  useEffect(() => {
    setCurrentPage(1);
    loadData(1, false);
  }, [currentFilter]);

  // Первоначальная загрузка
  useEffect(() => {
    loadData(1, false);
    loadStats();
  }, [user?.id, userRole]);

  // Обновление данных
  const refresh = useCallback(async () => {
    setCurrentPage(1);
    await loadData(1, true);
    await loadStats();
  }, [loadData, loadStats]);

  // Загрузка следующей страницы
  const loadMore = useCallback(async () => {
    if (!hasMore || loading || refreshing) return;
    
    await loadData(currentPage + 1, false);
  }, [hasMore, loading, refreshing, currentPage, loadData]);

  // Установка фильтра
  const setFilter = useCallback((filter: PaymentFilter) => {
    setCurrentFilter(filter);
  }, []);

  // Сброс фильтра
  const resetFilter = useCallback(() => {
    setCurrentFilter({
      type: 'all',
      status: 'all',
      dateRange: 'all',
    });
  }, []);

  // Очистка ошибки
  const clearError = useCallback(() => {
    setErrorKey(null);
  }, []);

  // Утилиты для отображения
  const getTransactionIcon = useCallback((type: string): string => {
    switch (type) {
      case 'trip':
        return 'car';
      case 'topup':
        return 'add-circle';
      case 'refund':
        return 'refresh-circle';
      case 'fee':
      case 'package_purchase':
      case 'subscription_renewal':
        return 'card';
      case 'withdrawal':
        return 'cash';
      case 'earnings':
        return 'trending-up';
      default:
        return 'card';
    }
  }, []);

  const getTransactionColor = useCallback((type: string): string => {
    switch (type) {
      case 'trip':
        return '#e53935';
      case 'topup':
      case 'earnings':
        return '#4caf50';
      case 'refund':
        return '#2196f3';
      case 'fee':
      case 'package_purchase':
      case 'subscription_renewal':
        return '#ff9800';
      case 'withdrawal':
        return '#f44336';
      default:
        return '#003366';
    }
  }, []);

  const getStatusColor = useCallback((status: string): string => {
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
  }, []);

  const formatAmount = useCallback((amount: number, type: string): string => {
    const sign = amount > 0 ? '+' : '';
    const absAmount = Math.abs(amount);
    return `${sign}${absAmount} AFc`;
  }, []);

  return {
    // Данные
    transactions,
    stats,
    filteredTransactions,
    
    // Состояние
    loading,
    refreshing,
    errorKey,
    hasMore,
    
    // Фильтры
    currentFilter,
    availableFilters,
    
    // Действия
    setFilter,
    resetFilter,
    refresh,
    loadMore,
    clearError,
    
    // Утилиты
    getTransactionIcon,
    getTransactionColor,
    getStatusColor,
    formatAmount,
  };
};
