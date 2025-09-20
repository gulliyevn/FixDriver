import { IOrderService } from './types/IOrderService';
import { OrderServiceStub } from './stubs/OrderServiceStub';
import { Order, CreateOrderData, OrderFilters, PaginationParams, PaginatedResponse, Address } from '../../../shared/types';

/**
 * gRPC OrderService
 *
 * This service will eventually connect to real gRPC backend.
 * For now, it uses OrderServiceStub for development/testing.
 */
export class OrderService implements IOrderService {
  private stub: OrderServiceStub;
  private isGRPCReady: boolean = false;

  constructor() {
    this.stub = new OrderServiceStub();
    this.checkGRPCConnection();
  }

  /**
   * Check if gRPC connection is available
   */
  private async checkGRPCConnection(): Promise<void> {
    try {
      // For now, always use stub
      this.isGRPCReady = false;
    } catch (error) {
      console.warn('gRPC connection not available, using stub:', error);
      this.isGRPCReady = false;
    }
  }

  async getOrders(filters?: OrderFilters, params?: PaginationParams): Promise<PaginatedResponse<Order>> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.getOrders(filters, params);
      }
    } catch (error) {
      console.error('OrderService getOrders error:', error);
      throw error;
    }
  }

  async getOrder(id: string): Promise<Order> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.getOrder(id);
      }
    } catch (error) {
      console.error('OrderService getOrder error:', error);
      throw error;
    }
  }

  async createOrder(orderData: CreateOrderData): Promise<Order> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.createOrder(orderData);
      }
    } catch (error) {
      console.error('OrderService createOrder error:', error);
      throw error;
    }
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.updateOrder(id, updates);
      }
    } catch (error) {
      console.error('OrderService updateOrder error:', error);
      throw error;
    }
  }

  async cancelOrder(id: string, reason?: string): Promise<Order> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.cancelOrder(id, reason);
      }
    } catch (error) {
      console.error('OrderService cancelOrder error:', error);
      throw error;
    }
  }

  async acceptOrder(orderId: string, driverId: string): Promise<Order> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.acceptOrder(orderId, driverId);
      }
    } catch (error) {
      console.error('OrderService acceptOrder error:', error);
      throw error;
    }
  }

  async startTrip(orderId: string): Promise<Order> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.startTrip(orderId);
      }
    } catch (error) {
      console.error('OrderService startTrip error:', error);
      throw error;
    }
  }

  async completeTrip(orderId: string): Promise<Order> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.completeTrip(orderId);
      }
    } catch (error) {
      console.error('OrderService completeTrip error:', error);
      throw error;
    }
  }

  async getUserOrders(userId: string, filters?: OrderFilters): Promise<Order[]> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.getUserOrders(userId, filters);
      }
    } catch (error) {
      console.error('OrderService getUserOrders error:', error);
      throw error;
    }
  }

  async getDriverActiveOrders(driverId: string): Promise<Order[]> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.getDriverActiveOrders(driverId);
      }
    } catch (error) {
      console.error('OrderService getDriverActiveOrders error:', error);
      throw error;
    }
  }

  async calculatePrice(from: Address, to: Address, options?: { distance?: number; duration?: number; vehicleType?: string }): Promise<number> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.calculatePrice(from, to, options);
      }
    } catch (error) {
      console.error('OrderService calculatePrice error:', error);
      throw error;
    }
  }
}
