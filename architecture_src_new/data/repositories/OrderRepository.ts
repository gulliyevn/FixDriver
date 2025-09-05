import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { OrderService } from '../datasources/grpc/OrderService';
import { Order, CreateOrderData, OrderFilters, PaginationParams, PaginatedResponse, Address } from '../../shared/types';
import { estimateTripDuration } from '../../shared/utils/calculations';
import { validateOrderId, validateAddresses, validateOrderData, validateOrderFilters, validatePaginationParams } from '../../shared/utils/orderValidators';

export class OrderRepository implements IOrderRepository {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  async getOrder(id: string): Promise<Order> {
    try {
      validateOrderId(id);
      return await this.orderService.getOrder(id);
    } catch (error) {
      throw new Error(`Failed to get order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createOrder(orderData: CreateOrderData): Promise<Order> {
    try {
      validateOrderData(orderData);
      return await this.orderService.createOrder(orderData);
    } catch (error) {
      throw new Error(`Failed to create order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    try {
      validateOrderId(id);
      return await this.orderService.updateOrder(id, updates);
    } catch (error) {
      throw new Error(`Failed to update order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteOrder(id: string): Promise<void> {
    try {
      validateOrderId(id);
      const order = await this.getOrder(id);
      if (order.status === 'completed' || order.status === 'in_progress') {
        throw new Error('Cannot delete completed or in-progress orders');
      }
      await this.cancelOrder(id, 'Order deleted by user');
    } catch (error) {
      throw new Error(`Failed to delete order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getOrders(filters?: OrderFilters, params?: PaginationParams): Promise<PaginatedResponse<Order>> {
    try {
      if (params) validatePaginationParams(params);
      if (filters) validateOrderFilters(filters);
      return await this.orderService.getOrders(filters, params);
    } catch (error) {
      throw new Error(`Failed to get orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUserOrders(userId: string, filters?: OrderFilters): Promise<Order[]> {
    try {
      if (!userId || userId.trim() === '') {
        throw new Error('User ID is required');
      }
      if (filters) validateOrderFilters(filters);
      return await this.orderService.getUserOrders(userId, filters);
    } catch (error) {
      throw new Error(`Failed to get user orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getDriverActiveOrders(driverId: string): Promise<Order[]> {
    try {
      if (!driverId || driverId.trim() === '') {
        throw new Error('Driver ID is required');
      }
      return await this.orderService.getDriverActiveOrders(driverId);
    } catch (error) {
      throw new Error(`Failed to get driver active orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async cancelOrder(id: string, reason?: string): Promise<Order> {
    try {
      validateOrderId(id);
      const canCancel = await this.canCancelOrder(id, 'system');
      if (!canCancel) {
        throw new Error('Order cannot be cancelled');
      }
      return await this.orderService.cancelOrder(id, reason);
    } catch (error) {
      throw new Error(`Failed to cancel order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async acceptOrder(orderId: string, driverId: string): Promise<Order> {
    try {
      validateOrderId(orderId);
      if (!driverId || driverId.trim() === '') {
        throw new Error('Driver ID is required');
      }
      return await this.orderService.acceptOrder(orderId, driverId);
    } catch (error) {
      throw new Error(`Failed to accept order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async startTrip(orderId: string): Promise<Order> {
    try {
      validateOrderId(orderId);
      return await this.orderService.startTrip(orderId);
    } catch (error) {
      throw new Error(`Failed to start trip: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async completeTrip(orderId: string): Promise<Order> {
    try {
      validateOrderId(orderId);
      return await this.orderService.completeTrip(orderId);
    } catch (error) {
      throw new Error(`Failed to complete trip: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async calculatePrice(from: Address, to: Address, options?: { distance?: number; duration?: number; vehicleType?: string }): Promise<number> {
    try {
      validateAddresses(from, to);
      return await this.orderService.calculatePrice(from, to, options);
    } catch (error) {
      throw new Error(`Failed to calculate price: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async estimateDuration(from: Address, to: Address): Promise<number> {
    try {
      validateAddresses(from, to);
      return estimateTripDuration(from, to);
    } catch (error) {
      throw new Error(`Failed to estimate duration: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
