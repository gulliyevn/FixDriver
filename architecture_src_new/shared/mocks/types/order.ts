/**
 * 📦 ORDER TYPES FOR MOCK DATA
 */

import { Identifiable, Timestamp, Location, OrderStatus, Price } from './common';

export interface Order extends Identifiable, Timestamp {
  userId: string;
  driverId?: string;
  pickupLocation: Location;
  dropoffLocation: Location;
  status: OrderStatus;
  price: Price;
  distance: number; // meters
  duration: number; // minutes
  notes?: string;
  paymentMethod: string;
  scheduledTime?: Date;
}
