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

// Функция для получения переведенных мок данных
export const getMockPaymentHistory = (t: (key: string) => string): PaymentHistory[] => [
  {
    id: '1',
    title: t('client.paymentHistory.mock.tripToCityCenter'),
    description: t('client.paymentHistory.mock.routeLeninGagarin'),
    amount: '-15.50 AFc',
    type: 'trip',
    status: 'completed',
    date: '2024-01-15',
    time: '14:30'
  },
  {
    id: '2',
    title: t('client.paymentHistory.mock.balanceTopUp'),
    amount: '+100 AFc',
    type: 'topup',
    status: 'completed',
    date: '2024-01-14',
    time: '10:15'
  },
  {
    id: '3',
    title: t('client.paymentHistory.mock.tripToAirport'),
    description: t('client.paymentHistory.mock.routeCenterAirport'),
    amount: '-8.75 AFc',
    type: 'trip',
    status: 'completed',
    date: '2024-01-13',
    time: '09:45'
  },
  {
    id: '4',
    title: t('client.paymentHistory.mock.refund'),
    description: t('client.paymentHistory.mock.refundForCancelledTrip'),
    amount: '+12.00 AFc',
    type: 'refund',
    status: 'completed',
    date: '2024-01-12',
    time: '16:20'
  }
];

// Оставляем старые данные для обратной совместимости
export const mockPaymentHistory: PaymentHistory[] = [
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
  }
]; 