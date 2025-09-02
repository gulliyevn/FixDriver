// Сервис для работы со статистикой водителя
// Поддерживает как моковые данные, так и реальные API вызовы

export interface DayStats {
  date: string; // YYYY-MM-DD
  hoursOnline: number;
  ridesCount: number;
  earnings: number;
  isQualified: boolean;
  timestamp: number;
}

export interface PeriodStats {
  totalHours: number;
  totalRides: number;
  totalEarnings: number;
  qualifiedDays: number;
  averageHoursPerDay: number;
  averageRidesPerDay: number;
}

// Интерфейс для API ответов
export interface EarningsChartData {
  labels: string[];
  data: number[];
  period: 'today' | 'week' | 'month' | 'year';
}

// Интерфейс для API запросов
export interface StatsRequest {
  driverId: string;
  period: 'today' | 'week' | 'month' | 'year';
  startDate?: string;
  endDate?: string;
}

// Конфигурация для переключения между моком и продакшном
const CONFIG = {
  USE_MOCK: __DEV__, // Используем мок в разработке
  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.fixdrive.com',
  API_TIMEOUT: 10000,
};

// Моковая БД в памяти
let mockDatabase: { [driverId: string]: DayStats[] } = {};

class DriverStatsServiceImpl {
  private driverId: string = 'default_driver';

  setDriverId(id: string) {
    this.driverId = id;
  }

  // Получение данных для графика заработка
  async getEarningsChartData(period: 'today' | 'week' | 'month' | 'year'): Promise<EarningsChartData> {
    if (CONFIG.USE_MOCK) {
      return this.getMockEarningsChartData(period);
    }
    
    return this.getRealEarningsChartData(period);
  }

  // Моковые данные для графика
  private async getMockEarningsChartData(period: 'today' | 'week' | 'month' | 'year'): Promise<EarningsChartData> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const mockData = {
      today: {
        labels: ['00:00', '06:00', '12:00', '18:00', '24:00'],
        data: [15, 25, 35, 45, 30]
      },
      week: {
        labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
        data: [120, 150, 180, 200, 220, 250, 280]
      },
      month: {
        labels: ['1', '5', '10', '15', '20', '25', '30'],
        data: [800, 1200, 1600, 2000, 2400, 2800, 3200]
      },
      year: {
        labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        data: [25000, 28000, 32000, 35000, 38000, 42000, 45000, 48000, 52000, 55000, 58000, 62000]
      }
    };

