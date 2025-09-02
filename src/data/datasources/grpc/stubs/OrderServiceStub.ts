import { IOrderService } from '../types/IOrderService';
import { Order, CreateOrderData, OrderFilters, PaginationParams, PaginatedResponse, Address } from '../../../../shared/types';

// Mock order data
const MOCK_ORDERS: Order[] = [
  {
    id: 'order-1',
    clientId: 'user-1',
    driverId: 'user-2',
    status: 'completed',
    from: {
      id: 'addr-1',
      address: '123 Main St, New York, NY',
      latitude: 40.7128,
      longitude: -74.0060,
      type: 'from',
    },
    to: {
      id: 'addr-2',
      address: '456 Broadway, New York, NY',
      latitude: 40.7589,
      longitude: -73.9851,
      type: 'to',
    },
    price: 25.50,
    distance: 2500,
    duration: 15,
    createdAt: '2024-01-01T10:00:00.000Z',
    updatedAt: '2024-01-01T10:15:00.000Z',
    completedAt: '2024-01-01T10:15:00.000Z',
  },
  {
    id: 'order-2',
    clientId: 'user-1',
    status: 'pending',
    from: {
      id: 'addr-3',
      address: '789 5th Ave, New York, NY',
      latitude: 40.7648,
      longitude: -73.9808,
      type: 'from',
    },
    to: {
      id: 'addr-4',
      address: '321 Park Ave, New York, NY',
      latitude: 40.7505,
      longitude: -73.9934,
      type: 'to',
    },
    price: 18.75,
    distance: 1800,
    duration: 12,
    createdAt: '2024-01-01T14:00:00.000Z',
    updatedAt: '2024-01-01T14:00:00.000Z',
  },
];

// Simulate network delay
const simulateNetworkDelay = (min: number = 200, max: number = 600): Promise<void> => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

export class OrderServiceStub implements IOrderService {
  private orders = new Map<string, Order>(MOCK_ORDERS.map(order => [order.id, order]));

  async getOrders(filters?: OrderFilters, params?: PaginationParams): Promise<PaginatedResponse<Order>> {
    await simulateNetworkDelay();

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const offset = params?.offset || (page - 1) * limit;

    let filteredOrders = Array.from(this.orders.values());

    // Apply filters
    if (filters?.status) {
      filteredOrders = filteredOrders.filter(order => order.status === filters.status);
    }
    if (filters?.clientId) {
      filteredOrders = filteredOrders.filter(order => order.clientId === filters.clientId);
    }
    if (filters?.driverId) {
      filteredOrders = filteredOrders.filter(order => order.driverId === filters.driverId);
    }

    const total = filteredOrders.length;
    const data = filteredOrders.slice(offset, offset + limit);
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getOrder(id: string): Promise<Order> {
    await simulateNetworkDelay();

    const order = this.orders.get(id);
    if (!order) {
      throw new Error(`Order with ID ${id} not found`);
    }

    return order;
  }

  async createOrder(orderData: CreateOrderData): Promise<Order> {
    await simulateNetworkDelay();

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      clientId: orderData.clientId,
      status: 'pending',
      from: orderData.from,
      to: orderData.to,
      stops: orderData.stops,
      price: orderData.estimatedPrice,
      distance: 0, // Will be calculated
      duration: 0, // Will be calculated
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      scheduledAt: orderData.scheduledAt,
    };

    this.orders.set(newOrder.id, newOrder);
    return newOrder;
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    await simulateNetworkDelay();

    const order = this.orders.get(id);
    if (!order) {
      throw new Error(`Order with ID ${id} not found`);
    }

    const updatedOrder: Order = {
      ...order,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async cancelOrder(id: string, reason?: string): Promise<Order> {
    await simulateNetworkDelay();

    const order = this.orders.get(id);
    if (!order) {
      throw new Error(`Order with ID ${id} not found`);
    }

    const updatedOrder: Order = {
      ...order,
      status: 'cancelled',
      cancellationReason: reason,
      cancelledAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async acceptOrder(orderId: string, driverId: string): Promise<Order> {
    await simulateNetworkDelay();

    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    const updatedOrder: Order = {
      ...order,
      driverId,
      status: 'accepted',
      updatedAt: new Date().toISOString(),
    };

    this.orders.set(orderId, updatedOrder);
    return updatedOrder;
  }

  async startTrip(orderId: string): Promise<Order> {
    await simulateNetworkDelay();

    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    const updatedOrder: Order = {
      ...order,
      status: 'in_progress',
      updatedAt: new Date().toISOString(),
    };

    this.orders.set(orderId, updatedOrder);
    return updatedOrder;
  }

  async completeTrip(orderId: string): Promise<Order> {
    await simulateNetworkDelay();

    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    const updatedOrder: Order = {
      ...order,
      status: 'completed',
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.orders.set(orderId, updatedOrder);
    return updatedOrder;
  }

  async getUserOrders(userId: string, filters?: OrderFilters): Promise<Order[]> {
    await simulateNetworkDelay();

    let userOrders = Array.from(this.orders.values()).filter(order => order.clientId === userId);

    if (filters?.status) {
      userOrders = userOrders.filter(order => order.status === filters.status);
    }

    return userOrders;
  }

  async getDriverActiveOrders(driverId: string): Promise<Order[]> {
    await simulateNetworkDelay();

    return Array.from(this.orders.values()).filter(
      order => order.driverId === driverId && 
      (order.status === 'accepted' || order.status === 'in_progress')
    );
  }

  async calculatePrice(from: Address, to: Address, options?: any): Promise<number> {
    await simulateNetworkDelay();

    // Simple price calculation based on distance
    const distance = Math.sqrt(
      Math.pow(to.latitude - from.latitude, 2) + 
      Math.pow(to.longitude - from.longitude, 2)
    ) * 111000; // Convert to meters

    const basePrice = 5.0;
    const pricePerKm = 2.0;
    
    return basePrice + (distance / 1000) * pricePerKm;
  }
}
