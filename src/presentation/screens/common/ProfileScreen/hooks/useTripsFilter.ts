/**
 * useTripsFilter hook
 * Manages trip filtering logic
 */

import { useState, useMemo } from 'react';
import { Trip, TripFilter } from '../../../../../shared/types/Trip';

export const useTripsFilter = (trips: Trip[]) => {
  const [currentFilter, setCurrentFilter] = useState<TripFilter>({
    status: 'all',
    dateRange: 'all'
  });

  const filteredTrips = useMemo(() => {
    let filtered = [...trips];
    
    // Filter by status
    if (currentFilter.status !== 'all') {
      filtered = filtered.filter(trip => trip.status === currentFilter.status);
    }
    
    // Filter by date range (simplified logic for mock data)
    if (currentFilter.dateRange !== 'all') {
      const now = new Date();
      
      filtered = filtered.filter((_, index) => {
        switch (currentFilter.dateRange) {
          case 'today':
            // Show only first trip (today's trip in mock)
            return index === 0;
          case 'week':
            // Show first 2 trips (this week's trips in mock)
            return index < 2;
          case 'month':
            // Show first 3 trips (this month's trips in mock)
            return index < 3;
          case 'year':
            // Show all trips
            return true;
          default:
            return true;
        }
      });
    }
    
    return filtered;
  }, [trips, currentFilter]);

  const clearFilters = () => {
    setCurrentFilter({
      status: 'all',
      dateRange: 'all'
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (currentFilter.status !== 'all') count++;
    if (currentFilter.dateRange !== 'all') count++;
    return count;
  };

  return {
    filteredTrips,
    currentFilter,
    setCurrentFilter,
    clearFilters,
    activeFiltersCount: getActiveFiltersCount()
  };
};
