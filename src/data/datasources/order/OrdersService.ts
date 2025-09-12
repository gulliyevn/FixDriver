/**
 * OrdersService
 * Main service for order-related operations with gRPC integration
 */

import { OrdersGrpcService } from './OrdersGrpcService';
import { OrdersMockService } from './OrdersMockService';
import { OrdersServiceClient } from '../../../shared/types/grpc/OrdersService';
import { 
  Order, 
  OrdersRequest, 
  OrdersResponse, 
  CreateOrderRequest,
  AcceptOrderRequest,
  UpdateOrderRequest
} from '../../../shared/types/order/OrderTypes';

export class OrdersService {
  private grpcService: OrdersGrpcService;
  private mockService: OrdersMockService;
  private useMock: boolean;

  constructor(grpcClient?: OrdersServiceClient, useMock: boolean = true) {
    this.useMock = useMock;
    this.mockService = new OrdersMockService();
    
    if (grpcClient && !useMock) {
      this.grpcService = new OrdersGrpcService(grpcClient);
    }
  }

  /**
   * Get orders based on user role and filters
   */
  async getOrders(request: OrdersRequest): Promise<OrdersResponse> {
    if (this.useMock || !this.grpcService) {
      return this.mockService.getOrders(request);
    }
    
    return this.grpcService.getOrders(request);
  }

  /**
   * Get available drivers for booking
   */
  async getAvailableDrivers(location: { latitude: number; longitude: number }, radius: number = 10): Promise<Order[]> {
    if (this.useMock || !this.grpcService) {
      return this.mockService.getAvailableDrivers(location, radius);
    }
    
    return this.grpcService.getAvailableDrivers(location, radius);
  }

  /**
   * Get available orders for driver
   */
  async getAvailableOrders(driverId: string, location?: { latitude: number; longitude: number }): Promise<Order[]> {
    if (this.useMock || !this.grpcService) {
      return this.mockService.getAvailableOrders(driverId, location);
    }
    
    return this.grpcService.getAvailableOrders(driverId, location);
  }

  /**
   * Create new order
   */
  async createOrder(request: CreateOrderRequest): Promise<Order> {
    if (this.useMock || !this.grpcService) {
      return this.mockService.createOrder(request);
    }
    
    return this.grpcService.createOrder(request);
  }

  /**
   * Accept order by driver
   */
  async acceptOrder(request: AcceptOrderRequest): Promise<Order> {
    if (this.useMock || !this.grpcService) {
      return this.mockService.acceptOrder(request);
    }
    
    return this.grpcService.acceptOrder(request);
  }

  /**
   * Update order status
   */
  async updateOrder(request: UpdateOrderRequest): Promise<Order> {
    if (this.useMock || !this.grpcService) {
      return this.mockService.updateOrder(request);
    }
    
    return this.grpcService.updateOrder(request);
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string, userId: string, reason?: string): Promise<void> {
    if (this.useMock || !this.grpcService) {
      return this.mockService.cancelOrder(orderId, userId, reason);
    }
    
    return this.grpcService.cancelOrder(orderId, userId, reason);
  }

  /**
   * Get order details
   */
  async getOrder(orderId: string): Promise<Order> {
    if (this.useMock || !this.grpcService) {
      return this.mockService.getOrder(orderId);
    }
    
    return this.grpcService.getOrder(orderId);
  }

  /**
   * Rate order
   */
  async rateOrder(orderId: string, userId: string, rating: number, comment?: string): Promise<void> {
    if (this.useMock || !this.grpcService) {
      return this.mockService.rateOrder(orderId, userId, rating, comment);
    }
    
    return this.grpcService.rateOrder(orderId, userId, rating, comment);
  }

  /**
   * Track order location
   */
  async trackOrder(orderId: string): Promise<{ latitude: number; longitude: number; timestamp: number }> {
    if (this.useMock || !this.grpcService) {
      return this.mockService.trackOrder(orderId);
    }
    
    return this.grpcService.trackOrder(orderId);
  }

  /**
   * Switch to gRPC mode
   */
  enableGrpc(grpcClient: OrdersServiceClient): void {
    this.grpcService = new OrdersGrpcService(grpcClient);
    this.useMock = false;
  }

  /**
   * Switch to mock mode
   */
  enableMock(): void {
    this.useMock = true;
  }
}
