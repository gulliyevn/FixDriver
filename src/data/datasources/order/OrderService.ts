import { Order, OrderStatus } from '../../../shared/types/order';
import { 
  IOrderService, 
  OrderData 
} from './OrderTypes';
import { OrderStorageService } from './OrderStorageService';
import { OrderTrackingService } from './OrderTrackingService';
import { OrderValidationService } from './OrderValidationService';
import { OrderGrpcService } from './OrderGrpcService';
import mockOrders from '../../../shared/mocks/data/orders';

export class OrderService implements IOrderService {
  private static instance: OrderService;
  private orders: Order[] = [];
  private storageService: OrderStorageService;
  private trackingService: OrderTrackingService;
  private validationService: OrderValidationService;
  private grpcService: OrderGrpcService;

  private constructor() {
    this.orders = mockOrders;
    this.storageService = new OrderStorageService();
    this.trackingService = new OrderTrackingService();
    this.validationService = new OrderValidationService();
    this.grpcService = new OrderGrpcService();
  }

  static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  async getOrders(userId: string): Promise<Order[]> {
    return this.orders.filter(order => order.clientId === userId);
  }

  async getOrder(orderId: string): Promise<Order | null> {
    return this.orders.find(order => order.id === orderId) || null;
  }

  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const order: Order = {
      id: `order_${Date.now()}`,
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.orders.push(order);
    this.notifySubscribers();
    return order;
  }

  async updateOrder(orderId: string, updates: Partial<Order>): Promise<Order | null> {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) return null;

    this.orders[orderIndex] = {
      ...this.orders[orderIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.notifySubscribers();
    return this.orders[orderIndex];
  }

  async cancelOrder(orderId: string): Promise<Order | null> {
    const order = this.orders.find(o => o.id === orderId);
    if (order && order.status !== 'completed') {
      order.status = 'cancelled';
      order.updatedAt = new Date().toISOString();
      this.notifySubscribers();
      return order;
    }
    return null;
  }

  async completeOrder(orderId: string): Promise<Order | null> {
    return this.updateOrder(orderId, { status: 'completed' });
  }

  async getOrdersByStatus(userId: string, status: OrderStatus): Promise<Order[]> {
    return this.orders.filter(order => order.clientId === userId && order.status === status);
  }

  async getActiveOrders(userId: string): Promise<Order[]> {
    return this.orders.filter(order => 
      order.clientId === userId && 
      ['pending', 'confirmed', 'in_progress'].includes(order.status)
    );
  }

  async getCompletedOrders(userId: string): Promise<Order[]> {
    return this.orders.filter(order => 
      order.clientId === userId && 
      order.status === 'completed'
    );
  }

  // Driver tracking
  startDriverTracking(driverId: string, destination: { latitude: number; longitude: number }): void {
    return this.trackingService.startDriverTracking(driverId, destination);
  }

  stopDriverTracking(): void {
    return this.trackingService.stopDriverTracking();
  }

  // Storage operations
  async saveOrderData(orderData: Omit<OrderData, 'id' | 'createdAt'>): Promise<OrderData> {
    return this.storageService.saveOrderData(orderData);
  }

  async loadOrderData(): Promise<OrderData | null> {
    return this.storageService.loadOrderData();
  }

  async updateOrderData(updates: Partial<OrderData>): Promise<OrderData | null> {
    return this.storageService.updateOrderData(updates);
  }

  async clearOrderData(): Promise<void> {
    return this.storageService.clearOrderData();
  }

  // Validation
  validateOrderData(data: any): { isValid: boolean; errors: string[] } {
    return this.validationService.validateOrderData(data);
  }

  // Static methods for API compatibility
  static async getClientOrders(clientId: string): Promise<Order[]> {
    const grpcService = new OrderGrpcService();
    return grpcService.getClientOrdersGrpc(clientId);
  }

  static async getDriverOrders(driverId: string): Promise<Order[]> {
    const grpcService = new OrderGrpcService();
    return grpcService.getDriverOrdersGrpc(driverId);
  }

  static async acceptOrder(orderId: string, driverId: string): Promise<Order> {
    const grpcService = new OrderGrpcService();
    return grpcService.acceptOrderGrpc(orderId, driverId);
  }

  static async updateOrderStatus(orderId: string): Promise<Order> {
    const grpcService = new OrderGrpcService();
    return grpcService.updateOrderStatusGrpc(orderId);
  }

  // Sync with backend
  async syncWithBackend(): Promise<boolean> {
    return this.grpcService.syncWithBackend();
  }

  notifySubscribers(): void {
    // Implementation of notifySubscribers method
  }
}

export const orderService = OrderService.getInstance();
export default OrderService;
