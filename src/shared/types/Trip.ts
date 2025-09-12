/**
 * Trip types
 * Type definitions for trip-related data
 */

export interface Trip {
  id: string;
  title: string;
  date: string;
  time: string;
  amount: string;
  status: 'completed' | 'cancelled' | 'scheduled';
  type: string;
  description?: string;
  driver?: string;
}

export interface TripFilter {
  status: 'all' | 'completed' | 'cancelled' | 'scheduled';
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
}
