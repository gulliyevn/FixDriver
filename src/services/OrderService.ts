import { mockOrders, mockUsers, mockDrivers } from '../mocks';
import { Order, OrderStatus } from '../types/order';

// Отключено для production - только для разработки
const ENABLE_ORDER_LOGS = false;

const log = (message: string, data?: unknown) => {
  if (ENABLE_ORDER_LOGS) {

  }
};

export class OrderService {
  private static instance: OrderService;
  private orders: Order[] = [];
  private trackingInterval: ReturnType<typeof setInterval> | null = null;

  private constructor() {
    this.orders = mockOrders;
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
  startDriverTracking(driverId: string, destination: { latitude: number; longitude: number }): void {
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
            ...mockOrders[0],
            id: '1',
            clientId: clientId,
            driverId: mockDrivers[0].id,
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
            ...mockOrders[0],
            id: '1',
            clientId: mockUsers[0].id,
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
          ...mockOrders[0],
          id: orderId,
          clientId: mockUsers[0].id,
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

  static async updateOrderStatus(orderId: string): Promise<Order> {
    // TODO: заменить на реальный API запрос
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: orderId,
          clientId: 'client_1',
          driverId: 'driver_1',
          from: 'ул. Низами, 23, Баку',
          to: 'пр. Нефтяников, 45, Баку',
          departureTime: '2024-01-15T10:30:00Z',
          passenger: {
            name: 'Алиса Петрова',
            relationship: 'daughter',
            phone: '+994501234567',
          },
          route: [
            {
              id: 'route_1_1',
              address: 'ул. Низами, 23, Баку',
              coordinates: { latitude: 40.3777, longitude: 49.8920 },
            },
            {
              id: 'route_1_2',
              address: 'пр. Нефтяников, 45, Баку',
              coordinates: { latitude: 40.4093, longitude: 49.8671 },
            },
          ],
          status: 'completed',
          price: 15,
          distance: 3.2,
          duration: 12,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:45:00Z',
        });
      }, 1000);
    });
  }

  notifySubscribers(): void {
    // Implementation of notifySubscribers method
  }
}

export const orderService = OrderService.getInstance();
export default OrderService;
