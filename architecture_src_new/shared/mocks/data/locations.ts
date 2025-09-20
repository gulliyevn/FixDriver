/**
 * 📍 MOCK LOCATION DATA
 */

import { Location } from '../types';

const mockLocations: Location[] = [
  {
    id: 'loc_1',
    latitude: 40.7128,
    longitude: -74.0060,
    address: 'New York, NY',
    city: 'New York',
    country: 'USA',
    zipCode: '10001',
    description: 'Manhattan, New York',
  },
  {
    id: 'loc_2',
    latitude: 40.7589,
    longitude: -73.9851,
    address: 'Times Square, New York, NY',
    city: 'New York',
    country: 'USA',
    zipCode: '10036',
    description: 'Famous intersection in Manhattan',
  },
];

export default mockLocations;
