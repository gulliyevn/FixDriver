export interface Debt {
  id: string;
  titleKey: string;
  descriptionKey: string;
  destinationKey?: string;
  debtType: 'trip' | 'service' | 'penalty' | 'subscription' | 'parking';
  serviceType?: 'transport' | 'premium' | 'vip';
  amount: string;
  currency: string;
  dueDate: string;
  dueTime: string;
  status: 'active' | 'overdue' | 'due_soon' | 'paid';
  createdAt: string;
  updatedAt: string;
  tripId?: string;
  orderId?: string;
}

export const mockDebts: Debt[] = [
  {
    id: '1',
    titleKey: 'client.debts.tripDebt',
    descriptionKey: 'client.debts.unpaidTrip',
    debtType: 'trip',
    serviceType: 'transport',
    amount: '25.50',
    currency: 'AZN',
    dueDate: '2024-01-20',
    dueTime: '14:30',
    status: 'overdue',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    tripId: 'trip_001'
  },
  {
    id: '2',
    titleKey: 'client.debts.tripDebt',
    descriptionKey: 'client.debts.unpaidTrip',
    debtType: 'trip',
    serviceType: 'transport',
    amount: '15.75',
    currency: 'AZN',
    dueDate: '2024-01-25',
    dueTime: '18:00',
    status: 'due_soon',
    createdAt: '2024-01-18T12:00:00Z',
    updatedAt: '2024-01-18T12:00:00Z',
    tripId: 'trip_002'
  },
  {
    id: '3',
    titleKey: 'client.debts.serviceDebt',
    descriptionKey: 'client.debts.unpaidService',
    debtType: 'service',
    serviceType: 'premium',
    amount: '50.00',
    currency: 'AZN',
    dueDate: '2024-01-30',
    dueTime: '23:59',
    status: 'active',
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-20T09:00:00Z',
    orderId: 'order_001'
  }
]; 