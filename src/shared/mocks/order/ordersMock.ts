export interface Order {
  id: string;
  clientName: string;
  clientPhone: string;
  pickup: string;
  destination: string;
  price: string;
  distance: string;
  estimatedTime: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  timestamp: string;
}

export interface OrderFilter {
  key: string;
  label: string;
  icon: string;
}

export const ordersMock: Order[] = [
  {
    id: '1',
    clientName: 'Иван Петров',
    clientPhone: '+994501234567',
    pickup: 'ул. Низами, 10',
    destination: 'БЦ Port Baku',
    price: '15 ₽',
    distance: '3.2 км',
    estimatedTime: '12 мин',
    status: 'pending',
    timestamp: '09:30'
  },
  {
    id: '2',
    clientName: 'Мария Сидорова',
    clientPhone: '+994507654321',
    pickup: 'ТЦ 28 Mall',
    destination: 'ул. Физули, 25',
    price: '22 ₽',
    distance: '5.1 км',
    estimatedTime: '18 мин',
    status: 'accepted',
    timestamp: '10:15'
  }
];

export const orderFiltersMock: OrderFilter[] = [
  { key: 'all', label: 'Все', icon: 'list' },
  { key: 'active', label: 'Активные', icon: 'checkmark-circle' },
  { key: 'completed', label: 'Завершенные', icon: 'checkmark-done' },
  { key: 'pending', label: 'Ожидающие', icon: 'time' }
]; 