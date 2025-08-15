import { useMemo } from 'react';
import { useBalance } from '../../../hooks/useBalance';

type PeriodType = 'today' | 'week' | 'month' | 'year';

// Моковые данные для разных периодов
const mockData = {
  today: {
    total: '25 AFc',
    rides: [
      { id: 't1', from: 'Площадь', to: 'Центр', time: 'Сегодня, 10:20', earnings: '+6 AFc', rating: 5.0 },
      { id: 't2', from: 'Аэропорт', to: 'Проспект', time: 'Сегодня, 09:15', earnings: '+9 AFc', rating: 4.9 },
      { id: 't3', from: 'Университет', to: 'ТЦ', time: 'Сегодня, 14:30', earnings: '+10 AFc', rating: 4.8 },
    ]
  },
  week: {
    total: '100 AFc',
    rides: [
      { id: 'w1', from: 'Площадь', to: 'Центр', time: 'Пн, 10:20', earnings: '+6 AFc', rating: 5.0 },
      { id: 'w2', from: 'Аэропорт', to: 'Проспект', time: 'Вт, 09:15', earnings: '+9 AFc', rating: 4.9 },
      { id: 'w3', from: 'Университет', to: 'ТЦ', time: 'Ср, 14:30', earnings: '+10 AFc', rating: 4.8 },
      { id: 'w4', from: 'Больница', to: 'Дом', time: 'Чт, 16:45', earnings: '+8 AFc', rating: 4.7 },
      { id: 'w5', from: 'Школа', to: 'Парк', time: 'Пт, 12:00', earnings: '+7 AFc', rating: 4.9 },
    ]
  },
  month: {
    total: '450 AFc',
    rides: [
      { id: 'm1', from: 'Площадь', to: 'Центр', time: '1 дек, 10:20', earnings: '+6 AFc', rating: 5.0 },
      { id: 'm2', from: 'Аэропорт', to: 'Проспект', time: '5 дек, 09:15', earnings: '+9 AFc', rating: 4.9 },
      { id: 'm3', from: 'Университет', to: 'ТЦ', time: '10 дек, 14:30', earnings: '+10 AFc', rating: 4.8 },
      { id: 'm4', from: 'Больница', to: 'Дом', time: '15 дек, 16:45', earnings: '+8 AFc', rating: 4.7 },
      { id: 'm5', from: 'Школа', to: 'Парк', time: '20 дек, 12:00', earnings: '+7 AFc', rating: 4.9 },
      { id: 'm6', from: 'Офис', to: 'Ресторан', time: '25 дек, 18:30', earnings: '+12 AFc', rating: 5.0 },
    ]
  },
  year: {
    total: '5200 AFc',
    rides: [
      { id: 'y1', from: 'Площадь', to: 'Центр', time: 'Янв, 10:20', earnings: '+6 AFc', rating: 5.0 },
      { id: 'y2', from: 'Аэропорт', to: 'Проспект', time: 'Фев, 09:15', earnings: '+9 AFc', rating: 4.9 },
      { id: 'y3', from: 'Университет', to: 'ТЦ', time: 'Мар, 14:30', earnings: '+10 AFc', rating: 4.8 },
      { id: 'y4', from: 'Больница', to: 'Дом', time: 'Апр, 16:45', earnings: '+8 AFc', rating: 4.7 },
      { id: 'y5', from: 'Школа', to: 'Парк', time: 'Май, 12:00', earnings: '+7 AFc', rating: 4.9 },
      { id: 'y6', from: 'Офис', to: 'Ресторан', time: 'Июн, 18:30', earnings: '+12 AFc', rating: 5.0 },
      { id: 'y7', from: 'ТЦ', to: 'Кино', time: 'Июл, 20:15', earnings: '+11 AFc', rating: 4.8 },
    ]
  },
  custom: {
    total: '75 AFc',
    rides: [
      { id: 'c1', from: 'Площадь', to: 'Центр', time: 'Выбр. период, 10:20', earnings: '+6 AFc', rating: 5.0 },
      { id: 'c2', from: 'Аэропорт', to: 'Проспект', time: 'Выбр. период, 09:15', earnings: '+9 AFc', rating: 4.9 },
    ]
  }
};

export const useEarningsData = (selectedPeriod: PeriodType = 'week') => {
  const { balance } = useBalance() as any;

  const currentData = useMemo(() => ({
    total: mockData[selectedPeriod].total,
  }), [selectedPeriod]);

  const quickStats = useMemo(() => ({
    totalTrips: mockData[selectedPeriod].rides.length,
    totalEarnings: mockData[selectedPeriod].total,
    averageRating: 4.8,
    onlineHours: 36,
  }), [selectedPeriod]);

  const rides = useMemo(() => mockData[selectedPeriod].rides, [selectedPeriod]);

  return {
    currentData,
    quickStats,
    rides,
  };
};
