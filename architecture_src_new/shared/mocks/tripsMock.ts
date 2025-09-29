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
  from?: string;
  to?: string;
  vehicle?: string;
}

// Функция для получения переведенных мок данных
export const getMockTrips = (t?: (key: string) => string): Trip[] => [
  {
    id: '1',
    title: 'Поездка в центр города',
    description: 'Маршрут: ул. Ленина - ул. Гагарина',
    amount: '15.50 AFc',
    type: 'completed',
    status: 'completed',
    date: '2024-01-15',
    time: '14:30',
    driver: 'Али Алиев',
    route: 'ул. Ленина - ул. Гагарина',
    from: 'ул. Ленина',
    to: 'ул. Гагарина',
    vehicle: 'Toyota Camry'
  },
  {
    id: '2',
    title: 'Поездка в аэропорт',
    description: 'Маршрут: центр - аэропорт Гейдар Алиев',
    amount: '25.00 AFc',
    type: 'completed',
    status: 'completed',
    date: '2024-01-14',
    time: '09:45',
    driver: 'Мария Петрова',
    route: 'центр - аэропорт Гейдар Алиев',
    from: 'Центр города',
    to: 'Аэропорт Гейдар Алиев',
    vehicle: 'Hyundai Elantra'
  },
  {
    id: '3',
    title: 'Поездка в торговый центр',
    description: 'Маршрут: дом - торговый центр',
    amount: '8.75 AFc',
    type: 'cancelled',
    status: 'cancelled',
    date: '2024-01-13',
    time: '16:20',
    driver: 'Иван Сидоров',
    route: 'дом - торговый центр',
    from: 'Дом',
    to: 'Торговый центр',
    vehicle: 'Kia Rio'
  },
  {
    id: '4',
    title: 'Поездка на работу',
    description: 'Маршрут: дом - офис',
    amount: '12.00 AFc',
    type: 'scheduled',
    status: 'scheduled',
    date: '2024-01-16',
    time: '08:00',
    driver: 'Елена Козлова',
    route: 'дом - офис',
    from: 'Дом',
    to: 'Офис',
    vehicle: 'Nissan Sentra'
  },
  {
    id: '5',
    title: 'Поездка в университет',
    description: 'Маршрут: дом - университет',
    amount: '6.50 AFc',
    type: 'completed',
    status: 'completed',
    date: '2024-01-12',
    time: '07:30',
    driver: 'Ахмед Гусейнов',
    route: 'дом - университет',
    from: 'Дом',
    to: 'Университет',
    vehicle: 'Toyota Corolla'
  }
];

// Оставляем старые данные для обратной совместимости
export const mockTrips: Trip[] = getMockTrips();
