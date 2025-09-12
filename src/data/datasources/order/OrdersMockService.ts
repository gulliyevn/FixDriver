/**
 * OrdersMockService
 * Mock implementation for order-related operations
 */

import { 
  Order, 
  OrdersRequest, 
  OrdersResponse, 
  CreateOrderRequest,
  AcceptOrderRequest,
  UpdateOrderRequest,
  OrderStatus
} from '../../../shared/types/order/OrderTypes';

export class OrdersMockService {
  /**
   * Mock orders storage
   */
  private mockOrders: Order[] = [];

  constructor() {
    this.initializeMockData();
  }

  /**
   * Initialize mock data
   */
  private initializeMockData() {
    this.mockOrders = [
      {
        id: '1',
        userId: 'client_1',
        driverId: 'driver_1',
        firstName: 'John',
        lastName: 'Smith',
        vehicleBrand: 'Toyota',
        vehicleModel: 'Camry',
        rating: 4.8,
        isAvailable: true,
        phoneNumber: '+994501234567',
        price: '$25.50',
        status: 'pending',
        pickupLocation: {
          latitude: 40.4093,
          longitude: 49.8671,
          address: 'Baku, Azerbaijan',
          city: 'Baku',
          country: 'Azerbaijan'
        },
        dropoffLocation: {
          latitude: 40.4093,
          longitude: 49.8671,
          address: 'Baku Airport',
          city: 'Baku',
          country: 'Azerbaijan'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        userId: 'client_2',
        driverId: 'driver_2',
        firstName: 'Sarah',
        lastName: 'Johnson',
        vehicleBrand: 'Honda',
        vehicleModel: 'Civic',
        rating: 4.6,
        isAvailable: true,
        phoneNumber: '+994507654321',
        price: '$18.75',
        status: 'accepted',
        pickupLocation: {
          latitude: 40.4093,
          longitude: 49.8671,
          address: 'City Center',
          city: 'Baku',
          country: 'Azerbaijan'
        },
        dropoffLocation: {
          latitude: 40.4093,
          longitude: 49.8671,
          address: 'Shopping Mall',
          city: 'Baku',
          country: 'Azerbaijan'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  /**
   * Get orders based on user role and filters
   */
  async getOrders(request: OrdersRequest): Promise<OrdersResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    let filteredOrders = [...this.mockOrders];

    // Filter by user role
    if (request.role === 'client') {
      filteredOrders = filteredOrders.filter(order => order.userId === request.userId);
    } else if (request.role === 'driver') {
      filteredOrders = filteredOrders.filter(order => order.driverId === request.userId || !order.driverId);
    }

    // Filter by status
    if (request.status && request.status.length > 0) {
      filteredOrders = filteredOrders.filter(order => request.status!.includes(order.status));
    }

    // Sort orders
    if (request.sortBy) {
      filteredOrders.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (request.sortBy) {
          case 'createdAt':
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          case 'scheduledTime':
            aValue = a.scheduledTime ? new Date(a.scheduledTime).getTime() : 0;
            bValue = b.scheduledTime ? new Date(b.scheduledTime).getTime() : 0;
            break;
          case 'price':
            aValue = parseFloat(a.price?.replace(/[^\d.,]/g, '') || '0');
            bValue = parseFloat(b.price?.replace(/[^\d.,]/g, '') || '0');
            break;
          default:
            return 0;
        }

        if (request.sortOrder === 'desc') {
          return bValue - aValue;
        }
        return aValue - bValue;
      });
    }

    // Apply pagination
    const offset = request.offset || 0;
    const limit = request.limit || 20;
    const paginatedOrders = filteredOrders.slice(offset, offset + limit);

    return {
      orders: paginatedOrders,
      totalCount: filteredOrders.length,
      hasMore: offset + limit < filteredOrders.length
    };
  }

  /**
   * Get available drivers for booking
   */
  async getAvailableDrivers(location: { latitude: number; longitude: number }, radius: number = 10): Promise<Order[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    // Mock available drivers (simplified - in real app these would be actual drivers)
    const availableDrivers: Order[] = [
      {
        id: 'driver_1',
        userId: 'driver_1',
        firstName: 'Ahmed',
        lastName: 'Aliyev',
        vehicleBrand: 'Toyota',
        vehicleModel: 'Camry',
        rating: 4.9,
        isAvailable: true,
        phoneNumber: '+994501234567',
        price: '$25.50',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'driver_2',
        userId: 'driver_2',
        firstName: 'Leyla',
        lastName: 'Mammadova',
        vehicleBrand: 'Honda',
        vehicleModel: 'Civic',
        rating: 4.7,
        isAvailable: true,
        phoneNumber: '+994507654321',
        price: '$22.00',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    return availableDrivers;
  }

  /**
   * Get available orders for driver
   */
  async getAvailableOrders(driverId: string, location?: { latitude: number; longitude: number }): Promise<Order[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return orders that are pending and don't have a driver assigned
    const availableOrders = this.mockOrders.filter(order => 
      order.status === 'pending' && !order.driverId
    );

    return availableOrders;
  }

  /**
   * Create new order
   */
  async createOrder(request: CreateOrderRequest): Promise<Order> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newOrder: Order = {
      id: `order_${Date.now()}`,
      userId: request.clientId,
      firstName: 'Client',
      lastName: 'Name',
      vehicleBrand: 'N/A',
      vehicleModel: 'N/A',
      rating: 0,
      isAvailable: true,
      phoneNumber: '+994500000000',
      price: request.estimatedPrice?.toString() || '$0.00',
      status: 'pending',
      pickupLocation: request.pickupLocation,
      dropoffLocation: request.dropoffLocation,
      scheduledTime: request.scheduledTime,
      estimatedDuration: 30,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.mockOrders.push(newOrder);
    return newOrder;
  }

  /**
   * Accept order by driver
   */
  async acceptOrder(request: AcceptOrderRequest): Promise<Order> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const order = this.mockOrders.find(o => o.id === request.orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    order.driverId = request.driverId;
    order.status = 'accepted';
    order.updatedAt = new Date().toISOString();

    return order;
  }

  /**
   * Update order status
   */
  async updateOrder(request: UpdateOrderRequest): Promise<Order> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const order = this.mockOrders.find(o => o.id === request.orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    if (request.status) order.status = request.status;
    if (request.actualDuration) order.actualDuration = request.actualDuration;
    if (request.finalPrice) order.price = `$${request.finalPrice}`;
    order.updatedAt = new Date().toISOString();

    return order;
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string, userId: string, reason?: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));

    const order = this.mockOrders.find(o => o.id === orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.userId !== userId && order.driverId !== userId) {
      throw new Error('Unauthorized to cancel this order');
    }

    order.status = 'cancelled';
    order.updatedAt = new Date().toISOString();

    console.log(`Order ${orderId} cancelled. Reason: ${reason || 'No reason provided'}`);
  }

  /**
   * Get order details
   */
  async getOrder(orderId: string): Promise<Order> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const order = this.mockOrders.find(o => o.id === orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  /**
   * Rate order
   */
  async rateOrder(orderId: string, userId: string, rating: number, comment?: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const order = this.mockOrders.find(o => o.id === orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Update rating (simplified - in real app this would be more complex)
    order.rating = rating;
    order.updatedAt = new Date().toISOString();

    console.log(`Order ${orderId} rated: ${rating}/5. Comment: ${comment || 'No comment'}`);
  }

  /**
   * Track order location
   */
  async trackOrder(orderId: string): Promise<{ latitude: number; longitude: number; timestamp: number }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const order = this.mockOrders.find(o => o.id === orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Return mock location (in real app this would be driver's current location)
    return {
      latitude: 40.4093 + (Math.random() - 0.5) * 0.01,
      longitude: 49.8671 + (Math.random() - 0.5) * 0.01,
      timestamp: Date.now()
    };
  }
}
