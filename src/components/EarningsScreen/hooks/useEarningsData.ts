import { useMemo, useEffect, useState } from "react";
import { useBalance } from "../../../hooks/useBalance";
import { useDriverStats } from "../../../hooks/useDriverStats";
import { PeriodStats } from "../../../services/DriverStatsService";

type PeriodType = "today" | "week" | "month" | "year";

// Моковые данные для разных периодов
const mockData = {
  today: {
    total: "25 AFc",
    rides: [
      {
        id: "t1",
        from: "Площадь",
        to: "Центр",
        time: "Сегодня, 10:20",
        earnings: "+6 AFc",
        rating: 5.0,
      },
      {
        id: "t2",
        from: "Аэропорт",
        to: "Проспект",
        time: "Сегодня, 09:15",
        earnings: "+9 AFc",
        rating: 4.9,
      },
      {
        id: "t3",
        from: "Университет",
        to: "ТЦ",
        time: "Сегодня, 14:30",
        earnings: "+10 AFc",
        rating: 4.8,
      },
    ],
  },
  week: {
    total: "100 AFc",
    rides: [
      {
        id: "w1",
        from: "Площадь",
        to: "Центр",
        time: "Пн, 10:20",
        earnings: "+6 AFc",
        rating: 5.0,
      },
      {
        id: "w2",
        from: "Аэропорт",
        to: "Проспект",
        time: "Вт, 09:15",
        earnings: "+9 AFc",
        rating: 4.9,
      },
      {
        id: "w3",
        from: "Университет",
        to: "ТЦ",
        time: "Ср, 14:30",
        earnings: "+10 AFc",
        rating: 4.8,
      },
      {
        id: "w4",
        from: "Больница",
        to: "Дом",
        time: "Чт, 16:45",
        earnings: "+8 AFc",
        rating: 4.7,
      },
      {
        id: "w5",
        from: "Школа",
        to: "Парк",
        time: "Пт, 12:00",
        earnings: "+7 AFc",
        rating: 4.9,
      },
    ],
  },
  month: {
    total: "450 AFc",
    rides: [
      {
        id: "m1",
        from: "Площадь",
        to: "Центр",
        time: "1 дек, 10:20",
        earnings: "+6 AFc",
        rating: 5.0,
      },
      {
        id: "m2",
        from: "Аэропорт",
        to: "Проспект",
        time: "5 дек, 09:15",
        earnings: "+9 AFc",
        rating: 4.9,
      },
      {
        id: "m3",
        from: "Университет",
        to: "ТЦ",
        time: "10 дек, 14:30",
        earnings: "+10 AFc",
        rating: 4.8,
      },
      {
        id: "m4",
        from: "Больница",
        to: "Дом",
        time: "15 дек, 16:45",
        earnings: "+8 AFc",
        rating: 4.7,
      },
      {
        id: "m5",
        from: "Школа",
        to: "Парк",
        time: "20 дек, 12:00",
        earnings: "+7 AFc",
        rating: 4.9,
      },
      {
        id: "m6",
        from: "Офис",
        to: "Ресторан",
        time: "25 дек, 18:30",
        earnings: "+12 AFc",
        rating: 5.0,
      },
    ],
  },
  year: {
    total: "5200 AFc",
    rides: [
      {
        id: "y1",
        from: "Площадь",
        to: "Центр",
        time: "Янв, 10:20",
        earnings: "+6 AFc",
        rating: 5.0,
      },
      {
        id: "y2",
        from: "Аэропорт",
        to: "Проспект",
        time: "Фев, 09:15",
        earnings: "+9 AFc",
        rating: 4.9,
      },
      {
        id: "y3",
        from: "Университет",
        to: "ТЦ",
        time: "Мар, 14:30",
        earnings: "+10 AFc",
        rating: 4.8,
      },
      {
        id: "y4",
        from: "Больница",
        to: "Дом",
        time: "Апр, 16:45",
        earnings: "+8 AFc",
        rating: 4.7,
      },
      {
        id: "y5",
        from: "Школа",
        to: "Парк",
        time: "Май, 12:00",
        earnings: "+7 AFc",
        rating: 4.9,
      },
      {
        id: "y6",
        from: "Офис",
        to: "Ресторан",
        time: "Июн, 18:30",
        earnings: "+12 AFc",
        rating: 5.0,
      },
      {
        id: "y7",
        from: "ТЦ",
        to: "Кино",
        time: "Июл, 20:15",
        earnings: "+11 AFc",
        rating: 4.8,
      },
    ],
  },
  custom: {
    total: "75 AFc",
    rides: [
      {
        id: "c1",
        from: "Площадь",
        to: "Центр",
        time: "Выбр. период, 10:20",
        earnings: "+6 AFc",
        rating: 5.0,
      },
      {
        id: "c2",
        from: "Аэропорт",
        to: "Проспект",
        time: "Выбр. период, 09:15",
        earnings: "+9 AFc",
        rating: 4.9,
      },
    ],
  },
};

