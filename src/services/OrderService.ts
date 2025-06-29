import { Driver, Client, UserRole } from '../types/user';
import { MapLocation } from './MapService';

export interface Order {
  id: string;
  client: Client;
  driver?: Driver;
  from: MapLocation;
  to: MapLocation;
  status: OrderStatus;
  price: number;
  createdAt: Date;
  scheduledFor?: Date;
  completedAt?: Date;
}

export type OrderStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

export interface CreateOrderPayload {
  clientId: string;
  from: MapLocation;
  to: MapLocation;
  scheduledFor?: Date;
}

// Вспомогательные mock объекты для тестирования
const mockClient = {
  id: '1',
  name: 'Тестовый',
  surname: 'Клиент',
  email: 'test@example.com',
  address: 'Москва',
  role: UserRole.CLIENT as UserRole.CLIENT,
  phone: '+7 (999) 123-45-67',
  avatar: null,
  rating: 4.5,
  createdAt: new Date().toISOString(),
};

const mockDriver = {
  id: '1',
  name: 'Алексей',
  surname: 'Петров',
  email: 'alex@example.com',
  address: 'Москва',
  role: UserRole.DRIVER as UserRole.DRIVER,
  phone: '+7 (999) 234-56-78',
  avatar: null,
  rating: 4.8,
  createdAt: new Date().toISOString(),
  vehicle: {
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    color: 'белый',
    licensePlate: 'A123BC',
  },
  isAvailable: true,
};

export class OrderService {
  static async createOrder(payload: CreateOrderPayload): Promise<Order> {
    // TODO: заменить на реальный API запрос
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Date.now().toString(),
          client: { ...mockClient, id: payload.clientId },
          from: payload.from,
          to: payload.to,
          status: 'pending',
          price: Math.floor(Math.random() * 1000) + 500,
          createdAt: new Date(),
          scheduledFor: payload.scheduledFor,
        });
      }, 1000);
    });
  }

  static async getClientOrders(clientId: string): Promise<Order[]> {
    // TODO: заменить на реальный API запрос
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            client: { ...mockClient, id: clientId },
            driver: mockDriver,
            from: {
              latitude: 55.7558,
              longitude: 37.6176,
              address: 'Москва, Красная площадь',
            },
            to: {
              latitude: 55.7539,
              longitude: 37.6208,
              address: 'Москва, ул. Тверская',
            },
            status: 'completed',
            price: 750,
            createdAt: new Date(Date.now() - 86400000),
            completedAt: new Date(Date.now() - 82800000),
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
            id: '1',
            client: mockClient,
            driver: { ...mockDriver, id: driverId },
            from: {
              latitude: 55.7558,
              longitude: 37.6176,
              address: 'Москва, Красная площадь',
            },
            to: {
              latitude: 55.7539,
              longitude: 37.6208,
              address: 'Москва, ул. Тверская',
            },
            status: 'in_progress',
            price: 750,
            createdAt: new Date(),
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
          id: orderId,
          client: mockClient,
          driver: { ...mockDriver, id: driverId },
          from: {
            latitude: 55.7558,
            longitude: 37.6176,
            address: 'Москва, Красная площадь',
          },
          to: {
            latitude: 55.7539,
            longitude: 37.6208,
            address: 'Москва, ул. Тверская',
          },
          status: 'accepted',
          price: 750,
          createdAt: new Date(),
        });
      }, 500);
    });
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    // TODO: заменить на реальный API запрос
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: orderId,
          client: mockClient,
          driver: mockDriver,
          from: {
            latitude: 55.7558,
            longitude: 37.6176,
            address: 'Москва, Красная площадь',
          },
          to: {
            latitude: 55.7539,
            longitude: 37.6208,
            address: 'Москва, ул. Тверская',
          },
          status,
          price: 750,
          createdAt: new Date(),
          completedAt: status === 'completed' ? new Date() : undefined,
        });
      }, 500);
    });
  }
}

export default OrderService;
