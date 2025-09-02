// Мок данные для детальной статистики заработка

export interface RideHistoryItem {
  id: string;
  clientName: string;
  clientSurname: string;
  amount: string;
  datetime: string;
  status: 'Завершена' | 'В процессе' | 'Отменена';
  rating?: number;
  distance?: string;
  duration?: string;
}

export interface HourlyActivityItem {
  hour: string;
  rides: number;
  earnings: string;
  efficiency: number;
}

export interface DistanceMetricItem {
  metric: string;
  value: string;
  icon: string;
  description?: string;
}

export interface RoutePointItem {
  id: string;
  point: string;
  status: 'В процессе' | 'Предстоит';
  time: string;
  address: string;
  clientName?: string;
}

// Мок данные для истории поездок
export const mockRideHistory: RideHistoryItem[] = [
  {
    id: '1',
    clientName: 'Алексей',
    clientSurname: 'Петров',
    amount: '45 AFc',
    datetime: '21.08 14:30',
    status: 'Завершена',
    rating: 5.0,
    distance: '3.2 км',
    duration: '12 мин'
  },
  {
    id: '2',
    clientName: 'Мария',
    clientSurname: 'Иванова',
    amount: '38 AFc',
    datetime: '21.08 13:15',
    status: 'Завершена',
    rating: 4.8,
    distance: '2.8 км',
    duration: '10 мин'
  },
  {
    id: '3',
    clientName: 'Дмитрий',
    clientSurname: 'Сидоров',
    amount: '52 AFc',
    datetime: '21.08 11:45',
    status: 'Завершена',
    rating: 5.0,
    distance: '4.1 км',
    duration: '15 мин'
  },
  {
    id: '4',
    clientName: 'Анна',
    clientSurname: 'Козлова',
    amount: '41 AFc',
    datetime: '21.08 10:20',
    status: 'Завершена',
    rating: 4.9,
    distance: '3.0 км',
    duration: '11 мин'
  },
  {
    id: '5',
    clientName: 'Сергей',
    clientSurname: 'Новиков',
    amount: '35 AFc',
    datetime: '21.08 09:05',
    status: 'Завершена',
    rating: 4.7,
    distance: '2.5 км',
    duration: '9 мин'
  },
  {
    id: '6',
    clientName: 'Елена',
    clientSurname: 'Морозова',
    amount: '48 AFc',
    datetime: '20.08 18:30',
    status: 'Завершена',
    rating: 4.9,
    distance: '3.5 км',
    duration: '13 мин'
  },
  {
    id: '7',
    clientName: 'Андрей',
    clientSurname: 'Волков',
    amount: '42 AFc',
    datetime: '20.08 17:15',
    status: 'Завершена',
    rating: 4.8,
    distance: '3.1 км',
    duration: '12 мин'
  },
  {
    id: '8',
    clientName: 'Ольга',
    clientSurname: 'Лебедева',
    amount: '39 AFc',
    datetime: '20.08 16:45',
    status: 'Завершена',
    rating: 5.0,
    distance: '2.9 км',
    duration: '11 мин'
  }
];

// Мок данные для активности по часам
export const mockHourlyActivity: HourlyActivityItem[] = [
  {
    hour: '09:00-10:00',
    rides: 3,
    earnings: '108 AFc',
    efficiency: 85
  },
  {
    hour: '10:00-11:00',
    rides: 2,
    earnings: '76 AFc',
    efficiency: 70
  },
  {
    hour: '11:00-12:00',
    rides: 4,
    earnings: '156 AFc',
    efficiency: 95
  },
  {
    hour: '12:00-13:00',
    rides: 1,
    earnings: '38 AFc',
    efficiency: 60
  },
  {
    hour: '13:00-14:00',
    rides: 3,
    earnings: '115 AFc',
    efficiency: 80
  },
  {
    hour: '14:00-15:00',
    rides: 2,
    earnings: '83 AFc',
    efficiency: 75
  },
  {
    hour: '15:00-16:00',
    rides: 5,
    earnings: '185 AFc',
    efficiency: 90
  },
  {
    hour: '16:00-17:00',
    rides: 3,
    earnings: '112 AFc',
    efficiency: 85
  }
];

