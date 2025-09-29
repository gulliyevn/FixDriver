export interface PaymentHistory {
  id: string;
  title: string;
  description?: string;
  amount: string;
  type: 'trip' | 'topup' | 'refund' | 'fee';
  status: 'completed' | 'pending' | 'failed';
  date: string;
  time: string;
}

// Функция для получения переведенных мок данных истории платежей
export const getMockPaymentHistory = (t?: (key: string) => string): PaymentHistory[] => [
  {
    id: '1',
    title: 'Поездка в центр города',
    description: 'Маршрут: ул. Ленина - ул. Гагарина',
    amount: '-15.50 AFc',
    type: 'trip',
    status: 'completed',
    date: '2024-01-15',
    time: '14:30'
  },
  {
    id: '2',
    title: 'Пополнение баланса',
    amount: '+100 AFc',
    type: 'topup',
    status: 'completed',
    date: '2024-01-14',
    time: '10:15'
  },
  {
    id: '3',
    title: 'Поездка в аэропорт',
    description: 'Маршрут: центр - аэропорт Гейдар Алиев',
    amount: '-8.75 AFc',
    type: 'trip',
    status: 'completed',
    date: '2024-01-13',
    time: '09:45'
  },
  {
    id: '4',
    title: 'Возврат средств',
    description: 'Возврат за отмененную поездку',
    amount: '+12.00 AFc',
    type: 'refund',
    status: 'completed',
    date: '2024-01-12',
    time: '16:20'
  },
  {
    id: '5',
    title: 'Комиссия сервиса',
    description: 'Комиссия за поездку',
    amount: '-2.50 AFc',
    type: 'fee',
    status: 'completed',
    date: '2024-01-11',
    time: '14:30'
  },
  {
    id: '6',
    title: 'Пополнение баланса',
    amount: '+50 AFc',
    type: 'topup',
    status: 'pending',
    date: '2024-01-10',
    time: '11:20'
  }
];

// Оставляем старые данные для обратной совместимости
export const mockPaymentHistory: PaymentHistory[] = getMockPaymentHistory();
