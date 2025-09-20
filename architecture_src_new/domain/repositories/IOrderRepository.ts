import { Order, CreateOrderData, OrderFilters, PaginationParams, PaginatedResponse, Address } from '../../shared/types';

export interface IOrderRepository {
  // Order CRUD operations
  getOrder(id: string): Promise<Order>;
  createOrder(orderData: CreateOrderData): Promise<Order>;
  updateOrder(id: string, updates: Partial<Order>): Promise<Order>;
  deleteOrder(id: string): Promise<void>;
  
  // Order listing and filtering
  getOrders(filters?: OrderFilters, params?: PaginationParams): Promise<PaginatedResponse<Order>>;
  getUserOrders(userId: string, filters?: OrderFilters): Promise<Order[]>;
  getDriverActiveOrders(driverId: string): Promise<Order[]>;
  
  // Order lifecycle management
  cancelOrder(id: string, reason?: string): Promise<Order>;
  acceptOrder(orderId: string, driverId: string): Promise<Order>;
  startTrip(orderId: string): Promise<Order>;
  completeTrip(orderId: string): Promise<Order>;
  
  // Order calculations
  calculatePrice(from: Address, to: Address, options?: { distance?: number; duration?: number; vehicleType?: string }): Promise<number>;
  estimateDuration(from: Address, to: Address): Promise<number>;
  
  // Order validation
  canCancelOrder(orderId: string, userId: string): Promise<boolean>;
  
  // Helper methods
  getOrdersByStatus(status: string): Promise<Order[]>;
  getOrdersByDateRange(startDate: string, endDate: string): Promise<Order[]>;
}