// Мок данные для статистики пробега
export const mockDistanceMetrics: DistanceMetricItem[] = [
  {
    metric: 'Общий пробег',
    value: '85 км',
    icon: 'speedometer-outline',
    description: 'За сегодня'
  },
  {
    metric: 'Средняя скорость',
    value: '35 км/ч',
    icon: 'flash-outline',
    description: 'В движении'
  },
  {
    metric: 'Время в пути',
    value: '2ч 25мин',
    icon: 'time-outline',
    description: 'Активное время'
  },
  {
    metric: 'Эффективность',
    value: '92%',
    icon: 'trending-up-outline',
    description: 'Коэффициент полезности'
  },
  {
    metric: 'Экономия топлива',
    value: '15%',
    icon: 'leaf-outline',
    description: 'Благодаря оптимизации'
  },
  {
    metric: 'Средняя поездка',
    value: '3.2 км',
    icon: 'map-outline',
    description: 'Расстояние за поездку'
  }
];

// Мок данные для маршрутов на сегодня
export const mockRoutePoints: RoutePointItem[] = [
  {
    id: '1',
    point: 'Алексей Петров',
    status: 'В процессе',
    time: '10:30',
    address: 'пр. Мира, 42',
    clientName: 'Алексей Петров'
  },
  {
    id: '2',
    point: 'Мария Иванова',
    status: 'Предстоит',
    time: '11:45',
    address: 'ул. Гагарина, 7',
    clientName: 'Мария Иванова'
  },
  {
    id: '3',
    point: 'Дмитрий Сидоров',
    status: 'Предстоит',
    time: '13:00',
    address: 'пр. Победы, 23',
    clientName: 'Дмитрий Сидоров'
  },
  {
    id: '4',
    point: 'Анна Козлова',
    status: 'Предстоит',
    time: '14:15',
    address: 'ул. Советская, 56',
    clientName: 'Анна Козлова'
  },
  {
    id: '5',
    point: 'Сергей Новиков',
    status: 'Предстоит',
    time: '15:30',
    address: 'ул. Ленина, 89',
    clientName: 'Сергей Новиков'
  },
  {
    id: '6',
    point: 'Елена Морозова',
    status: 'Предстоит',
    time: '16:45',
    address: 'ул. Пушкина, 12',
    clientName: 'Елена Морозова'
  }
];

// Функции для получения данных по периодам
export const getRideHistoryByPeriod = (period: 'today' | 'week' | 'month' | 'year') => {
  switch (period) {
    case 'today':
      return mockRideHistory.slice(0, 5); // Последние 5 поездок за сегодня
    case 'week':
      return mockRideHistory.slice(0, 8); // Все поездки за неделю
    case 'month':
      return mockRideHistory; // Все поездки за месяц
    case 'year':
      return mockRideHistory; // Все поездки за год (упрощенно)
    default:
      return mockRideHistory.slice(0, 5);
  }
};

export const getHourlyActivityByPeriod = (period: 'today' | 'week' | 'month' | 'year') => {
  switch (period) {
    case 'today':
      return mockHourlyActivity.slice(0, 8); // Активность за день
    case 'week':
      return mockHourlyActivity.slice(0, 5); // Средняя активность за неделю
    case 'month':
      return mockHourlyActivity.slice(0, 4); // Средняя активность за месяц
    case 'year':
      return mockHourlyActivity.slice(0, 3); // Средняя активность за год
    default:
      return mockHourlyActivity.slice(0, 8);
  }
};

export const getDistanceMetricsByPeriod = (period: 'today' | 'week' | 'month' | 'year') => {
  // Адаптируем метрики под период
  const baseMetrics = [...mockDistanceMetrics];
  
  switch (period) {
    case 'today':
      return baseMetrics;
    case 'week':
      return baseMetrics.map(metric => ({
        ...metric,
        value: period === 'week' ? 
          (metric.metric === 'Общий пробег' ? '420 км' :
           metric.metric === 'Время в пути' ? '12ч 15мин' :
           metric.value) : metric.value
      }));
    case 'month':
      return baseMetrics.map(metric => ({
        ...metric,
        value: period === 'month' ? 
          (metric.metric === 'Общий пробег' ? '1680 км' :
           metric.metric === 'Время в пути' ? '48ч 30мин' :
           metric.value) : metric.value
      }));
    case 'year':
      return baseMetrics.map(metric => ({
        ...metric,
        value: period === 'year' ? 
          (metric.metric === 'Общий пробег' ? '20160 км' :
           metric.metric === 'Время в пути' ? '582ч' :
           metric.value) : metric.value
      }));
    default:
      return baseMetrics;
  }
};

export const getRoutePointsByPeriod = (period: 'today' | 'week' | 'month' | 'year') => {
  switch (period) {
    case 'today':
      return mockRoutePoints; // Все точки на сегодня
    case 'week':
      return mockRoutePoints.slice(0, 4); // Основные точки недели
    case 'month':
      return mockRoutePoints.slice(0, 3); // Ключевые точки месяца
    case 'year':
      return mockRoutePoints.slice(0, 2); // Главные точки года
    default:
      return mockRoutePoints;
  }
};
