/**
 * 📦 MOCK ORDER SERVICE
 */

import { Order } from '../types';
import MockData from '../MockData';

export class OrderService {
  async getById(id: string): Promise<Order | null> {
    return MockData.getOrderById(id) || null;
  }

  async getByUserId(userId: string): Promise<Order[]> {
    return MockData.getOrdersByUserId(userId);
  }

  async create(orderData: Partial<Order>): Promise<Order> {
    const newOrder: Order = {
      id: `order_${Date.now()}`,
      userId: orderData.userId!,
      driverId: orderData.driverId || '',
      pickupLocation: orderData.pickupLocation!,
      dropoffLocation: orderData.dropoffLocation!,
      status: 'pending',
      price: orderData.price || { amount: 0, currency: 'USD', formatted: '$0.00' },
      distance: orderData.distance || 0,
      duration: orderData.duration || 0,
      notes: orderData.notes || '',
      paymentMethod: orderData.paymentMethod || 'cash',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('📦 Mock order created:', newOrder);
    return newOrder;
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    const order = MockData.getOrderById(id);
    if (!order) throw new Error('Order not found');
    
    const updatedOrder = { ...order, status, updatedAt: new Date() };
    console.log('📊 Mock order status updated:', updatedOrder);
    
    return updatedOrder;
  }
}

export default OrderService;
