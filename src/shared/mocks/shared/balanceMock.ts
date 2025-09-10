/**
 * 💰 BALANCE MOCK DATA
 * 
 * Mock balance data for development and testing.
 * Clean implementation with English comments and data.
 */

import { Transaction, TopUpMethod, WithdrawalMethod } from '../../types/balance';

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'payment',
    amount: '-15.50 AFc',
    description: 'Trip to city center',
    date: '2024-01-15',
    time: '14:30',
    status: 'completed'
  },
  {
    id: '2',
    type: 'topup',
    amount: '+100 AFc',
    description: 'Card top-up',
    date: '2024-01-14',
    time: '10:15',
    status: 'completed'
  },
  {
    id: '3',
    type: 'payment',
    amount: '-8.75 AFc',
    description: 'Trip to airport',
    date: '2024-01-13',
    time: '09:45',
    status: 'completed'
  },
  {
    id: '4',
    type: 'refund',
    amount: '+5.00 AFc',
    description: 'Trip cancellation refund',
    date: '2024-01-12',
    time: '16:20',
    status: 'completed'
  },
  {
    id: '5',
    type: 'payment',
    amount: '-12.25 AFc',
    description: 'Trip to school',
    date: '2024-01-11',
    time: '08:00',
    status: 'completed'
  }
];

export const mockTopUpMethods: TopUpMethod[] = [
  {
    id: '1',
    name: 'Visa ****1234',
    icon: '💳',
    description: 'Credit card payment'
  },
  {
    id: '2',
    name: 'Bank Transfer',
    icon: '🏦',
    description: 'Direct bank transfer'
  }
];

export const mockWithdrawalMethods: WithdrawalMethod[] = [
  {
    id: '1',
    name: 'Visa ****1234',
    icon: '💳',
    description: 'Credit card withdrawal',
    minAmount: 10,
    maxAmount: 1000
  },
  {
    id: '2',
    name: 'Bank Account',
    icon: '🏦',
    description: 'Bank account withdrawal',
    minAmount: 50,
    maxAmount: 5000
  }
];

// Mock balance amount
export const mockBalance = 150.75;

// Mock balance history
export const mockBalanceHistory = [
  { date: '2024-01-15', balance: 150.75 },
  { date: '2024-01-14', balance: 166.25 },
  { date: '2024-01-13', balance: 175.00 },
  { date: '2024-01-12', balance: 170.00 },
  { date: '2024-01-11', balance: 182.25 }
];