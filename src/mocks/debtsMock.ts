export interface Debt {
  id: string;
  title: string;
  description: string;
  amount: string;
  dueDate: string;
  status: 'active' | 'overdue' | 'due_soon' | 'paid';
}

export const mockDebts: Debt[] = [
  {
    id: '1',
    title: 'Долг за поездку',
    description: 'Неоплаченная поездка в аэропорт',
    amount: '25.50 AZN',
    dueDate: '2024-01-20',
    status: 'overdue'
  },
  {
    id: '2',
    title: 'Штраф за нарушение',
    description: 'Штраф за превышение скорости',
    amount: '50.00 AZN',
    dueDate: '2024-01-25',
    status: 'due_soon'
  }
]; 