import { Order } from '../types/order';
import { mockOrders, mockUsers, mockDrivers } from './index';

export const createMockClientOrder = (clientId: string): Order => ({
  ...mockOrders[0],
  id: '1',
  clientId: clientId,
  driverId: mockDrivers[0].id,
  from: 'Moscow, Red Square',
  to: 'Moscow, Tverskaya St',
  status: 'completed',
  createdAt: new Date(Date.now() - 86400000).toISOString(),
  updatedAt: new Date(Date.now() - 82800000).toISOString(),
});

export const createMockDriverOrder = (driverId: string): Order => ({
  ...mockOrders[0],
  id: '1',
  clientId: mockUsers[0].id,
  driverId: driverId,
  from: 'Moscow, Red Square',
  to: 'Moscow, Tverskaya St',
  status: 'in_progress',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const createMockAcceptedOrder = (orderId: string, driverId: string): Order => ({
  ...mockOrders[0],
  id: orderId,
  clientId: mockUsers[0].id,
  driverId: driverId,
  from: 'Moscow, Red Square',
  to: 'Moscow, Tverskaya St',
  status: 'in_progress',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const createMockUpdatedOrder = (orderId: string): Order => ({
  id: orderId,
  clientId: 'client_1',
  driverId: 'driver_1',
  from: 'Nizami St, 23, Baku',
  to: 'Neftchilar Ave, 45, Baku',
  departureTime: '2024-01-15T10:30:00Z',
  passenger: {
    name: 'Alice Petrova',
    relationship: 'daughter',
    phone: '+994501234567',
  },
  route: [
    {
      id: 'route_1_1',
      address: 'Nizami St, 23, Baku',
      coordinates: { latitude: 40.3777, longitude: 49.8920 },
    },
    {
      id: 'route_1_2',
      address: 'Neftchilar Ave, 45, Baku',
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
