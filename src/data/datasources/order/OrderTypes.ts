import { Order, OrderStatus } from '../../../shared/types/order';

export interface OrderData {
  id: string;
  familyMemberId: string;
  familyMemberName: string;
  packageType: string;
  addresses: Array<{
    id: string;
    type: 'from' | 'to' | 'stop';
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  }>;
  createdAt: number;
  status: 'draft' | 'confirmed' | 'completed' | 'cancelled';
}

export interface IOrderService {
  getOrders(userId: string): Promise<Order[]>;
  getOrder(orderId: string): Promise<Order | null>;
  createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order>;
  updateOrder(orderId: string, updates: Partial<Order>): Promise<Order | null>;
  cancelOrder(orderId: string): Promise<Order | null>;
  completeOrder(orderId: string): Promise<Order | null>;
  getOrdersByStatus(userId: string, status: OrderStatus): Promise<Order[]>;
  getActiveOrders(userId: string): Promise<Order[]>;
  getCompletedOrders(userId: string): Promise<Order[]>;
  startDriverTracking(driverId: string, destination: { latitude: number; longitude: number }): void;
  stopDriverTracking(): void;
  saveOrderData(orderData: Omit<OrderData, 'id' | 'createdAt'>): Promise<OrderData>;
  loadOrderData(): Promise<OrderData | null>;
  updateOrderData(updates: Partial<OrderData>): Promise<OrderData | null>;
  clearOrderData(): Promise<void>;
  validateOrderData(data: any): { isValid: boolean; errors: string[] };
  syncWithBackend(): Promise<boolean>;
}
