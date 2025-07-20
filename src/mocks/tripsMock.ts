export interface Trip {
  id: string;
  title: string;
  description?: string;
  amount: string;
  type: 'completed' | 'cancelled' | 'scheduled';
  status: 'completed' | 'cancelled' | 'scheduled';
  date: string;
  time: string;
  driver?: string;
  route?: string;
}

// Функция для получения переведенных мок данных
export const getMockTrips = (t: (key: string) => string): Trip[] => [
  {
    id: '1',
    title: t('client.trips.mock.tripToCityCenter'),
    description: t('client.trips.mock.routeLeninGagarin'),
    amount: '15.50 AZN',
    type: 'completed',
    status: 'completed',
    date: '2024-01-15',
    time: '14:30',
    driver: 'Али Алиев',
    route: 'ул. Ленина - ул. Гагарина'
  },
  {
    id: '2',
    title: t('client.trips.mock.tripToAirport'),
    description: t('client.trips.mock.routeCenterAirport'),
    amount: '25.00 AZN',
    type: 'completed',
    status: 'completed',
    date: '2024-01-14',
    time: '09:45',
    driver: 'Мария Петрова',
    route: 'центр - аэропорт Гейдар Алиев'
  },
  {
    id: '3',
    title: t('client.trips.mock.tripToMall'),
    description: t('client.trips.mock.routeToMall'),
    amount: '8.75 AZN',
    type: 'cancelled',
    status: 'cancelled',
    date: '2024-01-13',
    time: '16:20',
    driver: 'Иван Сидоров',
    route: 'дом - торговый центр'
  },
  {
    id: '4',
    title: t('client.trips.mock.tripToWork'),
    description: t('client.trips.mock.routeToWork'),
    amount: '12.00 AZN',
    type: 'scheduled',
    status: 'scheduled',
    date: '2024-01-16',
    time: '08:00',
    driver: 'Елена Козлова',
    route: 'дом - офис'
  }
];

// Оставляем старые данные для обратной совместимости
export const mockTrips: Trip[] = [
  {
    id: '1',
    title: 'Поездка в центр города',
    description: 'Маршрут: ул. Ленина - ул. Гагарина',
    amount: '15.50 AZN',
    type: 'completed',
    status: 'completed',
    date: '2024-01-15',
    time: '14:30',
    driver: 'Али Алиев',
    route: 'ул. Ленина - ул. Гагарина'
  },
  {
    id: '2',
    title: 'Поездка в аэропорт',
    description: 'Маршрут: центр - аэропорт Гейдар Алиев',
    amount: '25.00 AZN',
    type: 'completed',
    status: 'completed',
    date: '2024-01-14',
    time: '09:45',
    driver: 'Мария Петрова',
    route: 'центр - аэропорт Гейдар Алиев'
  },
  {
    id: '3',
    title: 'Поездка в торговый центр',
    description: 'Маршрут: дом - торговый центр',
    amount: '8.75 AZN',
    type: 'cancelled',
    status: 'cancelled',
    date: '2024-01-13',
    time: '16:20',
    driver: 'Иван Сидоров',
    route: 'дом - торговый центр'
  },
  {
    id: '4',
    title: 'Поездка на работу',
    description: 'Маршрут: дом - офис',
    amount: '12.00 AZN',
    type: 'scheduled',
    status: 'scheduled',
    date: '2024-01-16',
    time: '08:00',
    driver: 'Елена Козлова',
    route: 'дом - офис'
  }
]; 