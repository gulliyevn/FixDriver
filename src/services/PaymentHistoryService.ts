import AsyncStorage from '@react-native-async-storage/async-storage';
import APIClient from './APIClient';
import { useUserStorageKey, STORAGE_KEYS } from '../utils/storageKeys';

export interface PaymentTransaction {
  id: string;
  type: 'trip' | 'topup' | 'refund' | 'fee' | 'package_purchase' | 'subscription_renewal' | 'withdrawal' | 'earnings';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  translationKey?: string;
  translationParams?: Record<string, string>;
  packageType?: string;
  tripId?: string;
  driverId?: string;
}

export interface PaymentFilter {
  type: 'all' | 'trip' | 'topup' | 'refund' | 'fee' | 'package_purchase' | 'subscription_renewal' | 'withdrawal' | 'earnings';
  status: 'all' | 'completed' | 'pending' | 'failed';
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
}

export interface PaymentStats {
  totalTransactions: number;
  totalAmount: number;
  totalEarned: number;
  totalSpent: number;
  completedCount: number;
  pendingCount: number;
  failedCount: number;
}

export interface PaymentHistoryResponse {
  transactions: PaymentTransaction[];
  stats: PaymentStats;
  hasMore: boolean;
  nextCursor?: string;
}

export const PaymentHistoryService = {
  /**
   * Получить историю платежей с фильтрацией и пагинацией
   */
  async getPaymentHistory(
    userId: string,
    userRole: 'client' | 'driver',
    filter: PaymentFilter = { type: 'all', status: 'all', dateRange: 'all' },
    page: number = 1,
    limit: number = 20,
    cursor?: string
  ): Promise<PaymentHistoryResponse> {
    if (__DEV__) {
      return this.getPaymentHistoryDev(userId, userRole, filter, page, limit);
    }

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filter.type !== 'all' && { type: filter.type }),
      ...(filter.status !== 'all' && { status: filter.status }),
      ...(filter.dateRange !== 'all' && { dateRange: filter.dateRange }),
      ...(cursor && { cursor }),
      role: userRole,
    });

    const response = await APIClient.get<PaymentHistoryResponse>(
      `/payment-history/${userId}?${params.toString()}`
    );

    return response.data;
  },

  /**
   * DEV: Получить историю платежей из AsyncStorage
   */
  async getPaymentHistoryDev(
    userId: string,
    userRole: 'client' | 'driver',
    filter: PaymentFilter,
    page: number,
    limit: number
  ): Promise<PaymentHistoryResponse> {
    try {
      const storageKey = userRole === 'client' 
        ? `${STORAGE_KEYS.CLIENT_TRANSACTIONS}_${userId}`
        : `${STORAGE_KEYS.DRIVER_TRANSACTIONS}_${userId}`;

      const storedData = await AsyncStorage.getItem(storageKey);
      let allTransactions: PaymentTransaction[] = [];

      if (storedData) {
        const parsed = JSON.parse(storedData);
        allTransactions = Array.isArray(parsed) ? parsed : [];
      }

      // Применяем фильтры
      let filteredTransactions = this.applyFilters(allTransactions, filter);

      // Сортируем по дате (новые сначала)
      filteredTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // Пагинация
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

      // Статистика
      const stats = this.calculateStats(allTransactions);

      return {
        transactions: paginatedTransactions,
        stats,
        hasMore: endIndex < filteredTransactions.length,
        nextCursor: endIndex < filteredTransactions.length ? endIndex.toString() : undefined,
      };
    } catch (error) {
      return {
        transactions: [],
        stats: this.getEmptyStats(),
        hasMore: false,
      };
    }
  },

  /**
   * Получить статистику по платежам
   */
  async getPaymentStats(userId: string, userRole: 'client' | 'driver'): Promise<PaymentStats> {
    if (__DEV__) {
      return this.getPaymentStatsDev(userId, userRole);
    }

    const response = await APIClient.get<PaymentStats>(
      `/payment-history/${userId}/stats?role=${userRole}`
    );

    return response.data;
  },

  /**
   * DEV: Получить статистику из AsyncStorage
   */
  async getPaymentStatsDev(userId: string, userRole: 'client' | 'driver'): Promise<PaymentStats> {
    try {
      const storageKey = userRole === 'client' 
        ? `${STORAGE_KEYS.CLIENT_TRANSACTIONS}_${userId}`
        : `${STORAGE_KEYS.DRIVER_TRANSACTIONS}_${userId}`;

      const storedData = await AsyncStorage.getItem(storageKey);
      const transactions: PaymentTransaction[] = storedData ? JSON.parse(storedData) : [];

      return this.calculateStats(transactions);
    } catch (error) {
      return this.getEmptyStats();
    }
  },

  /**
   * Обновить кэш истории платежей (для DEV режима)
   */
  async updatePaymentHistoryCache(
    userId: string,
    userRole: 'client' | 'driver',
    transactions: PaymentTransaction[]
  ): Promise<void> {
    if (!__DEV__) return;

    try {
      const storageKey = userRole === 'client' 
        ? `${STORAGE_KEYS.CLIENT_TRANSACTIONS}_${userId}`
        : `${STORAGE_KEYS.DRIVER_TRANSACTIONS}_${userId}`;

      await AsyncStorage.setItem(storageKey, JSON.stringify(transactions));
    } catch (error) {
    }
  },

  /**
   * Применить фильтры к транзакциям
   */
  applyFilters(transactions: PaymentTransaction[], filter: PaymentFilter): PaymentTransaction[] {
    let filtered = [...transactions];

    // Фильтр по типу
    if (filter.type !== 'all') {
      filtered = filtered.filter(tx => tx.type === filter.type);
    }

    // Фильтр по статусу
    if (filter.status !== 'all') {
      filtered = filtered.filter(tx => tx.status === filter.status);
    }

    // Фильтр по дате
    if (filter.dateRange !== 'all') {
      const now = new Date();
      const startDate = this.getDateRangeStart(filter.dateRange, now);
      
      filtered = filtered.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate >= startDate && txDate <= now;
      });
    }

    return filtered;
  },

  /**
   * Вычислить статистику по транзакциям
   */
  calculateStats(transactions: PaymentTransaction[]): PaymentStats {
    const stats = this.getEmptyStats();

    transactions.forEach(tx => {
      stats.totalTransactions++;
      stats.totalAmount += Math.abs(tx.amount);

      if (tx.amount > 0) {
        stats.totalEarned += tx.amount;
      } else {
        stats.totalSpent += Math.abs(tx.amount);
      }

      switch (tx.status) {
        case 'completed':
          stats.completedCount++;
          break;
        case 'pending':
          stats.pendingCount++;
          break;
        case 'failed':
          stats.failedCount++;
          break;
      }
    });

    return stats;
  },

  /**
   * Получить начальную дату для диапазона
   */
  getDateRangeStart(dateRange: string, now: Date): Date {
    const start = new Date(now);
    
    switch (dateRange) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        break;
      case 'week':
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        start.setFullYear(now.getFullYear() - 1);
        break;
      default:
        start.setFullYear(2000); // Все время
    }

    return start;
  },

  /**
   * Получить пустую статистику
   */
  getEmptyStats(): PaymentStats {
    return {
      totalTransactions: 0,
      totalAmount: 0,
      totalEarned: 0,
      totalSpent: 0,
      completedCount: 0,
      pendingCount: 0,
      failedCount: 0,
    };
  },
};
