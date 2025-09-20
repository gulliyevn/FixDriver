import { Order, CreateOrderData, OrderFilters, PaginationParams, PaginatedResponse, Address } from '../../../../shared/types';

export interface IOrderService {
  /**
   * Get orders with filters
   */
  getOrders(filters?: OrderFilters, params?: PaginationParams): Promise<PaginatedResponse<Order>>;

  /**
   * Get order by ID
   */
  getOrder(id: string): Promise<Order>;

  /**
   * Create new order
   */
  createOrder(orderData: CreateOrderData): Promise<Order>;

  /**
   * Update order
   */
  updateOrder(id: string, updates: Partial<Order>): Promise<Order>;

  /**
   * Cancel order
   */
  cancelOrder(id: string, reason?: string): Promise<Order>;

  /**
   * Accept order by driver
   */
  acceptOrder(orderId: string, driverId: string): Promise<Order>;

  /**
   * Start trip
   */
  startTrip(orderId: string): Promise<Order>;

  /**
   * Complete trip
   */
  completeTrip(orderId: string): Promise<Order>;

  /**
   * Get user orders
   */
  getUserOrders(userId: string, filters?: OrderFilters): Promise<Order[]>;

  /**
   * Get driver active orders
   */
  getDriverActiveOrders(driverId: string): Promise<Order[]>;

  /**
   * Calculate trip price
   */
  calculatePrice(from: Address, to: Address, options?: { distance?: number; duration?: number; vehicleType?: string }): Promise<number>;
}
