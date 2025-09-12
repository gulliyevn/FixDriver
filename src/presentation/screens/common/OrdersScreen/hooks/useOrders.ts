/**
 * useOrders hook
 * Manages orders data fetching and state with gRPC integration
 */

import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { useAuth } from '../../../../context/AuthContext';
import { OrdersService } from '../../../../../../data/datasources/order/OrdersService';
import { OrdersRequest, Order } from '../../../../../../shared/types/order/OrderTypes';

export const useOrders = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize OrdersService (currently using mock)
  const ordersService = useMemo(() => {
    return new OrdersService(undefined, true); // Use mock for now
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const request: OrdersRequest = {
          userId: user.id,
          role: user.role === 'driver' ? 'driver' : 'client',
          limit: 50,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        };

        const response = await ordersService.getOrders(request);
        setOrders(response.orders);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load orders');
        
        // Fallback to empty array if API fails
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id, user?.role, ordersService]);

  const refetch = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const request: OrdersRequest = {
        userId: user.id,
        role: user.role === 'driver' ? 'driver' : 'client',
        limit: 50,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      const response = await ordersService.getOrders(request);
      setOrders(response.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh orders');
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: any) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      const newOrder = await ordersService.createOrder({
        clientId: user.id,
        pickupLocation: orderData.pickupLocation,
        dropoffLocation: orderData.dropoffLocation,
        scheduledTime: orderData.scheduledTime,
        estimatedPrice: orderData.estimatedPrice,
        notes: orderData.notes
      });

      // Refresh orders list
      await refetch();
      return newOrder;
    } catch (error) {
      throw error;
    }
  };

  const acceptOrder = async (orderId: string) => {
    if (!user?.id || user.role !== 'driver') {
      throw new Error('Only drivers can accept orders');
    }

    try {
      const updatedOrder = await ordersService.acceptOrder({
        orderId,
        driverId: user.id
      });

      // Refresh orders list
      await refetch();
      return updatedOrder;
    } catch (error) {
      throw error;
    }
  };

  const cancelOrder = async (orderId: string, reason?: string) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      await ordersService.cancelOrder(orderId, user.id, reason);
      
      // Refresh orders list
      await refetch();
    } catch (error) {
      throw error;
    }
  };

  const rateOrder = async (orderId: string, rating: number, comment?: string) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      await ordersService.rateOrder(orderId, user.id, rating, comment);
      
      // Refresh orders list to show updated rating
      await refetch();
    } catch (error) {
      throw error;
    }
  };

  return {
    orders,
    loading,
    error,
    refetch,
    createOrder,
    acceptOrder,
    cancelOrder,
    rateOrder
  };
};
