/**
 * 📦 MOCK ORDER DATA
 */

import { Order } from '../types';

const mockOrders: Order[] = [
  {
    id: 'order_1',
    userId: 'user_1',
    clientId: 'user_1',
    driverId: 'driver_1',
    from: '123 Main St, New York, NY',
    to: '456 Broadway, New York, NY',
    pickupLocation: {
      id: 'pickup_1',
      latitude: 40.7128,
      longitude: -74.0060,
      address: '123 Main St, New York, NY',
      city: 'New York',
      country: 'USA',
    },
    dropoffLocation: {
      id: 'dropoff_1',
      latitude: 40.7589,
      longitude: -73.9851,
      address: '456 Broadway, New York, NY',
      city: 'New York',
      country: 'USA',
    },
    status: 'completed',
    price: 25.50,
    distance: 2500,
    duration: 15,
    notes: 'Please be on time',
    paymentMethod: 'credit_card',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

export default mockOrders;
