import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { OrderServiceStub } from '../datasources/grpc/stubs/OrderServiceStub';
import { Order, CreateOrderData, OrderFilters, PaginationParams, PaginatedResponse, Address } from '../../shared/types';

export class OrderRepository implements IOrderRepository {
  private orderService: OrderServiceStub;

  constructor() {
    this.orderService = new OrderServiceStub();
  }

  async getOrder(id: string): Promise<Order> {
    try {
      // Validate input
      if (!id || id.trim() === '') {
        throw new Error('Order ID is required');
      }

      // Call service
      return await this.orderService.getOrder(id);
    } catch (error) {
      throw new Error(`Failed to get order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createOrder(orderData: CreateOrderData): Promise<Order> {
    try {
      // Validate order data
      const isValid = await this.validateOrderData(orderData);
      if (!isValid) {
        throw new Error('Invalid order data');
      }

      // Call service
      return await this.orderService.createOrder(orderData);
    } catch (error) {
      throw new Error(`Failed to create order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    try {
      // Validate input
      if (!id || id.trim() === '') {
        throw new Error('Order ID is required');
      }

      // Call service
      return await this.orderService.updateOrder(id, updates);
    } catch (error) {
      throw new Error(`Failed to update order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteOrder(id: string): Promise<void> {
    try {
      // Validate input
      if (!id || id.trim() === '') {
        throw new Error('Order ID is required');
      }

      // Check if order can be deleted
      const order = await this.getOrder(id);
      if (order.status === 'completed' || order.status === 'in_progress') {
        throw new Error('Cannot delete completed or in-progress orders');
      }

      // Call service (assuming delete method exists)
      // For now, we'll cancel the order instead
      await this.cancelOrder(id, 'Order deleted by user');
    } catch (error) {
      throw new Error(`Failed to delete order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getOrders(filters?: OrderFilters, params?: PaginationParams): Promise<PaginatedResponse<Order>> {
    try {
      // Validate pagination params
      if (params) {
        if (params.page && params.page < 1) {
          throw new Error('Page number must be greater than 0');
        }
        if (params.limit && (params.limit < 1 || params.limit > 100)) {
          throw new Error('Limit must be between 1 and 100');
        }
      }

      // Call service
      return await this.orderService.getOrders(filters, params);
    } catch (error) {
      throw new Error(`Failed to get orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUserOrders(userId: string, filters?: OrderFilters): Promise<Order[]> {
    try {
      // Validate input
      if (!userId || userId.trim() === '') {
        throw new Error('User ID is required');
      }

      // Call service
      return await this.orderService.getUserOrders(userId, filters);
    } catch (error) {
      throw new Error(`Failed to get user orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getDriverActiveOrders(driverId: string): Promise<Order[]> {
    try {
      // Validate input
      if (!driverId || driverId.trim() === '') {
        throw new Error('Driver ID is required');
      }

      // Call service
      return await this.orderService.getDriverActiveOrders(driverId);
    } catch (error) {
      throw new Error(`Failed to get driver active orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async cancelOrder(id: string, reason?: string): Promise<Order> {
    try {
      // Validate input
      if (!id || id.trim() === '') {
        throw new Error('Order ID is required');
      }

      // Check if order can be cancelled
      const canCancel = await this.canCancelOrder(id, 'system');
      if (!canCancel) {
        throw new Error('Order cannot be cancelled');
      }

      // Call service
      return await this.orderService.cancelOrder(id, reason);
    } catch (error) {
      throw new Error(`Failed to cancel order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async acceptOrder(orderId: string, driverId: string): Promise<Order> {
    try {
      // Validate input
      if (!orderId || orderId.trim() === '') {
        throw new Error('Order ID is required');
      }
      if (!driverId || driverId.trim() === '') {
        throw new Error('Driver ID is required');
      }

      // Call service
      return await this.orderService.acceptOrder(orderId, driverId);
    } catch (error) {
      throw new Error(`Failed to accept order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async startTrip(orderId: string): Promise<Order> {
    try {
      // Validate input
      if (!orderId || orderId.trim() === '') {
        throw new Error('Order ID is required');
      }

      // Call service
      return await this.orderService.startTrip(orderId);
    } catch (error) {
      throw new Error(`Failed to start trip: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async completeTrip(orderId: string): Promise<Order> {
    try {
      // Validate input
      if (!orderId || orderId.trim() === '') {
        throw new Error('Order ID is required');
      }

      // Call service
      return await this.orderService.completeTrip(orderId);
    } catch (error) {
      throw new Error(`Failed to complete trip: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async calculatePrice(from: Address, to: Address, options?: any): Promise<number> {
    try {
      // Validate addresses
      if (!from || !to) {
        throw new Error('From and to addresses are required');
      }

      if (!from.latitude || !from.longitude || !to.latitude || !to.longitude) {
        throw new Error('Address coordinates are required');
      }

      // Call service
      return await this.orderService.calculatePrice(from, to, options);
    } catch (error) {
      throw new Error(`Failed to calculate price: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async estimateDuration(from: Address, to: Address): Promise<number> {
    try {
      // Validate addresses
      if (!from || !to) {
        throw new Error('From and to addresses are required');
      }

      if (!from.latitude || !from.longitude || !to.latitude || !to.longitude) {
        throw new Error('Address coordinates are required');
      }

      // Simple duration estimation based on distance
      const distance = Math.sqrt(
        Math.pow(to.latitude - from.latitude, 2) + 
        Math.pow(to.longitude - from.longitude, 2)
      ) * 111000; // Convert to meters

      // Assume average speed of 30 km/h in city
      const speedKmH = 30;
      const durationMinutes = (distance / 1000) / speedKmH * 60;
      
      return Math.round(durationMinutes);
    } catch (error) {
      throw new Error(`Failed to estimate duration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async validateOrderData(orderData: CreateOrderData): Promise<boolean> {
    try {
      // Validate required fields
      if (!orderData.clientId || orderData.clientId.trim() === '') {
        return false;
      }

      if (!orderData.from || !orderData.to) {
        return false;
      }

      // Validate addresses
      if (!orderData.from.latitude || !orderData.from.longitude) {
        return false;
      }

      if (!orderData.to.latitude || !orderData.to.longitude) {
        return false;
      }

      // Validate price
      if (orderData.estimatedPrice && orderData.estimatedPrice <= 0) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  async canCancelOrder(orderId: string, userId: string): Promise<boolean> {
    try {
      // Get order
      const order = await this.getOrder(orderId);
      
      // Check if user is authorized to cancel
      if (order.clientId !== userId) {
        return false;
      }

      // Check if order can be cancelled
      const cancellableStatuses = ['pending', 'accepted'];
      return cancellableStatuses.includes(order.status);
    } catch (error) {
      return false;
    }
  }

  // Helper methods
  async getOrdersByStatus(status: string): Promise<Order[]> {
    try {
      const result = await this.getOrders({ status: status as any }, { limit: 100 });
      return result.data;
    } catch (error) {
      return [];
    }
  }

  async getOrdersByDateRange(startDate: string, endDate: string): Promise<Order[]> {
    try {
      const result = await this.getOrders(
        { dateFrom: startDate, dateTo: endDate },
        { limit: 100 }
      );
      return result.data;
    } catch (error) {
      return [];
    }
  }
}