    return {
      labels: mockData[period].labels,
      data: mockData[period].data,
      period
    };
  }

  // Реальные API вызовы для продакшна
  private async getRealEarningsChartData(period: 'today' | 'week' | 'month' | 'year'): Promise<EarningsChartData> {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/api/driver/earnings/chart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({
          driverId: this.driverId,
          period,
        }),
        timeout: CONFIG.API_TIMEOUT,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return {
        labels: data.labels,
        data: data.data,
        period
      };
    } catch (error) {
      console.error('[DriverStatsService] Ошибка получения данных графика:', error);
      // Fallback к моковым данным при ошибке
      return this.getMockEarningsChartData(period);
    }
  }

  // Получение токена авторизации (заглушка)
  private async getAuthToken(): Promise<string> {
    // В реальном приложении здесь будет получение токена из AuthService
    return 'mock_token';
  }

  // Сохранение статистики за день
  async saveDayStats(stats: Omit<DayStats, 'timestamp'>): Promise<void> {
    if (CONFIG.USE_MOCK) {
      return this.saveMockDayStats(stats);
    }
    
    return this.saveRealDayStats(stats);
  }

  private async saveMockDayStats(stats: Omit<DayStats, 'timestamp'>): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dayStats: DayStats = {
        ...stats,
        timestamp: Date.now(),
      };

      if (!mockDatabase[this.driverId]) {
        mockDatabase[this.driverId] = [];
      }

      // Удаляем старую запись за этот день, если есть
      mockDatabase[this.driverId] = mockDatabase[this.driverId].filter(
        stat => stat.date !== stats.date
      );

      // Добавляем новую запись
      mockDatabase[this.driverId].push(dayStats);

      console.log(`[DriverStatsService] Сохранена статистика за ${stats.date}:`, dayStats);
    } catch (error) {
      console.error('[DriverStatsService] Ошибка сохранения статистики:', error);
      throw error;
    }
  }

  private async saveRealDayStats(stats: Omit<DayStats, 'timestamp'>): Promise<void> {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/api/driver/stats/day`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({
          driverId: this.driverId,
          ...stats,
        }),
        timeout: CONFIG.API_TIMEOUT,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      console.log(`[DriverStatsService] Статистика сохранена в БД за ${stats.date}`);
    } catch (error) {
      console.error('[DriverStatsService] Ошибка сохранения статистики в БД:', error);
      throw error;
    }
  }

  // Получение статистики за конкретный день
  async getDayStats(date: string): Promise<DayStats | null> {
    if (CONFIG.USE_MOCK) {
      return this.getMockDayStats(date);
    }
    
    return this.getRealDayStats(date);
  }

  private async getMockDayStats(date: string): Promise<DayStats | null> {
    try {
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const driverStats = mockDatabase[this.driverId] || [];
      const dayStats = driverStats.find(stat => stat.date === date);
      
      return dayStats || null;
    } catch (error) {
      console.error('[DriverStatsService] Ошибка получения статистики дня:', error);
      return null;
    }
  }

  private async getRealDayStats(date: string): Promise<DayStats | null> {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/api/driver/stats/day?date=${date}&driverId=${this.driverId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        timeout: CONFIG.API_TIMEOUT,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('[DriverStatsService] Ошибка получения статистики дня из БД:', error);
      return null;
    }
  }

  // Получение статистики за период
  async getPeriodStats(startDate: string, endDate: string): Promise<PeriodStats> {
    if (CONFIG.USE_MOCK) {
      return this.getMockPeriodStats(startDate, endDate);
    }
    
    return this.getRealPeriodStats(startDate, endDate);
  }

  private async getMockPeriodStats(startDate: string, endDate: string): Promise<PeriodStats> {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const driverStats = mockDatabase[this.driverId] || [];
      const periodStats = driverStats.filter(
        stat => stat.date >= startDate && stat.date <= endDate
      );

      if (periodStats.length === 0) {
        return {
          totalHours: 0,
          totalRides: 0,
          totalEarnings: 0,
          qualifiedDays: 0,
          averageHoursPerDay: 0,
          averageRidesPerDay: 0,
        };
      }

      const totalHours = periodStats.reduce((sum, stat) => sum + stat.hoursOnline, 0);
      const totalRides = periodStats.reduce((sum, stat) => sum + stat.ridesCount, 0);
      const totalEarnings = periodStats.reduce((sum, stat) => sum + stat.earnings, 0);
      const qualifiedDays = periodStats.filter(stat => stat.isQualified).length;

      return {
        totalHours,
        totalRides,
        totalEarnings,
        qualifiedDays,
        averageHoursPerDay: totalHours / periodStats.length,
        averageRidesPerDay: totalRides / periodStats.length,
      };
    } catch (error) {
      console.error('[DriverStatsService] Ошибка получения статистики периода:', error);
      return {
        totalHours: 0,
        totalRides: 0,
        totalEarnings: 0,
        qualifiedDays: 0,
        averageHoursPerDay: 0,
        averageRidesPerDay: 0,
      };
    }
  }

  private async getRealPeriodStats(startDate: string, endDate: string): Promise<PeriodStats> {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/api/driver/stats/period`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({
          driverId: this.driverId,
          startDate,
          endDate,
        }),
        timeout: CONFIG.API_TIMEOUT,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('[DriverStatsService] Ошибка получения статистики периода из БД:', error);
      return {
        totalHours: 0,
        totalRides: 0,
        totalEarnings: 0,
        qualifiedDays: 0,
        averageHoursPerDay: 0,
        averageRidesPerDay: 0,
      };
    }
  }

  // Получение статистики за последние N дней
  async getLastNDaysStats(days: number): Promise<DayStats[]> {
    if (CONFIG.USE_MOCK) {
      return this.getMockLastNDaysStats(days);
    }
    
    return this.getRealLastNDaysStats(days);
  }

  private async getMockLastNDaysStats(days: number): Promise<DayStats[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const driverStats = mockDatabase[this.driverId] || [];
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      return driverStats.filter(stat => {
        const statDate = new Date(stat.date);
        return statDate >= startDate && statDate <= endDate;
      }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } catch (error) {
      console.error('[DriverStatsService] Ошибка получения статистики за последние дни:', error);
      return [];
    }
  }

  private async getRealLastNDaysStats(days: number): Promise<DayStats[]> {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/api/driver/stats/last-n-days?days=${days}&driverId=${this.driverId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        timeout: CONFIG.API_TIMEOUT,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('[DriverStatsService] Ошибка получения статистики за последние дни из БД:', error);
      return [];
    }
  }

  // Получение статистики за текущий месяц
  async getCurrentMonthStats(): Promise<DayStats[]> {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    return this.getLastNDaysStats(endOfMonth.getDate());
  }

  // Получение статистики за текущий год
  async getCurrentYearStats(): Promise<DayStats[]> {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const daysInYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    
    return this.getLastNDaysStats(daysInYear);
  }

  // Получение статистики за неделю (последние 7 дней)
  async getWeekStats(): Promise<PeriodStats> {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    const startDateStr = startDate.toISOString().split('T')[0];
    
    return this.getPeriodStats(startDateStr, endDate);
  }

  // Получение статистики за месяц (последние 30 дней)
  async getMonthStats(): Promise<PeriodStats> {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 29);
    const startDateStr = startDate.toISOString().split('T')[0];
    
    return this.getPeriodStats(startDateStr, endDate);
  }

  // Очистка моковых данных (для тестирования)
  clearMockData(): void {
    mockDatabase = {};
  }

  // Получение всех моковых данных (для отладки)
  getAllMockData(): { [driverId: string]: DayStats[] } {
    return { ...mockDatabase };
  }
}

const DriverStatsService = new DriverStatsServiceImpl();
export default DriverStatsService;
