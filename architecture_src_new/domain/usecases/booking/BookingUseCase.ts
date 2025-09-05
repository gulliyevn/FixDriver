import { IOrderRepository } from '../../repositories/IOrderRepository';
import { Order, CreateOrderData, OrderFilters, PaginationParams, PaginatedResponse, Address } from '../../../shared/types';
import { validateOrderId, validateAddresses, validateOrderData, validatePaginationParams } from '../../../shared/utils/orderValidators';

export class BookingUseCase {
  private orderRepository: IOrderRepository;

  constructor(orderRepository: IOrderRepository) {
    this.orderRepository = orderRepository;
  }

  async createOrder(orderData: CreateOrderData): Promise<Order> {
    try {
      validateOrderData(orderData);

      // Calculate price if not provided
      if (!orderData.estimatedPrice) {
        const price = await this.calculatePrice(orderData.from, orderData.to);
        orderData.estimatedPrice = price;
      }

      // Estimate duration
      const duration = await this.estimateDuration(orderData.from, orderData.to);
      orderData.estimatedDuration = duration;

      return await this.orderRepository.createOrder(orderData);
    } catch (error) {
      throw new Error(`Failed to create order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getOrder(id: string): Promise<Order> {
    try {
      validateOrderId(id);
      return await this.orderRepository.getOrder(id);
    } catch (error) {
      throw new Error(`Failed to get order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    try {
      validateOrderId(id);

      // Check if order can be updated
      const order = await this.getOrder(id);
      if (order.status === 'completed' || order.status === 'cancelled') {
        throw new Error('Cannot update completed or cancelled orders');
      }

      return await this.orderRepository.updateOrder(id, updates);
    } catch (error) {
      throw new Error(`Failed to update order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async cancelOrder(id: string, userId: string, reason?: string): Promise<Order> {
    try {
      validateOrderId(id);
      if (!userId || userId.trim() === '') {
        throw new Error('User ID is required');
      }

      // Check if user can cancel this order
      const canCancel = await this.orderRepository.canCancelOrder(id, userId);
      if (!canCancel) {
        throw new Error('Order cannot be cancelled');
      }

      return await this.orderRepository.cancelOrder(id, reason);
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

      // Check if order is available for acceptance
      const order = await this.getOrder(orderId);
      if (order.status !== 'pending') {
        throw new Error('Order is not available for acceptance');
      }

      return await this.orderRepository.acceptOrder(orderId, driverId);
    } catch (error) {
      throw new Error(`Failed to accept order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async startTrip(orderId: string): Promise<Order> {
    try {
      validateOrderId(orderId);

      // Check if order can be started
      const order = await this.getOrder(orderId);
      if (order.status !== 'accepted') {
        throw new Error('Order cannot be started');
      }

      return await this.orderRepository.startTrip(orderId);
    } catch (error) {
      throw new Error(`Failed to start trip: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async completeTrip(orderId: string): Promise<Order> {
    try {
      validateOrderId(orderId);

      // Check if trip can be completed
      const order = await this.getOrder(orderId);
      if (order.status !== 'in_progress') {
        throw new Error('Trip cannot be completed');
      }

      return await this.orderRepository.completeTrip(orderId);
    } catch (error) {
      throw new Error(`Failed to complete trip: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getOrders(filters?: OrderFilters, params?: PaginationParams): Promise<PaginatedResponse<Order>> {
    try {
      if (params) {
        validatePaginationParams(params);
      }

      return await this.orderRepository.getOrders(filters, params);
    } catch (error) {
      throw new Error(`Failed to get orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUserOrders(userId: string, filters?: OrderFilters): Promise<Order[]> {
    try {
      if (!userId || userId.trim() === '') {
        throw new Error('User ID is required');
      }

      return await this.orderRepository.getUserOrders(userId, filters);
    } catch (error) {
      throw new Error(`Failed to get user orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getDriverActiveOrders(driverId: string): Promise<Order[]> {
    try {
      if (!driverId || driverId.trim() === '') {
        throw new Error('Driver ID is required');
      }

      return await this.orderRepository.getDriverActiveOrders(driverId);
    } catch (error) {
      throw new Error(`Failed to get driver active orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async calculatePrice(from: Address, to: Address, options?: any): Promise<number> {
    try {
      validateAddresses(from, to);
      return await this.orderRepository.calculatePrice(from, to, options);
    } catch (error) {
      throw new Error(`Failed to calculate price: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async estimateDuration(from: Address, to: Address): Promise<number> {
    try {
      validateAddresses(from, to);
      return await this.orderRepository.estimateDuration(from, to);
    } catch (error) {
      throw new Error(`Failed to estimate duration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Helper methods
  async getOrdersByStatus(status: string): Promise<Order[]> {
    try {
      return await this.orderRepository.getOrdersByStatus(status);
    } catch (error) {
      return [];
    }
  }

  async getOrdersByDateRange(startDate: string, endDate: string): Promise<Order[]> {
    try {
      return await this.orderRepository.getOrdersByDateRange(startDate, endDate);
    } catch (error) {
      return [];
    }
  }

  async canCancelOrder(orderId: string, userId: string): Promise<boolean> {
    try {
      return await this.orderRepository.canCancelOrder(orderId, userId);
    } catch (error) {
      return false;
    }
  }


  // Business logic methods
  async getAvailableOrders(driverId: string): Promise<Order[]> {
    try {
      // Get all pending orders
      const pendingOrders = await this.getOrdersByStatus('pending');
      
      // Filter out orders that are too far or have other constraints
      // This is a simplified version - in real app would have more complex logic
      return pendingOrders;
    } catch (error) {
      return [];
    }
  }

  async getOrderHistory(userId: string, role: 'client' | 'driver'): Promise<Order[]> {
    try {
      if (role === 'client') {
        return await this.getUserOrders(userId, { status: 'completed' });
      } else {
        // For drivers, get orders they completed
        const allOrders = await this.getOrders({ status: 'completed' });
        return allOrders.data.filter(order => order.driverId === userId);
      }
    } catch (error) {
      return [];
    }
  }
}
