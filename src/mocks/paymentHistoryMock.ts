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

// Функция для получения переведенных мок данных истории пополнений
export const getMockTopUpHistory = (t: (key: string) => string): PaymentHistory[] => [
  {
    id: '1',
    title: t('client.paymentHistory.mock.balanceTopUp'),
    amount: '+100 AFc',
    type: 'topup',
    status: 'completed',
    date: '2024-01-15',
    time: '14:30'
  },
  {
    id: '2',
    title: t('client.paymentHistory.mock.balanceTopUp'),
    amount: '+50 AFc',
    type: 'topup',
    status: 'completed',
    date: '2024-01-14',
    time: '10:15'
  },
  {
    id: '3',
    title: t('client.paymentHistory.mock.balanceTopUp'),
    amount: '+200 AFc',
    type: 'topup',
    status: 'completed',
    date: '2024-01-13',
    time: '09:45'
  },
  {
    id: '4',
    title: t('client.paymentHistory.mock.balanceTopUp'),
    amount: '+75 AFc',
    type: 'topup',
    status: 'completed',
    date: '2024-01-12',
    time: '16:20'
  },
  {
    id: '5',
    title: t('client.paymentHistory.mock.balanceTopUp'),
    amount: '+150 AFc',
    type: 'topup',
    status: 'completed',
    date: '2024-01-11',
    time: '12:30'
  },
  {
    id: '6',
    title: t('client.paymentHistory.mock.balanceTopUp'),
    amount: '+300 AFc',
    type: 'topup',
    status: 'completed',
    date: '2024-01-10',
    time: '11:20'
  },
  {
    id: '7',
    title: t('client.paymentHistory.mock.balanceTopUp'),
    amount: '+80 AFc',
    type: 'topup',
    status: 'completed',
    date: '2024-01-09',
    time: '15:45'
  },
  {
    id: '8',
    title: t('client.paymentHistory.mock.balanceTopUp'),
    amount: '+120 AFc',
    type: 'topup',
    status: 'completed',
    date: '2024-01-08',
    time: '13:10'
  },
  {
    id: '9',
    title: t('client.paymentHistory.mock.balanceTopUp'),
    amount: '+90 AFc',
    type: 'topup',
    status: 'completed',
    date: '2024-01-07',
    time: '08:30'
  },
  {
    id: '10',
    title: t('client.paymentHistory.mock.balanceTopUp'),
    amount: '+250 AFc',
    type: 'topup',
    status: 'completed',
    date: '2024-01-06',
    time: '17:25'
  },
  {
    id: '11',
    title: t('client.paymentHistory.mock.balanceTopUp'),
    amount: '+180 AFc',
    type: 'topup',
    status: 'completed',
    date: '2024-01-05',
    time: '12:15'
  },
  {
    id: '12',
    title: t('client.paymentHistory.mock.balanceTopUp'),
    amount: '+95 AFc',
    type: 'topup',
    status: 'completed',
    date: '2024-01-04',
    time: '14:50'
  },
  {
    id: '13',
    title: t('client.paymentHistory.mock.balanceTopUp'),
    amount: '+160 AFc',
    type: 'topup',
    status: 'completed',
    date: '2024-01-03',
    time: '10:40'
  },
  {
    id: '14',
    title: t('client.paymentHistory.mock.balanceTopUp'),
    amount: '+70 AFc',
    type: 'topup',
    status: 'completed',
    date: '2024-01-02',
    time: '16:35'
  },
  {
    id: '15',
    title: t('client.paymentHistory.mock.balanceTopUp'),
    amount: '+220 AFc',
    type: 'topup',
    status: 'completed',
    date: '2024-01-01',
    time: '09:20'
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