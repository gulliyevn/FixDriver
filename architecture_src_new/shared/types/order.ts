export type OrderStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  clientId: string;
  driverId?: string;
  status: OrderStatus;
  from: Address;
  to: Address;
  stops?: Address[];
  price: number;
  distance: number;
  duration: number;
  createdAt: string;
  updatedAt: string;
  scheduledAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

export interface Address {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'from' | 'to' | 'stop';
}

export interface CreateOrderData {
  clientId: string;
  from: Address;
  to: Address;
  stops?: Address[];
  scheduledAt?: string;
  estimatedPrice?: number;
  estimatedDuration?: number;
}

export interface OrderFilters {
  status?: OrderStatus;
  clientId?: string;
  driverId?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

export interface OrderResult {
  success: boolean;
  order?: Order;
  orders?: Order[];
  error?: string;
}
