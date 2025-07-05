import { Driver, Client, UserRole } from '../types/user';
import { MapLocation } from './MapService';
import mockData from '../utils/mockData';
import { Order, OrderStatus } from '../types/order';

// Отключено для production - только для разработки
const ENABLE_ORDER_LOGS = false;

const log = (message: string, data?: any) => {
  if (ENABLE_ORDER_LOGS) {
    console.log(`[СЛЕЖЕНИЕ] ${message}`, data || '');
  }
};

export class OrderService {
  private static instance: OrderService;
  private orders: Order[] = [];
  private trackingInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.orders = mockData.orders;
  }

  static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  async getOrders(userId: string): Promise<Order[]> {
    return this.orders.filter(order => order.clientId === userId);
  }

  async getOrder(orderId: string): Promise<Order | null> {
    return this.orders.find(order => order.id === orderId) || null;
  }

  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const order: Order = {
      id: `order_${Date.now()}`,
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.orders.push(order);
    this.notifySubscribers();
    return order;
  }

  async updateOrder(orderId: string, updates: Partial<Order>): Promise<Order | null> {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) return null;

    this.orders[orderIndex] = {
      ...this.orders[orderIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.notifySubscribers();
    return this.orders[orderIndex];
  }

  async cancelOrder(orderId: string): Promise<Order | null> {
    const order = this.orders.find(o => o.id === orderId);
    if (order && order.status !== 'completed') {
      order.status = 'cancelled';
      order.updatedAt = new Date().toISOString();
      this.notifySubscribers();
      return order;
    }
    return null;
  }

  async completeOrder(orderId: string): Promise<Order | null> {
    return this.updateOrder(orderId, { status: 'completed' });
  }

  async getOrdersByStatus(userId: string, status: OrderStatus): Promise<Order[]> {
    return this.orders.filter(order => order.clientId === userId && order.status === status);
  }

  async getActiveOrders(userId: string): Promise<Order[]> {
    return this.orders.filter(order => 
      order.clientId === userId && 
      ['pending', 'confirmed', 'in_progress'].includes(order.status)
    );
  }

  async getCompletedOrders(userId: string): Promise<Order[]> {
    return this.orders.filter(order => 
      order.clientId === userId && 
      order.status === 'completed'
    );
  }

  // Симуляция отслеживания водителя
  startDriverTracking(driverId: string, destination: any): void {
    log('Начинается слежение за водителем');
    
    const startPosition = {
      latitude: 40.414300000000004,
      longitude: 49.8721,
    };
    
    log('Водитель стартует с позиции:', startPosition);
    log('Водитель начал движение к клиенту');

    let step = 0;
    const totalSteps = 12;
    
    this.trackingInterval = setInterval(() => {
      step++;
      if (step <= totalSteps) {
        const progress = step / totalSteps;
        const currentLat = startPosition.latitude - (startPosition.latitude - destination.latitude) * progress;
        const currentLng = startPosition.longitude + (destination.longitude - startPosition.longitude) * progress;
        
        log(`Шаг ${step}/${totalSteps}, позиция: ${currentLat.toFixed(6)}, ${currentLng.toFixed(6)}`);
        
        if (step === totalSteps) {
          log('Водитель прибыл к клиенту, начинается поездка');
          this.stopDriverTracking();
        }
      }
    }, 2000);
  }

  // Остановка отслеживания
  stopDriverTracking(): void {
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }
  }

  static async getClientOrders(clientId: string): Promise<Order[]> {
    // TODO: заменить на реальный API запрос
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            ...mockData.orders[0],
            id: '1',
            clientId: clientId,
            driverId: mockData.drivers[0].id,
            from: 'Москва, Красная площадь',
            to: 'Москва, ул. Тверская',
            status: 'completed',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 82800000).toISOString(),
          },
        ]);
      }, 500);
    });
  }

  static async getDriverOrders(driverId: string): Promise<Order[]> {
    // TODO: заменить на реальный API запрос
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            ...mockData.orders[0],
            id: '1',
            clientId: mockData.users[0].id,
            driverId: driverId,
            from: 'Москва, Красная площадь',
            to: 'Москва, ул. Тверская',
            status: 'in_progress',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
      }, 500);
    });
  }

  static async acceptOrder(orderId: string, driverId: string): Promise<Order> {
    // TODO: заменить на реальный API запрос
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ...mockData.orders[0],
          id: orderId,
          clientId: mockData.users[0].id,
          driverId: driverId,
          from: 'Москва, Красная площадь',
          to: 'Москва, ул. Тверская',
          status: 'in_progress',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }, 500);
    });
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    // TODO: заменить на реальный API запрос
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ...mockData.orders[0],
          id: orderId,
          clientId: mockData.users[0].id,
          driverId: mockData.drivers[0].id,
          from: 'Москва, Красная площадь',
          to: 'Москва, ул. Тверская',
          status: 'completed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }, 500);
    });
  }

  notifySubscribers(): void {
    // Implementation of notifySubscribers method
  }
}

export const orderService = OrderService.getInstance();
export default OrderService;
