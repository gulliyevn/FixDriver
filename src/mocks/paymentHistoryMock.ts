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

export const mockPaymentHistory: PaymentHistory[] = [
  {
    id: '1',
    title: 'Поездка в центр города',
    description: 'Маршрут: ул. Ленина - ул. Гагарина',
    amount: '-15.50 AZN',
    type: 'trip',
    status: 'completed',
    date: '2024-01-15',
    time: '14:30'
  },
  {
    id: '2',
    title: 'Пополнение баланса',
    amount: '+100 AZN',
    type: 'topup',
    status: 'completed',
    date: '2024-01-14',
    time: '10:15'
  },
  {
    id: '3',
    title: 'Поездка в аэропорт',
    description: 'Маршрут: центр - аэропорт Гейдар Алиев',
    amount: '-8.75 AZN',
    type: 'trip',
    status: 'completed',
    date: '2024-01-13',
    time: '09:45'
  },
  {
    id: '4',
    title: 'Возврат средств',
    description: 'Возврат за отмененную поездку',
    amount: '+12.00 AZN',
    type: 'refund',
    status: 'completed',
    date: '2024-01-12',
    time: '16:20'
  }
]; 