export const useEarningsData = (
  selectedPeriod: PeriodType = "week",
  forceUpdate?: number,
  localBalance?: number,
) => {
  const { balance, earnings } = useBalance();
  const { getWeekStats, getMonthStats, getTodayStats, loading, error } =
    useDriverStats();
  const [periodStats, setPeriodStats] = useState<PeriodStats | null>(null);

  // Используем локальный баланс, если он передан, иначе используем earnings из хука
  const effectiveBalance = localBalance !== undefined ? localBalance : earnings;

  // Загружаем статистику из БД в зависимости от выбранного периода
  useEffect(() => {
    const loadStats = async () => {
      let stats: PeriodStats | null = null;

      switch (selectedPeriod) {
        case "today": {
          const todayStats = await getTodayStats();
          if (todayStats) {
            stats = {
              totalHours: todayStats.hoursOnline,
              totalRides: todayStats.ridesCount,
              totalEarnings: todayStats.earnings,
              qualifiedDays: todayStats.isQualified ? 1 : 0,
              averageHoursPerDay: todayStats.hoursOnline,
              averageRidesPerDay: todayStats.ridesCount,
            };
          }
          break;
        }
        case "week":
          stats = await getWeekStats();
          break;
        case "month":
          stats = await getMonthStats();
          break;
        case "year":
          stats = null;
          break;
      }

      setPeriodStats(stats);
    };

    loadStats();
  }, [selectedPeriod, getWeekStats, getMonthStats, getTodayStats, forceUpdate]);

  const currentData = useMemo(() => {
    // Для периода "сегодня" показываем текущий заработок (earnings)
    // Для других периодов показываем данные из БД
    let currentBalance = 0;

    if (selectedPeriod === "today") {
      // Показываем текущий дневной заработок
      currentBalance = effectiveBalance || 0;
    } else {
      // Показываем данные из БД для выбранного периода
      currentBalance = periodStats?.totalEarnings || 0;
    }

    // Если баланс 0, показываем без точки
    if (currentBalance === 0) {
      return {
        total: `0 AFc`,
      };
    }

    // Для остальных случаев показываем с одним знаком после точки
    const formattedBalance = currentBalance.toFixed(1);
    return {
      total: `${formattedBalance} AFc`,
    };
  }, [
    selectedPeriod,
    effectiveBalance,
    periodStats,
    forceUpdate,
    localBalance,
    earnings,
    balance,
  ]);

  const quickStats = useMemo(() => {
    // Используем данные из БД, если доступны, иначе моковые данные
    if (periodStats) {
      return {
        totalTrips: periodStats.totalRides,
        totalEarnings: `${periodStats.totalEarnings.toFixed(1)} AFc`,
        averageRating: 4.8,
        onlineHours: Math.round(periodStats.totalHours),
      };
    }

    // Fallback на моковые данные
    return {
      totalTrips: mockData[selectedPeriod].rides.length,
      totalEarnings: mockData[selectedPeriod].total,
      averageRating: 4.8,
      onlineHours: 36,
    };
  }, [periodStats, selectedPeriod]);

  const rides = useMemo(() => mockData[selectedPeriod].rides, [selectedPeriod]);

  return {
    currentData,
    quickStats,
    rides,
    periodStats,
    loading,
    error,
  };
};
