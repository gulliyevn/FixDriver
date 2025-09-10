/**
 * 📦 ORDER SERVICE
 * 
 * Mock order service for development and testing.
 * Easy to replace with gRPC implementation.
 */

import MockData from '../MockData';
import { Order, OrderStatus } from '../types';

export default class OrderService {
  /**
   * Get all orders
   */
  async getAll(): Promise<Order[]> {
    return MockData.orders;
  }

  /**
   * Get order by ID
   */
  async getById(orderId: string): Promise<Order | null> {
    return MockData.orders.find(order => order.id === orderId) || null;
  }

  /**
   * Create new order
   */
  async create(orderData: Partial<Order>): Promise<Order> {
    const newOrder: Order = {
      id: `order_${Date.now()}`,
      clientId: (orderData as any).userId || '',
      driverId: orderData.driverId || '',
      from: typeof orderData.from === 'string' ? orderData.from : 'Unknown location',
      to: typeof orderData.to === 'string' ? orderData.to : 'Unknown destination',
      status: 'pending',
      departureTime: new Date().toISOString(),
      passenger: {
        name: 'Passenger',
        relationship: 'self'
      },
      route: [],
      price: orderData.price || 0,
      distance: orderData.distance || 0,
      duration: orderData.duration || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    MockData.orders.push(newOrder);
    console.log('📦 Mock order created:', newOrder);
    return newOrder;
  }

  /**
   * Update order status
   */
  async updateStatus(orderId: string, status: OrderStatus): Promise<void> {
    const order = MockData.orders.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');

    order.status = status;
    order.updatedAt = new Date().toISOString();

    console.log('📦 Mock order status updated:', order);
  }

  /**
   * Get orders by user ID
   */
  async getByUserId(userId: string): Promise<Order[]> {
    return MockData.orders.filter(order => order.clientId === userId);
  }

  /**
   * Get orders by driver ID
   */
  async getByDriverId(driverId: string): Promise<Order[]> {
    return MockData.orders.filter(order => order.driverId === driverId);
  }
}