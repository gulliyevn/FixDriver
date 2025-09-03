/**
 * 🚙 VEHICLE TYPES FOR MOCK DATA
 */

import { Identifiable, Timestamp, Media } from './common';

export interface Vehicle extends Identifiable, Timestamp {
  driverId: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  photos: Media[];
  capacity: number;
  features: string[];
  isAvailable: boolean;
}
