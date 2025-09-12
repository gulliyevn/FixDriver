/**
 * useOrdersFilter hook
 * Manages orders filtering logic
 */

import { useMemo } from 'react';
import { Order } from '../../../../../shared/types/order/OrderTypes';

interface ActiveFilters {
  all?: boolean;
  online?: boolean;
  priceAsc?: boolean;
  priceDesc?: boolean;
  rating45?: boolean;
  vip?: boolean;
  dailyTrips?: boolean;
  economy?: boolean;
  status?: string[];
}

export const useOrdersFilter = (
  orders: Order[], 
  searchQuery: string, 
  activeFilters: ActiveFilters
) => {
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(order =>
        order.firstName?.toLowerCase().includes(query) ||
        order.lastName?.toLowerCase().includes(query) ||
        order.vehicleBrand?.toLowerCase().includes(query) ||
        order.vehicleModel?.toLowerCase().includes(query) ||
        order.pickupLocation?.address?.toLowerCase().includes(query) ||
        order.dropoffLocation?.address?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (activeFilters.status && activeFilters.status.length > 0) {
      filtered = filtered.filter(order => activeFilters.status!.includes(order.status));
    }

    // Online/Available filter
    if (activeFilters.online) {
      filtered = filtered.filter(order => order.isAvailable);
    }

    // Rating filter (4.5+)
    if (activeFilters.rating45) {
      filtered = filtered.filter(order => order.rating >= 4.5);
    }

    // VIP filter (high rating)
    if (activeFilters.vip) {
      filtered = filtered.filter(order => order.rating >= 4.8);
    }

    // Economy filter (low price)
    if (activeFilters.economy) {
      filtered = filtered.filter(order => {
        const price = parseFloat(order.price?.replace(/[^\d.,]/g, '') || '0');
        return price <= 20;
      });
    }

    // Price sorting
    if (activeFilters.priceAsc || activeFilters.priceDesc) {
      filtered.sort((a, b) => {
        const priceA = parseFloat(a.price?.replace(/[^\d.,]/g, '') || '0');
        const priceB = parseFloat(b.price?.replace(/[^\d.,]/g, '') || '0');
        return activeFilters.priceAsc ? priceA - priceB : priceB - priceA;
      });
    }

    // Daily trips filter (simplified - based on availability)
    if (activeFilters.dailyTrips) {
      filtered = filtered.filter(order => order.isAvailable);
    }

    // Date sorting (default)
    if (!activeFilters.priceAsc && !activeFilters.priceDesc) {
      filtered.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }

    return filtered;
  }, [orders, searchQuery, activeFilters]);

  return {
    filteredOrders
  };
};
