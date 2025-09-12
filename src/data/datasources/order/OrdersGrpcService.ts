/**
 * OrdersGrpcService
 * gRPC service for order-related operations
 */

import { OrdersServiceClient } from '../../../shared/types/grpc/OrdersService';
import { 
  Order, 
  OrdersRequest, 
  OrdersResponse, 
  OrderFilter,
  CreateOrderRequest,
  AcceptOrderRequest,
  UpdateOrderRequest
} from '../../../shared/types/order/OrderTypes';

export class OrdersGrpcService {
  private client: OrdersServiceClient;

  constructor(client: OrdersServiceClient) {
    this.client = client;
  }

  /**
   * Get orders based on user role and filters
   */
  async getOrders(request: OrdersRequest): Promise<OrdersResponse> {
    try {
      const response = await this.client.getOrders(request);
      return response;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new Error('Failed to fetch orders');
    }
  }

  /**
   * Get available drivers for booking
   */
  async getAvailableDrivers(location: { latitude: number; longitude: number }, radius: number = 10): Promise<Order[]> {
    try {
      const request = {
        location,
        radius,
        limit: 50
      };
      
      const response = await this.client.getAvailableDrivers(request);
      return response.drivers;
    } catch (error) {
      console.error('Error fetching available drivers:', error);
      throw new Error('Failed to fetch available drivers');
    }
  }

  /**
   * Get available orders for driver
   */
  async getAvailableOrders(driverId: string, location?: { latitude: number; longitude: number }): Promise<Order[]> {
    try {
      const request = {
        driverId,
        location,
        limit: 20
      };
      
      const response = await this.client.getAvailableOrders(request);
      return response.orders;
    } catch (error) {
      console.error('Error fetching available orders:', error);
      throw new Error('Failed to fetch available orders');
    }
  }

  /**
   * Create new order
   */
  async createOrder(request: CreateOrderRequest): Promise<Order> {
    try {
      const response = await this.client.createOrder(request);
      return response.order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }

  /**
   * Accept order by driver
   */
  async acceptOrder(request: AcceptOrderRequest): Promise<Order> {
    try {
      const response = await this.client.acceptOrder(request);
      return response.order;
    } catch (error) {
      console.error('Error accepting order:', error);
      throw new Error('Failed to accept order');
    }
  }

  /**
   * Update order status
   */
  async updateOrder(request: UpdateOrderRequest): Promise<Order> {
    try {
      const response = await this.client.updateOrder(request);
      return response.order;
    } catch (error) {
      console.error('Error updating order:', error);
      throw new Error('Failed to update order');
    }
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string, userId: string, reason?: string): Promise<void> {
    try {
      const request = {
        orderId,
        userId,
        reason,
        timestamp: Date.now()
      };
      
      await this.client.cancelOrder(request);
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw new Error('Failed to cancel order');
    }
  }

  /**
   * Get order details
   */
  async getOrder(orderId: string): Promise<Order> {
    try {
      const request = { orderId };
      const response = await this.client.getOrder(request);
      return response.order;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw new Error('Failed to fetch order details');
    }
  }

  /**
   * Rate order
   */
  async rateOrder(orderId: string, userId: string, rating: number, comment?: string): Promise<void> {
    try {
      const request = {
        orderId,
        userId,
        rating,
        comment,
        timestamp: Date.now()
      };
      
      await this.client.rateOrder(request);
    } catch (error) {
      console.error('Error rating order:', error);
      throw new Error('Failed to rate order');
    }
  }

  /**
   * Track order location
   */
  async trackOrder(orderId: string): Promise<{ latitude: number; longitude: number; timestamp: number }> {
    try {
      const request = { orderId };
      const response = await this.client.trackOrder(request);
      return response.location;
    } catch (error) {
      console.error('Error tracking order:', error);
      throw new Error('Failed to track order');
    }
  }
}
