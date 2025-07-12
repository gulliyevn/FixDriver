import { Transaction, TopUpMethod, WithdrawalMethod } from '../types/balance';

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'payment',
    amount: '-15.50 AZN',
    description: 'Поездка в центр города',
    date: '2024-01-15',
    time: '14:30',
    status: 'completed'
  },
  {
    id: '2',
    type: 'topup',
    amount: '+100 AZN',
    description: 'Пополнение с карты',
    date: '2024-01-14',
    time: '10:15',
    status: 'completed'
  },
  {
    id: '3',
    type: 'payment',
    amount: '-8.75 AZN',
    description: 'Поездка в аэропорт',
    date: '2024-01-13',
    time: '09:45',
    status: 'completed'
  },
  {
    id: '4',
    type: 'refund',
    amount: '+12.00 AZN',
    description: 'Возврат средств',
    date: '2024-01-12',
    time: '16:20',
    status: 'completed'
  }
];

export const mockTopUpMethods: TopUpMethod[] = [
  {
    id: 'card',
    name: 'Банковская карта',
    icon: 'card',
    description: 'Visa, MasterCard, Maestro'
  },
  {
    id: 'cash',
    name: 'Наличные',
    icon: 'cash',
    description: 'Пополнение в офисе'
  }
];

export const mockWithdrawalMethods: WithdrawalMethod[] = [
  {
    id: 'card',
    name: 'На карту',
    icon: 'card',
    description: 'Перевод на банковскую карту',
    minAmount: 10,
    maxAmount: 10000
  }
];

export const mockBalance = '0 AZN';
export const mockQuickAmounts = ['10 AZN', '25 AZN', '50 AZN', '100 AZN']; 