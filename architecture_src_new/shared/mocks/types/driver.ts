/**
 * 🚗 DRIVER TYPES FOR MOCK DATA
 */

import { Identifiable, Timestamp, Location, Rating, DriverStatus } from './common';

export interface Driver extends Identifiable, Timestamp {
  userId: string;
  status: DriverStatus;
  currentLocation: Location;
  rating: Rating;
  vehicleId: string;
  licenseNumber: string;
  experience: number; // years
  totalTrips: number;
  totalEarnings: number;
  isOnline: boolean;
  lastActive: Date;
}
